const express = require('express');
const router = express.Router();
const Conversation = require('../models/Chatbot');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/user');

// Utility function to generate session ID
const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Intelligent response handler
const generateBotResponse = async (userMessage, userId = null) => {
  const message = userMessage.toLowerCase();
  
  // Order-related queries
  if (message.includes('order') || message.includes('tracking') || message.includes('delivery')) {
    if (userId) {
      try {
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(3);
        if (orders.length > 0) {
          const latestOrder = orders[0];
          return {
            response: `I found your recent orders! Your latest order #${latestOrder._id.toString().slice(-6)} is currently ${latestOrder.orderStatus}. ${getOrderStatusMessage(latestOrder.orderStatus)}`,
            category: 'order_inquiry'
          };
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
    return {
      response: "I can help you with order inquiries! Please provide your order number or sign in to view your order status. Common questions I can help with: order tracking, delivery estimates, and order modifications.",
      category: 'order_inquiry'
    };
  }
  
  // Product-related queries
  if (message.includes('product') || message.includes('item') || message.includes('size') || message.includes('color') || message.includes('price')) {
    if (message.includes('recommend') || message.includes('suggest')) {
      return {
        response: "I'd be happy to help you find the perfect product! Could you tell me what type of item you're looking for? For example: clothing, electronics, home goods, etc. I can provide recommendations based on popularity and customer reviews.",
        category: 'product_info'
      };
    }
    return {
      response: "I can help you with product information! I can assist with details about sizes, colors, pricing, availability, and specifications. What specific product would you like to know about?",
      category: 'product_info'
    };
  }
  
  // Shipping-related queries
  if (message.includes('shipping') || message.includes('delivery') || message.includes('ship')) {
    return {
      response: "Here's our shipping information:\n• Standard shipping: 5-7 business days (Free on orders over $50)\n• Express shipping: 2-3 business days ($9.99)\n• Next day delivery: 1 business day ($19.99)\n\nWe ship Monday-Friday. Orders placed before 2 PM are processed the same day!",
      category: 'shipping'
    };
  }
  
  // Returns and refunds
  if (message.includes('return') || message.includes('refund') || message.includes('exchange')) {
    return {
      response: "Our return policy:\n• 30-day return window for most items\n• Items must be unused and in original packaging\n• Free returns for defective items\n• Return shipping costs $5.99 (deducted from refund)\n\nWould you like me to help you initiate a return or exchange?",
      category: 'returns'
    };
  }
  
  // Account-related queries
  if (message.includes('account') || message.includes('profile') || message.includes('password') || message.includes('login')) {
    return {
      response: "I can help with account-related questions:\n• Password reset: Use 'Forgot Password' on the login page\n• Update profile information: Go to 'My Account' > 'Profile Settings'\n• Order history: Available in 'My Account' > 'My Orders'\n• Delete account: Contact our support team\n\nWhat specific account help do you need?",
      category: 'account'
    };
  }
  
  // Payment-related queries
  if (message.includes('payment') || message.includes('card') || message.includes('paypal') || message.includes('checkout')) {
    return {
      response: "We accept various payment methods:\n• Credit/Debit cards (Visa, MasterCard, American Express)\n• PayPal\n• Razorpay\n• Stripe\n\nAll payments are secure and encrypted. If you're having trouble with checkout, try clearing your browser cache or using a different payment method.",
      category: 'payment'
    };
  }
  
  // Greeting responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good')) {
    return {
      response: "Hello! Welcome to our customer support chat. I'm here to help you with:\n• Order tracking and status\n• Product information and recommendations\n• Shipping and delivery questions\n• Returns and exchanges\n• Account assistance\n• Payment support\n\nHow can I assist you today?",
      category: 'general'
    };
  }
  
  // Thank you responses
  if (message.includes('thank') || message.includes('thanks')) {
    return {
      response: "You're very welcome! I'm glad I could help. If you have any other questions, feel free to ask. Have a great shopping experience!",
      category: 'general'
    };
  }
  
  // Default response
  return {
    response: "I'm here to help! I can assist you with orders, products, shipping, returns, account issues, and payments. Could you please provide more details about what you need help with?",
    category: 'general'
  };
};

// Helper function for order status messages
const getOrderStatusMessage = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return "Your order is being prepared for shipment.";
    case 'processing':
      return "Your order is currently being processed.";
    case 'shipped':
      return "Your order has been shipped and is on its way!";
    case 'delivered':
      return "Your order has been delivered successfully.";
    case 'cancelled':
      return "This order has been cancelled. If you have questions, please contact support.";
    default:
      return "I can provide more details if needed.";
  }
};

// Start a new conversation
router.post('/start', async (req, res) => {
  try {
    const sessionId = generateSessionId();
    const { userId } = req.body;
    
    const conversation = new Conversation({
      sessionId,
      userId: userId || null,
      messages: [{
        content: "Hello! I'm your shopping assistant. How can I help you today?",
        sender: 'bot'
      }]
    });
    
    await conversation.save();
    
    res.status(201).json({
      success: true,
      sessionId,
      message: "Hello! I'm your shopping assistant. How can I help you today?"
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start conversation'
    });
  }
});

// Send a message to the chatbot
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message, userId } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and message are required'
      });
    }
    
    // Find existing conversation
    let conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    // Add user message to conversation
    conversation.messages.push({
      content: message,
      sender: 'user'
    });
    
    // Generate bot response
    const { response, category } = await generateBotResponse(message, userId);
    
    // Add bot response to conversation
    conversation.messages.push({
      content: response,
      sender: 'bot'
    });
    
    // Update category if detected
    if (category !== 'general') {
      conversation.category = category;
    }
    
    await conversation.save();
    
    res.status(200).json({
      success: true,
      response,
      category
    });
    
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message'
    });
  }
});

// Get conversation history
router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      conversation
    });
    
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation'
    });
  }
});

// End conversation
router.post('/end', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }
    
    conversation.status = 'resolved';
    conversation.messages.push({
      content: "Thank you for using our chat support! Have a great day!",
      sender: 'bot'
    });
    
    await conversation.save();
    
    res.status(200).json({
      success: true,
      message: 'Conversation ended successfully'
    });
    
  } catch (error) {
    console.error('Error ending conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end conversation'
    });
  }
});

// Get all conversations (for admin)
router.get('/admin/conversations', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const conversations = await Conversation.find(filter)
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Conversation.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      conversations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
    
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

module.exports = router;