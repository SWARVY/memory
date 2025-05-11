import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import buildPath from '~/shared/lib/build-path';

export default function useEditAbout() {
  const queryClient = useQueryClient();
  const editAbout = useConvexMutation(api.about.editAbout);
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['edit-about'],
    mutationFn: editAbout,
    onSuccess: () => {
      toast.success('소개글이 수정되었어요 🚀');
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[1] === 'about:getAbout',
      });
      navigate(buildPath('/about'));
    },
    onError: () => {
      toast.error('소개글 수정에 실패했어요 😢');
    },
  });
}
