import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import buildPath from '~/shared/lib/build-path';

export default function useDeletePost() {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['delete'],
    mutationFn: useConvexMutation(api.posts.deletePost),
    onSuccess: () => {
      navigate(buildPath('/'));
      toast.success('포스트가 삭제되었어요 🗑️');
    },
  });
}
