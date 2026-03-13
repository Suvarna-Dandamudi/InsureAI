// AI Insurance Chatbot Controller
const Policy = require('../models/Policy');
const Claim = require('../models/Claim');
const Customer = require('../models/Customer');

class InsuranceChatbot {
  static async processMessage(req, res) {
    try {
      const { message, customerId } = req.body;
      
      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required',
        });
      }

      // Process the message and generate response
      const response = await this.generateResponse(message, customerId);

      res.status(200).json({
        success: true,
        data: {
          message: response.text,
          suggestions: response.suggestions,
          actions: response.actions,
        },
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }

  static async generateResponse(message, customerId) {
    const lowerMessage = message.toLowerCase();

    // Greeting responses
    if (this.containsGreeting(lowerMessage)) {
      return {
        text: 'Hello! I\'m your AI insurance assistant. How can I help you today? You can ask me about policies, claims, or general insurance questions.',
        suggestions: [
          'Check my policy status',
          'File a new claim',
          'What does my policy cover?',
          'Premium payment options'
        ],
        actions: [],
      };
    }

    // Policy related queries
    if (this.containsPolicyQuery(lowerMessage)) {
      return await this.handlePolicyQuery(lowerMessage, customerId);
    }

    // Claim related queries
    if (this.containsClaimQuery(lowerMessage)) {
      return await this.handleClaimQuery(lowerMessage, customerId);
    }

    // Coverage questions
    if (this.containsCoverageQuery(lowerMessage)) {
      return this.handleCoverageQuery(lowerMessage);
    }

    // Premium questions
    if (this.containsPremiumQuery(lowerMessage)) {
      return await this.handlePremiumQuery(lowerMessage, customerId);
    }

    // Claim filing assistance
    if (this.containsClaimFilingQuery(lowerMessage)) {
      return this.handleClaimFilingQuery();
    }

    // General insurance information
    if (this.containsGeneralQuery(lowerMessage)) {
      return this.handleGeneralQuery(lowerMessage);
    }

    // Default response
    return {
      text: 'I understand you have a question. Let me help you with that. Could you please provide more details about what you\'d like to know?',
      suggestions: [
        'Policy information',
        'Claim status',
        'Coverage details',
        'Speak to a human agent'
      ],
      actions: [
        { type: 'contact_agent', label: 'Speak to Agent' }
      ],
    };
  }

  static async handlePolicyQuery(message, customerId) {
    if (!customerId) {
      return {
        text: 'To check your policy information, I\'ll need your customer ID. Please provide your customer ID or email address.',
        suggestions: ['Provide customer ID', 'Continue without ID'],
        actions: [],
      };
    }

    try {
      const customer = await Customer.findById(customerId).populate('policies');
      
      if (!customer) {
        return {
          text: 'I couldn\'t find your account. Please check your customer ID or contact support.',
          suggestions: ['Contact support', 'Try again'],
          actions: [],
        };
      }

      const activePolicies = customer.policies.filter(p => p.status === 'active');
      
      if (activePolicies.length === 0) {
        return {
          text: `Hello ${customer.name}! I don't see any active policies on your account. Would you like to explore available policy options?`,
          suggestions: ['Browse policies', 'Contact agent'],
          actions: [],
        };
      }

      return {
        text: `Hello ${customer.name}! You have ${activePolicies.length} active policy(ies). Here's a summary:\n\n${activePolicies.map(p => 
          `• ${p.type.toUpperCase()} Policy (${p.policyNumber})\n  Premium: $${p.premium}/month\n  Coverage: $${p.coverage}`
        ).join('\n\n')}`,
        suggestions: [
          'View policy details',
          'Check claim status',
          'Update policy',
          'Make a payment'
        ],
        actions: [],
      };
    } catch (error) {
      return {
        text: 'I\'m having trouble accessing your policy information right now. Please try again later or contact our support team.',
        suggestions: ['Contact support', 'Try again'],
        actions: [],
      };
    }
  }

  static async handleClaimQuery(message, customerId) {
    if (!customerId) {
      return {
        text: 'To check your claim status, I\'ll need your customer ID. Please provide your customer ID or email address.',
        suggestions: ['Provide customer ID', 'Continue without ID'],
        actions: [],
      };
    }

    try {
      const customer = await Customer.findById(customerId);
      const claims = await Claim.find({ customer: customerId }).populate('policy');

      if (claims.length === 0) {
        return {
          text: `I don't see any claims on your account. Would you like to file a new claim?`,
          suggestions: ['File new claim', 'Learn about claims process'],
          actions: [
            { type: 'file_claim', label: 'File New Claim' }
          ],
        };
      }

      const pendingClaims = claims.filter(c => c.status === 'pending');
      const approvedClaims = claims.filter(c => c.status === 'approved');

      return {
        text: `You have ${claims.length} claim(s) on file:\n\n• ${pendingClaims.length} pending\n• ${approvedClaims.length} approved\n• ${claims.length - pendingClaims.length - approvedClaims.length} other status\n\nYour most recent claim is ${claims[0].claimNumber} with status: ${claims[0].status.toUpperCase()}`,
        suggestions: [
          'View claim details',
          'File new claim',
          'Upload documents',
          'Contact claims department'
        ],
        actions: [],
      };
    } catch (error) {
      return {
        text: 'I\'m having trouble accessing your claim information right now. Please try again later or contact our claims department.',
        suggestions: ['Contact claims', 'Try again'],
        actions: [],
      };
    }
  }

  static handleCoverageQuery(message) {
    const coverageTypes = {
      'auto': 'Auto insurance covers vehicle damage, liability, medical expenses, and uninsured motorist protection.',
      'home': 'Home insurance covers dwelling, personal property, liability, and additional living expenses.',
      'life': 'Life insurance provides financial protection to beneficiaries upon death of the insured.',
      'health': 'Health insurance covers medical expenses, prescriptions, and preventive care.',
      'business': 'Business insurance covers property, liability, workers compensation, and business interruption.'
    };

    for (const [type, description] of Object.entries(coverageTypes)) {
      if (message.includes(type)) {
        return {
          text: `${type.toUpperCase()} Insurance:\n\n${description}\n\nWould you like to know more about specific coverage options or get a quote?`,
          suggestions: ['Get a quote', 'Coverage options', 'Deductibles', 'Exclusions'],
          actions: [
            { type: 'get_quote', label: 'Get Quote' }
          ],
        };
      }
    }

    return {
      text: 'I can help you understand different types of insurance coverage. What type of insurance are you interested in?',
      suggestions: ['Auto insurance', 'Home insurance', 'Life insurance', 'Health insurance', 'Business insurance'],
      actions: [],
    };
  }

  static async handlePremiumQuery(message, customerId) {
    if (!customerId) {
      return {
        text: 'To check your premium information, I\'ll need your customer ID. Please provide your customer ID or email address.',
        suggestions: ['Provide customer ID', 'Continue without ID'],
        actions: [],
      };
    }

    try {
      const customer = await Customer.findById(customerId).populate('policies');
      const activePolicies = customer.policies.filter(p => p.status === 'active');
      
      if (activePolicies.length === 0) {
        return {
          text: 'I don\'t see any active policies on your account.',
          suggestions: ['Browse policies', 'Contact agent'],
          actions: [],
        };
      }

      const totalMonthlyPremium = activePolicies.reduce((sum, p) => sum + p.premium, 0);

      return {
        text: `Your current monthly premium is $${totalMonthlyPremium.toFixed(2)} across ${activePolicies.length} policy(ies).\n\nPayment options:\n• Monthly auto-debit\n• Quarterly billing\n• Annual billing\n• Online portal\n• Phone payment`,
        suggestions: [
          'Make a payment',
          'Change payment method',
          'Discount eligibility',
          'Billing questions'
        ],
        actions: [
          { type: 'make_payment', label: 'Make Payment' }
        ],
      };
    } catch (error) {
      return {
        text: 'I\'m having trouble accessing your premium information right now. Please try again later or contact our billing department.',
        suggestions: ['Contact billing', 'Try again'],
        actions: [],
      };
    }
  }

  static handleClaimFilingQuery() {
    return {
      text: 'I can help you file a claim! Here\'s the process:\n\n1. Gather information (policy number, incident details, photos)\n2. Contact us immediately after the incident\n3. Submit claim form and documentation\n4. Claims adjuster will review your claim\n5. Receive decision and payment\n\nReady to start? I can guide you through each step.',
      suggestions: [
        'Start claim process',
        'What documents needed?',
        'Claim timeline',
        'Emergency claims'
      ],
      actions: [
        { type: 'start_claim', label: 'Start Claim Process' }
      ],
    };
  }

  static handleGeneralQuery(message) {
    const responses = {
      'deductible': 'A deductible is the amount you pay out of pocket before insurance coverage kicks in. Higher deductibles typically mean lower premiums.',
      'premium': 'A premium is the amount you pay for your insurance coverage, usually monthly or annually.',
      'coverage': 'Coverage is the maximum amount your insurance will pay for a covered loss.',
      'claim': 'A claim is a formal request to your insurance company for payment based on the terms of your policy.',
      'liability': 'Liability insurance protects you if you\'re responsible for injury to others or damage to their property.',
    };

    for (const [term, definition] of Object.entries(responses)) {
      if (message.includes(term)) {
        return {
          text: definition,
          suggestions: ['More questions', 'Contact agent', 'Policy details'],
          actions: [],
        };
      }
    }

    return {
      text: 'I\'m here to help with insurance questions, policy information, claims, and coverage details. What specific topic would you like to know more about?',
      suggestions: ['Policy types', 'Claims process', 'Coverage options', 'Payment options'],
      actions: [],
    };
  }

  // Helper methods for message classification
  static containsGreeting(message) {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  static containsPolicyQuery(message) {
    const policyKeywords = ['policy', 'policies', 'coverage', 'insurance', 'my policy'];
    return policyKeywords.some(keyword => message.includes(keyword));
  }

  static containsClaimQuery(message) {
    const claimKeywords = ['claim', 'claims', 'file claim', 'claim status', 'incident'];
    return claimKeywords.some(keyword => message.includes(keyword));
  }

  static containsCoverageQuery(message) {
    const coverageKeywords = ['coverage', 'covered', 'what does', 'protect', 'include'];
    return coverageKeywords.some(keyword => message.includes(keyword));
  }

  static containsPremiumQuery(message) {
    const premiumKeywords = ['premium', 'payment', 'cost', 'price', 'pay', 'billing'];
    return premiumKeywords.some(keyword => message.includes(keyword));
  }

  static containsClaimFilingQuery(message) {
    const filingKeywords = ['file', 'filing', 'submit', 'start claim', 'new claim'];
    return filingKeywords.some(keyword => message.includes(keyword));
  }

  static containsGeneralQuery(message) {
    const generalKeywords = ['what is', 'explain', 'help', 'question', 'information'];
    return generalKeywords.some(keyword => message.includes(keyword));
  }
}

module.exports = {
  processMessage: InsuranceChatbot.processMessage.bind(InsuranceChatbot),
};
