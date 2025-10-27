import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneIcon, 
  MapPinIcon, 
  StarIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

import { getPhoneLink, scrollToSection } from '../../utils/helpers';

const Header = ({ currentLanguage, onLanguageChange, onCreditScoreClick }) => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navigationItems = [
    { key: 'homeLoans', label: t('header.navigation.homeLoans'), href: '#products' },
    { key: 'pmay', label: t('header.navigation.pmay'), href: '#pmay' },
    { key: 'mortgageLoans', label: t('header.navigation.mortgageLoans'), href: '#products' },
    { key: 'emiCalculator', label: t('header.navigation.emiCalculator'), href: '#emi-calculator' },
    { key: 'partnerUs', label: t('header.navigation.partnerUs'), href: '#partner' },
    { key: 'careers', label: t('header.navigation.careers'), href: '#careers' },
    { key: 'aboutUs', label: t('header.navigation.aboutUs'), href: '/about-us' },
  ];

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      const sectionId = href.substring(1);
      scrollToSection(sectionId);
    } else if (href.startsWith('/')) {
      // Handle internal page navigation
      window.location.href = href;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-primary-600 text-white py-2 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <motion.a
              href={getPhoneLink()}
              className="flex items-center space-x-2 hover:text-primary-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneIcon className="h-4 w-4" />
              <span>{t('header.call')}</span>
            </motion.a>
            
            <span className="hidden md:block text-primary-200">|</span>
            
            <motion.button
              className="flex items-center space-x-2 hover:text-primary-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPinIcon className="h-4 w-4" />
              <span>{t('header.branchLocator')}</span>
            </motion.button>
            
            <span className="hidden md:block text-primary-200">|</span>
            
            <motion.button
              onClick={onCreditScoreClick}
              className="flex items-center space-x-2 bg-yellow-500 text-primary-900 px-3 py-1 rounded-full text-xs font-semibold hover:bg-yellow-400 transition-colors animate-pulse-slow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <StarIcon className="h-4 w-4" />
              <span>{t('header.creditScore')}</span>
            </motion.button>
          </div>
        </div>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-float"></div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-soft' 
            : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <div className="text-xl font-bold text-primary-600">
                  AHAM
                  <span className="block text-sm font-normal text-gray-600">
                    Housing Finance
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.key}
                  onClick={() => handleNavClick(item.href)}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.button
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </motion.button>

              {/* Language Toggle */}
              <div className="relative">
                <motion.button
                  onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlobeAltIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentLanguage === 'en' ? 'EN' : 'தமிழ்'}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </motion.button>

                <AnimatePresence>
                  {activeDropdown === 'language' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-lg shadow-medium border"
                    >
                      <button
                        onClick={() => {
                          onLanguageChange('en');
                          setActiveDropdown(null);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          currentLanguage === 'en' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          onLanguageChange('ta');
                          setActiveDropdown(null);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          currentLanguage === 'ta' ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
                        }`}
                      >
                        தமிழ்
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Customer Login */}
              <motion.button
                className="hidden md:flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserIcon className="h-4 w-4" />
                <span>{t('header.customerLogin')}</span>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.key}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                
                <motion.button
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium transition-colors w-full justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{t('header.customerLogin')}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;