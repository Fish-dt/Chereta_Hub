# Auction Website

A modern auction platform built with Next.js, TypeScript, and MongoDB.

## Environment Variables

Before deploying, you need to set up the following environment variables:

### Required Environment Variables

1. **MONGODB_URI** - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/auctionhub`
   - For local development: `mongodb://localhost:27017/auctionhub`

2. **NEXTAUTH_SECRET** - Secret key for NextAuth.js
   - Generate a random string for production
   - Example: `openssl rand -base64 32`

3. **NEXTAUTH_URL** - Your application URL
   - For production: `https://your-domain.vercel.app`
   - For local development: `http://localhost:3000`

4. **JWT_SECRET** - Secret key for JWT tokens
   - Generate a random string for production
   - Example: `openssl rand -base64 32`

### Optional Environment Variables

5. **MONGODB_DB** - Database name (defaults to "auctionhub")
6. **GOOGLE_CLIENT_ID** - Google OAuth client ID (for Google login)
7. **GOOGLE_CLIENT_SECRET** - Google OAuth client secret (for Google login)

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the required environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each required variable

### Vercel Environment Variables Setup

In your Vercel project dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auctionhub
NEXTAUTH_SECRET=your-generated-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
JWT_SECRET=your-generated-jwt-secret
MONGODB_DB=auctionhub
```

## Local Development

1. Clone the repository
2. Install dependencies: `npm install` or `pnpm install`
3. Create a `.env.local` file with the required environment variables
4. Run the development server: `npm run dev` or `pnpm dev`

## Features

- User authentication with NextAuth.js
- Google OAuth integration
- Auction creation and management
- Real-time bidding
- Admin panel
- Responsive design with Tailwind CSS
- TypeScript support

## Tech Stack

- Next.js 15
- TypeScript
- MongoDB
- NextAuth.js
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Zod validation 