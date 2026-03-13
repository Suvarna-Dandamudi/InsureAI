# INSUREAI - AI-Powered Insurance Platform

A comprehensive, production-level AI Insurance SaaS platform built with React, Node.js, and MongoDB.

## 🚀 Features

### Core Features
- **Customer Management**: Complete customer database with policies and claims history
- **Policy Management**: Create, update, and manage insurance policies with AI risk assessment
- **Claims Processing**: File, process, and manage claims with AI fraud detection
- **Analytics Dashboard**: Comprehensive analytics with real-time insights and charts
- **AI Chatbot**: Intelligent insurance assistant for customer support

### AI Features
- **Fraud Detection**: Advanced AI algorithms to detect suspicious claims
- **Risk Scoring**: AI-powered risk assessment for policy underwriting
- **Smart Chatbot**: Natural language processing for customer inquiries

### Technical Features
- **Modern UI/UX**: Professional SaaS dashboard with dark/light theme
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Real-time Updates**: Live data synchronization
- **Advanced Tables**: Search, filters, pagination, and export functionality
- **Beautiful Charts**: Interactive data visualizations with Recharts
- **Smooth Animations**: Framer Motion animations throughout

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive charts
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

### AI & Analytics
- **Custom Fraud Detection** - Pattern recognition algorithms
- **Risk Assessment Engine** - Machine learning-based scoring
- **Natural Language Processing** - Chatbot intelligence

## 📁 Project Structure

```
insure/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── customerController.js # Customer management
│   │   ├── policyController.js   # Policy management
│   │   ├── claimController.js    # Claims processing
│   │   ├── analyticsController.js # Analytics data
│   │   └── chatbotController.js  # AI chatbot
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT authentication
│   │   └── errorMiddleware.js    # Error handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Customer.js           # Customer schema
│   │   ├── Policy.js             # Policy schema
│   │   ├── Claim.js              # Claim schema
│   │   └── Fraudcase.js          # Fraud case schema
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── customerRoutes.js     # Customer routes
│   │   ├── policyRoutes.js       # Policy routes
│   │   ├── claimRoutes.js        # Claim routes
│   │   ├── analyticsRoutes.js    # Analytics routes
│   │   └── chatbotRoutes.js      # Chatbot routes
│   ├── utils/
│   │   ├── fraudDetection.js      # AI fraud detection
│   │   └── riskScore.js          # Risk assessment
│   └── server.js                 # Server entry point
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── index.css
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js         # Main layout
│   │   │   ├── Navbar.js         # Navigation bar
│   │   │   ├── Sidebar.js        # Sidebar navigation
│   │   │   ├── DataTable.js      # Reusable data table
│   │   │   ├── DashboardCards.js # Dashboard cards
│   │   │   ├── FraudAlerts.js    # Fraud alerts component
│   │   │   ├── RecentActivity.js # Recent activity
│   │   │   ├── ProtectedRoute.js  # Route protection
│   │   │   └── Charts/           # Chart components
│   │   ├── contexts/
│   │   │   ├── AuthContext.js    # Authentication context
│   │   │   └── ThemeContext.js   # Theme management
│   │   ├── pages/
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── Customers.js      # Customer management
│   │   │   ├── Policies.js       # Policy management
│   │   │   ├── PolicyList.js     # Policy list view
│   │   │   ├── Claims.js         # Claims management
│   │   │   ├── Analytics.js      # Analytics dashboard
│   │   │   ├── Chatbot.js        # AI chatbot
│   │   │   └── Login.js          # Login page
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.js                # Main app component
│   │   └── index.js              # App entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json                  # Root package.json
├── .env                         # Environment variables
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insure
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment setup**
   - Copy `.env` file and update with your configuration
   - Set your MongoDB URI
   - Set your JWT secret

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server    # Backend only
   cd frontend && npm start  # Frontend only
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Policies
- `GET /api/policies` - Get all policies
- `POST /api/policies` - Create policy
- `GET /api/policies/:id` - Get policy by ID
- `PUT /api/policies/:id` - Update policy
- `DELETE /api/policies/:id` - Delete policy

### Claims
- `GET /api/claims` - Get all claims
- `POST /api/claims` - Create claim
- `GET /api/claims/:id` - Get claim by ID
- `PUT /api/claims/:id` - Update claim
- `PUT /api/claims/:id/approve` - Approve claim
- `PUT /api/claims/:id/reject` - Reject claim

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/detailed` - Get detailed analytics

### Chatbot
- `POST /api/chatbot/message` - Send message to AI chatbot

## 🎨 UI Features

### Dashboard
- Real-time statistics cards
- Interactive charts (Claims, Risk Distribution, Growth)
- Fraud alerts panel
- Recent activity feed
- AI insights section

### Data Tables
- Advanced search functionality
- Multi-column filtering
- Pagination
- Sortable columns
- Export to CSV
- Responsive design

### Theme System
- Dark/Light mode toggle
- Persistent theme preference
- Smooth transitions
- Optimized for all devices

### Animations
- Page transitions
- Hover effects
- Loading states
- Micro-interactions

## 🤖 AI Features

### Fraud Detection
- Pattern recognition algorithms
- Risk factor analysis
- Automated flagging
- Severity assessment
- Investigation recommendations

### Risk Scoring
- Customer profile analysis
- Policy type risk assessment
- Historical data analysis
- Premium calculation
- Risk categorization

### AI Chatbot
- Natural language understanding
- Context-aware responses
- Policy information retrieval
- Claim assistance
- Customer support automation

## 🔧 Configuration

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/insureai
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### TailwindCSS Configuration
- Custom color palette
- Dark mode support
- Responsive breakpoints
- Custom animations
- Extended utilities

## 📱 Responsive Design

- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up
- **Large Desktop**: 1280px and up

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Rate limiting ready
- SQL injection prevention

## 🚀 Performance

- Code splitting
- Lazy loading
- Optimized images
- Caching strategies
- Bundle optimization
- Database indexing

## 📈 Analytics & Monitoring

- Real-time dashboard metrics
- User activity tracking
- Performance monitoring
- Error tracking
- Usage analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Integration with external APIs
- [ ] Mobile app development
- [ ] Advanced AI models
- [ ] Real-time notifications
- [ ] Document management
- [ ] Payment processing integration
- [ ] Advanced user roles and permissions
- [ ] Audit logging

---

**INSUREAI** - Transforming insurance with artificial intelligence 🚀
