import { userHandler } from '@/db/dexieHandler'
import { Prisma, User } from '@prisma/client'

const create = async (user: Prisma.UserCreateInput): Promise<User> => {
  return fetch(`/api/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      const user = await response.json()
      await userHandler.create(user)
      return user
    })

}

const get = async (id: string): Promise<User | null> => {
  return fetch(`/api/user/${id}`).then(response => response.json())
}

const getByEmail = async (email: string): Promise<User | null> => {
  const response = await fetch(`/api/user/email/${email}`)

  if (!response.ok) {
    const errorData = await response.json()
    console.log(errorData)
    throw new Error(errorData.message || 'Something went wrong')
  }

  return response.json()
}

export const UserService = {
  get,
  create,
  getByEmail,
}
