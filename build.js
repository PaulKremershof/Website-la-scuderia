#!/usr/bin/env node

/**
 * La Scuderia - Build Script
 * Reads content.json and updates index.html with the latest content
 */

const fs = require('fs');
const path = require('path');

// Paths
const CONTENT_JSON = path.join(__dirname, 'data', 'content.json');
const INDEX_HTML = path.join(__dirname, 'index.html');
const BACKUP_DIR = path.join(__dirname, 'data', 'backups', 'html');

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🔨 Building website from content.json...\n');

// Read content.json
let content;
try {
    const contentRaw = fs.readFileSync(CONTENT_JSON, 'utf8');
    content = JSON.parse(contentRaw);
    console.log('✅ Loaded content.json');
} catch (error) {
    console.error('❌ Error reading content.json:', error.message);
    process.exit(1);
}

// Read index.html
let html;
try {
    html = fs.readFileSync(INDEX_HTML, 'utf8');
    console.log('✅ Loaded index.html');
} catch (error) {
    console.error('❌ Error reading index.html:', error.message);
    process.exit(1);
}

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupPath = path.join(BACKUP_DIR, `index_${timestamp}.html`);
fs.writeFileSync(backupPath, html);
console.log(`✅ Created backup: ${backupPath}\n`);

// Update SEO meta tags
html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${content.seo.title_de}</title>`
);

html = html.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="${content.seo.description_de}">`
);

html = html.replace(
    /<meta property="og:description" content=".*?">/,
    `<meta property="og:description" content="${content.seo.description_de}">`
);

html = html.replace(
    /<meta property="og:title" content=".*?">/,
    `<meta property="og:title" content="Homepage | ${content.contact.name}">`
);

console.log('✅ Updated SEO meta tags');

// Update contact information in header
const contactBlock = `<p>${content.contact.name}<br />${content.contact.address}<br />${content.contact.postal_code} ${content.contact.city} <br />Tel. ${content.contact.phone}<br /></p>
<p>E-Mail: ${content.contact.email}</p>`;

html = html.replace(
    /<p>La Scuderia<br \/>Feuerbachstr\. 23<br \/>60325 Frankfurt <br \/>Tel\. 069 72 54 80<br \/><\/p>\s*<p>E-Mail: info@la-scuderia\.de<\/p>/,
    contactBlock
);

console.log('✅ Updated contact information');

// Update opening hours
const openingHoursBlock = `<p>${content.opening_hours.days}</p>
<p>${content.opening_hours.lunch}</p>
<p>und</p>
<p>${content.opening_hours.dinner}<br /></p>
<p>${content.opening_hours.note}</p>`;

// Match both regular dash (-) and en-dash (–)
html = html.replace(
    /<p>Montag[\s–-]+Samstag[s]?<\/p>\s*<p>12\.00[\s–-]+15\.\d{2} Uhr<\/p>\s*<p>und<\/p>\s*<p>18\.30[\s–-]+24\.00 Uhr<br \/><\/p>\s*<p>Unser Restaurant ist klimatisiert\.<\/p>/,
    openingHoursBlock
);

console.log('✅ Updated opening hours');

// Update hero quote
const heroQuote = content.sections.hero_quote.text_de;
const heroAuthor = content.sections.hero_quote.author;

html = html.replace(
    /<div class="quote-text">[\s\S]*?<\/div>\s*<div class="quote-author">.*?<\/div>/,
    `<div class="quote-text">${heroQuote}</div>\n              <div class="quote-author">${heroAuthor}</div>`
);

console.log('✅ Updated hero quote');

// Update Restaurant section
html = html.replace(
    /<h2>Restaurant<\/h2>\s*<div class="introtext"><p>.*?<\/p><\/div>/,
    `<h2>${content.sections.restaurant.title_de}</h2>\n              <div class="introtext"><p>${content.sections.restaurant.text_de}</p></div>`
);

console.log('✅ Updated Restaurant section');

// Update Kitchen section
html = html.replace(
    /<h2>Küche<\/h2>\s*<div class="introtext"><p>.*?<\/p><\/div>/,
    `<h2>${content.sections.kitchen.title_de}</h2>\n              <div class="introtext"><p>${content.sections.kitchen.text_de}</p></div>`
);

console.log('✅ Updated Kitchen section');

// Update Wine section
html = html.replace(
    /<h2>Weine<\/h2>\s*<div class="introtext"><p>.*?<\/p><\/div>/,
    `<h2>${content.sections.wine.title_de}</h2>\n              <div class="introtext"><p>${content.sections.wine.text_de}</p></div>`
);

console.log('✅ Updated Wine section');

// Update Schema.org structured data
const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": content.contact.name,
    "description": content.seo.description_de,
    "servesCuisine": "Italian",
    "priceRange": "€€€",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": content.contact.address,
        "addressLocality": content.contact.city,
        "postalCode": content.contact.postal_code,
        "addressCountry": "DE"
    },
    "telephone": `+49-${content.contact.phone.replace(/\s/g, '')}`,
    "email": content.contact.email,
    "url": "https://www.la-scuderia.de",
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "12:00",
            "closes": "15:00"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "18:30",
            "closes": "24:00"
        }
    ]
};

html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(schemaData, null, 2)}\n</script>`
);

console.log('✅ Updated Schema.org structured data');

// Write updated HTML
try {
    fs.writeFileSync(INDEX_HTML, html);
    console.log('\n✅ Successfully updated index.html!');
    console.log('\n📝 Changes made:');
    console.log('   - SEO meta tags');
    console.log('   - Contact information');
    console.log('   - Opening hours');
    console.log('   - Hero quote');
    console.log('   - Restaurant, Kitchen, and Wine sections');
    console.log('   - Schema.org structured data');
    console.log('\n🚀 Ready to commit and push to GitHub!');
} catch (error) {
    console.error('❌ Error writing index.html:', error.message);
    process.exit(1);
}
