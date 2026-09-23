// GitHub API Integration for La Scuderia CMS
// Allows direct publishing to GitHub without manual git commands

class GitHubIntegration {
    constructor() {
        this.owner = 'PaulKremershof';
        this.repo = 'Website-la-scuderia';
        this.branch = 'main';
        this.token = this.loadToken();
    }

    // Load token from localStorage
    loadToken() {
        return localStorage.getItem('github_token');
    }

    // Save token to localStorage
    saveToken(token) {
        localStorage.setItem('github_token', token);
        this.token = token;
    }

    // Remove token
    clearToken() {
        localStorage.removeItem('github_token');
        this.token = null;
    }

    // Check if authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Test authentication
    async testAuth() {
        if (!this.token) return false;
        
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Auth test failed:', error);
            return false;
        }
    }

    // Get file from GitHub
    async getFile(path) {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}?ref=${this.branch}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get file: ${response.statusText}`);
        }

        return await response.json();
    }

    // Update file on GitHub
    async updateFile(path, content, message, sha) {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;
        
        // Properly encode UTF-8 content to Base64
        // Use a more robust method that handles large files and special characters
        const utf8Bytes = new TextEncoder().encode(content);
        let binary = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
            binary += String.fromCharCode(utf8Bytes[i]);
        }
        const base64Content = btoa(binary);
        
        const body = {
            message: message,
            content: base64Content,
            branch: this.branch
        };

        if (sha) {
            body.sha = sha;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update file');
        }

        return await response.json();
    }

    // Trigger GitHub Actions workflow (if you have one for building)
    async triggerWorkflow(workflowId) {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/actions/workflows/${workflowId}/dispatches`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: this.branch
            })
        });

        return response.ok;
    }

    // Build HTML from JSON (runs build.js logic in browser)
    buildHTML(htmlContent, jsonData) {
        let html = htmlContent;

        // Update SEO meta tags
        html = html.replace(
            /<title>.*?<\/title>/,
            `<title>${jsonData.seo.title_de}</title>`
        );

        html = html.replace(
            /<meta name="description" content=".*?">/,
            `<meta name="description" content="${jsonData.seo.description_de}">`
        );

        html = html.replace(
            /<meta property="og:description" content=".*?">/,
            `<meta property="og:description" content="${jsonData.seo.description_de}">`
        );

        // Update contact information
        const contactBlock = `<p>${jsonData.contact.name}<br />${jsonData.contact.address}<br />${jsonData.contact.postal_code} ${jsonData.contact.city} <br />Tel. ${jsonData.contact.phone}<br /></p>
<p>E-Mail: ${jsonData.contact.email}</p>`;

        html = html.replace(
            /<p>La Scuderia<br \/>Feuerbachstr\. 23<br \/>60325 Frankfurt[^<]*<br \/>Tel\. 069 72 54 80<br \/><\/p>\s*<p>E-Mail: info@la-scuderia\.de<\/p>/,
            contactBlock
        );

        // Update opening hours
        const openingHoursBlock = `<p>${jsonData.opening_hours.days}</p>
<p>${jsonData.opening_hours.lunch}</p>
<p>und</p>
<p>${jsonData.opening_hours.dinner}<br /></p>
<p>${jsonData.opening_hours.note}</p>`;

        html = html.replace(
            /<p>Montag[\s–-]+Samstag[s]?<\/p>\s*<p>12\.00[\s–-]+\d{2}\.\d{2} Uhr<\/p>\s*<p>und<\/p>\s*<p>18\.30[\s–-]+24\.00 Uhr<br \/><\/p>\s*<p>Unser Restaurant ist klimatisiert\.<\/p>/,
            openingHoursBlock
        );

        // Update hero quote
        const heroQuote = jsonData.sections.hero_quote.text_de;
        const heroAuthor = jsonData.sections.hero_quote.author;

        html = html.replace(
            /<div class="quote-text">[\s\S]*?<\/div>\s*<div class="quote-author">.*?<\/div>/,
            `<div class="quote-text">${heroQuote}</div>\n              <div class="quote-author">${heroAuthor}</div>`
        );

        // Update Restaurant section
        html = html.replace(
            /<h2>Restaurant<\/h2>\s*<div class="introtext"><p>.*?<\/p><\/div>/,
            `<h2>${jsonData.sections.restaurant.title_de}</h2>\n              <div class="introtext"><p>${jsonData.sections.restaurant.text_de}</p></div>`
        );

        // Update Kitchen section
        html = html.replace(
            /<h2>Küche<\/h2>\s*<div class="introtext"><p>.*?<\/p><\/div>/,
            `<h2>${jsonData.sections.kitchen.title_de}</h2>\n              <div class="introtext"><p>${jsonData.sections.kitchen.text_de}</p></div>`
        );

        // Update Wine section
        html = html.replace(
            /<h2>Weine<\/h2>\s*<div class="introtext"><p>.*?<\/p><\/div>/,
            `<h2>${jsonData.sections.wine.title_de}</h2>\n              <div class="introtext"><p>${jsonData.sections.wine.text_de}</p></div>`
        );

        // Update Schema.org structured data
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": jsonData.contact.name,
            "description": jsonData.seo.description_de,
            "servesCuisine": "Italian",
            "priceRange": "€€€",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": jsonData.contact.address,
                "addressLocality": jsonData.contact.city,
                "postalCode": jsonData.contact.postal_code,
                "addressCountry": "DE"
            },
            "telephone": `+49-${jsonData.contact.phone.replace(/\s/g, '')}`,
            "email": jsonData.contact.email,
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

        return html;
    }

    // Publish changes to GitHub
    async publish(contentData, commitMessage = 'Update website content via CMS') {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated. Please set up GitHub token first.');
        }

        try {
            // Step 1: Get current content.json
            console.log('📥 Fetching current content.json...');
            const contentFile = await this.getFile('data/content.json');
            
            // Step 2: Update content.json
            console.log('💾 Updating content.json...');
            const contentJSON = JSON.stringify(contentData, null, 2);
            await this.updateFile(
                'data/content.json',
                contentJSON,
                commitMessage + ' [content.json]',
                contentFile.sha
            );

            // Step 3: Get current index.html
            console.log('📥 Fetching current index.html...');
            const indexFile = await this.getFile('index.html');
            // Properly decode Base64 to UTF-8
            const binaryString = atob(indexFile.content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const currentHTML = new TextDecoder().decode(bytes);

            // Step 4: Build new HTML
            console.log('🔨 Building HTML from JSON...');
            const newHTML = this.buildHTML(currentHTML, contentData);

            // Step 5: Update index.html
            console.log('💾 Updating index.html...');
            await this.updateFile(
                'index.html',
                newHTML,
                commitMessage + ' [index.html]',
                indexFile.sha
            );

            console.log('✅ Successfully published to GitHub!');
            return true;

        } catch (error) {
            console.error('❌ Publish failed:', error);
            throw error;
        }
    }
}

// Create global instance
window.githubIntegration = new GitHubIntegration();
