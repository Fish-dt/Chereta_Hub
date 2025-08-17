import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("auctionhub")
    
    // Test the connection
    await db.command({ ping: 1 })
    
    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connection successful",
      database: db.databaseName
    })
  } catch (error) {
    console.error('MongoDB connection test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
} 