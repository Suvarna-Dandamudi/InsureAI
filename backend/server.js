const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));


// ================= ROUTES =================
const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policies');
const claimRoutes = require('./routes/claims');
const customerRoutes = require('./routes/customers');
const analyticsRoutes = require('./routes/analytics');
const fraudRoutes = require('./routes/fraudAlerts');
const riskRoutes = require('./routes/riskAnalysis');
const chatRoutes = require('./routes/chat');

app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/fraud-alerts', fraudRoutes);
app.use('/api/risk-analysis', riskRoutes);
app.use('/api/chat', chatRoutes);


// ================= HEALTH CHECK =================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'InsurAI API running',
    timestamp: new Date()
  });
});


// ================= DATABASE CONNECTION =================
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {

  console.log('✅ MongoDB connected');

  app.listen(PORT, () => {
    console.log(`🚀 InsurAI API running on port ${PORT}`);
  });

})
.catch((err) => {

  console.error('❌ MongoDB connection error:', err);
  process.exit(1);

});