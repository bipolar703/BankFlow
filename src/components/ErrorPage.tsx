import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../store/AppStateContext';
import { CircleX } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();
  const { status, reset } = useAppState();
  
  useEffect(() => {
    // Redirect to home if user accessed this page directly without a rejection
    if (status !== 'rejected') {
      navigate('/');
    }
    
    // Reset application state after leaving this page
    return () => {
      reset();
    };
  }, [status, navigate, reset]);
  
  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-6 text-red-500">
          <CircleX size={64} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">فشلت عملية التحقق</h2>
        <p className="text-gray-600 mb-6">
          تم رفض طلب التحقق الخاص بك. يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
