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
   * @default true
   */
  defaults?: boolean;
}
