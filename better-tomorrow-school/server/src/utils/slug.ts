export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const ensureUniqueSlug = async (
  slug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  let uniqueSlug = slug;
  let counter = 1;
  while (await checkExists(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
};
