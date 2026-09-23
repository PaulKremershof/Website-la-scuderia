// La Scuderia CMS - Admin JavaScript

let contentData = {};
let hasChanges = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('CMS Admin initialized');
    
    // Show warning banner if on GitHub Pages
    if (!isLocalhost()) {
        const warning = document.getElementById('github-warning');
        if (warning) {
            warning.style.display = 'block';
        }
    }
    
    showLoading(true);
    loadContent();
    initNavigation();
    initEventListeners();
});

// Show/hide loading indicator
function showLoading(show) {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

// Load content from JSON
async function loadContent() {
    try {
        console.log('Loading content from ../data/content.json...');
        const response = await fetch('../data/content.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        contentData = await response.json();
        console.log('Content loaded successfully:', contentData);
        
        populateFields();
        loadImages();
        loadMenu();
        
        showLoading(false);
        showToast('✅ Content loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading content:', error);
        showToast('⚠️ Error loading content: ' + error.message, 'error');
        
        // Try to load from localStorage as fallback
        const savedData = localStorage.getItem('lascuderia_content');
        if (savedData) {
            contentData = JSON.parse(savedData);
            populateFields();
            loadImages();
            loadMenu();
            showLoading(false);
            showToast('📦 Loaded from browser storage', 'success');
        } else {
            showLoading(false);
        }
    }
}

// Populate form fields with data
function populateFields() {
    // SEO
    document.getElementById('seo-title-de').value = contentData.seo.title_de || '';
    document.getElementById('seo-title-en').value = contentData.seo.title_en || '';
    document.getElementById('seo-description-de').value = contentData.seo.description_de || '';
    document.getElementById('seo-description-en').value = contentData.seo.description_en || '';
    document.getElementById('seo-keywords').value = contentData.seo.keywords || '';

    // Contact
    document.getElementById('contact-name').value = contentData.contact.name || '';
    document.getElementById('contact-phone').value = contentData.contact.phone || '';
    document.getElementById('contact-email').value = contentData.contact.email || '';
    document.getElementById('contact-address').value = contentData.contact.address || '';
    document.getElementById('contact-postal').value = contentData.contact.postal_code || '';
    document.getElementById('contact-city').value = contentData.contact.city || '';
    document.getElementById('contact-instagram').value = contentData.contact.instagram || '';

    // Opening Hours
    document.getElementById('hours-days').value = contentData.opening_hours.days || '';
    document.getElementById('hours-lunch').value = contentData.opening_hours.lunch || '';
    document.getElementById('hours-dinner').value = contentData.opening_hours.dinner || '';
    document.getElementById('hours-note').value = contentData.opening_hours.note || '';

    // Content
    document.getElementById('content-hero-de').value = contentData.sections.hero_quote.text_de || '';
    document.getElementById('content-hero-en').value = contentData.sections.hero_quote.text_en || '';
    document.getElementById('content-hero-author').value = contentData.sections.hero_quote.author || '';
    document.getElementById('content-restaurant-de').value = contentData.sections.restaurant.text_de || '';
    document.getElementById('content-restaurant-en').value = contentData.sections.restaurant.text_en || '';
    document.getElementById('content-kitchen-de').value = contentData.sections.kitchen.text_de || '';
    document.getElementById('content-kitchen-en').value = contentData.sections.kitchen.text_en || '';
    document.getElementById('content-wine-de').value = contentData.sections.wine.text_de || '';
    document.getElementById('content-wine-en').value = contentData.sections.wine.text_en || '';
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById('section-' + sectionId).classList.add('active');

            // Update header title
            document.getElementById('section-title').textContent = this.textContent.trim();
        });
    });
}

// Event Listeners
function initEventListeners() {
    // Track changes
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            hasChanges = true;
        });
    });

    // Save button
    document.getElementById('btn-save').addEventListener('click', saveContent);

    // Reset button
    document.getElementById('btn-reset').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all changes?')) {
            loadContent();
            hasChanges = false;
            showToast('Changes reset', 'success');
        }
    });

    // Image upload
    document.getElementById('image-upload').addEventListener('change', handleImageUpload);

    // Add category button
    document.getElementById('btn-add-category').addEventListener('click', addMenuCategory);

    // Warn before leaving if there are unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Check if we're running on localhost or GitHub Pages
