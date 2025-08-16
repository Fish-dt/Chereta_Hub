# Deployment Guide for Vercel

## Environment Variables Required

Add these environment variables in your Vercel project settings:

### Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auctionhub?retryWrites=true&w=majority
MONGODB_DB=auctionhub
```

### NextAuth
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Google OAuth
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Steps to Fix Deployment Issues

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add all the variables listed above

2. **MongoDB Atlas Setup:**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Replace `username`, `password`, and `cluster` in the MONGODB_URI

3. **Google OAuth Setup:**
   - Go to Google Cloud Console
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your Vercel domain to authorized origins

4. **Generate NEXTAUTH_SECRET:**
   - Use: `openssl rand -base64 32`
   - Or any secure random string

5. **Redeploy:**
   - After setting environment variables, redeploy your project

## Common Issues Fixed

- ✅ Removed localhost fallback in MongoDB connection
- ✅ Fixed Google OAuth environment variable handling
- ✅ Simplified footer to essential links only
- ✅ Improved error handling in authentication
- ✅ Updated Vercel configuration

## Testing

After deployment:
1. Check if you can see auctions on the homepage
2. Try logging in with Google OAuth
3. Verify database connection works
4. Check console for any remaining errors 