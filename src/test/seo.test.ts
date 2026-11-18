import { describe, expect, it } from 'vitest';
import { SITE_CONFIG } from '@/data/profile';
import { buildAbsoluteUrl, getOgImageUrl } from '@/lib/seo/metadata';
import { getStructuredDataForPath } from '@/lib/seo/structuredData';

describe('SEO site origin configuration', () => {
  it('uses https://chaieeetanya.me without trailing slash as canonical site origin', () => {
    expect(SITE_CONFIG.siteUrl).toBe('https://chaieeetanya.me');
    expect(buildAbsoluteUrl('/')).toBe('https://chaieeetanya.me/');
    expect(buildAbsoluteUrl('/projects/chatttt')).toBe('https://chaieeetanya.me/projects/chatttt');
    expect(getOgImageUrl()).toBe('https://chaieeetanya.me/images/og-image.svg');
  });

  it('populates JSON-LD structured data schemas with https://chaieeetanya.me', () => {
    const schemas = getStructuredDataForPath('/');
    expect(schemas.length).toBeGreaterThanOrEqual(3);
    for (const schema of schemas) {
      expect(schema.url).toBe('https://chaieeetanya.me/');
    }
  });
});
