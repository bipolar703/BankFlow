import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage, LanguageCode, languages } from '../contexts/LanguageContext';

/**
 * Header Component
 *
 * Responsive navigation header with multilingual support, mobile menu,
 * and scroll-based appearance changes.
 */
const Header = () => {
  const { t, language, changeLanguage, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const location = useLocation();

  // Refs for click outside detection
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Enable body scrolling when menu is closed
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Toggle menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Add shadow to header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle language dropdown
  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen);
  };

  // Handle language selection
  const handleLanguageChange = (code: LanguageCode) => {
    changeLanguage(code);
    setIsLangDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close language dropdown when clicking outside
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }

      // Close mobile menu when clicking outside (but not on the toggle button)
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.mobile-menu-toggle')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Flag icons for language selector
  const flagIcons = {
    en: <img src="https://img.icons8.com/color/20/united-kingdom.png" alt="English" className="w-5 h-5" />,
    ar: <img src="https://img.icons8.com/color/20/iraq.png" alt="Arabic" className="w-5 h-5" />,
    ku: <img src="https://img.icons8.com/color/20/kurdistan--v1.png" alt="Kurdish" className="w-5 h-5" />
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-glass shadow-header' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary flex items-center">
          <span className="flex items-center">
            <span className="text-3xl font-bold">FIB</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
          <Link
            to="/"
            className={`text-gray-800 hover:text-primary transition-colors ${
              location.pathname === '/' ? 'text-primary font-medium' : ''
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/about"
            className={`text-gray-800 hover:text-primary transition-colors ${
              location.pathname === '/about' ? 'text-primary font-medium' : ''
            }`}
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/services"
            className={`text-gray-800 hover:text-primary transition-colors ${
              location.pathname === '/services' ? 'text-primary font-medium' : ''
            }`}
          >
            {t('nav.services')}
          </Link>
          <Link
            to="/contact"
            className={`text-gray-800 hover:text-primary transition-colors ${
              location.pathname === '/contact' ? 'text-primary font-medium' : ''
            }`}
          >
            {t('nav.contact')}
          </Link>

          {/* Verify Card CTA */}
          <Link
            to="/verify-card"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {t('cta.verifyCard')}
          </Link>

          {/* Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              className="flex items-center text-gray-800 hover:text-primary"
              onClick={toggleLangDropdown}
              aria-expanded={isLangDropdownOpen}
              aria-label="Select language"
            >
              {flagIcons[language]}
              <span className="ml-2 rtl:mr-2 rtl:ml-0">{languages[language].name}</span>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute top-full mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-10 animate-fadeIn">
                {Object.entries(languages).map(([code, langInfo]) => (
                  <button
                    key={code}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${
                      language === code ? 'bg-gray-100 font-medium' : ''
                    }`}
                    onClick={() => handleLanguageChange(code as LanguageCode)}
                  >
                    {flagIcons[code as LanguageCode]}
                    <span className="ml-2">{langInfo.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          {/* Mobile Language Selector */}
          <button
            className="mr-4 rtl:ml-4 rtl:mr-0 text-gray-800 flex items-center justify-center"
            onClick={toggleLangDropdown}
            aria-label="Toggle language menu"
          >
            {flagIcons[language]}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="text-gray-800 focus:outline-none p-2 mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden bg-white/95 backdrop-blur-sm pt-16 overflow-y-auto"
            ref={menuRef}
          >
            <div className="container mx-auto px-4 py-8">
              <nav className="flex flex-col space-y-6">
                <Link
                  to="/"
                  className={`text-xl text-gray-800 hover:text-primary ${
                    location.pathname === '/' ? 'text-primary font-medium' : ''
                  }`}
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/about"
                  className={`text-xl text-gray-800 hover:text-primary ${
                    location.pathname === '/about' ? 'text-primary font-medium' : ''
                  }`}
                >
                  {t('nav.about')}
                </Link>
                <Link
                  to="/services"
                  className={`text-xl text-gray-800 hover:text-primary ${
                    location.pathname === '/services' ? 'text-primary font-medium' : ''
                  }`}
                >
                  {t('nav.services')}
                </Link>
                <Link
                  to="/contact"
                  className={`text-xl text-gray-800 hover:text-primary ${
                    location.pathname === '/contact' ? 'text-primary font-medium' : ''
                  }`}
                >
                  {t('nav.contact')}
                </Link>

                {/* Mobile Verify Card CTA */}
                <Link
                  to="/verify-card"
                  className="w-full text-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-all duration-300 shadow-sm"
                >
                  {t('cta.verifyCard')}
                </Link>

                {/* Mobile Language Options */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    {isRTL ? 'زمان' : 'Language'}
                  </h3>
                  <div className="flex flex-col space-y-4">
                    {Object.entries(languages).map(([code, langInfo]) => (
                      <button
                        key={code}
                        className={`flex items-center py-2 ${
                          language === code ? 'text-primary font-medium' : 'text-gray-800'
                        }`}
                        onClick={() => handleLanguageChange(code as LanguageCode)}
                      >
                        {flagIcons[code as LanguageCode]}
                        <span className="ml-2 rtl:mr-2 rtl:ml-0">{langInfo.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Language Dropdown for Mobile (Absolute positioned) */}
        {isLangDropdownOpen && (
          <div
            className="lg:hidden absolute top-16 right-4 rtl:right-auto rtl:left-4 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn"
            ref={langDropdownRef}
          >
            {Object.entries(languages).map(([code, langInfo]) => (
              <button
                key={code}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center ${
                  language === code ? 'bg-gray-100 font-medium' : ''
                }`}
                onClick={() => handleLanguageChange(code as LanguageCode)}
              >
                {flagIcons[code as LanguageCode]}
                <span className="ml-2 rtl:mr-2 rtl:ml-0">{langInfo.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
