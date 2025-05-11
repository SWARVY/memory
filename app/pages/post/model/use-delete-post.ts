import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import buildPath from '~/shared/lib/build-path';

export default function useDeletePost() {
  const queryClient = useQueryClient();
  const deletePost = useConvexMutation(api.posts.deletePost);
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['delete-post'],
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success('포스트가 삭제되었어요 🗑️');
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[1] === 'posts:getPosts',
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[1] === 'posts:getPostDetail',
      });
      navigate(buildPath('/'));
    },
    onError: () => {
      toast.error('포스트 삭제에 실패했어요 😢');
    },
  });
}
