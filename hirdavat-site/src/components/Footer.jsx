import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-semibold text-gray-900 mb-4">Kurumsal</div>
          <ul className="space-y-2.5">
            <li><Link to="/bilgi/hakkimizda" className="text-gray-600 hover:text-primary-600 transition-colors">Hakkımızda</Link></li>
            <li><Link to="/bilgi/kvkk" className="text-gray-600 hover:text-primary-600 transition-colors">KVKK Aydınlatma Metni</Link></li>
            <li><Link to="/bilgi/gizlilik-sozlesmesi" className="text-gray-600 hover:text-primary-600 transition-colors">Gizlilik Sözleşmesi</Link></li>
            <li><Link to="/bilgi/mesafeli-satis-sozlesmesi" className="text-gray-600 hover:text-primary-600 transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
            <li><Link to="/bilgi/on-bilgilendirme" className="text-gray-600 hover:text-primary-600 transition-colors">Ön Bilgilendirme Formu</Link></li>
            <li><Link to="/bilgi/teslimat-iade" className="text-gray-600 hover:text-primary-600 transition-colors">Teslimat ve İade Şartları</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-900 mb-4">Kategoriler</div>
          <ul className="space-y-2.5">
            <li><a href="/makineler" className="text-gray-600 hover:text-primary-600 transition-colors">Makineler</a></li>
            <li><a href="/el-aletleri" className="text-gray-600 hover:text-primary-600 transition-colors">El Aletleri</a></li>
            <li><a href="/hirdavat" className="text-gray-600 hover:text-primary-600 transition-colors">Hırdavat</a></li>
            <li><a href="/bataryalar" className="text-gray-600 hover:text-primary-600 transition-colors">Bataryalar</a></li>
          </ul>
        </div>
        
        <div>
          <div className="font-semibold text-gray-900 mb-4">İletişim</div>
          <ul className="space-y-2.5 text-gray-600">
            <li><a href="tel:05448765907" className="hover:text-primary-600 transition-colors">0544 876 59 07</a></li>
            <li><a href="mailto:hkcinsaat42@gmail.com" className="hover:text-primary-600 transition-colors">hkcinsaat42@gmail.com</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-gray-900 mb-4">Güvenli Alışveriş</div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-medium">256-Bit SSL Sertifikası ile %100 Güvenli Alışveriş</span>
            </div>
            <img src="/iyzico_logo.svg" alt="iyzico ile Öde - Visa & MasterCard" className="w-full max-w-[200px]" />
          </div>
        </div>
      </div>
      <div className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <span>© {new Date().getFullYear()} <a href="https://www.yehsan.com" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary-600 transition-colors">By Yehsqn</a> — Tüm hakları saklıdır.</span>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/bilgi/gizlilik-sozlesmesi" className="hover:text-primary-600 transition-colors">Gizlilik Sözleşmesi</Link>
            <Link to="/bilgi/mesafeli-satis-sozlesmesi" className="hover:text-primary-600 transition-colors">Mesafeli Satış</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
