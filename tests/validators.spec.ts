import { describe, expect, it } from 'vitest';

import { SCHEMA_REGISTRY, VALIDATORS } from '../src/validators';

const sampleFilePayload = {
  id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  name: 'report.pdf',
  mimeType: 'application/pdf',
  size: 1024,
  url: 'https://files.example.com/report.pdf',
  uploadedAt: '2024-01-01T00:00:00.000Z',
  uploadedBy: 'ba485253-36b9-46e7-a020-03a0a852ef17',
} as const;

describe('schema registry', () => {
  it('exposes a validator for every schema key', () => {
    expect(Object.keys(VALIDATORS).sort()).toEqual(Object.keys(SCHEMA_REGISTRY).sort());
  });

  it('enforces ISO timestamps and branded ids on file uploads', () => {
    const parsed = VALIDATORS.fileUpload.safeParse(sampleFilePayload);
    expect(parsed.success).toBe(true);

    const invalid = VALIDATORS.fileUpload.safeParse({
      ...sampleFilePayload,
      uploadedAt: '2024-01-01',
      id: 'not-a-uuid',
    });
    expect(invalid.success).toBe(false);
  });

  it('rejects non-ISO metadata timestamps', () => {
    const invalid = SCHEMA_REGISTRY.errorResponse.safeParse({
      success: false,
      status: 400,
      error: { code: 'E_BAD_REQUEST', message: 'bad' },
      timestamp: '2024-01-01',
    });
    expect(invalid.success).toBe(false);
  });
});
