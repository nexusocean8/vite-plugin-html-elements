# 💧 vite-plugin-html-elements

> Modular HTML without the JavaScript

A lightweight Vite plugin for composing reusable HTML elements in static sites. Keep your HTML DRY and maintainable without adding runtime JavaScript.

## ✨ Features

- **Zero JavaScript** - Pure static HTML output
- **Hot Reload** - Instant updates during development
- **Intuitive Syntax** - Natural self-closing `<element />` tags
- **Shorthand Support** - `<element src="header.html" />`
- **TypeScript** - Full type safety
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

## 📝 Syntax

### Shorthand (Recommended)

```html
<element src="header.html" />
```

Automatically resolves to `elements/header.html`

### Explicit Paths

```html
<element src="elements/nav/mobile.html" />
```

## ⚙️ Configuration

### Debug Mode

Enable verbose logging to see which elements are being included:

```javascript
htmlElements({ debug: true });
```

Output:

```
💧 Element included: elements/header.html
💧 Element included: elements/footer.html
```

## 📁 Project Structure

Organize your project however you prefer. Here are some common patterns:

### Simple Structure

```
project/
├── src/
│   ├── elements/
│   │   ├── header.html
│   │   └── footer.html
│   ├── index.html
│   └── about.html
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
│   ├── index.html
│   ├── about.html
│   └── styles.css
├── public/
│   └── favicon.ico
└── vite.config.js
```

## 🎯 Use Cases

Perfect for:

- 📄 Landing pages
- 📝 Documentation sites
- 📰 Blogs
- 🎨 Marketing sites
- 🏢 Company websites
- 🚀 Any multi-page static site

Ideal when you want:

- Reusable HTML components
- No build complexity
- Progressive enhancement
- Fast, accessible sites
- SEO-friendly output

## 💡 Philosophy

HTML and CSS are powerful. JavaScript is optional.

This plugin embraces the web platform by making static HTML modular and maintainable without introducing runtime dependencies or complex tooling.

Start with solid HTML, add CSS for style, and layer JavaScript only where it adds value.

## 📚 Examples

### Shared Head Element

**src/elements/head.html:**

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="icon" href="/favicon.ico" />
</head>
```

**src/index.html:**

```html
<!doctype html>
<html lang="en">
  <element src="head.html" />
  <body>
    <!-- content -->
  </body>
</html>
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
<element src="buttons/primary.html" /> <element src="cards/product.html" />
```

## ❓ FAQ

**Can I use relative paths?**  
Yes! Paths are resolved relative to the HTML file containing the `<element />` tag.

**Does it work with other Vite plugins?**  
Yes! Fully compatible with Tailwind CSS and other Vite plugins.

**Can elements include JavaScript?**  
Elements are just HTML. You can include `<script>` tags in your elements if needed.

**What about dynamic content?**  
This plugin is for static composition at build time. For dynamic content, layer on JavaScript after your HTML is built.

**Do I need Node.js at runtime?**  
No! The plugin runs at build time. The output is pure static HTML that works anywhere.

## 🤝 Contributing

Contributions welcome! Please open an issue or PR on Codeberg.

## 📄 License

MIT

## 🔗 Links

- [Documentation](https://htmlelements.dev)
- [Codeberg](https://codeberg.org/nexusocean/vite-plugin-html-elements)
- [npm](https://www.npmjs.com/package/vite-plugin-html-elements)
- [Issues](https://codeberg.org/nexusocean/vite-plugin-html-elements/issues)
