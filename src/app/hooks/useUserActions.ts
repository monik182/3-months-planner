import { UserService } from '@/services/user'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'users'
export function useUserActions() {
  const queryClient = useQueryClient()

  const useCreate = () => {
    return useMutation({
      mutationFn: (user: Prisma.UserCreateInput) => UserService.create(user),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      }
    })
  }

  const useGet = (id: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { id }],
      queryFn: () => UserService.get(id),
      enabled: !!id,
    })
  }

  const useGetLocal = () => {
    return useQuery({
      queryKey: [QUERY_KEY],
      queryFn: () => UserService.getLocal(),
    })
  }

  const useGetByEmail = (email: string) => {
    return useQuery({
      queryKey: [QUERY_KEY, { email }],
      queryFn: () => UserService.getByEmail(email),
      enabled: !!email,
    })
  }

  const useGetByAuth0Id = (id: string, enabled = true) => {
    return useQuery({
      queryKey: [QUERY_KEY, { id }],
      queryFn: () => UserService.getByAuth0Id(id),
      enabled: !!id && enabled,
    })
  }

  return {
    useCreate,
    useGet,
    useGetByEmail,
    useGetLocal,
    useGetByAuth0Id,
  }
}

export type UseUserActions = ReturnType<typeof useUserActions>
