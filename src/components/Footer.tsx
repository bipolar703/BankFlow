import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.about')}</h3>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">FIB Bank</h2>
              <p className="text-gray-200 text-sm leading-relaxed">
                {t('footer.aboutDesc')}
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className={`flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'} mt-1`} />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className={`flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <a href="mailto:contact@fibbank.com" className="hover:underline">
                  contact@fibbank.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={20} className={`flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <a href="tel:+1234567890" className="hover:underline" dir="ltr">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-gray-300 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-gray-300 transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-300 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300 transition-colors">
                  {t('footer.careers')}
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300 transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Legal */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-gray-300 transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300 transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300 transition-colors">
                  Compliance
                </Link>
              </li>
            </ul>
            
            {/* App Store Badges */}
            <div className="mt-6 space-y-3">
              <a href="#" className="flex items-center bg-black/30 hover:bg-black/50 transition-colors rounded-lg px-3 py-2 w-36">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 rtl:ml-2 rtl:mr-0">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              
              <a href="#" className="flex items-center bg-black/30 hover:bg-black/50 transition-colors rounded-lg px-3 py-2 w-36">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 rtl:ml-2 rtl:mr-0">
                  <path d="M3,20.5C3,21.3 3.8,22 4.5,22H19.5C20.3,22 21,21.3 21,20.5V3.5C21,2.8 20.3,2 19.5,2H4.5C3.8,2 3,2.8 3,3.5V20.5M14.6,13.8L16.8,12L14.6,10.3V13.8M6.7,10.3L10.5,12L6.7,13.8V10.3Z" />
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} FIB Bank. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
