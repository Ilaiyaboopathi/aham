// Utility functions for the AHAM Housing Finance application

export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 80; // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export const formatCurrency = (amount, locale = 'en-IN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number, locale = 'en-IN') => {
  return new Intl.NumberFormat(locale).format(number);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobile = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const numPayments = tenure * 12;
  
  if (rate === 0) {
    return principal / numPayments;
  }
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / 
              (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Math.round(emi);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const getWhatsAppLink = (message = '') => {
  const phoneNumber = '917823911555'; // AHAM WhatsApp number
  const encodedMessage = encodeURIComponent(message || 'Hi, I would like to know more about AHAM Housing Finance loans.');
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const getPhoneLink = () => {
  return 'tel:+917823911555';
};

export const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    if (isElementInViewport(element)) {
      element.classList.add('animate-in');
    }
  });
};

// Initialize scroll animations
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', throttle(animateOnScroll, 100));
  window.addEventListener('load', animateOnScroll);
}