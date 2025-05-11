import { zid } from 'convex-helpers/server/zod';
import { z } from 'zod';
import { zMutation, zQuery } from '~/shared/lib/zod-convex';

import { PostResponseSchema, PostSchema } from './schema';

export const createPost = zMutation({
  args: { input: PostSchema },
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
  args: { input: PostResponseSchema },
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

    const summaries = await ctx.db.query('summary').order('desc').collect();

    const currentIndex = summaries.findIndex(
      (summary) => summary.postId === currentPost._id,
    );

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
