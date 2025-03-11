import { ENABLE_CLOUD_SYNC } from '@/app/constants'
import { QueueEntityType, QueueOperation } from '@/app/types/types'
import { userHandler } from '@/db/dexieHandler'
import { PartialUserSchema } from '@/lib/validators/user'
import { SyncService } from '@/services/sync'
import { Prisma, User } from '@prisma/client'
import cuid from 'cuid'

const create = async (user: Prisma.UserCreateInput): Promise<User> => {
  if (!ENABLE_CLOUD_SYNC) {
    const localUser = { ...user, id: cuid() }
    const exists = await userHandler.findOne(user.id || '')
    if (exists) {
      await userHandler.update(user.id as string, user as User)
    } else {
      await userHandler.create(localUser as User)
    }
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
        console.log('^^^^^^^^^^^^^^^^^^ NOT exists and creating', exists)
        await userHandler.create(user)
      } else {
        console.log('^^^^^^^^^^^^^^^^^^ exists and editing', exists)
        await userHandler.update(user.id, user)
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
  if (user?.auth0Id) {
    return user
  }

  if (!ENABLE_CLOUD_SYNC) {
    return null
  }

  return fetch(`/api/user/auth0/${id}`).then(response => response.json())
}

const update = async (id: string, user: Prisma.UserUpdateInput): Promise<Partial<User>> => {
  const parsedData = PartialUserSchema.parse(user)
  await userHandler.update(id, parsedData)
  await SyncService.queueForSync(QueueEntityType.USER, id, QueueOperation.UPDATE, { ...parsedData, id })
  return { ...parsedData, id }
}

export const UserService = {
  get,
  create,
  getByEmail,
  getLocal,
  getByAuth0Id,
  getRemoteById,
  update,
}
