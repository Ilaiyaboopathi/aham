import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  XMarkIcon,
  StarIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

import { validateEmail, validateMobile } from '../../utils/helpers';

const CreditScoreModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockScore, setMockScore] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock credit score based on form data
      const baseScore = 650;
      let score = baseScore;
      
      // Add variations based on form data
      if (data.employment === 'salaried') score += 50;
      if (data.income === 'high') score += 100;
      if (data.existingLoans === 'none') score += 80;
      
      // Add some randomness
      score += Math.floor(Math.random() * 50) - 25;
      
      // Keep score in valid range
      score = Math.min(Math.max(score, 300), 850);
      
      setMockScore(score);
      setStep(3);
      setIsSubmitting(false);
      toast.success('Credit score retrieved successfully!');
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-600 bg-green-50';
    if (score >= 700) return 'text-blue-600 bg-blue-50';
    if (score >= 650) return 'text-yellow-600 bg-yellow-50';
    if (score >= 600) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  };

  const getScoreAdvice = (score) => {
    if (score >= 750) {
      return [
        'Perfect credit profile for best loan rates',
        'Eligible for premium loan products',
        'Continue maintaining excellent payment history'
      ];
    }
    if (score >= 700) {
      return [
        'Good credit profile for competitive rates',
        'Eligible for most loan products',
        'Consider improving credit utilization'
      ];
    }
    if (score >= 650) {
      return [
        'Fair credit score, moderate loan approval chances',
        'Focus on timely EMI payments',
        'Reduce outstanding debt levels'
      ];
    }
    return [
      'Credit improvement needed for better loan terms',
      'Pay all EMIs on time for 6 months',
      'Consider credit counseling services'
    ];
  };

  const handleClose = () => {
    reset();
    setStep(1);
    setMockScore(null);
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 25 
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            variants={contentVariants}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 relative overflow-hidden">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <StarIcon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Free Credit Score Check</h3>
                  <p className="text-white/90">Get your credit score instantly</p>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Step {step} of 3</span>
                  <span>{Math.round((step / 3) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Basic Information
                      </h4>
                      <p className="text-gray-600">
                        Help us verify your identity for accurate credit score
                      </p>
                    </div>

                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            {...register('name', { required: 'Name is required' })}
                            className={`input-primary ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mobile Number *
                          </label>
                          <input
                            {...register('mobile', {
                              required: 'Mobile number is required',
                              validate: (value) => validateMobile(value) || 'Enter valid mobile number'
                            })}
                            className={`input-primary ${errors.mobile ? 'border-red-500' : ''}`}
                            placeholder="Enter 10-digit mobile"
                            maxLength={10}
                          />
                          {errors.mobile && (
                            <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            {...register('email', {
                              required: 'Email is required',
                              validate: (value) => validateEmail(value) || 'Enter valid email'
                            })}
                            className={`input-primary ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Enter email address"
                            type="email"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date of Birth *
                          </label>
                          <input
                            {...register('dob', { required: 'Date of birth is required' })}
                            className={`input-primary ${errors.dob ? 'border-red-500' : ''}`}
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                          />
                          {errors.dob && (
                            <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">Your information is secure</p>
                            <p>We use bank-grade encryption to protect your data. This check will not impact your credit score.</p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full btn-primary"
                      >
                        Continue
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        Employment & Income Details
                      </h4>
                      <p className="text-gray-600">
                        This helps us provide more accurate credit assessment
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Employment Type
                          </label>
                          <select
                            {...register('employment')}
                            className="input-primary"
                          >
                            <option value="salaried">Salaried Employee</option>
                            <option value="self-employed">Self Employed</option>
                            <option value="business">Business Owner</option>
                            <option value="professional">Professional</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Monthly Income Range
                          </label>
                          <select
                            {...register('income')}
                            className="input-primary"
                          >
                            <option value="low">Below ₹50,000</option>
                            <option value="medium">₹50,000 - ₹1,00,000</option>
                            <option value="high">Above ₹1,00,000</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Existing Loans
                          </label>
                          <select
                            {...register('existingLoans')}
                            className="input-primary"
                          >
                            <option value="none">No Existing Loans</option>
                            <option value="home">Home Loan</option>
                            <option value="personal">Personal Loan</option>
                            <option value="multiple">Multiple Loans</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            City Tier
                          </label>
                          <select
                            {...register('city')}
                            className="input-primary"
                          >
                            <option value="tier1">Tier 1 (Mumbai, Delhi, etc.)</option>
                            <option value="tier2">Tier 2 (Pune, Jaipur, etc.)</option>
                            <option value="tier3">Tier 3</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="btn-outline flex-1"
                        >
                          Back
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-primary flex-1"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                              <span>Checking...</span>
                            </div>
                          ) : (
                            'Get My Credit Score'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 3 && mockScore && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <div className="mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircleIcon className="h-10 w-10 text-green-600" />
                      </div>
                      
                      <h4 className="text-2xl font-bold text-gray-900 mb-4">
                        Your Credit Score
                      </h4>
                      
                      <div className="text-6xl font-bold text-primary-600 mb-4">
                        {mockScore}
                      </div>
                      
                      <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${getScoreColor(mockScore)}`}>
                        {getScoreLabel(mockScore)} Credit Score
                      </div>
                    </div>

                    <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Recommendations:</h5>
                      <ul className="space-y-2">
                        {getScoreAdvice(mockScore).map((advice, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <StarIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => toast.success('Redirecting to loan application...')}
                        className="btn-primary flex-1"
                      >
                        Apply for Loan
                      </button>
                      
                      <button
                        onClick={handleClose}
                        className="btn-outline flex-1"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreditScoreModal;