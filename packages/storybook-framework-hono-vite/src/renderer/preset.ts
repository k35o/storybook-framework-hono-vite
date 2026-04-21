import { fileURLToPath } from 'node:url';

export async function previewAnnotations(input: string[] = []) {
  return [...input, fileURLToPath(new URL('./entry-preview.mjs', import.meta.url))];
}
