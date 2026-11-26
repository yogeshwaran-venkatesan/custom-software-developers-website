/**
 * Post-build step for static hosting (Cloudflare Pages).
 * 1. Turns every prerendered `route/index.html` into `route.html`, so pages are served at `/route`
 *    (no trailing slash), matching the canonical URLs and the sitemap.
 * 2. Moves the prerendered /404 page to `404.html`, which the host returns for unknown URLs with a 404 status.
 */
import { existsSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist/csd-web/browser';
if (!existsSync(join(root, 'index.html'))) throw new Error(`No build found in ${root}`);

function flatten(dir) {
  for (const name of readdirSync(dir)) {
    const sub = join(dir, name);
    if (!statSync(sub).isDirectory()) continue;
    flatten(sub);
    const page = join(sub, 'index.html');
    if (existsSync(page)) {
      renameSync(page, `${sub}.html`);
      if (readdirSync(sub).length === 0) rmSync(sub, { recursive: true });
    }
  }
}
flatten(root);

if (existsSync(join(root, '404.html'))) console.log('postbuild: pages flattened, 404.html ready');
else throw new Error('postbuild: 404 page was not prerendered');

// Not needed on a static host.
for (const f of ['index.csr.html']) if (existsSync(join(root, f))) rmSync(join(root, f));
