import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define available languages and their RTL status
export const languages = {
  en: { name: 'English', rtl: false, code: 'en' },
  ar: { name: 'العربية', rtl: true, code: 'ar' },
  ku: { name: 'کوردی', rtl: true, code: 'ku' }
};

export type LanguageCode = keyof typeof languages;

interface LanguageContextType {
  language: LanguageCode;
  isRTL: boolean;
  changeLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translations for each language
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'cta.verifyCard': 'Verify Card',
    
    // Homepage
    'hero.title': 'Modern Banking for a Better Future',
    'hero.subtitle': 'Secure, fast, and reliable financial services tailored for you',
    'hero.cta.primary': 'Get Started',
    'hero.cta.secondary': 'Learn More',
    
    'services.title': 'Our Services',
    'services.subtitle': 'Banking solutions for every need',
    'services.card1.title': 'Secure Transactions',
    'services.card1.desc': 'End-to-end encrypted payments for your security',
    'services.card2.title': 'Mobile Banking',
    'services.card2.desc': 'Manage your accounts anytime, anywhere',
    'services.card3.title': 'Smart Savings',
    'services.card3.desc': 'Intelligent tools to help you save more',
    'services.card4.title': 'Instant Support',
    'services.card4.desc': '24/7 customer service when you need it',
    
    'warning.title': 'Important Security Notice',
    'warning.desc': 'Never share your OTP, PIN or passwords with anyone including bank representatives. FIB Bank will never ask for this information.',
    
    'review.title': 'Trusted by Millions',
    'review.desc': 'Join thousands of satisfied customers who trust FIB Bank',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.about': 'About FIB Bank',
    'footer.aboutDesc': 'FIB Bank is a leading financial institution providing innovative banking solutions to individuals and businesses.',
    'footer.contact': 'Contact Us',
    'footer.address': '123 Banking Street, Financial District',
    'footer.links': 'Quick Links',
    'footer.careers': 'Careers',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.faq': 'FAQs',
    
    // About page
    'about.title': 'About FIB Bank',
    'about.desc': 'A trusted financial partner since 1990',
    
    // Services page
    'services.pageTitle': 'Our Services',
    'services.pageDesc': 'Comprehensive financial solutions for your needs',
    
    // Contact page
    'contact.title': 'Contact Us',
    'contact.desc': 'We\'re here to help with your banking needs',
    'contact.formName': 'Full Name',
    'contact.formEmail': 'Email Address',
    'contact.formMessage': 'Message',
    'contact.formSubmit': 'Send Message',
    
