# InsurAI — Corporate Policy Automation & Intelligence System

A production-grade full-stack AI SaaS web application for insurance companies.
Built with React, Node.js, MongoDB, and integrated AI-powered features.

---

## 🏗️ Project Structure

```
insurai/
├── frontend/                    # React.js frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js        # Main layout wrapper
│   │   │   ├── Sidebar.js       # Navigation sidebar
│   │   │   ├── Navbar.js        # Top navigation bar
│   │   │   ├── KPICard.js       # Dashboard KPI cards
│   │   │   └── StatusBadge.js   # Status indicator badges
│   │   ├── pages/
│   │   │   ├── Landing.js       # Public landing page
│   │   │   ├── Login.js         # Authentication - login
│   │   │   ├── Signup.js        # Authentication - signup
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── Policies.js      # Policy management
│   │   │   ├── Claims.js        # Claims management
│   │   │   ├── Customers.js     # Customer management
│   │   │   ├── Analytics.js     # Analytics & charts
│   │   │   ├── FraudDetection.js# Fraud alerts & management
│   │   │   ├── RiskAnalysis.js  # AI risk assessment
│   │   │   ├── Chatbot.js       # AI chatbot assistant
│   │   │   └── Settings.js      # User settings
│   │   ├── context/
│   │   │   ├── AuthContext.js   # Authentication state
│   │   │   └── ThemeContext.js  # Dark/light theme
│   │   ├── utils/
│   │   │   ├── api.js           # Axios API client
│   │   │   └── mockData.js      # Demo data (offline mode)
│   │   ├── App.js               # Root component & routing
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles + Tailwind
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                     # Node.js Express backend
    ├── models/
    │   ├── User.js              # User schema
    │   ├── Policy.js            # Insurance policy schema
    │   ├── Claim.js             # Claims schema
    │   ├── Customer.js          # Customer schema
    │   └── FraudAlert.js        # Fraud alert schema
    ├── controllers/
    │   ├── authController.js    # Auth logic (signup/login)
    │   ├── policiesController.js
    │   ├── claimsController.js  # Includes AI fraud scoring
    │   ├── customersController.js
    │   ├── analyticsController.js
    │   ├── fraudController.js
    │   ├── riskController.js    # AI risk analysis
    │   └── chatController.js    # AI chatbot responses
    ├── routes/
    │   ├── auth.js
    │   ├── policies.js
    │   ├── claims.js
    │   ├── customers.js
    │   ├── analytics.js
    │   ├── fraudAlerts.js
    │   ├── riskAnalysis.js
    │   └── chat.js
    ├── middleware/
    │   └── auth.js              # JWT protect middleware
    ├── server.js                # Express app entry point
    ├── package.json
    └── .env.example
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone & Setup

```bash
git clone <your-repo>
cd insurai
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/insurai
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

**Start the backend:**
```bash
npm run dev      # Development (with nodemon)
npm start        # Production
```

Backend runs on: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create env file (optional - defaults to localhost:5000)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

**Start the frontend:**
```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

### 4. MongoDB Connection

**Option A: Local MongoDB**
```bash
# Install MongoDB
brew install mongodb-community   # macOS
# or download from mongodb.com/try/download/community

# Start MongoDB
mongod --dbpath /data/db
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at cloud.mongodb.com
2. Create cluster → Get connection string
3. Update MONGO_URI in .env:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/insurai
```

---

## 🚀 Demo Mode (Without Backend)

The app works **fully without a backend** using built-in mock data!

1. Just run `npm start` in the frontend
2. Click "Try Demo Account" on the login page
3. Explore all features with realistic sample data

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login with JWT |
| GET | `/api/auth/me` | Get current user |

### Policies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/policies` | List all policies |
| POST | `/api/policies` | Create policy |
| PUT | `/api/policies/:id` | Update policy |
| DELETE | `/api/policies/:id` | Delete policy |

### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/claims` | List all claims |
| POST | `/api/claims` | Submit claim (AI fraud scored) |
| PUT | `/api/claims/:id` | Update claim status |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | List customers |
| POST | `/api/customers` | Create customer |
| GET | `/api/customers/:id` | Get customer |
| PUT | `/api/customers/:id` | Update customer |

### Analytics & AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Dashboard KPIs & charts |
| GET | `/api/fraud-alerts` | Fraud detection alerts |
| PUT | `/api/fraud-alerts/:id` | Update alert status |
| GET | `/api/risk-analysis` | AI risk portfolio analysis |
| POST | `/api/chat` | AI chatbot response |

---

## 🎨 UI Features

- **Dark/Light Theme** — Toggle via navbar or Settings page
- **Responsive Design** — Mobile sidebar, fluid grid layouts
- **Framer Motion** — Page transitions, card animations, progress bars
- **Recharts** — Line, Area, Bar, Pie, Radar charts
- **Real-time Fraud Scores** — Color-coded score bars per claim
- **KPI Cards** — Animated counters with trend indicators
- **AI Insights Panel** — Risk warnings and recommendations
- **Chatbot Interface** — Multi-turn conversation with AI assistant

---

## 🛡️ Database Schemas

### User
```
name, email, password (bcrypt), role (admin|agent|underwriter|customer), isActive
```

### Policy
```
policyNumber, type, holder (→Customer), premium, coverageAmount, startDate, endDate, status, riskScore, createdBy (→User)
```

### Claim
```
claimNumber, policy (→Policy), customer (→Customer), type, amount, description, status, fraudScore, isFlagged, documents[]
```

### Customer
```
name, email, phone, address, riskCategory, kycStatus, totalPolicies, totalClaims, lifetimeValue
```

### FraudAlert
```
claim (→Claim), customer (→Customer), alertType, severity, fraudScore, description, status, detectedAt
```

---

## 🔐 Security Features

- JWT tokens (7-day expiry)
- bcrypt password hashing (salt rounds: 12)
- Protected routes (middleware)
- Role-based access (admin, agent, underwriter, customer)
- CORS configured for frontend origin

---

## 🤖 AI Features

| Feature | Implementation |
|---------|---------------|
| Fraud Detection | Rule-based + ML simulation scoring 0-100 |
| Risk Scoring | Multi-factor policy risk assessment |
| Auto-flagging | Claims >60 fraud score auto-flagged |
| AI Insights | Portfolio-level risk warnings |
| Chatbot | Intent-based response engine (OpenAI-ready) |

### To integrate OpenAI ChatGPT:

In `backend/controllers/chatController.js`, replace the mock logic:
```javascript
const { Configuration, OpenAIApi } = require('openai');
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

const completion = await openai.createChatCompletion({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'You are InsurAI assistant for an insurance platform.' },
    { role: 'user', content: message }
  ]
});
reply = completion.data.choices[0].message.content;
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TailwindCSS, Framer Motion |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Fonts | Sora (display), DM Sans (body) |

---

## 🌟 Portfolio Notes

This project demonstrates:
- Full-stack SaaS architecture
- AI/ML integration patterns
- JWT auth & protected routing
- Complex data visualization
- Modern UX with dark theme
- RESTful API design
- MongoDB schema design
- Real-world insurance domain logic

Built for Infosys internship portfolio. © 2025 InsurAI.
