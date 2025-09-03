import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test if we can import and create auth options
    const { getAuthOptions } = await import('@/lib/auth-config')
    const authOptions = await getAuthOptions()
    
    return NextResponse.json({
      status: 'Auth config test successful',
      hasSecret: !!authOptions.secret,
      hasProviders: authOptions.providers?.length || 0,
      hasAdapter: !!authOptions.adapter,
      strategy: authOptions.session?.strategy,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Auth config test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
