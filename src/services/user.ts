import { PartialUserSchema } from '@/lib/validators/user'
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
      return user
    })
}

const get = async (id: string): Promise<User | null> => {
  const remoteUser = await fetch(`/api/user/${id}`).then(response => response.json())
  return remoteUser
}

const getByEmail = async (email: string): Promise<User | null> => {
  const response = await fetch(`/api/user/email/${email}`)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Something went wrong')
  }
  const remoteUser = await response.json()
  return remoteUser
}

const getRemoteById = async (id: string): Promise<User | null> => {
  return fetch(`/api/user/${id}`).then(response => response.json())
}

const update = async (id: string, user: Prisma.UserUpdateInput): Promise<Partial<User>> => {
  const parsedData = PartialUserSchema.omit({ id: true }).parse(user)

  const response = await fetch(`/api/user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }

  return response.json()
}


export const UserService = {
  get,
  create,
  getByEmail,
  getRemoteById,
  update,
}
