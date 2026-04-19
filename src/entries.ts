import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import type { RouteConfig } from './types';

export function getRoutesEntries(
  routes: RouteConfig[],
  srcDir: string,
  debug: boolean
): Record<string, string> {
  const entries: Record<string, string> = {};

  routes.forEach((route) => {
    const sourcePath = resolve(srcDir, route.source);

    if (!existsSync(sourcePath)) {
      console.error(
        `❌ Route source not found: ${route.source} for path ${route.path}`
      );
      return;
    }

    let entryName: string;
    if (route.path === '/') {
      entryName = 'index';
    } else {
      const cleanPath = route.path.replace(/^\//, '');
      entryName = `${cleanPath}/index`;
    }

    entries[entryName] = sourcePath;

    if (debug) {
      console.log(
        `🗺️  Route: ${route.path} -> ${route.source} (output: ${entryName}.html)`
      );
    }
  });

  return entries;
}

export function getHtmlEntries(
  srcDir: string,
  debug: boolean = false
): Record<string, string> {
  const entries: Record<string, string> = {};

  function scanDirectory(dir: string, basePath: string = '') {
    try {
      const items = readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = resolve(dir, item.name);
        const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

        if (item.isDirectory()) {
          if (item.name === 'elements') continue;
          scanDirectory(fullPath, relativePath);
        } else if (item.isFile() && item.name.endsWith('.html')) {
          let entryName: string;
          if (item.name === 'index.html') {
            entryName = basePath ? `${basePath}/index` : 'index';
          } else {
            const nameWithoutExt = item.name.replace('.html', '');
            entryName = basePath
              ? `${basePath}/${nameWithoutExt}/index`
              : `${nameWithoutExt}/index`;
          }
          entries[entryName] = fullPath;
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`⚠️  Could not read directory: ${dir}`);
      if (debug) console.error(`   ${msg}`);
    }
  }

  scanDirectory(srcDir);

  if (debug) {
    console.log(`📄 Auto-discovered routes:`);
    Object.keys(entries).forEach((key) => {
      const url = key === 'index' ? '/' : `/${key.replace('/index', '')}`;
      console.log(`   ${url} -> ${entries[key].replace(srcDir + '/', '')}`);
    });
  }

  return entries;
}
