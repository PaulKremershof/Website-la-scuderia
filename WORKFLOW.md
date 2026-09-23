# La Scuderia - Website Update Workflow

## 🎯 Overview

Your website now uses a **CMS → Build → Deploy** workflow:

1. **Edit content** in the CMS (saves to `data/content.json`)
2. **Build website** (updates `index.html` from JSON)
3. **Deploy** (push to GitHub Pages)

---

## 🚀 Quick Start

### One-Command Deploy (Recommended)

```bash
npm run deploy
```

This runs the build script AND pushes to GitHub automatically!

### Manual Steps

If you prefer to do it step-by-step:

```bash
# 1. Build the website
npm run build

# 2. Check what changed
git status
git diff index.html

# 3. Commit and push
git add index.html data/
git commit -m "Update website content"
git push
```

---

## 📝 Detailed Workflow

### Step 1: Start Local Server

Make sure you're running the **PHP server** (not Python):

```bash
php -S localhost:8000
```

> **Why PHP?** The CMS needs PHP to save changes to `content.json`. Python's server is read-only.

### Step 2: Edit Content in CMS

1. Open http://localhost:8000/admin/
2. Make your changes (SEO, contact info, opening hours, etc.)
3. Click **"💾 Save All Changes"**
4. You should see: **"✅ Changes saved successfully!"**

### Step 3: Build the Website

Run the build script to update `index.html` from your JSON changes:

```bash
npm run build
```

You'll see output like:
```
🔨 Building website from content.json...
✅ Loaded content.json
✅ Loaded index.html
✅ Created backup: data/backups/html/index_2026-09-23T18-54-31.html
✅ Updated SEO meta tags
✅ Updated contact information
✅ Updated opening hours
... etc
```

### Step 4: Review Changes (Optional)

```bash
git diff index.html
```

This shows exactly what changed in the HTML.

### Step 5: Deploy to GitHub Pages

```bash
git add index.html data/
git commit -m "Update website content"
git push
```

Wait 1-2 minutes for GitHub Pages to rebuild.

Your changes are now live at: **https://paulkremershof.github.io/Website-la-scuderia/**

---

## 🔧 What Gets Updated

The build script updates these parts of `index.html`:

- ✅ **SEO meta tags** (title, description)
- ✅ **Contact information** (address, phone, email)
- ✅ **Opening hours**
- ✅ **Hero quote** (homepage quote)
- ✅ **Restaurant section** text
- ✅ **Kitchen section** text
- ✅ **Wine section** text
- ✅ **Schema.org structured data** (for Google)

---

## 💾 Backups

Every time you run the build script:

- **HTML backup** is created in `data/backups/html/`
- **JSON backup** is created in `data/backups/` (when you save in CMS)

You can restore from these if needed!

---

## ⚠️ Important Notes

### DO NOT edit `index.html` directly!

Your changes will be overwritten next time you run `npm run build`. Always edit through the CMS.

### Exception: Images and Layout

The build script only updates **content** (text, SEO, contact info). If you need to change:
- Images
- Layout/design
- CSS/styling

You'll need to edit `index.html` or CSS files directly.

---

## 🐛 Troubleshooting

### "Error: Cannot find module"
You might need to initialize npm:
```bash
npm init -y
```

### CMS shows "Error saving"
Make sure you're using the PHP server:
```bash
php -S localhost:8000
```

### Changes don't appear on live site
1. Did you run `npm run build`?
2. Did you push to GitHub?
3. Wait 1-2 minutes for GitHub Pages to rebuild

### Opening hours still show old text
The build script reads from `content.json`. Make sure:
1. You saved in the CMS
2. You ran `npm run build`
3. Check `data/content.json` to verify your changes are there

---

## 📚 Files Overview

```
lascuderia/
├── index.html              # Main website (auto-generated from JSON)
├── build.js                # Build script (updates HTML from JSON)
├── package.json            # npm scripts (build, deploy)
├── data/
│   ├── content.json        # CMS data (edit via CMS)
│   └── backups/            # Automatic backups
│       ├── html/           # HTML backups
│       └── content_*.json  # JSON backups
└── admin/                  # CMS interface
    ├── index.html
    ├── js/admin.js
    └── api/save.php        # Saves CMS changes to JSON
```

---

## 🎓 Summary

**Old workflow:**
1. Edit `index.html` manually
2. Push to GitHub

**New workflow:**
1. Edit in CMS → saves to `content.json`
2. Run `npm run build` → updates `index.html`
3. Push to GitHub

**Benefits:**
- ✅ No HTML knowledge needed
- ✅ Consistent formatting
- ✅ Automatic backups
- ✅ SEO data stays in sync
- ✅ One command to deploy

---

Need help? Check the build script output for detailed error messages!
