import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    // Optionally specify a path to revalidate, defaulting to root
    const path = request.nextUrl.searchParams.get('path') || '/'
    
    // Revalidating entire site if path is '/' and using layout
    revalidatePath(path, 'layout')
    
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return POST(request) // Pozwala też na proste wejście przez cron via GET (choć Vercel wysyła GET)
}
