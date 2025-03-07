import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { userHandler } from '@/db/dexieHandler'
import { Prisma, User } from '@prisma/client'
import cuid from 'cuid'

const create = async (user: Prisma.UserCreateInput): Promise<User> => {
  if (!ENABLE_CLOUD_SYNC) {
    const localUser = { ...user, id: cuid() }
    await userHandler.create(localUser as User)
    return localUser as User
  }
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
      const exists = await userHandler.findOne(user.id)
      if (!exists) {
        await userHandler.create(user)
      }
      return user
    })
}

const get = async (id: string): Promise<User | null> => {
  const user = await userHandler.findOne(id)
  if (user) {
    return user
  }


  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/user/${id}`).then(response => response.json())
}

const getByEmail = async (email: string): Promise<User | null> => {
  const user = await userHandler.findOneByEmail(email)
  if (user) {
    return user
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
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
  return user as User || null
}

const getRemoteById = async (id: string): Promise<User | null> => {
  return fetch(`/api/user/${id}`).then(response => response.json())
}

const getByAuth0Id = async (id: string): Promise<User | null> => {
  const user = await userHandler.findOneByAuth0Id(id)
  if (user) {
    return user
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/user/auth0/${id}`).then(response => response.json())
}

export const UserService = {
  get,
  create,
  getByEmail,
  getLocal,
  getByAuth0Id,
  getRemoteById,
}
