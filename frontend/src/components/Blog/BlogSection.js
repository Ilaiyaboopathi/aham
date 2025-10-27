import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const BlogSection = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch articles from CMS
  React.useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cms/articles`);
      const data = await response.json();
      
      // Transform CMS data to component format (limit to 3 latest)
      const transformedArticles = data.slice(0, 3).map(article => ({
        id: article._id,
        title: i18n.language === 'ta' ? article.title_ta : article.title_en,
        excerpt: (i18n.language === 'ta' ? article.content_ta : article.content_en).substring(0, 120) + '...',
        image: article.thumbnail_url,
        date: new Date(article.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        readTime: '5 min read',
        category: 'Update'
      }));
      
      setArticles(transformedArticles.length > 0 ? transformedArticles : getDefaultArticles());
    } catch (error) {
      console.error('Failed to load articles:', error);
      setArticles(getDefaultArticles());
    } finally {
      setLoading(false);
    }
  };

  // Fallback default articles
  const getDefaultArticles = () => [
    {
      id: 1,
      title: 'PMAY 2.0 Guidelines: Complete Guide to Government Housing Subsidy',
      excerpt: 'Learn about the updated PMAY 2.0 scheme, eligibility criteria, and how to apply for government housing subsidies up to ₹2.67 lakhs.',
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxob3VzaW5nJTIwZmluYW5jZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NjAwMTMyMDF8MA&ixlib=rb-4.1.0&q=85',
      date: '2025-10-05',
      readTime: '5 min read',
      category: 'Government Schemes'
    },
  ];

  // Re-fetch when language changes
  React.useEffect(() => {
    if (!loading && articles.length > 0) {
      fetchArticles();
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
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
            {t('blog.title')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {t('blog.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Blog Posts */}
          <motion.div
            variants={containerVariants}
            className="space-y-8"
          >
            {articles.map((post, index) => (
              <motion.article
                key={post.id}
                variants={itemVariants}
                className="group cursor-pointer"
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="bg-white rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform group-hover:scale-110 transition-transform duration-700"
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-primary-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      <button className="flex items-center space-x-2 text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                        <span>Read More</span>
                        <ArrowRightIcon className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* YouTube Video & Newsletter */}
          <motion.div
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Featured Video */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-soft overflow-hidden"
            >
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary-600 to-purple-600 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                    style={{ 
                      backgroundImage: 'url(https://images.pexels.com/photos/7937708/pexels-photo-7937708.jpeg)'
                    }}
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 transform hover:scale-110">
                      <PlayIcon className="h-8 w-8 ml-1" />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-semibold mb-2">
                      How to Apply for AHAM Home Loan in 5 Easy Steps
                    </h4>
                    <div className="flex items-center space-x-4 text-white/80 text-sm">
                      <span>AHAM Housing Finance</span>
                      <span>•</span>
                      <span>2.5K views</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  Watch our step-by-step guide on how to apply for a home loan with AHAM Housing Finance. Learn about documentation, eligibility, and the approval process.
                </p>
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                  Stay Updated
                </h4>
                <p className="text-gray-600">
                  Get the latest home loan news, rates, and tips directly in your inbox.
                </p>
              </div>

              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200"
                />
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  {t('forms.newsletter')}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-soft p-6"
            >
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Popular Resources
              </h4>
              
              <div className="space-y-3">
                {[
                  'Home Loan Eligibility Calculator',
                  'Document Checklist',
                  'Interest Rate Comparison',
                  'PMAY 2.0 Application Guide',
                  'EMI vs Interest Rate Chart'
                ].map((link, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-700 group-hover:text-primary-600">{link}</span>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* View All CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <button className="btn-outline">
            View All Articles
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;