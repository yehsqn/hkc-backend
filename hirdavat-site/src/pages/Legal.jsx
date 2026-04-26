import { useParams } from 'react-router-dom'

const CONTENT = {
  'hakkimizda': {
    title: 'Hakkımızda',
    text: `
      <h2>Biz Kimiz?</h2>
      <p>HKC İnşaat ve Yapı Malzemeleri olarak yılların verdiği tecrübe ile inşaat, makine ve hırdavat sektöründe kaliteli ve güvenilir hizmet sunuyoruz.</p>
      <h2>Vizyonumuz</h2>
      <p>Müşteri memnuniyetini en üst düzeyde tutarak, sektördeki yenilikleri takip edip en kaliteli ürünleri en uygun fiyatlarla sunmaktır.</p>
      <h2>Misyonumuz</h2>
      <p>İhtiyaçlara anında cevap verebilen, dürüst ve ilkeli ticaret anlayışımızla tüm Türkiye'ye hizmet vermek.</p>
    `
  },
  'gizlilik-sozlesmesi': {
    title: 'Gizlilik Sözleşmesi',
    text: `
      <h2>1. GİZLİLİK POLİTİKASI</h2>
      <p>HKC İnşaat ve Yapı Malzemeleri ("Şirket") olarak, web sitemizi ziyaret eden ve hizmetlerimizden faydalanan kullanıcılarımızın kişisel verilerinin güvenliğine büyük önem veriyoruz.</p>
      <h2>2. VERİ TOPLAMA VE KULLANIMI</h2>
      <p>Sipariş işlemleri için ad, soyad, iletişim bilgileri ve adres gibi temel bilgileriniz talep edilmektedir. Bu bilgiler sipariş sürecini tamamlamak haricinde hiçbir üçüncü taraf şirket veya şahısla paylaşılmamaktadır.</p>
      <h2>3. ÇEREZLER (COOKIES)</h2>
      <p>Web sitemiz, alışveriş deneyiminizi iyileştirmek için çerezler kullanmaktadır.</p>
    `
  },
  'mesafeli-satis-sozlesmesi': {
    title: 'Mesafeli Satış Sözleşmesi',
    text: `
      <h2>1. TARAFLAR</h2>
      <p>Bu sözleşme, alıcı (tüketici) ile satıcı (HKC İnşaat) arasında, dijital ortamda kurulan satış ilişkisini düzenler.</p>
      <h2>2. SÖZLEŞMENİN KONUSU</h2>
      <p>İşbu sözleşmenin konusu, alıcının satıcıya ait internet sitesinden elektronik ortamda siparişini yaptığı ürünlerin satışı ve teslimidir.</p>
      <h2>3. CAYMA HAKKI</h2>
      <p>Alıcı, ürünü teslim aldıktan sonra 14 gün içinde hiçbir gerekçe göstermeksizin cayma hakkına sahiptir.</p>
      <h2>4. YETKİLİ MAHKEME</h2>
      <p>İşbu sözleşmenin uygulanmasında, T.C. Sanayi ve Ticaret Bakanlığı tarafından ilan edilen değere kadar Tüketici Hakem Heyetleri ile alıcının veya satıcının yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.</p>
    `
  },
  'teslimat-iade': {
    title: 'Teslimat ve İade Şartları',
    text: `
      <h2>1. TESLİMAT BİLGİLERİ</h2>
      <p>Siparişleriniz onaylandıktan sonra en geç 3 iş günü içinde anlaşmalı kargo şirketine teslim edilmektedir. Kargo takip numarası e-posta adresinize gönderilir.</p>
      <h2>2. İADE KOŞULLARI</h2>
      <p>Satın aldığınız ürünleri teslim tarihinden itibaren 14 gün içerisinde kullanılmamış ve orijinal ambalajı bozulmamış şekilde iade edebilirsiniz.</p>
      <h2>3. HASARLI ÜRÜNLER</h2>
      <p>Kargo teslimatı sırasında pakette hasar varsa kargo görevlisine tutanak tutturarak ürünü teslim almayınız ve tarafımıza bilgi veriniz.</p>
    `
  },
  'on-bilgilendirme': {
    title: 'Ön Bilgilendirme Formu',
    text: `
      <h2>1. TARAFLAR</h2>
      <p>İşbu Ön Bilgilendirme Formu ("Form"), [HKC İnşaat ve Yapı Malzemeleri] ("Satıcı") ile sipariş veren müşteri ("Alıcı") arasında düzenlenmiştir.</p>
      <h2>2. SÖZLEŞMENİN KONUSU</h2>
      <p>İşbu Form'un konusu, Alıcı'nın Satıcı'ya ait web sitesinden sipariş verdiği ürün ve hizmetlerin satışı ve teslimatı ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca bilgilendirilmesidir.</p>
    `
  },
  'kvkk': {
    title: 'KVKK Aydınlatma Metni',
    text: `
      <h2>1. VERİ SORUMLUSU</h2>
      <p>Kişisel verileriniz, veri sorumlusu sıfatıyla [HKC İnşaat ve Yapı Malzemeleri] tarafından 6698 sayılı KVKK kapsamında işlenmektedir.</p>
      <h2>2. İŞLENME AMACI</h2>
      <p>Kişisel verileriniz; sipariş süreçlerinin yürütülmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.</p>
    `
  }
}

export default function Legal() {
  const { pageId } = useParams()
  const content = CONTENT[pageId]

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Sayfa Bulunamadı</h1>
        <p className="text-gray-500">Aradığınız bilgilendirme sayfası mevcut değil.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="bg-white border rounded-2xl p-6 md:p-12 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b">
          {content.title}
        </h1>
        <div
          className="prose max-w-none text-gray-700 space-y-6 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:text-lg prose-p:text-sm prose-li:text-sm"
          dangerouslySetInnerHTML={{ __html: content.text }}
        />
      </div>
    </div>
  )
}
