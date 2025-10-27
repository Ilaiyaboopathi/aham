import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  HomeIcon,
  BuildingOffice2Icon,
  GlobeAsiaAustraliaIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  BanknotesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ProductsSection = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from CMS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cms/products`);
      const data = await response.json();
      
      // Transform CMS data to component format
      const transformedProducts = data.map(product => ({
        id: product._id,
        title: i18n.language === 'ta' ? product.title_ta : product.title_en,
        description: i18n.language === 'ta' ? product.description_ta : product.description_en,
        icon: getIconComponent(product.icon),
        image: product.image_url,
        features: product.features,
        gradient: product.gradient
      }));
      
      setProducts(transformedProducts.length > 0 ? transformedProducts : getDefaultProducts());
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts(getDefaultProducts());
    } finally {
      setLoading(false);
    }
  };

  // Helper to get icon component
  const getIconComponent = (iconName) => {
    const icons = {
      HomeIcon,
      BuildingOffice2Icon,
      GlobeAsiaAustraliaIcon,
      WrenchScrewdriverIcon,
      PlusIcon,
      BanknotesIcon
    };
    return icons[iconName] || HomeIcon;
  };

  // Fallback default products
  const getDefaultProducts = () => [
    {
      id: 'homeConstruction',
      title: t('products.items.homeConstruction.title'),
      description: t('products.items.homeConstruction.description'),
      icon: HomeIcon,
      image: 'https://images.unsplash.com/photo-1628133287836-40bd5453bed1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxob21lJTIwb3duZXJzaGlwfGVufDB8fHx8MTc2MDAxMzIwN3ww&ixlib=rb-4.1.0&q=85',
      features: ['Stage-wise disbursement', 'Competitive rates', 'Flexible repayment'],
      gradient: 'from-blue-500 to-indigo-600'
    },
  ];

  // Re-fetch when language changes
  useEffect(() => {
    if (!loading && products.length > 0) {
      fetchProducts();
    }
  }, [i18n.language]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4 flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
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
            variants={cardVariants}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            {t('products.title')}
          </motion.h2>
          <motion.p
            variants={cardVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('products.subtitle')}
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              className="group cursor-pointer"
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 overflow-hidden h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${product.gradient} opacity-80`} />
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <product.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="flex items-center space-x-2 text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                    <span>{t('common.learnMore')}</span>
                    <ArrowRightIcon className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10">
                  <div className={`w-full h-full bg-gradient-to-br ${product.gradient} rounded-full opacity-20`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={cardVariants}
          className="text-center mt-16"
        >
          <motion.button
            className="btn-primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('common.applyNow')}
          </motion.button>
          
          <p className="text-gray-600 mt-4">
            Have questions? <button className="text-primary-600 hover:text-primary-700 font-medium">{t('common.contactUs')}</button>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;