    // Not found page
    '404.title': 'Page Not Found',
    '404.desc': 'The page you are looking for doesn\'t exist or has been moved.',
    '404.button': 'Back to Home',
  },
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.about': 'حول',
    'nav.services': 'الخدمات',
    'nav.contact': 'اتصل بنا',
    'cta.verifyCard': 'تحقق من البطاقة',
    
    // Homepage
    'hero.title': 'خدمات مصرفية حديثة لمستقبل أفضل',
    'hero.subtitle': 'خدمات مالية آمنة وسريعة وموثوقة مصممة خصيصًا لك',
    'hero.cta.primary': 'ابدأ الآن',
    'hero.cta.secondary': 'اعرف المزيد',
    
    'services.title': 'خدماتنا',
    'services.subtitle': 'حلول مصرفية لكل احتياج',
    'services.card1.title': 'معاملات آمنة',
    'services.card1.desc': 'مدفوعات مشفرة بالكامل لضمان أمنك',
    'services.card2.title': 'الخدمات المصرفية عبر الجوال',
    'services.card2.desc': 'إدارة حساباتك في أي وقت وفي أي مكان',
    'services.card3.title': 'ادخار ذكي',
    'services.card3.desc': 'أدوات ذكية لمساعدتك على توفير المزيد',
    'services.card4.title': 'دعم فوري',
    'services.card4.desc': 'خدمة عملاء على مدار الساعة عندما تحتاجها',
    
    'warning.title': 'إشعار أمني مهم',
    'warning.desc': 'لا تشارك أبدًا كلمة المرور لمرة واحدة أو رقم التعريف الشخصي أو كلمات المرور مع أي شخص بما في ذلك ممثلي البنك. لن يطلب بنك FIB هذه المعلومات أبدًا.',
    
    'review.title': 'موثوق به من قبل الملايين',
    'review.desc': 'انضم إلى آلاف العملاء الراضين الذين يثقون ببنك FIB',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.about': 'حول بنك FIB',
    'footer.aboutDesc': 'بنك FIB هو مؤسسة مالية رائدة تقدم حلولاً مصرفية مبتكرة للأفراد والشركات.',
    'footer.contact': 'اتصل بنا',
    'footer.address': '123 شارع البنوك، الحي المالي',
    'footer.links': 'روابط سريعة',
    'footer.careers': 'وظائف',
    'footer.terms': 'شروط الخدمة',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.faq': 'الأسئلة الشائعة',
    
    // About page
    'about.title': 'حول بنك FIB',
    'about.desc': 'شريك مالي موثوق به منذ عام 1990',
    
    // Services page
    'services.pageTitle': 'خدماتنا',
    'services.pageDesc': 'حلول مالية شاملة لتلبية احتياجاتك',
    
    // Contact page
    'contact.title': 'اتصل بنا',
    'contact.desc': 'نحن هنا للمساعدة في احتياجاتك المصرفية',
    'contact.formName': 'الاسم الكامل',
    'contact.formEmail': 'البريد الإلكتروني',
    'contact.formMessage': 'الرسالة',
    'contact.formSubmit': 'إرسال الرسالة',
    
    // Not found page
    '404.title': 'الصفحة غير موجودة',
    '404.desc': 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    '404.button': 'العودة إلى الصفحة الرئيسية',
  },
  ku: {
    // Header
    'nav.home': 'سەرەکی',
    'nav.about': 'دەربارە',
    'nav.services': 'خزمەتگوزارییەکان',
    'nav.contact': 'پەیوەندی',
    'cta.verifyCard': 'پشتڕاستکردنەوەی کارت',
    
    // Homepage
    'hero.title': 'خزمەتگوزاری بانکی نوێ بۆ داهاتوویەکی باشتر',
    'hero.subtitle': 'خزمەتگوزاری دارایی پارێزراو، خێرا و متمانەپێکراو کە بۆ تۆ دیزاین کراوە',
    'hero.cta.primary': 'دەست پێ بکە',
    'hero.cta.secondary': 'زیاتر فێربە',
    
    'services.title': 'خزمەتگوزارییەکانمان',
    'services.subtitle': 'چارەسەری بانکی بۆ هەموو پێویستییەک',
    'services.card1.title': 'مامەڵەی پارێزراو',
    'services.card1.desc': 'پارەدانی کۆدکراو بۆ پاراستنی تۆ',
    'services.card2.title': 'بانکی مۆبایل',
    'services.card2.desc': 'بەڕێوەبردنی هەژمارەکانت لە هەر کات و شوێنێک',
    'services.card3.title': 'پاشەکەوتی زیرەک',
    'services.card3.desc': 'ئامرازی زیرەک بۆ یارمەتیدانت لە پاشەکەوتکردنی زیاتر',
    'services.card4.title': 'پشتگیری خێرا',
    'services.card4.desc': 'خزمەتگوزاری کڕیار ٢٤/٧ کاتێک پێویستت پێیەتی',
    
    'warning.title': 'ئاگاداری گرنگی ئاسایش',
    'warning.desc': 'هەرگیز ژمارەی نهێنی یەکجار، ژمارەی ناسنامەی کەسی یان وشە نهێنییەکانت لەگەڵ کەسێکدا هاوبەش مەکە لەوانە نوێنەرانی بانک. بانکی FIB هەرگیز داوای ئەم زانیارییانە ناکات.',
    
    'review.title': 'متمانەی ملیۆنان کەس',
    'review.desc': 'پەیوەندی بکە بە هەزاران کڕیاری دڵخۆشەوە کە متمانە بە بانکی FIB دەکەن',
    
    // Footer
    'footer.rights': 'هەموو مافەکان پارێزراون',
    'footer.about': 'دەربارەی بانکی FIB',
    'footer.aboutDesc': 'بانکی FIB دامەزراوەیەکی دارایی پێشەنگە کە چارەسەری بانکی داهێنەرانە پێشکەش بە تاکەکان و بزنسەکان دەکات.',
    'footer.contact': 'پەیوەندیمان پێوە بکە',
    'footer.address': '١٢٣ شەقامی بانک، ناوچەی دارایی',
    'footer.links': 'لینکی خێرا',
    'footer.careers': 'کارەکان',
    'footer.terms': 'مەرجەکانی خزمەتگوزاری',
    'footer.privacy': 'سیاسەتی تایبەتمەندی',
    'footer.faq': 'پرسیارە باوەکان',
    
    // About page
    'about.title': 'دەربارەی بانکی FIB',
    'about.desc': 'هاوبەشێکی دارایی متمانەپێکراو لە ساڵی ١٩٩٠ەوە',
    
    // Services page
    'services.pageTitle': 'خزمەتگوزارییەکانمان',
    'services.pageDesc': 'چارەسەری دارایی تەواو بۆ پێویستییەکانت',
    
    // Contact page
    'contact.title': 'پەیوەندیمان پێوە بکە',
    'contact.desc': 'ئێمە لێرەین بۆ یارمەتیدانت لە پێویستییە بانکییەکانت',
    'contact.formName': 'ناوی تەواو',
    'contact.formEmail': 'ناونیشانی ئیمەیل',
    'contact.formMessage': 'پەیام',
    'contact.formSubmit': 'ناردنی پەیام',
    
    // Not found page
    '404.title': 'پەڕە نەدۆزرایەوە',
    '404.desc': 'ئەو پەڕەیەی بەدوایدا دەگەڕێیت بوونی نییە یان گواستراوەتەوە.',
    '404.button': 'گەڕانەوە بۆ سەرەکی',
  }
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Get saved language from localStorage or use default (ku - Kurdish)
  const getSavedLanguage = (): LanguageCode => {
    const savedLanguage = localStorage.getItem('language') as LanguageCode;
    return savedLanguage && languages[savedLanguage] ? savedLanguage : 'ku';
  };

  const [language, setLanguage] = useState<LanguageCode>(getSavedLanguage());
  const isRTL = languages[language].rtl;

  // Apply RTL direction to the HTML element
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    
    // Save language to localStorage
    localStorage.setItem('language', language);
  }, [language, isRTL]);

  // Change language function
  const changeLanguage = (code: LanguageCode) => {
    if (languages[code]) {
      setLanguage(code);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
