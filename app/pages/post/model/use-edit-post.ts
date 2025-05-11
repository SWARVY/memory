import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import buildPath from '~/shared/lib/build-path';

export default function useEditPost() {
  const queryClient = useQueryClient();
  const editPost = useConvexMutation(api.posts.editPost);
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['edit-post'],
    mutationFn: editPost,
    onSuccess: () => {
      navigate(buildPath('/'));
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[1] === 'posts:getPosts',
      });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[1] === 'posts:getPostDetail',
      });
      toast.success('포스트가 수정되었어요 ✅');
    },
    onError: () => {
      toast.error('포스트 수정에 실패했어요 😢');
    },
  });
}
