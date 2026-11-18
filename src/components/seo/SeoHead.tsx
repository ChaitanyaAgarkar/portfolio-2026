import { useEffect } from 'react';
import { buildAbsoluteUrl, getOgImageUrl, getRouteMetadata } from '@/lib/seo/metadata';
import { getStructuredDataForPath } from '@/lib/seo/structuredData';

interface SeoHeadProps {
  pathname: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function SeoHead({ pathname }: SeoHeadProps) {
  const meta = getRouteMetadata(pathname);
  const canonicalUrl = buildAbsoluteUrl(meta.canonicalPath);
  const ogImage = getOgImageUrl();
  const schemas = getStructuredDataForPath(meta.canonicalPath, meta.breadcrumbs);

  useEffect(() => {
    document.title = meta.title;
    upsertMeta('name', 'description', meta.description);
    upsertCanonical(canonicalUrl);

    upsertMeta('property', 'og:site_name', '<Chaieeetanya/> — Chaitanya Agarkar');
    upsertMeta('property', 'og:type', meta.ogType ?? 'website');
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImage);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', ogImage);

    document.head
      .querySelectorAll('script[data-portfolio-ld="true"]')
      .forEach((node) => node.remove());

    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-portfolio-ld', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [meta.title, meta.description, meta.ogType, canonicalUrl, ogImage, schemas]);

  return null;
}
