import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-hot-toast';
import {
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';

import { eligibilityAPI } from '../../services/api';

const EligibilityScorecardSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    {
      id: 'age_group',
      question: t('eligibilityScorecard.questions.age'),
      options: [
        { value: '21-30', label: '21-30 years' },
        { value: '31-40', label: '31-40 years' },
        { value: '41-50', label: '41-50 years' },
        { value: '51-60', label: '51-60 years' },
        { value: '60+', label: '60+ years' }
      ]
    },
    {
      id: 'income_range',
      question: t('eligibilityScorecard.questions.income'),
      options: [
        { value: 'below-3lakh', label: 'Below ₹3 Lakhs' },
        { value: '3-5lakh', label: '₹3-5 Lakhs' },
        { value: '5-10lakh', label: '₹5-10 Lakhs' },
        { value: '10-20lakh', label: '₹10-20 Lakhs' },
        { value: 'above-20lakh', label: 'Above ₹20 Lakhs' }
      ]
    },
    {
      id: 'employment_type',
      question: t('eligibilityScorecard.questions.employment'),
      options: [
        { value: 'salaried', label: 'Salaried Employee' },
        { value: 'self-employed', label: 'Self Employed' },
        { value: 'business', label: 'Business Owner' },
        { value: 'professional', label: 'Professional' },
        { value: 'retired', label: 'Retired' }
      ]
    },
    {
      id: 'city_tier',
      question: t('eligibilityScorecard.questions.city'),
      options: [
        { value: 'tier-1', label: 'Tier 1 City (Mumbai, Delhi, etc.)' },
        { value: 'tier-2', label: 'Tier 2 City (Pune, Jaipur, etc.)' },
        { value: 'tier-3', label: 'Tier 3 City' },
        { value: 'rural', label: 'Rural Area' }
      ]
    },
    {
      id: 'existing_loans',
      question: t('eligibilityScorecard.questions.existingLoans'),
      options: [
        { value: 'none', label: 'No Existing Loans' },
        { value: 'home-loan', label: 'Home Loan' },
        { value: 'personal-loan', label: 'Personal Loan' },
        { value: 'multiple', label: 'Multiple Loans' },
        { value: 'credit-card', label: 'Credit Card Only' }
      ]
    },
    {
      id: 'credit_score_range',
      question: t('eligibilityScorecard.questions.creditScore'),
      options: [
        { value: 'excellent-750+', label: 'Excellent (750+)' },
        { value: 'good-700-750', label: 'Good (700-750)' },
        { value: 'fair-650-700', label: 'Fair (650-700)' },
        { value: 'poor-600-650', label: 'Poor (600-650)' },
        { value: 'very-poor-below-600', label: 'Very Poor (<600)' },
        { value: 'unknown', label: "Don't Know" }
      ]
    },
    {
      id: 'property_type',
      question: t('eligibilityScorecard.questions.propertyType'),
      options: [
        { value: 'ready-to-move', label: 'Ready to Move' },
        { value: 'under-construction', label: 'Under Construction' },
        { value: 'plot', label: 'Plot Purchase' },
        { value: 'renovation', label: 'Renovation' },
        { value: 'refinance', label: 'Refinance' }
      ]
    }
  ];

  const handleOptionSelect = (value) => {
    setResponses(prev => ({
      ...prev,
      [questions[currentStep].id]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const response = await eligibilityAPI.assess(responses);
      
      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Assessment completed successfully!');
      }
    } catch (error) {
      console.error('Assessment failed:', error);
      toast.error('Failed to complete assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setResponses({});
    setResult(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-blue-600 bg-blue-50';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50';
      case 'poor':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (result) {
    return (
      <section id="eligibility-scorecard" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-3xl p-8 lg:p-12 text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-6">
                  <CheckCircleIcon className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Assessment Complete!
                </h2>
                
                <div className="text-6xl lg:text-7xl font-bold text-primary-600 mb-4">
                  {result.score}/150
                </div>
                
                <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${getStatusColor(result.status)}`}>
                  {result.status} Eligibility
                </div>
              </div>

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {result.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 text-left">
                        <StarIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="btn-primary"
                  onClick={() => toast.success('Redirecting to loan application...')}
                >
                  Apply for Loan
                </button>
                
                <button
                  onClick={resetAssessment}
                  className="btn-outline"
                >
                  Take Assessment Again
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="eligibility-scorecard" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-100 p-4 rounded-2xl">
                <ClipboardDocumentCheckIcon className="h-12 w-12 text-purple-600" />
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('eligibilityScorecard.title')}
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('eligibilityScorecard.subtitle')}
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-primary-600">
                {Math.round(((currentStep + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Question Card */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-large p-8 lg:p-12"
              >
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
                  {questions[currentStep].question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentStep].options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        responses[questions[currentStep].id] === option.value
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          responses[questions[currentStep].id] === option.value
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-gray-300'
                        }`}>
                          {responses[questions[currentStep].id] === option.value && (
                            <CheckCircleIcon className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={itemVariants} className="flex justify-between items-center mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              disabled={!responses[questions[currentStep].id] || isSubmitting}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                !responses[questions[currentStep].id] || isSubmitting
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === questions.length - 1 ? 'Get Results' : 'Next'}</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EligibilityScorecardSection;