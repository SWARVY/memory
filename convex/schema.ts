import { zid, zodToConvex } from 'convex-helpers/server/zod';
import { defineSchema, defineTable } from 'convex/server';
import { z } from 'zod';

export const CategorySchema = z.enum(['TECH', 'THINKING', 'ETC']);

export type Category = z.infer<typeof CategorySchema>;

const BasePostSchema = z.object({
  title: z.string().min(1),
  category: CategorySchema,
  briefContents: z.string(),
});

export const PostSummarySchema = BasePostSchema.extend({
  postId: z.string(),
});

export type PostSummary = z.infer<typeof PostSummarySchema>;

export const PostSummaryResponseSchema = PostSummarySchema.extend({
  _id: zid('summary'),
  _creationTime: z.number(),
});

export type PostSummaryResponse = z.infer<typeof PostSummaryResponseSchema>;

export const PostSchema = BasePostSchema.extend({
  contents: z.string(),
});

export type Post = z.infer<typeof PostSchema>;

export const PostResponseSchema = PostSchema.extend({
  _id: zid('post'),
  _creationTime: z.number(),
});

export type PostResponse = z.infer<typeof PostResponseSchema>;

export const FileSchema = z.object({
  body: z.string(),
});

export const AboutSchema = z.object({
  content: z.string().min(1),
});

export type About = z.infer<typeof AboutSchema>;

export const AboutResponseSchema = AboutSchema.extend({
  _id: zid('about'),
  _creationTime: z.number(),
});

export type AboutResponse = z.infer<typeof AboutResponseSchema>;

export const SettingsSchema = z.object({
  profileImage: z.string().url().optional(),
  name: z.string(),
  description: z.string(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const SettingsResponseSchema = SettingsSchema.extend({
  _id: zid('settings'),
  _creationTime: z.number(),
});

export type SettingsResponse = z.infer<typeof SettingsResponseSchema>;

export default defineSchema({
  summary: defineTable(zodToConvex(PostSummarySchema)).index('by_postId', [
    'postId',
  ]),
  post: defineTable(zodToConvex(PostSchema)),
  file: defineTable(zodToConvex(FileSchema)),
  about: defineTable(zodToConvex(AboutSchema)),
  settings: defineTable(zodToConvex(SettingsSchema)),
});
