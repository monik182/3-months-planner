import { UserService } from '@/services/user'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'

const QUERY_KEY = 'users'
export function useUserActions() {

  const useCreate = () => {
    return useMutation({
      mutationFn: (user: Prisma.UserCreateInput) => UserService.create(user),
    })
  }

  const useGet = (id: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { id }],
      queryFn: () => UserService.get(id),
      enabled: !!id,
    })
  }

  const useGetByEmail = (email: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { email }],
      queryFn: () => UserService.getByEmail(email),
      enabled: !!email,
    })
  }

  return {
    useCreate,
    useGet,
    useGetByEmail,
  }
}

export type UseUserActions = ReturnType<typeof useUserActions>
