import { describe, expect, it } from 'vitest';
import { brandConfig } from './brand';

describe('brandConfig', () => {
  it('exposes stable fallback branding values', () => {
    expect(brandConfig.brandName).toBeTruthy();
    expect(brandConfig.brandInitials).toBeTruthy();
    expect(brandConfig.productName).toBeTruthy();
    expect(brandConfig.productDescription).toBeTruthy();
  });
});
