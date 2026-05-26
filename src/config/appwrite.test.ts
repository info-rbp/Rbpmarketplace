import { describe, expect, it } from 'vitest';
import { appwriteConfig, hasAppwriteDataModelConfig, isAppwriteConfigured } from './appwrite';

describe('appwriteConfig scaffold', () => {
  it('exposes runtime config fields', () => {
    expect(appwriteConfig).toBeTypeOf('object');
  });

  it('defaults to an unconfigured state without frontend env values', () => {
    expect(isAppwriteConfigured).toBe(false);
    expect(hasAppwriteDataModelConfig).toBe(false);
  });
});
