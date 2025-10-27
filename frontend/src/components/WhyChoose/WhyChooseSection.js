import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import {
  DocumentCheckIcon,
  ClockIcon,
  ShieldCheckIcon,
  MapPinIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';

const WhyChooseSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      id: 'lowDoc',
      icon: DocumentCheckIcon,
      title: t('whyChoose.features.lowDoc.title'),
      description: t('whyChoose.features.lowDoc.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'fastProcessing',
      icon: ClockIcon,
      title: t('whyChoose.features.fastProcessing.title'),
      description: t('whyChoose.features.fastProcessing.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'customerTrust',
      icon: ShieldCheckIcon,
      title: t('whyChoose.features.customerTrust.title'),
      description: t('whyChoose.features.customerTrust.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'regionalExpertise',
      icon: MapPinIcon,
      title: t('whyChoose.features.regionalExpertise.title'),
      description: t('whyChoose.features.regionalExpertise.description'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const stats = [
    {
      id: 'customers',
      icon: UsersIcon,
      value: 50000,
      label: t('whyChoose.stats.customers'),
      suffix: '+',
      color: 'text-primary-600'
    },
    {
      id: 'branches',
      icon: BuildingOfficeIcon,
      value: 150,
      label: t('whyChoose.stats.branches'),
      suffix: '+',
      color: 'text-green-600'
    },
    {
      id: 'experience',
      icon: CalendarIcon,
      value: 25,
      label: t('whyChoose.stats.experience'),
      suffix: '+',
      color: 'text-blue-600'
    },
    {
      id: 'disbursed',
      icon: CurrencyRupeeIcon,
      value: 5000,
      label: t('whyChoose.stats.disbursed'),
      suffix: '+',
      color: 'text-purple-600'
    },
  ];

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
    <section className="py-20 bg-gradient-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #283079 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #283079 0%, transparent 50%)`
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            {t('whyChoose.title')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('whyChoose.subtitle')}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="group"
            >
              <div className="card card-hover text-center h-full">
                <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          variants={containerVariants}
          className="bg-white rounded-3xl shadow-large p-8 lg:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} bg-gray-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {inView && (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      delay={index * 0.2}
                      separator=","
                    />
                  )}
                  <span className={stat.color}>{stat.suffix}</span>
                </div>
                
                <p className="text-gray-600 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <motion.button
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('common.getStarted')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSection;