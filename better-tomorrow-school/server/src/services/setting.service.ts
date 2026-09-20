import prisma from '../config/database';

export const getAllSettings = async () => {
  const settings = await prisma.schoolSetting.findMany();
  return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as Record<string, string>);
};

export const getSetting = async (key: string) => {
  const setting = await prisma.schoolSetting.findUnique({ where: { key } });
  return setting?.value;
};

export const updateSetting = async (key: string, value: string) => {
  return prisma.schoolSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
};

export const bulkUpdateSettings = async (settings: { key: string; value: string }[]) => {
  const results = await Promise.all(
    settings.map(s => prisma.schoolSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: { key: s.key, value: s.value } }))
  );
  return results;
};

export const deleteSetting = async (key: string) => {
  await prisma.schoolSetting.delete({ where: { key } });
  return { message: 'Setting deleted successfully' };
};
