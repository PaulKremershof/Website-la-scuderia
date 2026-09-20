# La Scuderia CMS - Admin Panel

A simple, user-friendly Content Management System for the La Scuderia restaurant website.

## 🚀 Features

- ✅ **SEO Management** - Edit meta titles, descriptions, and keywords for German and English versions
- ✅ **Contact Information** - Update restaurant details, phone, email, address
- ✅ **Opening Hours** - Manage business hours and special notes
- ✅ **Content Editing** - Edit all text content on the website (quotes, descriptions, etc.)
- ✅ **Image Management** - Upload, replace, and delete images
- ✅ **Menu Management** - Create categories and add menu items with prices
- ✅ **Auto-Backup** - Automatic backups before each save (keeps last 10)
- ✅ **No Database** - Uses simple JSON files for storage

## 📂 File Structure

```
admin/
├── index.html          # Admin interface
├── css/
│   └── admin.css      # Admin styles
├── js/
│   └── admin.js       # Admin functionality
└── api/
    └── save.php       # Save endpoint

data/
├── content.json       # Main content file
└── backups/          # Automatic backups
```

## 🌐 Access the CMS

### Local Development
1. Make sure your server is running (Python, PHP, or any web server)
2. Navigate to: `http://localhost:8000/admin/`

### Production
Upload to your web server and access: `https://yourdomain.com/admin/`

## 🔐 Security Recommendations

**IMPORTANT**: Before deploying to production:

1. **Add Password Protection**
   - Use `.htaccess` and `.htpasswd` (Apache)
   - Or add authentication to `admin/index.html`

2. **Restrict Access by IP**
   - Only allow your office/home IP address

3. **Use HTTPS**
   - Always use SSL certificate in production

### Example .htaccess for Password Protection

Create `admin/.htaccess`:
```apache
AuthType Basic
AuthName "Restricted Area"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

Create password file:
```bash
htpasswd -c .htpasswd admin
```

## 📖 How to Use

### 1. SEO Settings
- Edit page titles (keep under 60 characters)
- Write meta descriptions (150-160 characters)
- Add relevant keywords

### 2. Contact Information
- Update restaurant name, phone, email
- Edit address and postal code
- Update social media links

### 3. Opening Hours
- Set days open
- Update lunch and dinner hours
- Add special notes

### 4. Page Content
- Edit hero quote and author
- Update restaurant description
- Modify kitchen and wine section text
- Available in German and English

### 5. Image Management
- Click "Upload Images" to add new photos
- Click 🔄 to replace an existing image
- Click 🗑️ to delete an image
- Supported formats: JPG, PNG, WebP

### 6. Menu Management
- Click "+ Add Category" to create sections (Antipasti, Pasta, etc.)
- Click "+ Add Item" to add dishes
- Edit items to update name, description, price
- Delete items or entire categories

### 7. Saving Changes
- Click "💾 Save All Changes" to save
- Changes are backed up automatically
- You'll see a confirmation message

## 🔄 Backup & Restore

### Automatic Backups
- Created before each save
- Stored in `data/backups/`
- Keeps last 10 backups
- Named with timestamp: `content_2026-09-20_14-30-00.json`

### Manual Restore
1. Go to `data/backups/`
2. Find the backup you want to restore
3. Copy it to `data/content.json`
4. Refresh the admin panel

## 🛠️ Technical Details

### Requirements
- Web server (Apache, Nginx, or Python)
- PHP 7.0+ (for save functionality)
- Modern web browser

### Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

### Data Format
Content is stored in JSON format in `data/content.json`. You can edit this file directly if needed.

## 🐛 Troubleshooting

### Changes Not Saving
1. Check if PHP is installed: `php -v`
2. Check file permissions: `chmod 755 admin/api/`
3. Check browser console for errors
4. Fallback: Data is saved to browser localStorage

### Images Not Uploading
1. Check PHP upload settings in `php.ini`:
   ```ini
   upload_max_filesize = 10M
   post_max_size = 10M
   ```
2. Check folder permissions: `chmod 755 images/`

### Can't Access Admin Panel
1. Make sure server is running
2. Check the URL path
3. Clear browser cache
4. Check for JavaScript errors in console

## 📝 Development Notes

### Adding New Fields
1. Add field to `data/content.json`
2. Add input in `admin/index.html`
3. Add save/load logic in `admin/js/admin.js`

### Customizing Styles
Edit `admin/css/admin.css` to change colors, fonts, layout.

### Adding Features
The CMS is modular - you can easily add:
- Multi-language support
- User roles and permissions
- Image optimization
- Email notifications
- Analytics integration

## 🆘 Support

For issues or questions:
1. Check this README
2. Check browser console for errors
3. Review `data/backups/` for recent changes
4. Contact your developer

## 📄 License

This CMS is custom-built for La Scuderia Restaurant.

---

**Built with ❤️ for La Scuderia**
