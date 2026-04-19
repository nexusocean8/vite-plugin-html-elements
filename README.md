## Changes in 0.2.0

Add the following to the **Features** list:

- **Data Binding** - Render elements from local JSON data with `data-src`

---

Add this new section after the **With Props** section:

### With Data (JSON)

Render an element once per item in a JSON array using `data-src`:

```html
<element src="product-card.html" data-src="./src/data/products.json" />
```

Each object in the array is passed as props to the element template:

**src/data/products.json:**

```json
[
  {
    "name": "Handmade Ceramic Vase",
    "price": "$120",
    "image": "/images/vase.jpg",
    "paymentLink": "https://buy.stripe.com/xxx",
    "sold": ""
  },
  {
    "name": "Original Oil Painting",
    "price": "$450",
    "image": "/images/painting.jpg",
    "paymentLink": "https://buy.stripe.com/yyy",
    "sold": "true"
  }
]
```

**src/elements/product-card.html:**

```html
<div class="product-card">
  <img src="{{image}}" alt="{{name}}" />
  <h2>{{name}}</h2>
  <p>{{price}}</p>
  <a href="{{paymentLink}}">Buy Now</a>
</div>
```

Props and slots work alongside `data-src`. Any props defined directly on the element are merged with each data item, with data item values taking precedence.

---

Add this to the **Configuration** options interface:

```typescript
interface HtmlElementsOptions {
  debug?: boolean; // Enable verbose logging (default: false)
  basePath?: string; // Base path for deployment (default: '/')
  srcDir?: string; // Source directory for HTML files (default: 'src')
  defaults?: boolean; // Use opinionated structure (default: true)
  routes?: RouteConfig[]; // Route manifest (optional)
}
```

---

Add this to the **FAQ** section:

**Can I use `data-src` with props and slots?**
Yes. Props defined on the element are merged with each data item. Slots also work as normal. Data item values take precedence over static props of the same name.

**What format does the JSON file need to be?**
A top-level array of objects. Each object's keys map directly to `{{propName}}` placeholders in your element template.

**Can I use `data-src` for non-product use cases?**
Yes — any repeated element like blog post listings, team members, testimonials, or navigation items works the same way.

---

Update the **Use Cases** section to add:

- 🛍️ Product catalogs from JSON data
