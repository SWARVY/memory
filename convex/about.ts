import { zMutation, zQuery } from '~/shared/lib/zod-convex';

import { AboutResponseSchema, AboutSchema } from './schema';

export const createAbout = zMutation({
  args: { input: AboutSchema },
  handler: async (ctx, args) => {
    await ctx.db.insert('about', args.input);
  },
});

export const editAbout = zMutation({
  args: { input: AboutResponseSchema },
  handler: async (ctx, args) => {
    ctx.db.patch(args.input._id, args.input);
  },
});

export const getAbout = zQuery({
  handler: async (ctx) => {
    const about = await ctx.db.query('about').collect();

    return about[0];
  },
});
