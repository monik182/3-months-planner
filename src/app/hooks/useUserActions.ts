import { useMixpanelContext } from '@/app/providers/MixpanelProvider'
import { UserService } from '@/services/user'
import { UserSchemaType, PartialUserSchemaType } from '@/lib/validators/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'users'
export function useUserActions() {
  const queryClient = useQueryClient()
  const { track } = useMixpanelContext()

  const useCreate = () => {
    return useMutation({
      mutationFn: (user: UserSchemaType) => UserService.create(user),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('create_user', data)
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

  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ userId, updates }: { userId: string, updates: PartialUserSchemaType }) => UserService.update(userId, updates),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
        track('update_user', { updated: Object.keys(data) })
      }
    })
  }

  return {
    useCreate,
    useGet,
    useGetByEmail,
    useGetByAuth0Id,
    useUpdate,
  }
}

export type UseUserActions = ReturnType<typeof useUserActions>
