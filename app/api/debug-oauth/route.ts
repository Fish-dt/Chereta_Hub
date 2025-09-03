import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check Google OAuth environment variables
    const oauthCheck = {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
    }

    // Test auth configuration
    let authConfigStatus = 'Not tested'
    try {
      const { getAuthOptions } = await import('@/lib/auth-config')
      const authOptions = await getAuthOptions()
      
      authConfigStatus = {
        hasGoogleProvider: authOptions.providers?.some(p => p.id === 'google') || false,
        providersCount: authOptions.providers?.length || 0,
        hasSecret: !!authOptions.secret,
        hasAdapter: !!authOptions.adapter,
      }
    } catch (error) {
      authConfigStatus = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    return NextResponse.json({
      status: 'OAuth Debug Info',
      environment: oauthCheck,
      authConfig: authConfigStatus,
      expectedCallbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'OAuth debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
