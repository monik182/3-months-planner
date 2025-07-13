import { PartialUserSchema, PartialUserSchemaType, UserSchemaType } from '@/lib/validators/user'
import { User } from '@/app/types/models'

const create = async (user: UserSchemaType): Promise<User> => {

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

const getByAuth0Id = async (id: string): Promise<User | null> => {
  const response = await fetch(`/api/user/auth0/${id}`)
  if (!response.ok) {
    return null
  }

  const remoteUser = await response.json()
  return remoteUser
}

const update = async (id: string, user: PartialUserSchemaType): Promise<Partial<User>> => {
  const parsedData = PartialUserSchema.parse(user)

  const response = await fetch(`/api/user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsedData),
  })

  if (!response.ok) {
    throw new Error('Failed to update user')
  }

  return { ...parsedData, id }
}


export const UserService = {
  get,
  create,
  getByEmail,
  getByAuth0Id,
  getRemoteById,
  update,
}
