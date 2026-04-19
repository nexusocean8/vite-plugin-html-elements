import { parseAttributes, resolveElementPath, renderElement } from './elements';
import { loadJsonData } from './data';

export function processElements(
  html: string,
  debug: boolean,
  srcDir: string
): string {
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
      const props = parseAttributes(attributes);
      const fullPath = resolveElementPath(filepath, srcDir);

      // Handle data-src iteration
      const dataSrc = props['data-src'];
      const cleanProps = Object.fromEntries(
        Object.entries(props).filter(([k]) => k !== 'data-src')
      );

      if (dataSrc) {
        const items = loadJsonData(dataSrc, debug);
        if (!items)
          return `<!-- Element error: Could not load data ${dataSrc} -->`;

        return items
          .map((item) =>
            renderElement(
              fullPath,
              filepath,
              slotContent,
              { ...cleanProps, ...item },
              debug
            )
          )
          .join('\n');
      }

      return renderElement(fullPath, filepath, slotContent, cleanProps, debug);
    }
  );
}
