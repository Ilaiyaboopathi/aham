import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Import new AboutUs page
import AboutUs from './pages/AboutUs';

// Admin Panel
import AdminApp from './admin/AdminApp';

// Components
import Header from './components/Header/Header';
import HeroSection from './components/Hero/HeroSection';
import FloatingActions from './components/FloatingActions/FloatingActions';
import WhyChooseSection from './components/WhyChoose/WhyChooseSection';
import ProductsSection from './components/Products/ProductsSection';
import EMICalculatorSection from './components/EMICalculator/EMICalculatorSection';
import EligibilityScorecardSection from './components/EligibilityScorecard/EligibilityScorecardSection';
import TestimonialsSection from './components/Testimonials/TestimonialsSection';
import BlogSection from './components/Blog/BlogSection';
import Footer from './components/Footer/Footer';

// Modals
import EnquiryModal from './components/Modals/EnquiryModal';
import CreditScoreModal from './components/Modals/CreditScoreModal';

// Utils
import { scrollToSection } from './utils/helpers';

function App() {
  const { i18n } = useTranslation();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showCreditScoreModal, setShowCreditScoreModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Handle language change
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    
    // Update body class for Tamil font
    if (lang === 'ta') {
      document.body.classList.add('font-tamil');
    } else {
      document.body.classList.remove('font-tamil');
    }
  };

  // Initialize language on mount
  useEffect(() => {
    handleLanguageChange(i18n.language);
  }, [i18n.language]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#283079',
                color: '#ffffff',
                fontSize: '14px',
                borderRadius: '8px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />

          <Routes>
            {/* Admin Panel Routes */}
            <Route path="/admin/*" element={<AdminApp />} />
            
            {/* About Us Page Route */}
            <Route path="/about-us" element={<AboutUs />} />
            
            {/* Main Homepage Route */}
            <Route
              path="/*"
              element={
              <>
                {/* Header */}
                <Header
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  onCreditScoreClick={() => setShowCreditScoreModal(true)}
                />

                {/* Main Content */}
                <main className="overflow-hidden">
                  {/* Hero Section */}
                  <HeroSection onEnquiryClick={() => setShowEnquiryModal(true)} />

                  {/* Why Choose AHAM */}
                  <WhyChooseSection />

                  {/* Products Section */}
                  <ProductsSection />

                  {/* EMI Calculator */}
                  <EMICalculatorSection />

                  {/* Eligibility Scorecard */}
                  <EligibilityScorecardSection />

                  {/* Testimonials */}
                  <TestimonialsSection />

                  {/* Blog & Updates */}
                  <BlogSection />
                </main>

                {/* Footer */}
                <Footer />

                {/* Floating Actions */}
                <FloatingActions
                  onEnquiryClick={() => setShowEnquiryModal(true)}
                  onEMIClick={() => scrollToSection('emi-calculator')}
                  onScorecardClick={() => scrollToSection('eligibility-scorecard')}
                />

                {/* Modals */}
                {showEnquiryModal && (
                  <EnquiryModal
                    isOpen={showEnquiryModal}
                    onClose={() => setShowEnquiryModal(false)}
                  />
                )}

                {showCreditScoreModal && (
                  <CreditScoreModal
                    isOpen={showCreditScoreModal}
                    onClose={() => setShowCreditScoreModal(false)}
                  />
                )}
              </>
            }
          />
        </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;