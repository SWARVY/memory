import { zid } from 'convex-helpers/server/zod';

import { PostSchema } from './schema';
import { zMutation, zQuery } from '~/shared/lib/zod-convex';

export const createPost = zMutation({
  args: { input: PostSchema.omit({ _id: true, _creationTime: true }) },
  handler: async (ctx, args) => {
    await ctx.db.insert('post', args.input);
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
  handler: async (ctx) => {
    const posts = await ctx.db.query('post').collect();
    return posts;
  },
});

export const getPostDetail = zQuery({
  args: { id: zid('post') },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    return post;
  },
});
