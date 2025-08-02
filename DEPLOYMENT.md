# Vercel Deployment Guide

## Prerequisites

1. A GitHub repository with your auction website code
2. A Vercel account (free tier available)
3. A MongoDB database (MongoDB Atlas recommended)

## Step 1: Set up MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/auctionhub`)

## Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

### Required Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auctionhub
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://your-project-name.vercel.app
JWT_SECRET=your-random-jwt-secret-here
```

### Optional Variables:

```
MONGODB_DB=auctionhub
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### How to Generate Secrets:

For `NEXTAUTH_SECRET` and `JWT_SECRET`, you can generate random strings:

**Option 1: Using OpenSSL (recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online generator**
Use a secure random string generator online (at least 32 characters)

## Step 4: Deploy

1. After adding all environment variables, click **Deploy**
2. Vercel will build and deploy your application
3. Your site will be available at `https://your-project-name.vercel.app`

## Step 5: Verify Deployment

1. Check that your site loads without errors
2. Test user registration and login
3. Verify that auctions can be created and viewed

## Troubleshooting

### Build Errors

If you see build errors related to environment variables:

1. Double-check that all required environment variables are set in Vercel
2. Make sure there are no typos in the variable names
3. Ensure the MongoDB URI is correct and accessible

### Runtime Errors

If the site loads but features don't work:

1. Check the browser console for errors
2. Verify your MongoDB connection string is correct
3. Ensure your database user has the right permissions

### Common Issues

1. **"Invalid/Missing environment variable: MONGODB_URI"**
   - Make sure MONGODB_URI is set in Vercel environment variables

2. **Authentication not working**
   - Verify NEXTAUTH_SECRET and NEXTAUTH_URL are set correctly
   - Check that JWT_SECRET is configured

3. **Database connection issues**
   - Ensure your MongoDB Atlas cluster is running
   - Verify your IP address is whitelisted (or use 0.0.0.0/0 for all IPs)
   - Check that your database user has the correct permissions

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| MONGODB_URI | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/auctionhub` |
| NEXTAUTH_SECRET | Yes | Secret for NextAuth.js | `random-32-character-string` |
| NEXTAUTH_URL | Yes | Your application URL | `https://your-app.vercel.app` |
| JWT_SECRET | Yes | Secret for JWT tokens | `random-32-character-string` |
| MONGODB_DB | No | Database name (default: auctionhub) | `auctionhub` |
| GOOGLE_CLIENT_ID | No | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| GOOGLE_CLIENT_SECRET | No | Google OAuth client secret | `GOCSPX-xxxxxxxxxxxxxxxx` |

## Security Notes

1. Never commit environment variables to your repository
2. Use strong, random secrets for production
3. Regularly rotate your secrets
4. Use environment-specific variables in Vercel (Production, Preview, Development) 