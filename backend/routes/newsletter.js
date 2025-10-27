const express = require('express');
const Joi = require('joi');

const router = express.Router();

// Validation schema for newsletter subscription
const subscriptionSchema = Joi.object({
  email: Joi.string().email().required()
});

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { error, value } = subscriptionSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if email already exists
    const existingSubscription = global.storage.newsletterSubscriptions.find(
      sub => sub.email === value.email && sub.status === 'active'
    );
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed'
      });
    }
    
    // Add new subscription
    const subscriptionId = global.storage.newsletterSubscriptions.length + 1;
    const newSubscription = {
      id: subscriptionId,
      email: value.email,
      status: 'active',
      created_at: new Date().toISOString()
    };
    
    global.storage.newsletterSubscriptions.push(newSubscription);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter'
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req, res) => {
  try {
    const { error, value } = subscriptionSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Find and update subscription
    const subscription = global.storage.newsletterSubscriptions.find(
      sub => sub.email === value.email
    );
    
    if (subscription) {
      subscription.status = 'unsubscribed';
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter'
    });
  }
});

// Get newsletter subscriptions (admin endpoint)
router.get('/subscribers', async (req, res) => {
  try {
    // Get active subscriptions from memory
    const activeSubscriptions = global.storage.newsletterSubscriptions
      .filter(sub => sub.status === 'active')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(sub => ({
        email: sub.email,
        status: sub.status,
        created_at: sub.created_at
      }));

    res.json({
      success: true,
      data: activeSubscriptions,
      count: activeSubscriptions.length
    });

  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch newsletter subscribers'
    });
  }
});

module.exports = router;