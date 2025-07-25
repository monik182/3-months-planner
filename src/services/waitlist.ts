import { Prisma, Waitlist } from '@prisma/client'

const create = async (waitlist: Prisma.WaitlistCreateInput): Promise<Waitlist> => {

  return fetch(`/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waitlist),
  })
    .then(async (response) => {
      if (!response.ok) {
        const error: { message: string } | null = await response.json()
        throw new Error(error?.message || 'Failed to add user to waitlist')
      }
      const waitlist = await response.json()
      return waitlist
    })
}

const getByToken = async (token: string): Promise<Waitlist | null> => {
  const response = await fetch(`/api/waitlist/token/${token}`).then(response => response.json())
  if (response.ok) {
    return response.json()
  }

  return null
}

const update = async (id: string, waitlist: Prisma.WaitlistUpdateInput): Promise<Partial<Waitlist>> => {

  return fetch(`/api/waitlist/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waitlist),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error('Failed to update waitlist')
    }
    return response.json()
  })
}

export const WaitlistService = {
  getByToken,
  create,
  update
}
