import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { Resend } from 'resend'
import { db } from '../db/client.js'

const router = Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Geçici şifre sıfırlama kodları (bellek içi, 10 dakika geçerli)
const resetCodes = new Map() // email -> { code, expiresAt }

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Kayıt ol
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email ve şifre zorunludur.' })
    if (password.length < 6) return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır.' })

    const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] })
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Bu email zaten kayıtlı.' })

    const hash = await bcrypt.hash(password, 10)
    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user'

    const result = await db.execute({
      sql: 'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      args: [full_name || '', email, hash, role],
    })

    const userId = Number(result.lastInsertRowid)
    const user = { id: userId, email, full_name: full_name || '', role }
    res.status(201).json({ token: makeToken(user), user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası.' })
  }
})

// Giriş yap
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email ve şifre zorunludur.' })

    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] })
    if (result.rows.length === 0) return res.status(401).json({ error: 'Email veya şifre hatalı.' })

    const u = result.rows[0]
    const valid = await bcrypt.compare(password, u.password_hash)
    if (!valid) return res.status(401).json({ error: 'Email veya şifre hatalı.' })

    const user = { id: Number(u.id), email: u.email, full_name: u.full_name, role: u.role }
    res.json({ token: makeToken(user), user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası.' })
  }
})

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    if (!credential) return res.status(400).json({ error: 'Google token eksik.' })

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { email, name, sub: googleId } = payload

    if (!email) return res.status(400).json({ error: 'Google hesabından email alınamadı.' })

    let result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] })

    let userId, role, full_name

    if (result.rows.length === 0) {
      role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user'
      full_name = name || email.split('@')[0]
      const insertResult = await db.execute({
        sql: 'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        args: [full_name, email, `google_${googleId}`, role],
      })
      userId = Number(insertResult.lastInsertRowid)
    } else {
      const u = result.rows[0]
      userId = Number(u.id)
      role = u.role
      full_name = u.full_name || name || ''
    }

    const user = { id: userId, email, full_name, role }
    res.json({ token: makeToken(user), user })
  } catch (err) {
    console.error('Google auth error:', err)
    res.status(401).json({ error: 'Google doğrulaması başarısız.' })
  }
})

// Şifre sıfırlama kodu gönder
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email zorunludur.' })

    // Kullanıcı var mı kontrol et
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] })
    if (result.rows.length === 0) {
      // Güvenlik için her durumda başarılı döndür
      return res.json({ success: true })
    }

    const u = result.rows[0]
    if (u.password_hash.startsWith('google_')) {
      return res.status(400).json({ error: 'Google ile kayıt olan hesaplarda şifre sıfırlama kullanılamaz.' })
    }

    // 6 haneli kod oluştur
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 dakika

    resetCodes.set(email, { code, expiresAt })

    // Email gönder (Resend)
    const { data, error } = await resend.emails.send({
      from: 'HKC Hırdavat <noreply@hakansezerinsaat.com>',
      to: email,
      subject: 'Şifre Sıfırlama Kodunuz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #d97706; margin-bottom: 8px;">Şifre Sıfırlama</h2>
          <p style="color: #374151; margin-bottom: 24px;">Aşağıdaki 6 haneli kodu kullanarak şifrenizi sıfırlayabilirsiniz.</p>
          <div style="background: #d97706; color: white; font-size: 36px; font-weight: bold; letter-spacing: 12px; text-align: center; padding: 20px 32px; border-radius: 8px; margin-bottom: 24px;">
            ${code}
          </div>
          <p style="color: #6b7280; font-size: 14px;">Bu kod <strong>10 dakika</strong> geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız bu emaili dikkate almayın.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #9ca3af; font-size: 12px;">HKC Hırdavat &amp; İnşaat Malzemeleri</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(500).json({ error: 'Email gönderilemedi. Lütfen tekrar deneyin.' })
    }

    console.log('✅ Mail gönderildi:', data?.id, '→', email)
    res.json({ success: true })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ error: 'Email gönderilemedi. Lütfen tekrar deneyin.' })
  }
})

// Kodu doğrula
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body
    if (!email || !code) return res.status(400).json({ error: 'Email ve kod zorunludur.' })

    const stored = resetCodes.get(email)
    if (!stored) return res.status(400).json({ error: 'Kod bulunamadı. Lütfen tekrar kod isteyin.' })
    if (Date.now() > stored.expiresAt) {
      resetCodes.delete(email)
      return res.status(400).json({ error: 'Kodun süresi dolmuş. Lütfen yeni kod isteyin.' })
    }
    if (stored.code !== code) return res.status(400).json({ error: 'Hatalı kod. Lütfen tekrar deneyin.' })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası.' })
  }
})

// Yeni şifre belirle
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, new_password } = req.body
    if (!email || !code || !new_password) return res.status(400).json({ error: 'Tüm alanlar zorunludur.' })
    if (new_password.length < 6) return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır.' })

    // Kodu tekrar doğrula
    const stored = resetCodes.get(email)
    if (!stored) return res.status(400).json({ error: 'Kod bulunamadı. Lütfen tekrar kod isteyin.' })
    if (Date.now() > stored.expiresAt) {
      resetCodes.delete(email)
      return res.status(400).json({ error: 'Kodun süresi dolmuş. Lütfen yeni kod isteyin.' })
    }
    if (stored.code !== code) return res.status(400).json({ error: 'Hatalı kod.' })

    // Şifreyi güncelle
    const newHash = await bcrypt.hash(new_password, 10)
    await db.execute({ sql: 'UPDATE users SET password_hash = ? WHERE email = ?', args: [newHash, email] })

    // Kodu sil (tek kullanımlık)
    resetCodes.delete(email)

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası.' })
  }
})

// Şifre değiştir (giriş yapılmışken)
router.put('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Giriş gerekli.' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { current_password, new_password } = req.body
    if (!current_password || !new_password) return res.status(400).json({ error: 'Mevcut ve yeni şifre zorunludur.' })
    if (new_password.length < 6) return res.status(400).json({ error: 'Yeni şifre en az 6 karakter olmalıdır.' })

    const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [decoded.id] })
    if (result.rows.length === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' })

    const u = result.rows[0]
    if (u.password_hash.startsWith('google_')) return res.status(400).json({ error: 'Google ile giriş yapan hesapta şifre değiştirilemez.' })

    const valid = await bcrypt.compare(current_password, u.password_hash)
    if (!valid) return res.status(401).json({ error: 'Mevcut şifre hatalı.' })

    const newHash = await bcrypt.hash(new_password, 10)
    await db.execute({ sql: 'UPDATE users SET password_hash = ? WHERE id = ?', args: [newHash, decoded.id] })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası.' })
  }
})

// Ad Soyad güncelle
router.put('/update-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Giriş gerekli.' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { full_name } = req.body
    if (!full_name) return res.status(400).json({ error: 'Ad Soyad zorunludur.' })

    await db.execute({ sql: 'UPDATE users SET full_name = ? WHERE id = ?', args: [full_name, decoded.id] })
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [decoded.id] })
    const u = result.rows[0]
    const user = { id: Number(u.id), email: u.email, full_name: u.full_name, role: u.role }
    res.json({ token: makeToken(user), user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Sunucu hatası.' })
  }
})

export default router
