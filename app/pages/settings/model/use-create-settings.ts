import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { toast } from 'sonner';

export default function useCreateSettings() {
  const queryClient = useQueryClient();
  const createSettings = useConvexMutation(api.settings.createSettings);

  return useMutation({
    mutationKey: ['create-settings'],
    mutationFn: createSettings,
    onSuccess: () => {
      toast.success('설정이 등록되었어요 🚀');
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey[0] === 'settings:getSettings',
      });
    },
    onError: () => {
      toast.error('설정 등록에 실패했어요 😢');
    },
  });
}
