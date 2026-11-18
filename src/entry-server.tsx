import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { App } from '@/app/App';
import { buildAbsoluteUrl, getOgImageUrl, getRouteMetadata } from '@/lib/seo/metadata';
import { getStructuredDataForPath } from '@/lib/seo/structuredData';

function escapeAttr(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderRoute(url: string): { html: string; head: string } {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  const meta = getRouteMetadata(url);
  const canonical = buildAbsoluteUrl(meta.canonicalPath);
  const ogImage = getOgImageUrl();
  const schemas = getStructuredDataForPath(meta.canonicalPath, meta.breadcrumbs);

  const schemaTags = schemas
    .map(
      (schema) =>
        `<script type="application/ld+json" data-portfolio-ld="true">${JSON.stringify(schema)}</script>`,
    )
    .join('\n    ');

  const head = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    `<meta property="og:site_name" content="${escapeAttr('<Chaieeetanya/> — Chaitanya Agarkar')}" />`,
    `<meta property="og:type" content="${escapeAttr(meta.ogType ?? 'website')}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`,
    schemaTags,
  ].join('\n    ');

  return { html, head };
}

