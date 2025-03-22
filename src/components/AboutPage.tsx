import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { History, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">{t('about.title')}</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">{t('about.desc')}</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Bank team meeting"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Founded in 1990, FIB Bank has grown from a small regional bank to one of the leading financial institutions in the country, serving millions of customers with innovative banking solutions.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our journey began with a simple vision: to create a bank that truly understands and addresses the needs of its customers. Three decades later, that vision continues to guide everything we do.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we combine our rich heritage and experience with cutting-edge technology to deliver banking services that are secure, convenient, and tailored to the modern financial landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer First</h3>
              <p className="text-gray-700">
                We put our customers at the center of everything we do, striving to exceed expectations at every touchpoint.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trust & Security</h3>
              <p className="text-gray-700">
                We maintain the highest standards of integrity, security, and trustworthiness in all our operations.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-700">
                We continuously innovate to provide modern banking solutions that make financial management easier and more efficient.
              </p>
            </div>
            
            {/* Value 4 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <History size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Heritage</h3>
              <p className="text-gray-700">
                We honor our rich history while embracing the future, combining experience with forward-thinking approaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to experience better banking?</h2>
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

export default AboutPage;
