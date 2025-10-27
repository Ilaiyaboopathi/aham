import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet-async';
import {
  EyeIcon,
  HeartIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Import existing components if needed
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import FloatingActions from '../components/FloatingActions/FloatingActions';

const AboutUs = () => {
  const { i18n } = useTranslation();
  const videoRef = useRef(null);
  const [videoSectionRef, videoInView] = useInView({
    triggerOnce: false,
    threshold: 0.3
  });

  // Handle video play/pause based on visibility
  useEffect(() => {
    if (videoRef.current) {
      if (videoInView) {
        videoRef.current.play?.().catch(() => {
          // Ignore autoplay errors
        });
      } else {
        videoRef.current.pause?.();
      }
    }
  }, [videoInView]);

  const highlights = [
    {
      id: 'customers',
      value: 10000,
      suffix: '+',
      label: 'Happy Customers',
      icon: UsersIcon,
      color: 'text-primary-600'
    },
    {
      id: 'branches',
      value: 20,
      suffix: '+',
      label: 'Branches Across 4 States',
      icon: BuildingOfficeIcon,
      color: 'text-green-600'
    },
    {
      id: 'disbursed',
      value: 500,
      suffix: '+',
      label: 'Crores Disbursed',
      icon: CurrencyRupeeIcon,
      color: 'text-blue-600'
    },
    {
      id: 'satisfaction',
      value: 99,
      suffix: '%',
      label: 'Customer Satisfaction',
      icon: StarIcon,
      color: 'text-yellow-600'
    }
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
    <>
      <Helmet>
        <title>About AHAM Housing Finance | Trusted Home Loan Provider</title>
        <meta name="description" content="Learn about AHAM Housing Finance Limited — an inclusive, transparent, and trusted home loan provider across South India." />
        <meta property="og:title" content="About AHAM Housing Finance Limited" />
        <meta property="og:description" content="Empowering every Indian's home ownership dream through affordable and transparent housing finance." />
        <meta property="og:image" content="/images/aham-about-banner.jpg" />
        <meta name="keywords" content="about AHAM, housing finance, home loans, trusted lender, India" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <Header
          currentLanguage={i18n.language}
          onLanguageChange={(lang) => i18n.changeLanguage(lang)}
          onCreditScoreClick={() => {}}
        />

        {/* Hero Section */}
        <section className="relative h-screen max-h-[600px] min-h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1730130596425-197566414dc4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYW1pbHklMjBob21lfGVufDB8fHx8MTc2MDAxMzE5Nnww&ixlib=rb-4.1.0&q=85')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/70 to-primary-600/60"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl text-white"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Empowering Every Indian's Dream of{' '}
                <span className="text-yellow-400">Home Ownership</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl">
                At AHAM Housing Finance, we redefine accessibility in home loans through trust, innovation, and empathy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Explore Our Loans</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                >
                  Check Eligibility
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs font-medium uppercase tracking-wider">Scroll Down</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-px h-8 bg-white/60"
              />
            </div>
          </motion.div>
        </section>

        {/* About the Company Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-5xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  About the Company
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} className="prose prose-lg max-w-none">
                <div className="bg-gradient-light rounded-3xl p-8 lg:p-12">
                  <div className="text-gray-700 leading-relaxed space-y-6 text-lg">
                    <p className="text-xl font-semibold text-primary-600 mb-6">
                      AHAM HOUSING FINANCE LIMITED
                    </p>
                    
                    <p>
                      <strong>AHAM HOUSING FINANCE LIMITED</strong> (formerly known as Aham Housing Finance Private Limited) aims to be the institution of choice for fulfilling every individual's housing dream and also to be respected, trusted and renowned for our exceptional customer service in the local community.
                    </p>
                    
                    <p>
                      We pride ourselves in being at the heart of the communities where we strive to make a real difference. Our presence can be seen mainly in the outskirts of major metros and in smaller cities (Tier II and Tier III). Our uniqueness in combining an interview-based assessment with a proprietary scoring methodology ensures consistency in decision making across all types of people; be it a local trader, a teacher, a government servant or an individual working in a small firm.
                    </p>
                    
                    <p>
                      This allows us to fund higher amounts by taking minimal risks to these individuals who are unable to produce the traditional income proofs.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-20 bg-gradient-light">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Our Vision & Mission
                </h2>
                <p className="text-xl text-gray-600">
                  Guiding principles that drive our commitment to excellence
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vision Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-white rounded-3xl shadow-large p-8 lg:p-12 text-center group"
                >
                  <div className="bg-primary-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <EyeIcon className="h-10 w-10 text-primary-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "To be the trusted lender to fulfil the home ownership dream of every Indian."
                  </p>
                </motion.div>

                {/* Mission Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-white rounded-3xl shadow-large p-8 lg:p-12 text-center group"
                >
                  <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <HeartIcon className="h-10 w-10 text-green-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    "To provide fast, reliable, customer centric and transparent home loan solutions by leveraging technology."
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* YouTube Video Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  A Glimpse of AHAM in Action
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Watch how AHAM Housing Finance is making home ownership dreams come true across India.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                ref={videoSectionRef}
                className="w-full flex justify-center my-10"
              >
                <iframe
                  ref={videoRef}
                  src="https://www.youtube.com/embed/izPWSL4iC7E?autoplay=1&mute=1&loop=1&playlist=izPWSL4iC7E&controls=0&modestbranding=1&rel=0"
                  title="AHAM Housing Finance"
                  className="w-full md:w-3/4 h-[400px] rounded-2xl shadow-large"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Key Highlights Section */}
        <section className="py-20 bg-gradient-light">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Key Highlights
                </h2>
                <p className="text-xl text-gray-600">
                  Numbers that showcase our commitment to excellence
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight.id}
                    variants={itemVariants}
                    className="bg-white rounded-2xl shadow-soft p-8 text-center group hover:shadow-large transition-shadow duration-300"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${highlight.color} bg-gray-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <highlight.icon className="h-8 w-8" />
                    </div>
                    
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      <CountUp
                        start={0}
                        end={highlight.value}
                        duration={2.5}
                        delay={index * 0.2}
                        separator=","
                      />
                      <span className={highlight.color}>{highlight.suffix}</span>
                    </div>
                    
                    <p className="text-gray-600 font-medium">
                      {highlight.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call-to-Action Footer */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, #ffffff 0%, transparent 50%)`
            }} />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-center"
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl lg:text-5xl font-bold text-white mb-6"
              >
                Ready to start your home loan journey with AHAM?
              </motion.h2>
              
              <motion.p
                variants={itemVariants}
                className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
              >
                Join thousands of satisfied customers who have made their home ownership dreams come true with us.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Apply Now</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                >
                  Check Eligibility
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Floating Actions */}
        <FloatingActions
          onEnquiryClick={() => {}}
          onEMIClick={() => {}}
          onScorecardClick={() => {}}
        />
      </div>
    </>
  );
};

export default AboutUs;