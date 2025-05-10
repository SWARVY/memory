import { zid } from 'convex-helpers/server/zod';
import { z } from 'zod';
import { zMutation, zQuery } from '~/shared/lib/zod-convex';

import { PostSchema } from './schema';

export const createPost = zMutation({
  args: { input: PostSchema.omit({ _id: true, _creationTime: true }) },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert('post', args.input);

    await ctx.db.insert('summary', {
      postId,
      title: args.input.title,
      briefContents: args.input.briefContents,
      category: args.input.category,
    });
  },
});

export const editPost = zMutation({
  args: { input: PostSchema },
  handler: async (ctx, args) => {
    ctx.db.patch(args.input._id!, args.input);

    const summaries = await ctx.db
      .query('summary')
      .withIndex('by_postId', (q) => q.eq('postId', args.input._id!))
      .collect();

    const summary = summaries[0];

    if (summary) {
      await ctx.db.patch(summary._id, {
        title: args.input.title,
        briefContents: args.input.briefContents,
        category: args.input.category,
      });
    }
  },
});

export const deletePost = zMutation({
  args: { id: zid('post') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);

    const summaries = await ctx.db
      .query('summary')
      .withIndex('by_postId', (q) => q.eq('postId', args.id))
      .collect();

    await ctx.db.delete(summaries[0]._id);
  },
});

export const getPosts = zQuery({
  args: {
    cursor: z.string().nullable(),
    numItems: z.number().default(10),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('summary')
      .order('desc')
      .paginate({ cursor: args.cursor, numItems: args.numItems });

    return result;
  },
});

export const getPostDetail = zQuery({
  args: { id: zid('post') },
  handler: async (ctx, args) => {
    const currentPost = await ctx.db.get(args.id);

    if (!currentPost) {
      return null;
    }

    // 모든 summary 데이터를 시간 순으로 가져오기
    const summaries = await ctx.db.query('summary').order('desc').collect();

    // 현재 포스트의 인덱스 찾기
    const currentIndex = summaries.findIndex(
      (summary) => summary.postId === currentPost._id,
    );

    // 이전, 다음 포스트 찾기
    const nextPost = currentIndex > 0 ? summaries[currentIndex - 1] : null;
    const previousPost =
      currentIndex < summaries.length - 1 ? summaries[currentIndex + 1] : null;

    return {
      currentPost,
      previousPost,
      nextPost,
    };
  },
});
