import { Prisma, Waitlist } from '@prisma/client'

const create = async (waitlist: Prisma.WaitlistCreateInput): Promise<Waitlist> => {

  return fetch(`/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waitlist),
  })
    .then(response => response.json())
}

export const WaitlistService = {
  create,
}
