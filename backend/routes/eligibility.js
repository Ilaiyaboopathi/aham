const express = require('express');
const Joi = require('joi');

const router = express.Router();

// Validation schema for eligibility assessment
const eligibilitySchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
  age_group: Joi.string().valid('21-30', '31-40', '41-50', '51-60', '60+').required(),
  income_range: Joi.string().valid('below-3lakh', '3-5lakh', '5-10lakh', '10-20lakh', 'above-20lakh').required(),
  employment_type: Joi.string().valid('salaried', 'self-employed', 'business', 'professional', 'retired').required(),
  city_tier: Joi.string().valid('tier-1', 'tier-2', 'tier-3', 'rural').required(),
  existing_loans: Joi.string().valid('none', 'home-loan', 'personal-loan', 'multiple', 'credit-card').required(),
  credit_score_range: Joi.string().valid('excellent-750+', 'good-700-750', 'fair-650-700', 'poor-600-650', 'very-poor-below-600', 'unknown').required(),
  property_type: Joi.string().valid('ready-to-move', 'under-construction', 'plot', 'renovation', 'refinance').required()
});

// Calculate eligibility score
const calculateEligibilityScore = (data) => {
  let score = 0;
  let recommendations = [];

  // Age group scoring
  switch (data.age_group) {
    case '21-30': score += 25; break;
    case '31-40': score += 30; break;
    case '41-50': score += 25; break;
    case '51-60': score += 15; break;
    case '60+': score += 10; break;
  }

  // Income range scoring
  switch (data.income_range) {
    case 'below-3lakh': score += 5; recommendations.push('Consider increasing income or co-applicant'); break;
    case '3-5lakh': score += 15; break;
    case '5-10lakh': score += 25; break;
    case '10-20lakh': score += 30; break;
    case 'above-20lakh': score += 30; break;
  }

  // Employment type scoring
  switch (data.employment_type) {
    case 'salaried': score += 25; break;
    case 'self-employed': score += 20; break;
    case 'business': score += 15; break;
    case 'professional': score += 20; break;
    case 'retired': score += 10; recommendations.push('Pension documentation required'); break;
  }

  // City tier scoring
  switch (data.city_tier) {
    case 'tier-1': score += 15; break;
    case 'tier-2': score += 12; break;
    case 'tier-3': score += 10; break;
    case 'rural': score += 8; recommendations.push('Property valuation may take longer'); break;
  }

  // Existing loans impact
  switch (data.existing_loans) {
    case 'none': score += 20; break;
    case 'home-loan': score += 10; recommendations.push('Balance transfer options available'); break;
    case 'personal-loan': score += 5; recommendations.push('Consider loan consolidation'); break;
    case 'multiple': score += 0; recommendations.push('Debt consolidation recommended'); break;
    case 'credit-card': score += 8; break;
  }

  // Credit score impact
  switch (data.credit_score_range) {
    case 'excellent-750+': score += 30; break;
    case 'good-700-750': score += 25; break;
    case 'fair-650-700': score += 15; recommendations.push('Credit improvement may help get better rates'); break;
    case 'poor-600-650': score += 5; recommendations.push('Credit repair recommended before applying'); break;
    case 'very-poor-below-600': score += 0; recommendations.push('Significant credit improvement needed'); break;
    case 'unknown': score += 10; recommendations.push('Free credit score check recommended'); break;
  }

  // Property type considerations
  switch (data.property_type) {
    case 'ready-to-move': score += 15; break;
    case 'under-construction': score += 12; recommendations.push('Builder approval verification required'); break;
    case 'plot': score += 10; recommendations.push('Construction timeline planning needed'); break;
    case 'renovation': score += 13; break;
    case 'refinance': score += 14; break;
  }

  // Determine eligibility status
  let status = '';
  if (score >= 120) {
    status = 'Excellent';
    recommendations.unshift('High approval chances with competitive rates');
  } else if (score >= 100) {
    status = 'Good';
    recommendations.unshift('Good approval chances with standard rates');
  } else if (score >= 80) {
    status = 'Fair';
    recommendations.unshift('Moderate approval chances, may need additional documents');
  } else if (score >= 60) {
    status = 'Poor';
    recommendations.unshift('Low approval chances, consider improving profile');
  } else {
    status = 'Very Poor';
    recommendations.unshift('Profile improvement needed before application');
  }

  return {
    score: Math.min(score, 150), // Cap at 150
    status,
    recommendations: recommendations.slice(0, 3) // Top 3 recommendations
  };
};

// Submit eligibility assessment
router.post('/assess', async (req, res) => {
  try {
    const { error, value } = eligibilitySchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(detail => detail.message)
      });
    }

    const assessment = calculateEligibilityScore(value);

    // Store assessment in memory
    try {
      const assessmentId = global.storage.eligibilityScores.length + 1;
      const newAssessment = {
        id: assessmentId,
        name: value.name || null,
        mobile: value.mobile || null,
        age_group: value.age_group,
        income_range: value.income_range,
        employment_type: value.employment_type,
        city_tier: value.city_tier,
        existing_loans: value.existing_loans,
        credit_score_range: value.credit_score_range,
        property_type: value.property_type,
        eligibility_score: assessment.score,
        eligibility_status: assessment.status,
        recommendations: JSON.stringify(assessment.recommendations),
        created_at: new Date().toISOString()
      };
      
      global.storage.eligibilityScores.push(newAssessment);
    } catch (storageError) {
      console.error('Error storing eligibility assessment:', storageError);
      // Continue with response even if storage fails
    }

    res.json({
      success: true,
      data: {
        ...assessment,
        input_data: value
      }
    });

  } catch (error) {
    console.error('Error assessing eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assess eligibility'
    });
  }
});

// Get eligibility assessments (admin endpoint)
router.get('/history', async (req, res) => {
  try {
    // Get from memory storage
    const assessments = global.storage.eligibilityScores
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);

    // Parse recommendations JSON
    const processedAssessments = assessments.map(row => ({
      ...row,
      recommendations: row.recommendations ? JSON.parse(row.recommendations) : []
    }));

    res.json({
      success: true,
      data: processedAssessments,
      count: processedAssessments.length
    });

  } catch (error) {
    console.error('Error fetching eligibility history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch eligibility history'
    });
  }
});

module.exports = router;