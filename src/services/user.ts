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
  const user = await userHandler.findOne(id)
  if (user) {
    return user
  }

  return fetch(`/api/user/${id}`).then(response => response.json())
}

const getByEmail = async (email: string): Promise<User | null> => {
  const user = await userHandler.findOneByEmail(email)
  if (user) {
    return user
  }

  const response = await fetch(`/api/user/email/${email}`)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Something went wrong')
  }

  return response.json()
}

const getLocal = async (): Promise<User | null> => {
  const user = await userHandler.findFirst()
  return user as User
}

export const UserService = {
  get,
  create,
  getByEmail,
  getLocal,
}
