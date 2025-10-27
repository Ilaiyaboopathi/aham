import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-hot-toast';
import {
  CalculatorIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

import { emiAPI } from '../../services/api';
import { formatCurrency, formatNumber, debounce } from '../../utils/helpers';

const EMICalculatorSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [formData, setFormData] = useState({
    loanAmount: 5000000,
    interestRate: 8.5,
    tenureYears: 20
  });

  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate EMI with debouncing
  const calculateEMI = useCallback(
    debounce(async (amount, rate, years) => {
      if (amount < 100000 || rate < 5 || years < 1) return;

      setIsCalculating(true);
      try {
        const response = await emiAPI.calculate({
          loan_amount: amount,
          interest_rate: rate,
          tenure_months: years * 12
        });

        if (response.data.success) {
          setResult(response.data.data);
        }
      } catch (error) {
        console.error('EMI calculation failed:', error);
        toast.error('Failed to calculate EMI. Please try again.');
      } finally {
        setIsCalculating(false);
      }
    }, 500),
    []
  );

  // Calculate on form data change
  useEffect(() => {
    calculateEMI(formData.loanAmount, formData.interestRate, formData.tenureYears);
  }, [formData, calculateEMI]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  return (
    <section id="emi-calculator" className="py-20 bg-gradient-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #283079 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, #283079 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, #4f46e5 0%, transparent 50%)`
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="bg-primary-100 p-4 rounded-2xl">
              <CalculatorIcon className="h-12 w-12 text-primary-600" />
            </div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            {t('emiCalculator.title')}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {t('emiCalculator.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto"
        >
          {/* Calculator Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-large p-8 lg:p-12"
          >
            <div className="space-y-8">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('emiCalculator.loanAmount')}
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="100000"
                    max="50000000"
                    step="100000"
                    value={formData.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>₹1L</span>
                    <span className="font-semibold text-primary-600 text-lg">
                      {formatCurrency(formData.loanAmount)}
                    </span>
                    <span>₹5Cr</span>
                  </div>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('emiCalculator.interestRate')}
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>5%</span>
                    <span className="font-semibold text-primary-600 text-lg">
                      {formData.interestRate}% p.a.
                    </span>
                    <span>20%</span>
                  </div>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t('emiCalculator.tenure')}
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={formData.tenureYears}
                    onChange={(e) => handleInputChange('tenureYears', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 Year</span>
                    <span className="font-semibold text-primary-600 text-lg">
                      {formData.tenureYears} Years
                    </span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            variants={itemVariants}
            className="space-y-8"
          >
            {result && !isCalculating ? (
              <>
                {/* EMI Card */}
                <div className="bg-gradient-primary rounded-3xl text-white p-8 lg:p-12 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <CurrencyRupeeIcon className="h-8 w-8" />
                      <span className="text-white/80 text-lg">{t('emiCalculator.monthlyEmi')}</span>
                    </div>
                    <div className="text-4xl lg:text-5xl font-bold mb-2">
                      {formatCurrency(result.monthly_emi)}
                    </div>
                    <div className="text-white/80">
                      Monthly Payment
                    </div>
                  </div>
                  
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12" />
                </div>

                {/* Other Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-soft p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <ChartBarIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <span className="text-gray-600">{t('emiCalculator.totalAmount')}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(result.total_amount)}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-soft p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <ClockIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <span className="text-gray-600">{t('emiCalculator.totalInterest')}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(result.total_interest)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary flex-1 flex items-center justify-center space-x-2">
                    <span>{t('common.applyNow')}</span>
                  </button>
                  
                  <button className="btn-outline flex items-center justify-center space-x-2">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    <span>Download Report</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl shadow-large p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Calculating EMI...</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #283079;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(40, 48, 121, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #283079;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(40, 48, 121, 0.3);
        }
      `}</style>
    </section>
  );
};

export default EMICalculatorSection;