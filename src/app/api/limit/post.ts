import Redis from 'ioredis'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL!)

  if (!data?.userId) {
    return new Response(JSON.stringify({ error: 'Invalid user id' }), { status: 400 })
  }

  try {

    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `api_limit:${process.env.NODE_ENV}:${data.userId}:${today}`

    const requestCount = await redis.get(cacheKey)
    const count = requestCount ? parseInt(requestCount) : 0

    if (count >= parseInt(process.env.MAX_REQUEST_ALLOWED_PER_DAY || '0')) {
      return new Response(JSON.stringify({ error: 'Daily request limit reached' }), { status: 429 })
    }

    await redis.set(cacheKey, count + 1, 'EX', 86400)
    return new Response(JSON.stringify({ success: true, remaining: 10 - count - 1 }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
