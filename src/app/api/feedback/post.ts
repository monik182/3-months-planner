import { feedbackHandler } from '@/db/prismaHandler'
import { FeedbackSchema } from '@/lib/validators/feedback'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()

  if (!data?.feedback) {
    return new Response(JSON.stringify({ message: 'Invalid data', ok: false }), { status: 400 })
  }

  try {
    const parsedData = FeedbackSchema.parse(data)
    console.log(parsedData)
    const response = await feedbackHandler.create(parsedData)
    return new Response(JSON.stringify({ ...response, ok: true }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error, ok: false }), { status: 500 })
  }
}
