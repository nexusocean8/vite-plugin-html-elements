import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, extname } from 'path';

export function loadJsonData(
  dataSrc: string,
  debug: boolean
): Record<string, string>[] | null {
  const fullPath = resolve(process.cwd(), dataSrc);

  if (!existsSync(fullPath)) {
    console.error(`❌ Data source not found: ${dataSrc}`);
    if (debug) console.error(`   Tried path: ${fullPath}`);
    return null;
  }

  // Directory of JSON files
  if (statSync(fullPath).isDirectory()) {
    const files = readdirSync(fullPath).filter((f) => extname(f) === '.json');

    if (debug)
      console.log(`📂 Loading directory: ${dataSrc} (${files.length} files)`);

    const items: Record<string, string>[] = [];

    for (const file of files) {
      const filePath = resolve(fullPath, file);
      const item = parseSingleJson(filePath, file, debug);
      if (item) items.push(item);
    }

    return items;
  }

  // Single JSON file
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

function parseSingleJson(
  filePath: string,
  fileName: string,
  debug: boolean
): Record<string, string> | null {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      console.error(`❌ Product file must be a JSON object: ${fileName}`);
      return null;
    }

    if (debug) console.log(`📦 Loaded product: ${fileName}`);

    return parsed as Record<string, string>;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error reading product file: ${fileName}`);
    if (debug) console.error(`   ${msg}`);
    return null;
  }
}
