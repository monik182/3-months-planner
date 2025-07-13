import { Waitlist } from '@/app/types/models'
import { WaitlistSchemaType, PartialWaitlistSchemaType } from '@/lib/validators/waitlist'

const create = async (waitlist: WaitlistSchemaType): Promise<Waitlist> => {

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

const update = async (id: string, waitlist: PartialWaitlistSchemaType): Promise<Partial<Waitlist>> => {

  return fetch(`/api/waitlist/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waitlist),
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error('Failed to update waitlist')
    }
    const waitlist = await response.json()
    return waitlist
  })
}

export const WaitlistService = {
  getByToken,
  create,
  update
}
