# GitHub Integration Guide

## 🚀 One-Click Publishing

Your CMS now has **direct GitHub integration**! You can publish changes with one click - no more build scripts or git commands.

---

## 📋 Setup (One-Time)

### Step 1: Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in the form:
   - **Note:** `La Scuderia CMS`
   - **Expiration:** Choose your preference (recommend: 90 days or No expiration)
   - **Select scopes:** Check ✅ **`repo`** (Full control of private repositories)
4. Click **"Generate token"** at the bottom
5. **IMPORTANT:** Copy the token immediately (it starts with `ghp_` or `github_pat_`)
   - You won't be able to see it again!

### Step 2: Add Token to CMS

1. Open your CMS: http://localhost:8000/admin/ (or the GitHub Pages URL)
2. Click the **"🔑 Setup GitHub"** button in the top right
3. Paste your token in the modal
4. Click **"💾 Save Token"**
5. You should see: **"✅ GitHub token saved successfully!"**

The **"🚀 Publish to GitHub"** button will now appear!

---

## 🎯 How to Use

### New Workflow (Super Simple!)

1. **Edit Content** in the CMS
   - Change SEO, contact info, opening hours, etc.
   - Make as many changes as you want

2. **Click "🚀 Publish to GitHub"**
   - Confirm the action
   - Wait for success message

3. **Wait 1-2 minutes**
   - GitHub Pages automatically rebuilds
   - Your changes go live!

That's it! No build scripts, no git commands, no terminal needed!

---

## 🔄 What Happens When You Publish?

When you click "Publish to GitHub", the CMS automatically:

1. ✅ Collects all your changes from the form
2. ✅ Updates `data/content.json` on GitHub
3. ✅ Fetches current `index.html` from GitHub
4. ✅ Builds new HTML with your changes (runs build logic in browser)
5. ✅ Updates `index.html` on GitHub
6. ✅ Creates a commit with both files
7. ✅ GitHub Pages detects the commit and rebuilds (1-2 min)
8. ✅ Your changes are live!

---

## 💡 Comparison: Old vs New Workflow

### Old Workflow (Manual)
```
1. Edit in CMS
2. Run: npm run build
3. Run: git add .
4. Run: git commit -m "message"
5. Run: git push
6. Wait for GitHub Pages
```

### New Workflow (Automated)
```
1. Edit in CMS
2. Click "Publish to GitHub"
3. Wait for GitHub Pages
```

**Saves you 4 steps!** 🎉

---

## 🔒 Security

### Is my token safe?

✅ **Yes!** Your token is:
- Stored **only in your browser** (localStorage)
- **Never sent to any server** except GitHub's official API
- **Not visible** in the code or network requests (except to GitHub)
- **Can be revoked** anytime from GitHub settings

### Who can publish?

- Only people with a valid GitHub token for your repository
- The token is stored per-browser, so each person needs their own
- You can revoke tokens anytime from: https://github.com/settings/tokens

---

## 🛠️ Troubleshooting

### "Invalid token" error

- Make sure you selected the `repo` scope when creating the token
- Check that you copied the entire token (starts with `ghp_` or `github_pat_`)
- Try creating a new token

### "Publish failed" error

- Check your internet connection
- Make sure the token hasn't expired
- Verify you have write access to the repository
- Check GitHub status: https://www.githubstatus.com/

### Publish button doesn't appear

- Click "🔑 Setup GitHub" and add your token
- Refresh the page
- Check browser console for errors (F12)

### Changes don't appear on live site

- Wait 2-3 minutes (GitHub Pages can be slow)
- Check GitHub Actions: https://github.com/PaulKremershof/Website-la-scuderia/actions
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

---

## 📱 Using on Different Devices

### On Your Computer
- Use localhost: http://localhost:8000/admin/
- Full functionality, fastest performance

### On GitHub Pages
- Use: https://paulkremershof.github.io/Website-la-scuderia/admin/
- Works from anywhere!
- Need to setup GitHub token once per browser

### On Mobile/Tablet
- Works on GitHub Pages URL
- Might be slower, but fully functional
- Setup token once per device

---

## 🔄 Token Management

### Rotating Tokens (Recommended every 90 days)

1. Create a new token (same steps as setup)
2. Click "🔑 Setup GitHub" in CMS
3. Paste new token
4. Old token is automatically replaced

### Revoking Access

If you want to remove publishing access:

1. Go to https://github.com/settings/tokens
2. Find "La Scuderia CMS" token
3. Click "Delete"
4. The CMS will no longer be able to publish

---

## 🎓 Advanced: How It Works

The GitHub integration uses GitHub's REST API:

1. **Authentication:** Personal Access Token (OAuth)
2. **Get Files:** `GET /repos/{owner}/{repo}/contents/{path}`
3. **Update Files:** `PUT /repos/{owner}/{repo}/contents/{path}`
4. **Build Logic:** Runs the same regex replacements as `build.js` but in the browser

All operations are done client-side (in your browser). No backend server needed!

---

## 📞 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Check browser console (F12) for error messages
3. Verify GitHub token has correct permissions
4. Try creating a fresh token

---

## ✨ Benefits

✅ **No technical knowledge needed** - Just click a button  
✅ **Works from anywhere** - Use on any device with internet  
✅ **Automatic builds** - No need to run build scripts  
✅ **Version control** - All changes tracked in Git  
✅ **Instant feedback** - See success/error messages immediately  
✅ **Secure** - Token stored locally, only you have access  

---

**Enjoy your new one-click publishing workflow!** 🚀
