import type { Plugin, IndexHtmlTransformContext, UserConfig } from 'vite';
import { resolve } from 'path';
import { getHtmlEntries, getRoutesEntries } from './entries';
import { processElements } from './transform';
import type { HtmlElementsOptions } from './types';

export type { HtmlElementsOptions, RouteConfig } from './types';

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
        if (routes) console.log(`   Routes: ${routes.length} defined`);
      }

      const input = routes
        ? getRoutesEntries(routes, resolvedSrcDir, debug)
        : getHtmlEntries(resolvedSrcDir, debug);

      if (defaults) {
        return {
          root: srcDir,
          publicDir: '../public',
          base: basePath,
          build: {
            outDir: '../dist',
            emptyOutDir: true,
            rollupOptions: { input },
          },
        };
      }

      return {
        base: basePath,
        build: { rollupOptions: { input } },
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
