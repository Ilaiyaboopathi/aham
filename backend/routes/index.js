const express = require('express');
const router = express.Router();

// Import route modules
const leadsRoutes = require('./leads');
const emiRoutes = require('./emi');
const eligibilityRoutes = require('./eligibility');
const newsletterRoutes = require('./newsletter');

// Use routes
router.use('/leads', leadsRoutes);
router.use('/emi', emiRoutes);
router.use('/eligibility', eligibilityRoutes);
router.use('/newsletter', newsletterRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AHAM Housing Finance API',
    version: '1.0.0',
    endpoints: {
      leads: '/api/leads',
      emi: '/api/emi',
      eligibility: '/api/eligibility',
      newsletter: '/api/newsletter'
    }
  });
});

module.exports = router;