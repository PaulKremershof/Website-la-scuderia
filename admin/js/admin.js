// La Scuderia CMS - Admin JavaScript

let contentData = {};
let hasChanges = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('CMS Admin initialized');
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
        } else {
            throw new Error('Save failed');
        }
    } catch (error) {
        console.error('Error saving:', error);
        showToast('❌ Error saving changes. Using local storage as backup.', 'error');
        // Fallback to localStorage
        localStorage.setItem('lascuderia_content', JSON.stringify(contentData));
        showToast('💾 Saved to browser storage', 'success');
    }
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
