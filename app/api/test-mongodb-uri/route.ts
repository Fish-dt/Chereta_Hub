import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI
    
    if (!uri) {
      return NextResponse.json({
        error: 'MONGODB_URI not set',
        uri: null
      }, { status: 400 })
    }

    // Parse the URI to check its structure
    let parsedUri
    try {
      parsedUri = new URL(uri)
    } catch (error) {
      return NextResponse.json({
        error: 'Invalid URI format',
        uri: uri,
        parseError: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 400 })
    }

    // Test connection
    let connectionResult = 'Not tested'
    try {
      const client = new MongoClient(uri)
      await client.connect()
      await client.db().admin().ping()
      await client.close()
      connectionResult = '✅ Connected successfully'
    } catch (error) {
      connectionResult = `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    return NextResponse.json({
      status: 'MongoDB URI Test',
      uri: {
        full: uri,
        length: uri.length,
        protocol: parsedUri.protocol,
        hostname: parsedUri.hostname,
        port: parsedUri.port,
        pathname: parsedUri.pathname,
        search: parsedUri.search,
        username: parsedUri.username,
        hasPassword: !!parsedUri.password
      },
      connection: connectionResult,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
