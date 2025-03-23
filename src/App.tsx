import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AboutPage from "./components/AboutPage";
import CardDetailsForm from "./components/CardDetailsForm";
import ContactPage from "./components/ContactPage";
import ErrorPage from "./components/ErrorPage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import ServicesPage from "./components/ServicesPage";
import SuccessPage from "./components/SuccessPage";
import VerificationPage from "./components/VerificationPage";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./index.css";
import { AppStateProvider } from "./store/AppStateContext";

/**
 * Base Layout Component
 * Ensures consistent spacing and layout across all pages
 */
const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4 mt-16 mb-8">
        <div className="container mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

/**
 * Card Verification Layout
 * Special layout for the card verification flow with centered content
 */
const VerificationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4 mt-16 mb-8">
        <div className="container mx-auto flex justify-center items-center">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <Router>
          <Routes>
            {/* Marketing/Informational Pages */}
            <Route
              path="/"
              element={
                <BaseLayout>
                  <HomePage />
                </BaseLayout>
              }
            />
            <Route
              path="/about"
              element={
                <BaseLayout>
                  <AboutPage />
                </BaseLayout>
              }
            />
            <Route
              path="/services"
              element={
                <BaseLayout>
                  <ServicesPage />
                </BaseLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <BaseLayout>
                  <ContactPage />
                </BaseLayout>
              }
            />

            {/* Card Verification Flow */}
            <Route
              path="/verify-card"
              element={
                <VerificationLayout>
                  <CardDetailsForm />
                </VerificationLayout>
              }
            />
            <Route
              path="/verify"
              element={
                <VerificationLayout>
                  <VerificationPage />
                </VerificationLayout>
              }
            />
            <Route
              path="/success"
              element={
                <VerificationLayout>
                  <SuccessPage />
                </VerificationLayout>
              }
            />
            <Route
              path="/error"
              element={
                <VerificationLayout>
                  <ErrorPage />
                </VerificationLayout>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <BaseLayout>
                  <NotFoundPage />
                </BaseLayout>
              }
            />
          </Routes>
        </Router>
      </AppStateProvider>
    </LanguageProvider>
  );
}

export default App;
