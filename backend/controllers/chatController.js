// AI Chatbot endpoint - placeholder with intelligent mock responses
const responses = {
  policy: [
    "I can help you with policy information. Our plans cover Health, Auto, Life, Property, Travel, and Business. What type of coverage are you looking for?",
    "To check your policy details, please provide your policy number. I can pull up coverage amounts, premium details, and renewal dates.",
  ],
  claim: [
    "To file a claim, you'll need your policy number, incident date, and a brief description. I can guide you through the entire process.",
    "Claim processing typically takes 3-7 business days. For urgent cases, we have an expedited review process available.",
  ],
  fraud: [
    "Our AI system continuously monitors for suspicious patterns. If you suspect fraud, please report immediately and we'll investigate within 24 hours.",
  ],
  default: [
    "I'm InsurAI's virtual assistant. I can help with policy queries, claim submissions, fraud reporting, and coverage questions. How can I assist you today?",
    "Great question! Let me connect you with the right information. Could you provide more details about your inquiry?",
    "I'm here to help with all your insurance needs. Whether it's understanding your coverage, filing a claim, or checking policy status — I've got you covered.",
  ]
};

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const lowerMsg = message.toLowerCase();
    let category = 'default';
    if (lowerMsg.includes('policy') || lowerMsg.includes('coverage') || lowerMsg.includes('premium')) category = 'policy';
    else if (lowerMsg.includes('claim') || lowerMsg.includes('file') || lowerMsg.includes('submit')) category = 'claim';
    else if (lowerMsg.includes('fraud') || lowerMsg.includes('suspicious')) category = 'fraud';

    const pool = responses[category];
    const reply = pool[Math.floor(Math.random() * pool.length)];

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      reply,
      timestamp: new Date(),
      confidence: Math.floor(Math.random() * 20) + 80 + '%'
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
