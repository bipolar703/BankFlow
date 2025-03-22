import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { House } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold mt-6 mb-4">{t('404.title')}</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          {t('404.desc')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition-colors"
        >
          <House size={20} className="mr-2 rtl:ml-2 rtl:mr-0" />
          <span>{t('404.button')}</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
