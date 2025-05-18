import { zid } from 'convex-helpers/server/zod';
import { zMutation, zQuery } from '~/shared/lib/zod-convex';

import type { Id } from './_generated/dataModel';
import { SettingsResponseSchema, SettingsSchema } from './schema';

export const createSettings = zMutation({
  args: { input: SettingsSchema },
  handler: async (ctx, args) => {
    await ctx.db.insert('settings', args.input);
  },
});

export const editSettings = zMutation({
  args: { input: SettingsResponseSchema },
  handler: async (ctx, args) => {
    ctx.db.patch(args.input._id, args.input);
  },
});

export const getSettings = zQuery({
  handler: async (ctx) => {
    const settings = await ctx.db.query('settings').collect();

    return settings[0];
  },
});

export const generateProfileImageUploadUrl = zMutation({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query('settings').first();

    if (settings?.profileImage) {
      const url = new URL(settings.profileImage);
      const storageId = url.searchParams.get('storageId') as Id<'_storage'>;
      if (storageId) {
        await ctx.storage.delete(storageId);
      }
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveProfileImage = zMutation({
  args: {
    storageId: zid('_storage'),
    settingsId: zid('settings').optional(),
  },
  handler: async (ctx, args) => {
    const { storageId, settingsId } = args;
    const imageUrl = `/api/storage?storageId=${storageId}`;

    if (settingsId) {
      await ctx.db.patch(settingsId, {
        profileImage: imageUrl,
      });
    }

    return imageUrl;
  },
});
