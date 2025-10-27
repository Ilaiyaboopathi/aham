const express = require('express');
const Joi = require('joi');

const router = express.Router();

// Validation schema for EMI calculation
const emiSchema = Joi.object({
  loan_amount: Joi.number().min(100000).max(50000000).required(),
  interest_rate: Joi.number().min(5).max(20).required(),
  tenure_months: Joi.number().min(12).max(360).required()
});

// Calculate EMI
router.post('/calculate', async (req, res) => {
  try {
    const { error, value } = emiSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { loan_amount, interest_rate, tenure_months } = value;

    // EMI calculation formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const principal = parseFloat(loan_amount);
    const monthlyRate = parseFloat(interest_rate) / 12 / 100;
    const numPayments = parseInt(tenure_months);

    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / 
                (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalAmount = emi * numPayments;
    const totalInterest = totalAmount - principal;

    const result = {
      loan_amount: principal,
      interest_rate: parseFloat(interest_rate),
      tenure_months: numPayments,
      monthly_emi: Math.round(emi),
      total_amount: Math.round(totalAmount),
      total_interest: Math.round(totalInterest),
      tenure_years: Math.round(numPayments / 12 * 10) / 10
    };

    // Store calculation in memory
    try {
      const calculationId = global.storage.emiCalculations.length + 1;
      const newCalculation = {
        id: calculationId,
        loan_amount: result.loan_amount,
        interest_rate: result.interest_rate,
        tenure_months: result.tenure_months,
        monthly_emi: result.monthly_emi,
        total_amount: result.total_amount,
        total_interest: result.total_interest,
        user_ip: req.ip || 'unknown',
        created_at: new Date().toISOString()
      };
      
      global.storage.emiCalculations.push(newCalculation);
    } catch (storageError) {
      console.error('Error storing EMI calculation:', storageError);
      // Continue with response even if storage fails
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error calculating EMI:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate EMI'
    });
  }
});

// Get EMI calculation history (admin endpoint)
router.get('/history', async (req, res) => {
  try {
    // Get from memory storage
    const calculations = global.storage.emiCalculations
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);

    res.json({
      success: true,
      data: calculations,
      count: calculations.length
    });

  } catch (error) {
    console.error('Error fetching EMI history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch EMI history'
    });
  }
});

module.exports = router;