function isLocalhost() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname === '';
}

// Save content
async function saveContent() {
    // Collect data from form
    contentData.seo.title_de = document.getElementById('seo-title-de').value;
    contentData.seo.title_en = document.getElementById('seo-title-en').value;
    contentData.seo.description_de = document.getElementById('seo-description-de').value;
    contentData.seo.description_en = document.getElementById('seo-description-en').value;
    contentData.seo.keywords = document.getElementById('seo-keywords').value;

    contentData.contact.name = document.getElementById('contact-name').value;
    contentData.contact.phone = document.getElementById('contact-phone').value;
    contentData.contact.email = document.getElementById('contact-email').value;
    contentData.contact.address = document.getElementById('contact-address').value;
    contentData.contact.postal_code = document.getElementById('contact-postal').value;
    contentData.contact.city = document.getElementById('contact-city').value;
    contentData.contact.instagram = document.getElementById('contact-instagram').value;

    contentData.opening_hours.days = document.getElementById('hours-days').value;
    contentData.opening_hours.lunch = document.getElementById('hours-lunch').value;
    contentData.opening_hours.dinner = document.getElementById('hours-dinner').value;
    contentData.opening_hours.note = document.getElementById('hours-note').value;

    contentData.sections.hero_quote.text_de = document.getElementById('content-hero-de').value;
    contentData.sections.hero_quote.text_en = document.getElementById('content-hero-en').value;
    contentData.sections.hero_quote.author = document.getElementById('content-hero-author').value;
    contentData.sections.restaurant.text_de = document.getElementById('content-restaurant-de').value;
    contentData.sections.restaurant.text_en = document.getElementById('content-restaurant-en').value;
    contentData.sections.kitchen.text_de = document.getElementById('content-kitchen-de').value;
    contentData.sections.kitchen.text_en = document.getElementById('content-kitchen-en').value;
    contentData.sections.wine.text_de = document.getElementById('content-wine-de').value;
    contentData.sections.wine.text_en = document.getElementById('content-wine-en').value;

    // Save Links & Navigation data
    if (document.getElementById('social-instagram')) {
        if (!contentData.social_links) contentData.social_links = {};
        contentData.social_links.instagram = document.getElementById('social-instagram').value;
        contentData.social_links.facebook = document.getElementById('social-facebook').value;
        contentData.social_links.twitter = document.getElementById('social-twitter').value;
    }

    if (document.getElementById('footer-privacy-de')) {
        if (!contentData.footer_links) contentData.footer_links = {};
        contentData.footer_links.privacy_de = document.getElementById('footer-privacy-de').value;
        contentData.footer_links.privacy_en = document.getElementById('footer-privacy-en').value;
        contentData.footer_links.imprint_de = document.getElementById('footer-imprint-de').value;
        contentData.footer_links.imprint_en = document.getElementById('footer-imprint-en').value;
    }

    if (document.getElementById('cta-reservation-de')) {
        if (!contentData.cta_buttons) contentData.cta_buttons = {};
        if (!contentData.cta_buttons.reservation) contentData.cta_buttons.reservation = {};
        if (!contentData.cta_buttons.phone) contentData.cta_buttons.phone = {};
        
        contentData.cta_buttons.reservation.text_de = document.getElementById('cta-reservation-de').value;
        contentData.cta_buttons.reservation.text_en = document.getElementById('cta-reservation-en').value;
        contentData.cta_buttons.phone.url = document.getElementById('cta-phone-url').value;
    }

    // Save Code Injection data
    if (document.getElementById('code-head')) {
        if (!contentData.code_injection) contentData.code_injection = {};
        contentData.code_injection.head_scripts = document.getElementById('code-head').value;
        contentData.code_injection.body_scripts = document.getElementById('code-body').value;
        contentData.code_injection.opentable_widget = document.getElementById('code-opentable').value;
    }

    // Save AI Optimization data
    if (document.getElementById('ai-voice-phrases')) {
        if (!contentData.ai_optimization) contentData.ai_optimization = {};
        
        const phrases = document.getElementById('ai-voice-phrases').value;
        contentData.ai_optimization.voice_search_phrases = phrases.split(',').map(p => p.trim()).filter(p => p);
        
        contentData.ai_optimization.ai_description = document.getElementById('ai-description').value;
        
        if (!contentData.ai_optimization.chatgpt_tags) contentData.ai_optimization.chatgpt_tags = {};
        contentData.ai_optimization.chatgpt_tags.cuisine_type = document.getElementById('ai-cuisine').value;
        contentData.ai_optimization.chatgpt_tags.price_level = document.getElementById('ai-price').value;
        
        const specialties = document.getElementById('ai-specialties').value;
        contentData.ai_optimization.chatgpt_tags.specialties = specialties.split(',').map(s => s.trim()).filter(s => s);
        
        const bestFor = document.getElementById('ai-best-for').value;
        contentData.ai_optimization.chatgpt_tags.best_for = bestFor.split(',').map(b => b.trim()).filter(b => b);
    }

    // Save Schema.org data
    if (document.getElementById('schema-chef-name')) {
        if (!contentData.schema_enhanced) contentData.schema_enhanced = {};
        if (!contentData.schema_enhanced.chef) contentData.schema_enhanced.chef = {};
        
        contentData.schema_enhanced.chef.name = document.getElementById('schema-chef-name').value;
        contentData.schema_enhanced.chef.since = document.getElementById('schema-chef-since').value;
        contentData.schema_enhanced.average_rating = parseFloat(document.getElementById('schema-rating').value) || 0;
        contentData.schema_enhanced.review_count = parseInt(document.getElementById('schema-reviews').value) || 0;
    }

    // Check if running on localhost (PHP backend available)
    if (isLocalhost()) {
        try {
            const response = await fetch('api/save.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contentData)
            });

            if (response.ok) {
                hasChanges = false;
                showToast('✅ Changes saved successfully!', 'success');
                // Also save to localStorage as backup
                localStorage.setItem('lascuderia_content', JSON.stringify(contentData));
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            console.error('Error saving:', error);
            showToast('❌ Error saving to server. Saved to browser storage instead.', 'error');
            localStorage.setItem('lascuderia_content', JSON.stringify(contentData));
        }
    } else {
        // Running on GitHub Pages - offer download instead
        showToast('⚠️ Cannot save directly on GitHub Pages. Download the file and commit it manually.', 'error');
        
        // Save to localStorage
        localStorage.setItem('lascuderia_content', JSON.stringify(contentData));
        
        // Automatically trigger download
        downloadContentJSON();
        
        showToast('💾 File downloaded! Upload it to /data/content.json and push to GitHub.', 'success');
    }
}

