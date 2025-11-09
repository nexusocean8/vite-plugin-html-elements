import type { Plugin, IndexHtmlTransformContext } from 'vite';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export interface HtmlElementsOptions {
  /**
   * Enable debug logging
   * @default false
   */
  debug: boolean;
}

export function htmlElements(
  options: HtmlElementsOptions = { debug: false }
): Plugin {
  const { debug } = options;

  return {
    name: 'vite-plugin-html-elements',

    config() {
      const srcDir = 'src';
      const resolvedSrcDir = resolve(process.cwd(), srcDir);

      return {
        root: srcDir,
        publicDir: '../public',
        build: {
          outDir: '../dist',
          emptyOutDir: true,
          rollupOptions: {
            input: getHtmlEntries(resolvedSrcDir),
          },
        },
      };
    },

    transformIndexHtml: {
      order: 'pre',
      handler(html: string, _ctx: IndexHtmlTransformContext) {
        return processElements(html, debug);
      },
    },
  } as Plugin;
}

function processElements(html: string, debug: boolean): string {
  const pattern = /<element\s+src=["']([^"']+)["']([^>]*?)(?:\/>|>([\s\S]*?)<\/element>)/g;

  return html.replace(pattern, (_match, filepath: string, attributes: string, slotContent: string = '') => {
    let resolvedPath = filepath;
    if (!filepath.includes('elements/') && filepath.includes('.html')) {
      resolvedPath = `elements/${filepath}`;
    }

    const srcDir = resolve(process.cwd(), 'src');
    const fullPath = resolve(srcDir, resolvedPath);

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
      content = content.replace(/\{\{(\w+)\}\}/g, (_, key) => props[key] || '');

      // Replace slot
      if (slotContent.trim()) {
        content = content.replace(/<slot\s*\/>/g, slotContent);
      } else {
        content = content.replace(/<slot\s*\/>/g, '');
      }

      if (debug) {
        console.log(`💧 Element included: ${resolvedPath}${slotContent.trim() ? ' (with slot)' : ''}${Object.keys(props).length ? ` (props: ${Object.keys(props).join(', ')})` : ''}`);
      }

      return content;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error reading element: ${filepath}`);
      if (debug) {
        console.error(`   ${errorMessage}`);
      }
      return `<!-- Element error: Could not load ${filepath} -->`;
    }
  });
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

export function getHtmlEntries(srcDir: string): Record<string, string> {
  try {
    const htmlFiles = readdirSync(srcDir).filter((file) =>
      file.endsWith('.html')
    );

    const entries: Record<string, string> = {};
    htmlFiles.forEach((file) => {
      const name = file.replace('.html', '');
      entries[name] = resolve(srcDir, file);
    });

    return entries;
  } catch (error) {
    console.warn(`⚠️  Could not read directory: ${srcDir}`);
    return {};
  }
}
