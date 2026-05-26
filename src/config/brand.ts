export interface BrandConfig {
  brandName: string;
  brandInitials: string;
  productName: string;
  productLabel: string;
  productTagline: string;
  productDescription: string;
  supportEmail: string;
}

function readEnv(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const brandConfig: BrandConfig = {
  brandName: readEnv(import.meta.env.VITE_BRAND_NAME, 'RBP Marketplace'),
  brandInitials: readEnv(import.meta.env.VITE_BRAND_INITIALS, 'R'),
  productName: readEnv(import.meta.env.VITE_PRODUCT_NAME, 'Business-In-A-Box'),
  productLabel: readEnv(
    import.meta.env.VITE_PRODUCT_LABEL,
    'Business-In-A-Box opportunities',
  ),
  productTagline: readEnv(
    import.meta.env.VITE_PRODUCT_TAGLINE,
    'Ready-to-launch businesses, packaged to be sold, built, or partnered on.',
  ),
  productDescription: readEnv(
    import.meta.env.VITE_PRODUCT_DESCRIPTION,
    'Explore business opportunities across compliance, property, insurance, digital services, and business growth categories.',
  ),
  supportEmail: readEnv(import.meta.env.VITE_SUPPORT_EMAIL, 'hello@example.com'),
};
