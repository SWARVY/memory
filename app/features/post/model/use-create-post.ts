import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import buildPath from '~/shared/lib/build-path';

export default function useCreatePost() {
  const queryClient = useQueryClient();
  const createPost = useConvexMutation(api.posts.createPost);
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['insert'],
    mutationFn: createPost,
    onSuccess: () => {
      toast.success('포스트가 등록되었어요 🚀');
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[1] === 'posts:getPosts',
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[1] === 'posts:getPostDetail',
      });
      navigate(buildPath('/'));
    },
    onError: () => {
      toast.error('포스트 등록에 실패했어요 😢');
    },
  });
}
