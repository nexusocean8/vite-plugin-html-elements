import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export function loadJsonData(
  dataSrc: string,
  debug: boolean
): Record<string, string>[] | null {
  const fullPath = resolve(process.cwd(), dataSrc);

  if (!existsSync(fullPath)) {
    console.error(`❌ Data file not found: ${dataSrc}`);
    if (debug) console.error(`   Tried path: ${fullPath}`);
    return null;
  }

  try {
    const raw = readFileSync(fullPath, 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      console.error(`❌ Data file must export a JSON array: ${dataSrc}`);
      return null;
    }

    const items = parsed.filter(
      (item): item is Record<string, string> =>
        typeof item === 'object' && item !== null && !Array.isArray(item)
    );

    if (debug)
      console.log(`📦 Loaded data: ${dataSrc} (${items.length} items)`);

    return items;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error reading data file: ${dataSrc}`);
    if (debug) console.error(`   ${msg}`);
    return null;
  }
}
