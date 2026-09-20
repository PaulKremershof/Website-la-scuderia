# La Scuderia Restaurant Website

Rebuilt website for La Scuderia Italian Restaurant in Frankfurt's Westend with comprehensive SEO improvements.

## 🎯 SEO Issues Fixed

### Critical (Sehr hoch)
- ✅ **Page Title**: Added proper `<title>` tags on both German and English pages
- ✅ **Meta Description**: Replaced placeholder "SITEDESCRIPTION" with proper descriptions
- ✅ **English Version**: Removed Lorem ipsum text, added proper English content, fixed opening hours

### High Priority (Hoch)
- ✅ **Main Heading (H1)**: Changed H1 to clearly state restaurant type and location
- ✅ **Structured Data**: Added Schema.org Restaurant markup with complete information
- ✅ **Language Assignment**: Added proper `lang` attributes and `hreflang` tags

### Medium Priority (Mittel)
- ✅ **Canonical URLs**: Added canonical links to all pages
- ✅ **Sitemap**: Created proper sitemap.xml with all pages
- ✅ **robots.txt**: Created robots.txt file with sitemap reference
- ✅ **Images**: Added alt attributes to all images, implemented srcset for responsive images, added native lazy loading

## 📁 Project Structure

```
lascuderia/
├── index.html              # German homepage
├── en/
│   └── index.html         # English homepage
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   └── main.js            # JavaScript functionality
├── images/
│   ├── logo.svg           # Restaurant logo
│   └── placeholder.txt    # Image requirements
├── sitemap.xml            # XML sitemap
├── robots.txt             # Robots file
└── README.md              # This file
```

## 🚀 Running Locally

### Option 1: Python HTTP Server
```bash
python3 -m http.server 8000
```
Then visit: http://localhost:8000

### Option 2: PHP Built-in Server
```bash
php -S localhost:8000
```

### Option 3: Node.js http-server
```bash
npx http-server -p 8000
```

### Option 4: Using Live Server (VS Code Extension)
Install "Live Server" extension and click "Go Live"

## 📋 SEO Improvements Summary

### Meta Tags
- Proper title tags on all pages
- Descriptive meta descriptions
- Open Graph tags for social media
- Twitter Card tags
- Canonical URLs
- Hreflang tags for multilingual support

### Structured Data
- Schema.org Restaurant markup including:
  - Name, description, cuisine type
  - Complete address and geo-coordinates
  - Phone, email, website
  - Opening hours
  - Price range
  - Reservation acceptance

### Accessibility
- All images have descriptive alt text
- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus indicators
- Responsive design

### Performance
- Responsive images with srcset
- Native lazy loading
- Optimized CSS
- Minimal JavaScript
- Mobile-first approach

## 🌐 Language Support

- **German** (default): `/` or `/index.html`
- **English**: `/en/` or `/en/index.html`

Both versions have:
- Proper language attributes
- Hreflang tags
- Translated content (no Lorem ipsum)
- Consistent opening hours

## 📸 Images Needed

Replace placeholder images with actual photos:
1. `logo.svg` - Restaurant logo (currently placeholder)
2. `hero-bg.jpg` - Hero section background
3. `restaurant-1.jpg` - Interior photo
4. `restaurant-2.jpg` - Garden area
5. `kitchen-1.jpg` - Food/kitchen photo
6. `wine-1.jpg` - Wine cellar
7. `la-scuderia-og.jpg` - Social media preview (1200x630px)

For each image, create responsive versions:
- `*-400.jpg` (400px width)
- `*-800.jpg` (800px width)
- `*-1200.jpg` (1200px width)

## 🎨 Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
--primary-color: #2c3e50;
--secondary-color: #8b0000;
--accent-gold: #d4af37;
```

### Content
- Edit `index.html` for German content
- Edit `en/index.html` for English content

### Contact Information
Update in both HTML files and structured data sections.

## 📱 Mobile Features

- Responsive design for all screen sizes
- Mobile quick action buttons (sticky footer)
- Touch-friendly navigation
- Optimized images for mobile

## ✅ Testing Checklist

- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Validate HTML: https://validator.w3.org/
- [ ] Test structured data: https://search.google.com/test/rich-results
- [ ] Check mobile-friendliness: https://search.google.com/test/mobile-friendly
- [ ] Test page speed: https://pagespeed.web.dev/
- [ ] Verify sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html

## 📞 Contact Information

**La Scuderia**  
Feuerbachstr. 23  
60325 Frankfurt am Main  
Germany

Tel: +49 69 72 54 80  
Email: info@la-scuderia.de  
Instagram: [@lascuderia_frankfurt](https://www.instagram.com/lascuderia_frankfurt/)

## 📄 License

This website rebuild is for La Scuderia Restaurant. All content and branding belong to La Scuderia.