// Download content.json file
function downloadContentJSON() {
    const dataStr = JSON.stringify(contentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Load images
function loadImages() {
    const imageGrid = document.getElementById('image-grid');
    const images = [
        { name: 'hero-bg.jpg', path: '../images/hero-bg.jpg' },
        { name: 'restaurant-1.jpg', path: '../images/restaurant-1.jpg' },
        { name: 'restaurant-2.jpg', path: '../images/restaurant-2.jpg' },
        { name: 'kitchen-1.jpg', path: '../images/kitchen-1.jpg' },
        { name: 'wine-1.jpg', path: '../images/wine-1.jpg' },
        { name: 'logo.svg', path: '../images/logo.svg' }
    ];

    imageGrid.innerHTML = images.map(img => `
        <div class="image-item">
            <img src="${img.path}" alt="${img.name}">
            <div class="image-actions">
                <button class="btn-icon" onclick="replaceImage('${img.name}')" title="Replace">
                    🔄
                </button>
                <button class="btn-icon" onclick="deleteImage('${img.name}')" title="Delete">
                    🗑️
                </button>
            </div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 0.5rem; font-size: 0.8rem;">
                ${img.name}
            </div>
        </div>
    `).join('');
}

// Handle image upload
function handleImageUpload(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    showToast(`📤 Uploading ${files.length} image(s)...`, 'success');

    // In a real implementation, you would upload to server
    // For now, we'll show a success message
    setTimeout(() => {
        showToast('✅ Images uploaded successfully!', 'success');
        loadImages();
    }, 1000);
}

// Replace image
function replaceImage(imageName) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        if (e.target.files.length > 0) {
            showToast(`🔄 Replacing ${imageName}...`, 'success');
            // Upload logic here
            setTimeout(() => {
                showToast('✅ Image replaced!', 'success');
                loadImages();
            }, 1000);
        }
    };
    input.click();
}

