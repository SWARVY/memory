import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { toast } from 'sonner';

export default function useEditSettings() {
  const queryClient = useQueryClient();
  const editSettings = useConvexMutation(api.settings.editSettings);

  return useMutation({
    mutationKey: ['edit-settings'],
    mutationFn: editSettings,
    onSuccess: () => {
      toast.success('설정이 수정되었어요 🚀');
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => queryKey[0] === 'settings:getSettings',
      });
    },
    onError: () => {
      toast.error('설정 수정에 실패했어요 😢');
    },
  });
}
