import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrPattern = /(\w[\w-]*)=["']([^"']*)["']/g;
  let match;
  while ((match = attrPattern.exec(attrString)) !== null) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

export function resolveElementPath(filepath: string, srcDir: string): string {
  const resolvedSrcDir = resolve(process.cwd(), srcDir);
  let resolvedPath = filepath;
  if (!filepath.includes('elements/') && filepath.includes('.html')) {
    resolvedPath = `elements/${filepath}`;
  }
  return resolve(resolvedSrcDir, resolvedPath);
}

export function renderElement(
  fullPath: string,
  filepath: string,
  slotContent: string,
  props: Record<string, string>,
  debug: boolean
): string {
  if (!existsSync(fullPath)) {
    console.error(`❌ Element not found: ${filepath}`);
    if (debug) console.error(`   Tried path: ${fullPath}`);
    return `<!-- Element error: Could not load ${filepath} -->`;
  }

  try {
    let content = readFileSync(fullPath, 'utf-8');

    content = content.replace(
      /\{\{(\w+)\}\}/g,
      (_, key: string) => props[key] ?? ''
    );

    content = slotContent.trim()
      ? content.replace(/<slot\s*\/>/g, slotContent)
      : content.replace(/<slot\s*\/>/g, '');

    if (debug) {
      console.log(
        `💧 Element included: ${filepath}` +
          (slotContent.trim() ? ' (with slot)' : '') +
          (Object.keys(props).length
            ? ` (props: ${Object.keys(props).join(', ')})`
            : '')
      );
    }

    return content;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error reading element: ${filepath}`);
    if (debug) console.error(`   ${msg}`);
    return `<!-- Element error: Could not load ${filepath} -->`;
  }
}