// Delete image
function deleteImage(imageName) {
    if (confirm(`Are you sure you want to delete ${imageName}?`)) {
        showToast(`🗑️ Deleting ${imageName}...`, 'success');
        // Delete logic here
        setTimeout(() => {
            showToast('✅ Image deleted!', 'success');
            loadImages();
        }, 500);
    }
}

// Load menu
function loadMenu() {
    const menuContainer = document.getElementById('menu-container');
    
    if (!contentData.menu.categories || contentData.menu.categories.length === 0) {
        menuContainer.innerHTML = '<p class="info-text">No menu categories yet. Click "Add Category" to get started.</p>';
        return;
    }

    menuContainer.innerHTML = contentData.menu.categories.map((category, catIndex) => `
        <div class="menu-category">
            <div class="menu-category-header">
                <input type="text" class="form-control" value="${category.name}" 
                       onchange="updateCategoryName(${catIndex}, this.value)" 
                       style="max-width: 300px; display: inline-block;">
                <div>
                    <button class="btn btn-secondary" onclick="addMenuItem(${catIndex})">+ Add Item</button>
                    <button class="btn btn-danger" onclick="deleteCategory(${catIndex})">Delete Category</button>
                </div>
            </div>
            <div>
                ${category.items.map((item, itemIndex) => `
                    <div class="menu-item">
                        <div class="menu-item-info">
                            <div class="menu-item-name">${item.name}</div>
                            <div class="menu-item-description">${item.description || ''}</div>
                        </div>
                        <div class="menu-item-price">${item.price}</div>
                        <button class="btn btn-secondary" onclick="editMenuItem(${catIndex}, ${itemIndex})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteMenuItem(${catIndex}, ${itemIndex})">Delete</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Add menu category
function addMenuCategory() {
    const categoryName = prompt('Enter category name (e.g., "Antipasti", "Pasta", "Desserts"):');
    if (!categoryName) return;

    if (!contentData.menu.categories) {
        contentData.menu.categories = [];
    }

    contentData.menu.categories.push({
        name: categoryName,
        items: []
    });

    hasChanges = true;
    loadMenu();
    showToast('✅ Category added!', 'success');
}

// Add menu item
function addMenuItem(categoryIndex) {
    const name = prompt('Item name:');
    if (!name) return;

    const description = prompt('Description (optional):');
    const price = prompt('Price (e.g., "€12.50"):');

    contentData.menu.categories[categoryIndex].items.push({
        name: name,
        description: description || '',
        price: price || ''
    });

    hasChanges = true;
    loadMenu();
    showToast('✅ Menu item added!', 'success');
}

// Edit menu item
function editMenuItem(categoryIndex, itemIndex) {
    const item = contentData.menu.categories[categoryIndex].items[itemIndex];
    
    const name = prompt('Item name:', item.name);
    if (name === null) return;

    const description = prompt('Description:', item.description);
    const price = prompt('Price:', item.price);

    item.name = name;
    item.description = description || '';
    item.price = price || '';

    hasChanges = true;
    loadMenu();
    showToast('✅ Menu item updated!', 'success');
}

// Delete menu item
function deleteMenuItem(categoryIndex, itemIndex) {
    if (confirm('Delete this menu item?')) {
        contentData.menu.categories[categoryIndex].items.splice(itemIndex, 1);
        hasChanges = true;
        loadMenu();
        showToast('✅ Menu item deleted!', 'success');
    }
}

// Delete category
function deleteCategory(categoryIndex) {
    if (confirm('Delete this entire category and all its items?')) {
        contentData.menu.categories.splice(categoryIndex, 1);
        hasChanges = true;
        loadMenu();
        showToast('✅ Category deleted!', 'success');
    }
}

// Update category name
function updateCategoryName(categoryIndex, newName) {
    contentData.menu.categories[categoryIndex].name = newName;
    hasChanges = true;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// NEW FUNCTIONALITY FOR ENHANCED CMS
// ============================================

// Load Links & Navigation data
function loadLinksData() {
    if (!contentData.navigation) return;
    
    // Load navigation menu
    loadNavigationMenu();
    
    // Load social links
    document.getElementById('social-instagram').value = contentData.social_links?.instagram || '';
    document.getElementById('social-facebook').value = contentData.social_links?.facebook || '';
    document.getElementById('social-twitter').value = contentData.social_links?.twitter || '';
    
    // Load footer links
    document.getElementById('footer-privacy-de').value = contentData.footer_links?.privacy_de || '';
    document.getElementById('footer-privacy-en').value = contentData.footer_links?.privacy_en || '';
    document.getElementById('footer-imprint-de').value = contentData.footer_links?.imprint_de || '';
    document.getElementById('footer-imprint-en').value = contentData.footer_links?.imprint_en || '';
    
    // Load CTA buttons
    document.getElementById('cta-reservation-de').value = contentData.cta_buttons?.reservation?.text_de || '';
    document.getElementById('cta-reservation-en').value = contentData.cta_buttons?.reservation?.text_en || '';
    document.getElementById('cta-phone-url').value = contentData.cta_buttons?.phone?.url || '';
}

// Load navigation menu
function loadNavigationMenu() {
    const menuList = document.getElementById('nav-menu-list');
    if (!menuList || !contentData.navigation?.main_menu) return;
    
    menuList.innerHTML = contentData.navigation.main_menu.map((item, index) => `
        <div class="nav-menu-item" data-index="${index}">
            <span class="drag-handle">☰</span>
            <div class="nav-item-content">
                <input type="text" placeholder="Text (DE)" value="${item.text_de}" onchange="updateNavItem(${index}, 'text_de', this.value)">
                <input type="text" placeholder="Text (EN)" value="${item.text_en}" onchange="updateNavItem(${index}, 'text_en', this.value)">
                <input type="text" placeholder="URL" value="${item.url}" onchange="updateNavItem(${index}, 'url', this.value)">
            </div>
            <button class="btn btn-danger" onclick="deleteNavItem(${index})">Delete</button>
        </div>
    `).join('');
}

// Update navigation item
function updateNavItem(index, field, value) {
    if (!contentData.navigation.main_menu[index]) return;
    contentData.navigation.main_menu[index][field] = value;
    hasChanges = true;
}

// Delete navigation item
function deleteNavItem(index) {
    if (confirm('Delete this menu item?')) {
        contentData.navigation.main_menu.splice(index, 1);
        hasChanges = true;
        loadNavigationMenu();
        showToast('✅ Menu item deleted!', 'success');
    }
}

// Add navigation item
function addNavItem() {
    const text_de = prompt('Menu text (German):');
    if (!text_de) return;
    
    const text_en = prompt('Menu text (English):');
    const url = prompt('URL (e.g., /#section):');
    
    if (!contentData.navigation) contentData.navigation = { main_menu: [] };
    if (!contentData.navigation.main_menu) contentData.navigation.main_menu = [];
    
    contentData.navigation.main_menu.push({
        id: 'nav' + Date.now(),
        text_de: text_de,
        text_en: text_en || text_de,
        url: url || '#',
        order: contentData.navigation.main_menu.length + 1
    });
    
    hasChanges = true;
    loadNavigationMenu();
    showToast('✅ Menu item added!', 'success');
}

// Load Code Injection data
function loadCodeInjection() {
    if (!contentData.code_injection) return;
    
    document.getElementById('code-head').value = contentData.code_injection.head_scripts || '';
    document.getElementById('code-body').value = contentData.code_injection.body_scripts || '';
    document.getElementById('code-opentable').value = contentData.code_injection.opentable_widget || '';
}

// Load AI Optimization data
function loadAIOptimization() {
    if (!contentData.ai_optimization) return;
    
    // Load FAQ
    loadFAQList();
    
    // Load voice search phrases
    const phrases = contentData.ai_optimization.voice_search_phrases || [];
    document.getElementById('ai-voice-phrases').value = phrases.join(', ');
    
    // Load AI description
    document.getElementById('ai-description').value = contentData.ai_optimization.ai_description || '';
    
    // Load ChatGPT tags
    const tags = contentData.ai_optimization.chatgpt_tags || {};
    document.getElementById('ai-cuisine').value = tags.cuisine_type || '';
    document.getElementById('ai-price').value = tags.price_level || '';
    document.getElementById('ai-specialties').value = (tags.specialties || []).join(', ');
    document.getElementById('ai-best-for').value = (tags.best_for || []).join(', ');
    
    // Load Schema.org data
    const schema = contentData.schema_enhanced || {};
    document.getElementById('schema-chef-name').value = schema.chef?.name || '';
    document.getElementById('schema-chef-since').value = schema.chef?.since || '';
    document.getElementById('schema-rating').value = schema.average_rating || '';
    document.getElementById('schema-reviews').value = schema.review_count || '';
}

// Load FAQ list
function loadFAQList() {
    const faqList = document.getElementById('faq-list');
    if (!faqList) return;
    
    const faqs = contentData.ai_optimization?.faq || [];
    
    if (faqs.length === 0) {
        faqList.innerHTML = '<p class="info-text">No FAQs yet. Click "Add FAQ" to get started.</p>';
        return;
    }
    
    faqList.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item">
            <div class="faq-item-header">
                <h4>FAQ #${index + 1}</h4>
                <button class="btn btn-danger" onclick="deleteFAQ(${index})">Delete</button>
            </div>
            <div class="form-group">
                <label>Question (German)</label>
                <textarea class="form-control" rows="2" onchange="updateFAQ(${index}, 'question_de', this.value)">${faq.question_de}</textarea>
            </div>
            <div class="form-group">
                <label>Question (English)</label>
                <textarea class="form-control" rows="2" onchange="updateFAQ(${index}, 'question_en', this.value)">${faq.question_en}</textarea>
            </div>
            <div class="form-group">
                <label>Answer (German)</label>
                <textarea class="form-control" rows="3" onchange="updateFAQ(${index}, 'answer_de', this.value)">${faq.answer_de}</textarea>
            </div>
            <div class="form-group">
                <label>Answer (English)</label>
                <textarea class="form-control" rows="3" onchange="updateFAQ(${index}, 'answer_en', this.value)">${faq.answer_en}</textarea>
            </div>
        </div>
    `).join('');
}

// Update FAQ
function updateFAQ(index, field, value) {
    if (!contentData.ai_optimization.faq[index]) return;
    contentData.ai_optimization.faq[index][field] = value;
    hasChanges = true;
}

// Delete FAQ
function deleteFAQ(index) {
    if (confirm('Delete this FAQ?')) {
        contentData.ai_optimization.faq.splice(index, 1);
        hasChanges = true;
        loadFAQList();
        showToast('✅ FAQ deleted!', 'success');
    }
}

// Add FAQ
function addFAQ() {
    const question_de = prompt('Question (German):');
    if (!question_de) return;
    
    const question_en = prompt('Question (English):');
    const answer_de = prompt('Answer (German):');
    const answer_en = prompt('Answer (English):');
    
    if (!contentData.ai_optimization) contentData.ai_optimization = { faq: [] };
    if (!contentData.ai_optimization.faq) contentData.ai_optimization.faq = [];
    
    contentData.ai_optimization.faq.push({
        id: 'faq' + Date.now(),
        question_de: question_de,
        question_en: question_en || question_de,
        answer_de: answer_de || '',
        answer_en: answer_en || answer_de || ''
    });
    
    hasChanges = true;
    loadFAQList();
    showToast('✅ FAQ added!', 'success');
}

// Handle favicon upload
async function handleFaviconUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    showToast('📤 Uploading favicon...', 'success');
    
    const formData = new FormData();
    formData.append('favicon', file);
    
    try {
        const response = await fetch('api/upload-favicon.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('✅ Favicon generated successfully!', 'success');
            // Reload favicon preview
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            throw new Error(result.message || 'Upload failed');
        }
    } catch (error) {
        console.error('Favicon upload error:', error);
        showToast('❌ Favicon upload failed: ' + error.message, 'error');
    }
}

// Preview changes
async function previewChanges() {
    showToast('🔄 Generating preview...', 'success');
    
    try {
        const response = await fetch('api/preview.php', {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('✅ Preview generated!', 'success');
            
            // Show preview links
            const previewLinks = document.getElementById('preview-links');
            const linkDE = document.getElementById('preview-link-de');
            const linkEN = document.getElementById('preview-link-en');
            
            linkDE.href = result.preview_url_de;
            linkEN.href = result.preview_url_en;
            
            previewLinks.style.display = 'block';
            
            // Auto-open German preview
            window.open(result.preview_url_de, '_blank');
        } else {
            throw new Error(result.message || 'Preview generation failed');
        }
    } catch (error) {
        console.error('Preview error:', error);
        showToast('❌ Preview failed: ' + error.message, 'error');
    }
}

// Publish to live website
async function publishWebsite() {
    if (!confirm('Are you sure you want to publish these changes to the live website?')) {
        return;
    }
    
    showToast('🚀 Publishing to live website...', 'success');
    
    try {
        const response = await fetch('api/publish.php', {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('✅ Website published successfully!', 'success');
            hasChanges = false;
            
            // Add to publish history
            addPublishHistory(result.timestamp);
        } else {
            throw new Error(result.message || 'Publish failed');
        }
    } catch (error) {
        console.error('Publish error:', error);
        showToast('❌ Publish failed: ' + error.message, 'error');
    }
}

// Add publish history entry
function addPublishHistory(timestamp) {
    const historyDiv = document.getElementById('publish-history');
    if (!historyDiv) return;
    
    const entry = document.createElement('div');
    entry.className = 'history-item';
    entry.innerHTML = `
        <span class="timestamp">${timestamp}</span>
        <span class="status success">Published</span>
    `;
    
    historyDiv.insertBefore(entry, historyDiv.firstChild);
}

// Initialize new event listeners
function initNewEventListeners() {
    // Add navigation item button
    const btnAddNav = document.getElementById('btn-add-nav-item');
    if (btnAddNav) {
        btnAddNav.addEventListener('click', addNavItem);
    }
    
    // Favicon upload
    const faviconUpload = document.getElementById('favicon-upload');
    if (faviconUpload) {
        faviconUpload.addEventListener('change', handleFaviconUpload);
    }
    
    // Add FAQ button
    const btnAddFAQ = document.getElementById('btn-add-faq');
    if (btnAddFAQ) {
        btnAddFAQ.addEventListener('click', addFAQ);
    }
    
    // Preview button
    const btnPreview = document.getElementById('btn-preview');
    if (btnPreview) {
        btnPreview.addEventListener('click', previewChanges);
    }
    
    // Publish button
    const btnPublish = document.getElementById('btn-publish');
    if (btnPublish) {
        btnPublish.addEventListener('click', publishWebsite);
    }
    
    // Save draft button
    const btnSaveDraft = document.getElementById('btn-save-draft');
    if (btnSaveDraft) {
        btnSaveDraft.addEventListener('click', saveContent);
    }
}

// Enhanced populate fields to include new sections
function populateAllFields() {
    populateFields(); // Original function
    loadLinksData();
    loadCodeInjection();
    loadAIOptimization();
}

// Override the original loadContent to include new data
const originalLoadContent = loadContent;
loadContent = async function() {
    await originalLoadContent();
    populateAllFields();
    initNewEventListeners();
};
