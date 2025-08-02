#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generating secure secrets for your auction website...\n');

// Generate NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('NEXTAUTH_SECRET:');
console.log(nextAuthSecret);
console.log();

// Generate JWT_SECRET
const jwtSecret = crypto.randomBytes(32).toString('base64');
console.log('JWT_SECRET:');
console.log(jwtSecret);
console.log();

console.log('📋 Copy these values to your Vercel environment variables:');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Navigate to Settings → Environment Variables');
console.log('3. Add each variable with the corresponding value above');
console.log();

console.log('⚠️  Important:');
console.log('- Keep these secrets secure and never commit them to your repository');
console.log('- Use different secrets for development and production');
console.log('- Store these values in a secure password manager'); 