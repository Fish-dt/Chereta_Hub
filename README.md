# CheretaHub 🏛️

<div align="center">

![CheretaHub Logo](public/logo.png)

**A Modern, Full-Featured Online Auction Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.9-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-Tested-C21325)](https://jestjs.io/)
[![Testing Library](https://img.shields.io/badge/Testing_Library-React-61DAFB)](https://testing-library.com/react)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Configuration](#-configuration) • [Deployment](#-deployment) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CheretaHub** is a comprehensive, modern auction platform built with cutting-edge web technologies. It provides a seamless experience for both buyers and sellers, featuring real-time bidding, secure payments, multi-language support, and an intelligent admin system.

### Key Highlights

- 🎯 **Real-time Auction System** - Live bidding with automatic time extensions
- 💳 **Secure Payment Integration** - Chapa payment gateway with ETB support
- 🌍 **Multi-language Support** - English and Amharic (አማርኛ)
- 🤖 **AI-Powered Chatbot** - Gemini AI integration for customer support
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔐 **Robust Authentication** - NextAuth.js with Google OAuth support
- ⚡ **Real-time Notifications** - Email and in-app notifications
- 🎨 **Beautiful UI/UX** - Modern design with dark mode support

---

## ✨ Features

### For Buyers
- 🔍 **Browse & Search** - Filter auctions by category, price, location
- 💰 **Place Bids** - Real-time bidding with automatic bid validation
- 📱 **Watchlist** - Save favorite auctions for later
- 💬 **Messaging** - Direct communication with sellers
- 📊 **Dashboard** - Track your bids, won auctions, and account balance
- 🔔 **Notifications** - Real-time updates on bid status and auction results

### For Sellers
- 🎨 **Create Listings** - Upload multiple images with detailed descriptions
- 📈 **Track Performance** - Monitor views, bids, and auction status
- 💵 **Payment Management** - Secure payment processing and balance management
- 📧 **Automated Notifications** - Get notified of new bids and auction results
- 🏆 **Seller Dashboard** - Comprehensive analytics and account management

### Admin Features
- 🔍 **Auction Review** - Approve/reject auction listings before going live
- 👥 **User Management** - Manage users, roles, and permissions
- 📊 **Analytics Dashboard** - Track platform performance and revenue
- 💳 **Payment Management** - Monitor transactions, refunds, and reconciliations
- 🛡️ **Security** - Role-based access control (RBAC) with multiple permission levels

### Additional Features
- 🤖 **AI Chatbot** - Gemini-powered customer support assistant
- 🌐 **Internationalization** - English and Amharic language support
- 🎨 **Theme Switching** - Light and dark mode
- 📧 **Email Notifications** - Automated email alerts using Nodemailer
- 🔒 **Security** - bcrypt password hashing, JWT tokens, secure API routes
- 📱 **Progressive Web App** - Fast loading and offline capabilities

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 15.2](https://nextjs.org/) - React framework with App Router
- **UI Library:** [React 19](https://reactjs.org/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** React Context API + React Hooks
- **Forms:** [React Hook Form](https://react-hook-form.com/) + Zod validation
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **API Routes:** Next.js API Routes
- **Database:** [MongoDB 5.9](https://www.mongodb.com/)
- **Authentication:** [NextAuth.js 4.24](https://next-auth.js.org/)
- **Session Management:** JWT tokens + MongoDB sessions

### Integrations
- **Payment Gateway:** [Chapa](https://chapa.co/) - Ethiopian payment processing
- **AI Service:** [Google Gemini 2.0](https://deepmind.google/technologies/gemini/) - Chatbot
- **Email Service:** Nodemailer - Transactional emails
- **OAuth:** Google Sign-In

### Development Tools
- **Language:** [TypeScript 5.9](https://www.typescriptlang.org/)
- **Package Manager:** npm/pnpm
- **Code Quality:** ESLint
- **Build Tool:** Next.js Turbopack
- **Testing:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or pnpm)
- **MongoDB** 5.9 or higher (local or Atlas)
- **Git** for version control

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Chereta-Hub.git
cd Chereta-Hub
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_generate_with_npm_run_generate-secrets

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Chapa Payment Gateway
CHAPA_SECRET_KEY=your_chapa_secret_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Generate Secrets

```bash
npm run generate-secrets
```

This will generate secure secrets for NextAuth and JWT.

### 5. Database Setup

The application will automatically create the necessary collections on first run. Optionally, you can run:

```bash
node scripts/seed-database.js
```

---

## ⚙️ Configuration

### MongoDB Setup

1. **Local MongoDB:**
   ```bash
   mongod --dbpath /path/to/data
   ```

2. **MongoDB Atlas:**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get your connection string
   - Update `MONGODB_URI` in `.env.local`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### Chapa Payment Setup

1. Sign up at [Chapa](https://chapa.co/)
2. Get your secret key from the dashboard
3. Add to `.env.local`

### Gemini AI Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env.local`

---

## 💻 Development

### Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Run Linter

```bash
npm run lint
```

### Create Admin User

```bash
node scripts/create-admin.js
```

### Testing

The project includes comprehensive testing with Jest and React Testing Library:

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Generate coverage report:**
```bash
npm run test:coverage
```

**Test Coverage:**
- ✅ **Component Tests** - UI components and business logic (Button, Input, Card, AuctionCard, Filters)
- ✅ **API Route Tests** - Auctions and Bids endpoints with authentication
- ✅ **Integration Tests** - Authentication, validation, error handling
- ✅ **Utility Tests** - Helper functions and utilities

**Total Test Suites:** 13+ | **Total Tests:** 73+

See [`__tests__/README.md`](__tests__/README.md) for detailed testing documentation.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Chereta-Hub)

### Netlify

1. Push your code to GitHub
2. Connect repository in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy!

### Other Platforms

This application can be deployed to any Node.js hosting platform:
- Heroku
- AWS
- Google Cloud Platform
- DigitalOcean
- Railway

---

## 📁 Project Structure

```
Chereta-Hub/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── admin/           # Admin endpoints
│   │   ├── auctions/        # Auction endpoints
│   │   ├── auth/            # Authentication
│   │   ├── bids/            # Bidding system
│   │   ├── chapa/           # Payment gateway
│   │   └── chatbot/         # AI chatbot
│   ├── admin/               # Admin dashboard
│   ├── auction/             # Auction detail pages
│   ├── auth/                # Authentication pages
│   └── [various pages]      # Other pages
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── [components]         # Custom components
├── lib/                     # Utilities & helpers
│   ├── auth.ts             # Authentication logic
│   ├── mongodb.ts          # Database connection
│   └── utils.ts            # Helper functions
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
├── public/                 # Static assets
├── scripts/                # Utility scripts
└── styles/                 # Global styles
```

---

## 📚 API Documentation

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST `/api/auth/login`
Login user with credentials or Google OAuth.

### Auctions

#### GET `/api/auctions`
Get all active auctions with optional filters.

**Query Parameters:**
- `category` - Filter by category
- `search` - Search term
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

#### POST `/api/auctions/create`
Create a new auction listing.

**Request:** Multipart form data with images

#### GET `/api/auctions/[id]`
Get auction details by ID.

### Bidding

#### POST `/api/bids`
Place a bid on an auction.

**Request Body:**
```json
{
  "auctionId": "auction_id",
  "amount": 1000
}
```

#### GET `/api/bids?auctionId=[id]`
Get all bids for an auction.

### Payments

#### POST `/api/chapa/initialize`
Initialize a payment transaction.

#### GET `/api/chapa/verify?tx_ref=[reference]`
Verify payment status.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Testing Guidelines

- Write tests for all new components and API routes
- Maintain at least 70% code coverage
- Test critical user flows and business logic
- Use `npm run test:watch` for development
- See [`__tests__/README.md`](__tests__/README.md) for detailed testing documentation

**Current Test Coverage:**
- 🟢 Component Tests: UI and business components
- 🟢 API Tests: Auctions, Bids, Authentication
- 🟢 Integration Tests: User flows and error handling
- 🟡 Coverage: 65+ tests across 13 test suites

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **fisiha** - *Initial work* - [Fish-dt](https://github.com/fish-dt)

---

## 🙏 Acknowledgments

- [shadcn](https://ui.shadcn.com/) for the beautiful UI components
- [Vercel](https://vercel.com/) for the amazing deployment platform
- [Chapa](https://chapa.co/) for payment gateway services
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities

---


## 🔗 Links

- [Live Demo](https://cheretahub.vercel.app)
- [Documentation](https://docs.cheretahub.com)
- [GitHub Repository](https://github.com/yourusername/Chereta-Hub)
- [Issue Tracker](https://github.com/yourusername/Chereta-Hub/issues)

---

<div align="center">

**Made with ❤️ using Next.js and TypeScript**

⭐ Star this repo if you found it helpful!

</div> 