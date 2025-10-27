import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  XMarkIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import { leadAPI } from '../../services/api';
import { validateEmail, validateMobile } from '../../utils/helpers';

const EnquiryModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const loanTypes = [
    'Home Construction Loan',
    'Plot + Construction Loan',
    'NRI Home Loan',
    'Home Renovation Loan',
    'Home Extension Loan',
    'Mortgage Loan'
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await leadAPI.submit({
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        city: data.city,
        loan_type: data.loanType,
        loan_amount: data.loanAmount ? parseFloat(data.loanAmount) : null,
        message: data.message
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast.success('Enquiry submitted successfully!');
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Enquiry submission failed:', error);
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setIsSuccess(false);
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
            {isSuccess ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircleIcon className="h-10 w-10 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Thank You!
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Your enquiry has been submitted successfully. Our team will contact you within 24 hours.
                </p>
                
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-green-800 font-medium">Next Steps:</p>
                      <ul className="text-sm text-green-700 mt-1 space-y-1">
                        <li>• Document verification call</li>
                        <li>• Eligibility assessment</li>
                        <li>• Loan proposal presentation</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleClose}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Form State */
              <>
                {/* Header */}
                <div className="bg-gradient-primary text-white p-6 relative overflow-hidden">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <DocumentTextIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Loan Enquiry</h3>
                      <p className="text-white/90">Get personalized loan assistance</p>
                    </div>
                  </div>
                  
                  {/* Background decoration */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                </div>

                {/* Form */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('forms.name')} *
                        </label>
                        <input
                          {...register('name', {
                            required: t('forms.required'),
                            minLength: { value: 2, message: 'Name must be at least 2 characters' }
                          })}
                          className={`input-primary ${errors.name ? 'border-red-500' : ''}`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('forms.mobile')} *
                        </label>
                        <input
                          {...register('mobile', {
                            required: t('forms.required'),
                            validate: (value) => validateMobile(value) || t('forms.validMobile')
                          })}
                          className={`input-primary ${errors.mobile ? 'border-red-500' : ''}`}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                        />
                        {errors.mobile && (
                          <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('forms.email')}
                        </label>
                        <input
                          {...register('email', {
                            validate: (value) => !value || validateEmail(value) || t('forms.validEmail')
                          })}
                          className={`input-primary ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="Enter email address (optional)"
                          type="email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('forms.city')}
                        </label>
                        <input
                          {...register('city')}
                          className="input-primary"
                          placeholder="Enter your city"
                        />
                      </div>

                      {/* Loan Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('forms.loanType')}
                        </label>
                        <select
                          {...register('loanType')}
                          className="input-primary"
                        >
                          <option value="">Select loan type</option>
                          {loanTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      {/* Loan Amount */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t('forms.loanAmount')}
                        </label>
                        <input
                          {...register('loanAmount')}
                          className="input-primary"
                          placeholder="Enter required amount"
                          type="number"
                          min="100000"
                          max="50000000"
                          step="100000"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t('forms.message')}
                      </label>
                      <textarea
                        {...register('message')}
                        className="input-primary"
                        rows={4}
                        placeholder="Any specific requirements or questions?"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                          isSubmitting
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500" />
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          t('forms.submit')
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleClose}
                        className="btn-outline py-3 px-6"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnquiryModal;