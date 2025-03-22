import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { CreditCard, Landmark, ShieldCheck, Smartphone, Wallet } from 'lucide-react';

const ServicesPage = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">{t('services.pageTitle')}</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">{t('services.pageDesc')}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <CreditCard size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('services.card1.title')}
              </h3>
              <p className="text-gray-700 mb-6">
                {t('services.card1.desc')}
              </p>
              <Link to="/verify-card" className="text-primary font-medium hover:underline">
                {t('hero.cta.primary')} →
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <Smartphone size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('services.card2.title')}
              </h3>
              <p className="text-gray-700 mb-6">
                Manage your accounts, transfer funds, pay bills, and more from your mobile device with our secure banking app.
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Download App →
              </a>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Identity Protection
              </h3>
              <p className="text-gray-700 mb-6">
                Advanced security features to protect your personal information and financial data from fraud and identity theft.
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Learn More →
              </a>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <Wallet size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Personal Loans
              </h3>
              <p className="text-gray-700 mb-6">
                Flexible personal loan options with competitive rates to help you achieve your financial goals and aspirations.
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Apply Now →
              </a>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <Landmark size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Business Banking
              </h3>
              <p className="text-gray-700 mb-6">
                Comprehensive banking solutions for businesses of all sizes, from startups to established enterprises.
              </p>
              <a href="#" className="text-primary font-medium hover:underline">
                Explore Services →
              </a>
            </div>

            {/* Service 6 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-headset">
                  <path d="M3 11V5a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 13v6a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"></path>
                  <path d="M3 13v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-700 mb-6">
                Round-the-clock customer support via phone, chat, or email. Our team is always ready to assist you with any banking needs.
              </p>
              <Link to="/contact" className="text-primary font-medium hover:underline">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join millions of satisfied customers who trust FIB Bank for their financial needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/verify-card"
              className="px-8 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              {t('hero.cta.primary')}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
