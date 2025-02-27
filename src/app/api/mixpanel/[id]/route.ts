import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const data = Object.fromEntries(new URLSearchParams(rawBody))

  if (!data) {
    return new Response(JSON.stringify({ message: 'Invalid data', ok: false }), { status: 400 })
  }

  try {
    const url = 'https://api.mixpanel.com' + request.nextUrl.pathname.replace('/api/mixpanel', '')
    const response = await fetch(url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: new URLSearchParams(data).toString(),
    })

    const parsedResponse = await response.json()
    return new Response(JSON.stringify({ ...parsedResponse, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }

}
