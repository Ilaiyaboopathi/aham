import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  CalculatorIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import { getPhoneLink, getWhatsAppLink } from '../../utils/helpers';

const FloatingActions = ({ onEnquiryClick, onEMIClick, onScorecardClick }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const actionItems = [
    {
      id: 'call',
      icon: PhoneIcon,
      label: t('floatingActions.call'),
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.location.href = getPhoneLink(),
    },
    {
      id: 'whatsapp',
      icon: ChatBubbleBottomCenterTextIcon,
      label: t('floatingActions.whatsapp'),
      color: 'bg-green-600 hover:bg-green-700',
      action: () => window.open(getWhatsAppLink(), '_blank'),
    },
    {
      id: 'enquiry',
      icon: DocumentTextIcon,
      label: t('floatingActions.enquiry'),
      color: 'bg-primary-600 hover:bg-primary-700',
      action: onEnquiryClick,
    },
    {
      id: 'scorecard',
      icon: ClipboardDocumentCheckIcon,
      label: t('floatingActions.scorecard'),
      color: 'bg-purple-600 hover:bg-purple-700',
      action: onScorecardClick,
    },
    {
      id: 'emi',
      icon: CalculatorIcon,
      label: t('floatingActions.emiCalculator'),
      color: 'bg-blue-600 hover:bg-blue-700',
      action: onEMIClick,
    },
  ];

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      transition: { 
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: 50,
      scale: 0
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 25
      }
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={containerVariants}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 space-y-3"
      >
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-large transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          variants={itemVariants}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                {/* Pulse Animation */}
                <div className="absolute -inset-1 bg-primary-400 rounded-full animate-ping opacity-30"></div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
              {isExpanded ? 'Close Menu' : 'Quick Actions'}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </div>
          </div>
        </motion.button>

        {/* Action Items */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {actionItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={item.action}
                  className={`relative ${item.color} text-white p-3 rounded-full shadow-medium transition-all duration-300 group block`}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className="h-5 w-5" />
                  
                  {/* Tooltip */}
                  <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                    <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
                      {item.label}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingActions;