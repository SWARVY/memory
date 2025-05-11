import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import buildPath from '~/shared/lib/build-path';

export default function useCreateAbout() {
  const queryClient = useQueryClient();
  const createAbout = useConvexMutation(api.about.createAbout);
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['create-about'],
    mutationFn: createAbout,
    onSuccess: () => {
      toast.success('소개글이 등록되었어요 🚀');
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[1] === 'about:getAbout',
      });
      navigate(buildPath('/about'));
    },
    onError: () => {
      toast.error('소개글 등록에 실패했어요 😢');
    },
  });
}
