import type { Plugin, IndexHtmlTransformContext, UserConfig } from 'vite';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export interface RouteConfig {
  /**
   * URL path for the route (e.g., '/', '/blog', '/blog/today-is-nice')
   */
  path: string;
  /**
   * Source HTML file relative to srcDir
   */
  source: string;
}

export interface HtmlElementsOptions {
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Base path for deployment (e.g., '/my-site' for GitHub Pages)
   * @default '/'
   */
  basePath?: string;

  /**
   * Route manifest for explicit path configuration
   * If provided, automatic HTML discovery is disabled
   */
  routes?: RouteConfig[];

  /**
   * Source directory for HTML files (relative to Vite's root)
   * @default 'src'
   */
  srcDir?: string;

  /**
   * Apply opinionated project structure conventions
   * When true: sets root to 'src', publicDir to '../public', outDir to '../dist' (default)
   * When false: respects user's Vite config completely
   * @default true
   */
  defaults?: boolean;
}

export function htmlElements(options: HtmlElementsOptions = {}): Plugin {
  const {
    debug = false,
    basePath = '/',
    routes,
    srcDir = 'src',
    defaults = true,
  } = options;

  return {
    name: 'vite-plugin-html-elements',

    config(userConfig: UserConfig) {
      const root = defaults ? srcDir : userConfig.root || process.cwd();
      const resolvedSrcDir = defaults
        ? resolve(process.cwd(), srcDir)
        : resolve(root, srcDir);

      if (debug) {
        console.log(`🔧 html-elements config:`);
        console.log(`   Defaults mode: ${defaults}`);
        console.log(`   Root: ${root}`);
        console.log(`   Source dir: ${resolvedSrcDir}`);
        console.log(`   Base path: ${basePath}`);
        if (routes) {
          console.log(`   Routes: ${routes.length} defined`);
        }
      }

      if (defaults) {
        return {
          root: srcDir,
          publicDir: '../public',
          base: basePath,
          build: {
            outDir: '../dist',
            emptyOutDir: true,
            rollupOptions: {
              input: routes
                ? getRoutesEntries(routes, resolvedSrcDir, debug)
                : getHtmlEntries(resolvedSrcDir, debug),
            },
          },
        };
      }

      return {
        base: basePath,
        build: {
          rollupOptions: {
            input: routes
              ? getRoutesEntries(routes, resolvedSrcDir, debug)
              : getHtmlEntries(resolvedSrcDir, debug),
          },
        },
      };
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html: string, _ctx: IndexHtmlTransformContext) {
        return processElements(html, debug, srcDir);
      },
    },
  } as Plugin;
}

function getRoutesEntries(
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

    // Convert route path to entry name
    // '/' -> 'index'
    // '/blog' -> 'blog/index'
    // '/blog/today-is-nice' -> 'blog/today-is-nice/index'
    let entryName: string;
    if (route.path === '/') {
      entryName = 'index';
    } else {
      // Remove leading slash and add /index for directory structure
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

function processElements(html: string, debug: boolean, srcDir: string): string {
  const pattern =
    /<element\s+src=["']([^"']+)["']([^>]*?)(?:\/>|>([\s\S]*?)<\/element>)/g;

  return html.replace(
    pattern,
    (
      _match,
      filepath: string,
      attributes: string,
      slotContent: string = ''
    ) => {
      let resolvedPath = filepath;
      if (!filepath.includes('elements/') && filepath.includes('.html')) {
        resolvedPath = `elements/${filepath}`;
      }

      const resolvedSrcDir = resolve(process.cwd(), srcDir);
      const fullPath = resolve(resolvedSrcDir, resolvedPath);

      if (!existsSync(fullPath)) {
        console.error(`❌ Element not found: ${filepath}`);
        if (debug) {
          console.error(`   Tried path: ${fullPath}`);
        }
        return `<!-- Element error: Could not load ${filepath} -->`;
      }

      try {
        let content = readFileSync(fullPath, 'utf-8');

        // Parse props from attributes
        const props = parseAttributes(attributes);

        // Replace props: {{propName}}
        content = content.replace(
          /\{\{(\w+)\}\}/g,
          (_, key: string) => props[key] || ''
        );

        // Replace slot
        if (slotContent.trim()) {
          content = content.replace(/<slot\s*\/>/g, slotContent);
        } else {
          content = content.replace(/<slot\s*\/>/g, '');
        }

        if (debug) {
          console.log(
            `💧 Element included: ${resolvedPath}${slotContent.trim() ? ' (with slot)' : ''}${Object.keys(props).length ? ` (props: ${Object.keys(props).join(', ')})` : ''}`
          );
        }

        return content;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error reading element: ${filepath}`);
        if (debug) {
          console.error(`   ${errorMessage}`);
        }
        return `<!-- Element error: Could not load ${filepath} -->`;
      }
    }
  );
}

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrPattern = /(\w+)=["']([^"']*)["']/g;
  let match;
  while ((match = attrPattern.exec(attrString)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
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
          // Skip elements directory
          if (item.name === 'elements') {
            continue;
          }
          // Recursively scan subdirectories
          scanDirectory(fullPath, relativePath);
        } else if (item.isFile() && item.name.endsWith('.html')) {
          // Generate entry name from file path
          let entryName: string;
          if (item.name === 'index.html') {
            // index.html in root -> 'index'
            // index.html in blog/ -> 'blog/index'
            entryName = basePath ? `${basePath}/index` : 'index';
          } else {
            // about.html -> 'about/index'
            // blog/post.html -> 'blog/post/index'
            const nameWithoutExt = item.name.replace('.html', '');
            entryName = basePath
              ? `${basePath}/${nameWithoutExt}/index`
              : `${nameWithoutExt}/index`;
          }

          entries[entryName] = fullPath;
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      console.warn(`⚠️  Could not read directory: ${dir}`);
      if (debug) {
        console.error(`   ${errorMessage}`);
      }
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
