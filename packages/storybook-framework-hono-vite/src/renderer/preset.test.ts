import { describe, expect, it } from 'vitest';

describe('previewAnnotations', () => {
  it('appends the bundled preview entry to the existing annotations', async () => {
    const { previewAnnotations } = await import('./preset.js');

    const result = await previewAnnotations(['/tmp/custom-preview.mjs']);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe('/tmp/custom-preview.mjs');
    expect(result[1]).toMatch(/src\/renderer\/entry-preview\.mjs$/);
  });
});
