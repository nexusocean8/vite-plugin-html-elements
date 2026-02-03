# 💧 vite-plugin-html-elements

> Modular HTML without the JavaScript

A lightweight Vite plugin for composing reusable HTML elements in static sites. Keep your HTML DRY and maintainable without adding runtime JavaScript.

## ✨ Features

- **Zero JavaScript** - Pure static HTML output
- **Hot Reload** - Instant updates during development
- **Intuitive Syntax** - Natural self-closing `<element />` tags with props and slots
- **Route Manifests** - Explicit control over URL structure
- **Deployment Ready** - Built-in base path support for subdirectory hosting
- **TypeScript** - Full type safety
- **Flexible** - Opinionated defaults or complete control
- **Tiny** - Minimal footprint, maximum impact

## 📦 Installation

```bash
npm install -D vite-plugin-html-elements
```

## 🚀 Quick Start

### 1. Add to your Vite config

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { htmlElements } from 'vite-plugin-html-elements';

export default defineConfig({
  plugins: [htmlElements()],
});
```

### 2. Create your project structure

```
project/
├── src/
│   ├── elements/
│   │   ├── header.html
│   │   └── footer.html
│   └── index.html
└── vite.config.js
```

### 3. Create reusable elements

**src/elements/header.html:**

```html
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</header>
```

### 4. Use elements in your pages

**src/index.html:**

```html
<!doctype html>
<html lang="en">
  <head>
    <title>My Site</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <element src="header.html" />

    <main>
      <h1>Welcome to my site!</h1>
    </main>

    <element src="footer.html" />
  </body>
</html>
```

### 5. Build

```bash
npm run dev    # Development with hot reload
npm run build  # Production build
```

The output is pure static HTML with all elements inlined - no `<element>` tags remain.

## 📝 Basic Syntax

### Shorthand (Recommended)

```html
<element src="header.html" />
```

Automatically resolves to `elements/header.html`

### Explicit Paths

```html
<element src="elements/nav/mobile.html" />
```

### With Slots

```html
<element src="card.html">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</element>
```

**src/elements/card.html:**

```html
<div class="card">
  <slot />
</div>
```

### With Props

```html
<element src="hero.html" title="Welcome" subtitle="Build fast static sites">
  <button>Get Started</button>
</element>
```

**src/elements/hero.html:**

```html
<section class="hero">
  <h1>{{title}}</h1>
  <p>{{subtitle}}</p>
  <slot />
</section>
```

## ⚙️ Configuration

### Basic Options

```typescript
interface HtmlElementsOptions {
  debug?: boolean; // Enable verbose logging (default: false)
  basePath?: string; // Base path for deployment (default: '/')
  srcDir?: string; // Source directory for HTML files (default: 'src')
  defaults?: boolean; // Use opinionated structure (default: true)
  routes?: RouteConfig[]; // Route manifest (optional)
}
```

### Debug Mode

Enable verbose logging to see which elements are being included:

```javascript
htmlElements({ debug: true });
```

Output:

```
💧 Element included: elements/header.html
💧 Element included: elements/footer.html (with slot)
🗺️  Route: /blog -> blog.html (output: blog/index.html)
```

### Base Path

Deploy to a subdirectory (e.g., GitHub Pages):

```javascript
htmlElements({
  basePath: '/my-site',
});
```

All asset paths will be automatically prefixed with `/my-site`.

### Custom Source Directory

```javascript
htmlElements({
  srcDir: 'pages', // Look for HTML files in src/pages/
});
```

### Non-Opinionated Mode

Take full control over your Vite configuration:

```javascript
export default defineConfig({
  root: './',
  publicDir: 'static',
  build: { outDir: 'build' },
  plugins: [
    htmlElements({
      defaults: false, // Disable opinionated defaults
      srcDir: 'pages',
    }),
  ],
});
```

## 🗺️ Route Manifests

Define explicit URL structures with route manifests:

```javascript
htmlElements({
  basePath: '/my-site',
  routes: [
    { path: '/', source: 'index.html' },
    { path: '/blog', source: 'blog.html' },
    { path: '/blog/getting-started', source: 'blog/getting-started.html' },
    { path: '/blog/advanced-tips', source: 'blog/advanced-tips.html' },
  ],
});
```

**Output structure:**

```
dist/
├── index.html
└── blog/
    ├── index.html
    ├── getting-started/
    │   └── index.html
    └── advanced-tips/
        └── index.html
