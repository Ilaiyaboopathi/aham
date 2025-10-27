const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Validation schema for lead submission
const leadSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  email: Joi.string().email().optional(),
  city: Joi.string().min(2).max(100).optional(),
  loan_type: Joi.string().max(100).optional(),
  loan_amount: Joi.number().positive().optional(),
  message: Joi.string().max(1000).optional()
});

// Submit lead
router.post('/submit', async (req, res) => {
  try {
    const { error, value } = leadSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Store in memory
    const leadId = global.storage.leads.length + 1;
    const newLead = {
      id: leadId,
      name: value.name,
      mobile: value.mobile,
      email: value.email || null,
      city: value.city || null,
      loan_type: value.loan_type || null,
      loan_amount: value.loan_amount || null,
      message: value.message || null,
      source: 'website',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    global.storage.leads.push(newLead);

    res.status(201).json({
      success: true,
      message: 'Lead submitted successfully',
      leadId: leadId
    });

  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit lead'
    });
  }
});

// Get all leads (admin endpoint)
router.get('/all', async (req, res) => {
  try {
    // Get from memory storage
    const leads = global.storage.leads
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 100);

    res.json({
      success: true,
      data: leads,
      count: leads.length
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads'
    });
  }
});

module.exports = router;