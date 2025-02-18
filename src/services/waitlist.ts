import { Prisma, Waitlist } from '@prisma/client'

const create = async (waitlist: Prisma.WaitlistCreateInput): Promise<Waitlist> => {

  return fetch(`/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waitlist),
  })
    .then(response => response.json())
}

const getByToken = async (token: string): Promise<Waitlist | null> => {
  return fetch(`/api/waitlist/token/${token}`).then(response => response.json())
}

const update = async (id: string, waitlist: Prisma.WaitlistUpdateInput): Promise<Partial<Waitlist>> => {
  return fetch(`/api/waitlist/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(waitlist),
  }).then(response => response.json())
}

export const WaitlistService = {
  getByToken,
  create,
  update
}
