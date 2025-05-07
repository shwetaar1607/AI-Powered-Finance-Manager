# AI-Powered Personal Finance Manager 💰🤖

An intelligent personal finance management web application that leverages AI and real-time banking data to help users track expenses, predict future spending, and make smarter financial decisions.

---

## 🚀 Features

- 🔄 **Automated Expense Tracking**
  - Real-time bank transaction fetching via Plaid API
  - Auto-categorization of expenses using AI
  - Manual and receipt-based transaction logging

- 📊 **Budget & Expense Management**
  - Monthly budget limits and alerts
  - Interactive visualizations of spending patterns
  - Historical expense comparison and analytics

- 🤖 **AI-Powered Insights**
  - Predict future expenses based on past trends
  - Smart savings and spending recommendations
  - Personalized financial planning based on user goals

- 💼 **Investment & Goal Tracking** *(Premium)*
  - Portfolio tracking with ROI calculation
  - Savings goal management
  - Debt repayment advice

- 🔐 **Security & Compliance**
  - OAuth2 + JWT authentication
  - AES/TLS encryption
  - GDPR & PCI DSS compliant

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Shadcn UI, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas + Mongoose
- **AI/ML:** TensorFlow, Scikit-learn, spaCy (via FastAPI)
- **APIs:** Plaid (banking), Stripe (payments), Resend (email)
- **Testing:** Jest, React Testing Library, Cypress
- **Deployment:** AWS ECS, Docker, Vercel

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-finance-manager.git
   cd ai-finance-manager
2. **Install dependencies**
    ```bash
   npm install # for frontend/backend
   cd client && npm install
4. **Set up environment variables**
   Create a .env file in both / and /client with required API keys (Plaid, Stripe, MongoDB URI, JWT secret).
5. **Run the application**
   start backend- npm run dev
   In another terminal start frontend - cd client
                                         npm start
