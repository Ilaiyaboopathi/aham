import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const HeroSection = ({ onEnquiryClick }) => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch banners from CMS
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cms/banners`);
      const data = await response.json();
      
      // Transform CMS data to component format
      const transformedSlides = data.map(banner => ({
        id: banner._id,
        title: i18n.language === 'ta' ? banner.title_ta : banner.title_en,
        subtitle: i18n.language === 'ta' ? banner.subtitle_ta : banner.subtitle_en,
        cta: i18n.language === 'ta' ? banner.cta_text_ta : banner.cta_text_en,
        backgroundImage: banner.image_url,
        action: banner.cta_action,
        highlights: banner.highlights
      }));
      
      setSlides(transformedSlides.length > 0 ? transformedSlides : getDefaultSlides());
    } catch (error) {
      console.error('Failed to load banners:', error);
      setSlides(getDefaultSlides());
    } finally {
      setLoading(false);
    }
  };

  // Fallback default slides
  const getDefaultSlides = () => [
    {
      id: 1,
      title: t('hero.slide1.title'),
      subtitle: t('hero.slide1.subtitle'),
      cta: t('hero.slide1.cta'),
      backgroundImage: 'https://images.unsplash.com/photo-1628133287836-40bd5453bed1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxob21lJTIwb3duZXJzaGlwfGVufDB8fHx8MTc2MDAxMzIwN3ww&ixlib=rb-4.1.0&q=85',
      action: 'enquiry',
      highlights: ['No Income Proof Required', 'Quick Approval', 'Competitive Rates']
    },
  ];

  // Re-fetch when language changes
  useEffect(() => {
    if (!loading && slides.length > 0) {
      fetchBanners();
    }
  }, [i18n.language]);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideAction = (action) => {
    switch (action) {
      case 'enquiry':
        onEnquiryClick();
        break;
      case 'scorecard':
        // Scroll to scorecard section
        document.getElementById('eligibility-scorecard')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'pmay':
        // Scroll to PMAY section or open modal
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'emi':
        // Scroll to EMI calculator
        document.getElementById('emi-calculator')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        onEnquiryClick();
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen max-h-[800px] min-h-[600px] flex items-center justify-center bg-gradient-to-r from-primary-900 to-primary-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-screen max-h-[800px] min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].backgroundImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/70 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Slide Number */}
                <div className="flex items-center space-x-2 text-white/80">
                  <span className="text-sm font-medium">
                    {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                  </span>
                  <div className="flex space-x-1">
                    {slides.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 transition-all duration-300 ${
                          index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  {slides[currentSlide].title}
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
                  {slides[currentSlide].subtitle}
                </p>

                {/* Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  {slides[currentSlide].highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
                    >
                      <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      <span className="text-white text-sm font-medium">{highlight}</span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <button
                    onClick={() => handleSlideAction(slides[currentSlide].action)}
                    className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-large"
                  >
                    {slides[currentSlide].cta}
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                    <PlayIcon className="h-5 w-5" />
                    <span>Watch Demo</span>
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 right-8 z-20"
      >
        <div className="flex flex-col items-center space-y-2 text-white/80">
          <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
          <div className="w-px h-8 bg-white/60 relative">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 left-0 w-px h-2 bg-white"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;