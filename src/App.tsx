import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import CardDetailsForm from './components/CardDetailsForm';
import VerificationPage from './components/VerificationPage';
import SuccessPage from './components/SuccessPage';
import ErrorPage from './components/ErrorPage';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { AppStateProvider } from './store/AppStateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import NotFoundPage from './components/NotFoundPage';

export function App() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Marketing/Informational Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Card Verification Flow */}
                <Route path="/verify-card" element={<CardDetailsForm />} />
                <Route path="/verify" element={<VerificationPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/error" element={<ErrorPage />} />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppStateProvider>
    </LanguageProvider>
  );
}

export default App;
