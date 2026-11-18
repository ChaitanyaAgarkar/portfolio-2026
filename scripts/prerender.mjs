import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const SSR_DIR = path.resolve(process.cwd(), 'dist-ssr');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

const ROUTES = [
  '/',
  '/about',
  '/work',
  '/experience',
  '/skills',
  '/coding',
  '/contact',
  '/projects',
  '/projects/chatttt',
  '/projects/lingo',
  '/projects/docs',
  '/projects/flight-predictor',
  '/projects/editum-ide',
  '/projects/ecommerce-platform',
  '/404',
];

async function run() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Missing built client template at ${TEMPLATE_PATH}`);
  }

  const ssrEntry = fs
    .readdirSync(SSR_DIR)
    .find((file) => file.startsWith('entry-server') && /\.(m?js)$/.test(file));

  if (!ssrEntry) {
    throw new Error(`Missing SSR entry bundle in ${SSR_DIR}`);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const { renderRoute } = await import(pathToFileURL(path.join(SSR_DIR, ssrEntry)).href);

  for (const route of ROUTES) {
    const { html, head } = renderRoute(route);

    let outputHtml = template.replace(
      /<!--ssr-head-start-->[\s\S]*?<!--ssr-head-end-->/,
      `<!--ssr-head-start-->\n    ${head}\n    <!--ssr-head-end-->`,
    );
    outputHtml = outputHtml.replace('<!--ssr-outlet-->', html);

    let targetFile;
    if (route === '/') {
      targetFile = path.join(DIST_DIR, 'index.html');
    } else if (route === '/404') {
      targetFile = path.join(DIST_DIR, '404.html');
    } else {
      const routeDir = path.join(DIST_DIR, route.replace(/^\/+/, ''));
      fs.mkdirSync(routeDir, { recursive: true });
      targetFile = path.join(routeDir, 'index.html');
    }

    fs.writeFileSync(targetFile, outputHtml, 'utf8');
    console.log(`Prerendered ${route} -> ${path.relative(process.cwd(), targetFile)}`);
  }

  fs.rmSync(SSR_DIR, { recursive: true, force: true });
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
