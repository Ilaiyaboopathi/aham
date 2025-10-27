import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

const TestimonialsSection = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from CMS
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cms/testimonials`);
      const data = await response.json();
      
      // Transform CMS data to component format
      const transformedTestimonials = data.map(testimonial => ({
        id: testimonial._id,
        name: testimonial.name,
        location: testimonial.location,
        rating: testimonial.rating,
        text: i18n.language === 'ta' ? testimonial.comment_ta : testimonial.comment_en,
        image: testimonial.image_url,
        loanType: testimonial.loan_type
      }));
      
      setTestimonials(transformedTestimonials.length > 0 ? transformedTestimonials : getDefaultTestimonials());
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      setTestimonials(getDefaultTestimonials());
    } finally {
      setLoading(false);
    }
  };

  // Fallback default testimonials
  const getDefaultTestimonials = () => [
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      text: 'AHAM made my dream of owning a home come true! Their no-income-proof process was exactly what I needed as a freelance consultant. The team was supportive throughout.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      loanType: 'Home Construction Loan'
    },
  ];

  // Re-fetch when language changes
  useEffect(() => {
    if (!loading && testimonials.length > 0) {
      fetchTestimonials();
    }
  }, [i18n.language]);

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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

  if (loading) {
    return (
      <section className="py-20 bg-gradient-light">
        <div className="container mx-auto px-4 flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-light relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
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
            {t('testimonials.title')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('testimonials.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="max-w-6xl mx-auto"
        >
          <div className="relative">
            {/* Main Testimonial */}
            <div className="bg-white rounded-3xl shadow-large p-8 lg:p-12 relative overflow-hidden">
              {/* Quote Icon */}
              <div className="absolute top-8 left-8 text-primary-200 text-6xl font-serif">
                "
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                  {/* Profile */}
                  <div className="flex-shrink-0 text-center lg:text-left">
                    <div className="w-24 h-24 mx-auto lg:mx-0 mb-4 relative">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full rounded-full object-cover"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-primary-600 rounded-full p-2">
                        <StarIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {testimonials[currentIndex].name}
                    </h4>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {testimonials[currentIndex].location}
                    </p>
                    
                    <div className="inline-block bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-medium">
                      {testimonials[currentIndex].loanType}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Rating */}
                    <div className="flex justify-center lg:justify-start space-x-1 mb-4">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed italic text-center lg:text-left">
                      "{testimonials[currentIndex].text}"
                    </blockquote>
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-50 rounded-full transform translate-x-16 translate-y-16"></div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary-300 text-gray-600 hover:text-primary-600 p-3 rounded-full transition-all duration-300"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>

              {/* Indicators */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-primary-600 scale-125' 
                        : 'bg-gray-300 hover:bg-primary-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-primary-300 text-gray-600 hover:text-primary-600 p-3 rounded-full transition-all duration-300"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="hidden lg:flex justify-center mt-8 space-x-4">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 p-2 rounded-2xl transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary-100 border-2 border-primary-300' 
                      : 'bg-white border-2 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;