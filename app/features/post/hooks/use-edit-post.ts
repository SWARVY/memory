import { useConvexMutation } from '@convex-dev/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'convex/_generated/api';
import { toast } from 'sonner';

export default function useEditPost() {
  const queryClient = useQueryClient();
  const editPost = useConvexMutation(api.posts.editPost);

  return useMutation({
    mutationKey: ['edit'],
    mutationFn: editPost,
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [api.posts.getPostDetail, { id: variables.input._id }],
      });
      toast.success('포스트가 수정되었어요 ✅');
      // router.navigate({
      //   to: '/posts/list/$type',
      //   params: { type: 'POST' },
      // });
    },
    onError: () => {
      toast.error('포스트 수정에 실패했어요 😢');
    },
  });
}
