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
  },
});

export const deletePost = zMutation({
  args: { id: zid('post') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
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
    const post = await ctx.db.get(args.id);
    return post;
  },
});
