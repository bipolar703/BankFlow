import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Headset, Info, ShieldCheck, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * HomePage Component
 * 
 * The main landing page of the application featuring:
 * - Hero section with call-to-action
 * - Services overview
 * - Security warnings
 * - Mobile-optimized layout
 */
const HomePage = () => {
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle CTA button click with loading simulation for security perception
  const handleGetStarted = () => {
    setIsLoading(true);
    
    // Simulate loading/security check before redirecting
    setTimeout(() => {
      setIsLoading(false);
      navigate('/verify-card');
    }, 1500);
  };
  
  const showKurdish = language === 'ku';
  
  return (
    <div className="pt-20">
      {/* Hero Section - Mobile First Design */}
      <section className="py-10 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Warning Banner */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            <div className="flex">
              <div className={`flex-shrink-0 text-amber-500 ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <Info size={24} />
              </div>
              <div className="text-sm text-gray-700">
                {showKurdish ? (
                  <p>تکایە زانیاری بەکارهێنانی کارتەکەت لەگەڵ کەسی تر بەشدار مەکە بۆ زانین FIB هەرگیز داوای زانیاری کارتەکەت لێ ناکات.</p>
                ) : (
                  t('warning.desc')
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {showKurdish ? (
                  <>ئایندەت لەگەڵ<br />بانکی FIB بنەخشێنە</>
                ) : (
                  t('hero.title')
                )}
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                {showKurdish ? (
                  "بەشێک بە لە گواستنەوەکاری"
                ) : (
                  t('hero.subtitle')
                )}
              </p>
              
              <button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg shadow-button hover:bg-primary-light transition-all duration-300 text-center font-medium"
                aria-label={isLoading ? "Loading..." : "Get Started"}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {showKurdish ? "چاوەڕوانبە..." : "Loading..."}
                  </div>
                ) : (
                  showKurdish ? "دەستپێبکە" : t('hero.cta.primary')
                )}
              </button>
              
              <div className="mt-4 text-sm text-gray-500 flex items-center">
                <ShieldCheck size={16} className={`${isRTL ? 'ml-1' : 'mr-1'}`} />
                {showKurdish ? "ئاستی بەرزی پاراستن" : "Secure Environment"}
              </div>
            </div>
            
            {/* Mobile App Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative max-w-[280px] md:max-w-[320px]">
                <img 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Bank mobile app"
                  className="rounded-2xl shadow-2xl w-full phone-float"
                  loading="eager"
                />
                <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                  <div className="bg-primary rounded-full p-2">
                    <ShieldCheck size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview - Simplified for Mobile */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {showKurdish ? "خزمەتگوزارییەکانمان" : t('services.title')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {showKurdish ? "پارەدانی سەلامەت" : t('services.card1.title')}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {showKurdish ? "پارەدانی پارێزراو بۆ ئاسایشی تۆ" : t('services.card1.desc')}
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {showKurdish ? "بانکی مۆبایل" : t('services.card2.title')}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {showKurdish ? "بەڕێوەبردنی هەژمارەکانت لە هەر کات و شوێنێک" : t('services.card2.desc')}
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow transform hover:translate-y-[-4px] duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Headset size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {showKurdish ? "پشتگیری خێرا" : t('services.card4.title')}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {showKurdish ? "خزمەتگوزاری کڕیار ٢٤/٧ کاتێک پێویستت پێیەتی" : t('services.card4.desc')}
              </p>
            </div>
          </div>
          
          {/* How it works section */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium mb-4">
              {showKurdish ? "بزانە چۆن کار دەکات" : "See how it works"}
            </h3>
            <button 
              className="flex items-center mx-auto text-primary font-medium hover:underline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span>{showKurdish ? "زیاتر بزانە" : "Learn more"}</span>
              <ChevronRight size={18} className={`${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-primary mb-2">
                <strong className="text-3xl font-bold">24/7</strong>
              </div>
              <p className="text-sm text-gray-600">
                {showKurdish ? "خزمەتگوزاری بەردەوام" : "Customer Support"}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-primary mb-2">
                <strong className="text-3xl font-bold">256</strong>
              </div>
              <p className="text-sm text-gray-600">
                {showKurdish ? "کۆدکردنی بیت" : "Bit Encryption"}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-primary mb-2">
                <strong className="text-3xl font-bold">100%</strong>
              </div>
              <p className="text-sm text-gray-600">
                {showKurdish ? "دڵنیایی و متمانە" : "Secure Transactions"}
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-primary mb-2">
                <strong className="text-3xl font-bold">10M+</strong>
              </div>
              <p className="text-sm text-gray-600">
                {showKurdish ? "ژمارەی کڕیارەکان" : "Happy Customers"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {showKurdish ? "ئامادەی بۆ دەستپێکردن؟" : "Ready to get started?"}
          </h2>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto">
            {showKurdish 
              ? "باشترین ئەزموونی بانکی موبایل لەگەڵ بانکی FIB" 
              : "Experience the best mobile banking with FIB Bank"}
          </p>
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg shadow-button hover:bg-primary-light transition-all duration-300 font-medium"
          >
            {showKurdish ? "دەستپێبکە" : t('hero.cta.primary')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
