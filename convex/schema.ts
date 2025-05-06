import { zid, zodToConvex } from 'convex-helpers/server/zod';
import { defineSchema, defineTable } from 'convex/server';
import { z } from 'zod';

export const CategorySchema = z.enum(['TECH', 'THINKING', 'ETC']);

export type Category = z.infer<typeof CategorySchema>;

const BasePostSchema = z.object({
  _id: zid('post').optional(),
  _creationTime: z.number().optional(),
  title: z.string().min(1),
  category: CategorySchema,
  briefContents: z.string().optional(),
});

export const PostSummarySchema = BasePostSchema.extend({
  postId: z.string(),
});

export type PostSummary = z.infer<typeof PostSummarySchema>;

export const PostSchema = BasePostSchema.extend({
  contents: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;

export const FileSchema = z.object({
  body: z.string(),
});

export default defineSchema({
  summary: defineTable(zodToConvex(PostSummarySchema)),
  post: defineTable(zodToConvex(PostSchema)),
  file: defineTable(zodToConvex(FileSchema)),
});
