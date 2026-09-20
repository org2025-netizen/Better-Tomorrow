import { z } from 'zod';

export const updateSettingSchema = z.object({
  body: z.object({
    key: z.string().min(1),
    value: z.string().min(1),
  }),
});

export const bulkUpdateSettingsSchema = z.object({
  body: z.object({
    settings: z.array(z.object({
      key: z.string().min(1),
      value: z.string().min(1),
    })).min(1),
  }),
});
