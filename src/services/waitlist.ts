import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { waitlistHandler } from '@/db/dexieHandler'
import { Prisma, Waitlist } from '@prisma/client'

const create = async (waitlist: Prisma.WaitlistCreateInput): Promise<Waitlist> => {

  return fetch(`/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waitlist),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to create waitlist')
      }
      const waitlist = await response.json()
      await waitlistHandler.create(waitlist)
      return waitlist
    })
}

const getByToken = async (token: string): Promise<Waitlist | null> => {
  const response = await waitlistHandler.findOneByToken(token)
  if (response) {
    return response
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/waitlist/token/${token}`).then(response => response.json())
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
    const waitlist = await response.json()
    await waitlistHandler.update(id, waitlist)
    return waitlist
  })
}

export const WaitlistService = {
  getByToken,
  create,
  update
}
