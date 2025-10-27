import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
// Social media icons - using simple div placeholders since specific icons don't exist in heroicons

import { getPhoneLink, scrollToSection } from '../../utils/helpers';

const Footer = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Home Loans', href: '#products' },
    { label: 'PMAY 2.0', href: '#pmay' },
    { label: 'EMI Calculator', href: '#emi-calculator' },
    { label: 'Eligibility Check', href: '#eligibility-scorecard' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  const products = [
    'Home Construction Loan',
    'Plot + Construction Loan',
    'NRI Home Loan',
    'Home Renovation Loan',
    'Home Extension Loan',
    'Mortgage Loan'
  ];

  const support = [
    'Customer Support',
    'Branch Locator',
    'Download Forms',
    'Track Application',
    'FAQs',
    'Grievance Redressal'
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', label: 'F' },
    { name: 'Twitter', href: '#', label: 'T' },
    { name: 'Instagram', href: '#', label: 'I' },
    { name: 'LinkedIn', href: '#', label: 'L' },
    { name: 'YouTube', href: '#', label: 'Y' }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #283079 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #4f46e5 0%, transparent 50%)`
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div className="text-xl font-bold">
                    AHAM
                    <span className="block text-sm font-normal text-gray-400">
                      Housing Finance Limited
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                  {t('footer.description')}
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                    <a href={getPhoneLink()} className="text-gray-300 hover:text-white transition-colors">
                      {t('footer.phone')}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                    <a href="mailto:info@ahamhfc.com" className="text-gray-300 hover:text-white transition-colors">
                      {t('footer.email')}
                    </a>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-primary-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300">
                      {t('footer.address')}
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 mt-6">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      className="bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white w-10 h-10 rounded-lg transition-all duration-300 flex items-center justify-center font-semibold"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {social.label}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">{t('footer.quickLinks')}</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.href.substring(1))}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">{t('footer.products')}</h4>
              <ul className="space-y-3">
                {products.map((product, index) => (
                  <li key={index}>
                    <button className="text-gray-300 hover:text-white transition-colors duration-300 text-left text-sm">
                      {product}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-gray-800"
          >
            <div className="max-w-md">
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4">
                Get the latest home loan updates and offers.
              </p>
              
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>

            <div className="flex items-center space-x-6 text-sm">
              <button className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ArrowUpIcon className="h-6 w-6" />
      </motion.button>
    </footer>
  );
};

export default Footer;