```

**Benefits:**

- Clean URLs (`/blog/getting-started` instead of `/blog-getting-started.html`)
- Explicit path control
- Perfect for blogs, documentation, and content sites
- Works seamlessly with static hosting (Netlify, Vercel, GitHub Pages)

## 📁 Project Structure

### Default Structure (Opinionated)

When using `defaults: true` (the default):

```
project/
├── public/           # Static assets
│   └── favicon.ico
├── src/              # Source files (becomes root)
│   ├── elements/     # Reusable elements
│   │   ├── header.html
│   │   └── footer.html
│   ├── index.html
│   └── about.html
├── dist/             # Build output
└── vite.config.js
```

### Custom Structure

When using `defaults: false`:

```
project/
├── pages/            # You control everything
│   ├── components/
│   ├── index.html
│   └── about.html
├── build/
└── vite.config.js
```

### Organized Structure

```
project/
├── src/
│   ├── elements/
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── nav/
│   │       ├── mobile.html
│   │       └── desktop.html
│   ├── blog/
│   │   ├── index.html
│   │   └── post-1.html
│   ├── index.html
│   └── styles.css
└── vite.config.js
```

## 🎯 Use Cases

Perfect for:

- 📄 Landing pages
- 📝 Documentation sites
- 📰 Blogs with clean URLs
- 🎨 Marketing sites
- 🏢 Company websites
- 🚀 Any multi-page static site
- 📱 Progressive web apps (start with HTML)

Ideal when you want:

- Reusable HTML components with props and slots
- No build complexity
- Clean URL structures
- Progressive enhancement
- Fast, accessible sites
- SEO-friendly output
- Easy deployment to static hosts

## 💡 Philosophy

HTML and CSS are powerful. JavaScript is optional.

This plugin embraces the web platform by making static HTML modular and maintainable without introducing runtime dependencies or complex tooling.

Start with solid HTML, add CSS for style, and layer JavaScript only where it adds value.

## 📚 Examples

### Shared Head Element with Props

**src/elements/head.html:**

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/styles.css" />
  <title>{{pageTitle}}</title>
</head>
```

**src/index.html:**

```html
<!doctype html>
<html lang="en">
  <element src="head.html" pageTitle="Home | My Site" />
  <body>
    <!-- content -->
  </body>
</html>
```

### Feature Cards with Slots

**src/elements/feature-card.html:**

```html
<div class="feature-card">
  <div class="icon">{{icon}}</div>
  <h3>{{title}}</h3>
  <slot />
</div>
```

**Usage:**

```html
<element src="feature-card.html" icon="⚡" title="Fast Builds">
  <p>Lightning-fast hot reloading with Vite.</p>
</element>

<element src="feature-card.html" icon="🎨" title="Zero JS">
  <p>Pure static HTML output.</p>
</element>
```

### Blog with Route Manifest

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    htmlElements({
      routes: [
        { path: '/', source: 'index.html' },
        { path: '/blog', source: 'blog/index.html' },
        { path: '/blog/post-1', source: 'blog/post-1.html' },
        { path: '/blog/post-2', source: 'blog/post-2.html' },
      ],
    }),
  ],
});
```

### Component Library

```
elements/
├── buttons/
│   ├── primary.html
│   └── secondary.html
├── cards/
│   ├── product.html
│   └── blog.html
└── layouts/
    ├── header.html
    └── footer.html
```

```html
<element src="buttons/primary.html">Buy Now</element>
<element src="cards/product.html" title="Product" price="$99">
  <p>Product description here</p>
</element>
```

## ❓ FAQ

**Can I use props and slots together?**  
Yes! Props replace `{{propName}}` placeholders, while slots inject content into `<slot />` tags.

**Does it work with Tailwind CSS?**  
Yes! Fully compatible with Tailwind and other CSS frameworks.

**Can I deploy to GitHub Pages?**  
Yes! Use `basePath: '/repo-name'` to match your repository name.

**What's the difference between `defaults: true` and `defaults: false`?**  
`defaults: true` applies opinionated structure (`src/` as root, `public/`, `dist/`). Set to `false` to fully control your Vite config.

**Can elements include JavaScript?**  
Yes! Elements are just HTML. Include `<script>` tags as needed.

**What about dynamic content?**  
This plugin is for static composition at build time. Layer on JavaScript for dynamic behavior.

**Do I need Node.js at runtime?**  
No! The plugin runs at build time. Output is pure static HTML that works anywhere.

**How do route manifests work with static hosting?**  
Routes like `/blog/post-1` output to `blog/post-1/index.html`, which static hosts serve automatically at the clean URL.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR on Codeberg.

## 📄 License

MIT

## 🔗 Links

- [Documentation](https://htmlelements.dev)
- [Codeberg](https://codeberg.org/nexusocean/vite-plugin-html-elements)
- [npm](https://www.npmjs.com/package/vite-plugin-html-elements)
- [Issues](https://codeberg.org/nexusocean/vite-plugin-html-elements/issues)
