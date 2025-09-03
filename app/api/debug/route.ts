import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
      MONGODB_DB: process.env.MONGODB_DB || 'auctionhub',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    // Test MongoDB connection
    let mongoStatus = 'Not tested'
    try {
      const { getClient } = await import('@/lib/mongodb')
      const client = await getClient()
      await client.db().admin().ping()
      mongoStatus = '✅ Connected'
    } catch (error) {
      mongoStatus = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    return NextResponse.json({
      status: 'Debug Info',
      environment: envCheck,
      mongodb: mongoStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
