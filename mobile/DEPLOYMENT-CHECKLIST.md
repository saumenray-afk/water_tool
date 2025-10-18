# ✅ DEPLOYMENT CHECKLIST

## Before You Deploy - Complete These Steps:

### 1. ⚙️ Configuration Files

- [ ] Open `/mobile/config.js`
  - [ ] Verify `username: 'saumenray-afk'` is YOUR GitHub username
  - [ ] Verify `repo: 'water_tool'` is YOUR repository name
  - [ ] Verify `branch: 'main'` is YOUR branch name
  - [ ] Verify `dataFile` name matches your ZIP file

- [ ] Open `/mobile/manifest.json`
  - [ ] Change `"start_url": "/water_tool/mobile/"` (replace 'water_tool' with your repo name)
  - [ ] Change `"scope": "/water_tool/mobile/"` (replace 'water_tool' with your repo name)

- [ ] Open `/mobile/service-worker.js`
  - [ ] Update ALL paths to include your repo name (around 15 paths)
  - [ ] Example: `/mobile/` → `/water_tool/mobile/`

### 2. 🎨 App Icons

- [ ] Create 8 icon files (see `/mobile/icons/ICONS-NEEDED.md`)
- [ ] Place all icons in `/mobile/icons/` folder
- [ ] Verify file names match exactly:
  - [ ] icon-72x72.png
  - [ ] icon-96x96.png
  - [ ] icon-128x128.png
  - [ ] icon-144x144.png
  - [ ] icon-152x152.png
  - [ ] icon-192x192.png
  - [ ] icon-384x384.png
  - [ ] icon-512x512.png

### 3. 📁 File Structure

Verify your repository has this structure:
```
water_tool/
├── index.html                ← OLD tool (existing)
├── app.js                    ← OLD tool (existing)
├── DENSE_CONTINUOUS_POI...zip ← Data file (existing)
└── mobile/                   ← NEW PWA (add this)
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── config.js
    ├── pwa.js
    ├── service-worker.js
    ├── manifest.json
    ├── README.md
    ├── QUICKSTART.md
    └── icons/
        └── (8 PNG files)
```

### 4. 📤 Upload to GitHub

- [ ] Upload entire `/mobile/` folder to your repository
- [ ] Or commit and push if using git command line
- [ ] Verify all files appear on GitHub.com

### 5. 🌐 Enable GitHub Pages

- [ ] Go to Repository Settings
- [ ] Click "Pages" in sidebar
- [ ] Source: Branch `main`, Folder `/ (root)`
- [ ] Click Save
- [ ] Wait 2-3 minutes

### 6. ✅ Testing

#### Test Old Web Tool:
- [ ] Visit: `https://YOUR-USERNAME.github.io/YOUR-REPO/`
- [ ] Verify it loads correctly
- [ ] Verify map works
- [ ] Verify distributors load

#### Test New Mobile PWA:
- [ ] Visit: `https://YOUR-USERNAME.github.io/YOUR-REPO/mobile/`
- [ ] Verify login screen appears
- [ ] Login with credentials
- [ ] Check dashboard loads
- [ ] Check map loads with markers
- [ ] Check distributors list
- [ ] Test install banner (on mobile)

### 7. 📱 Mobile Installation Test

#### On Android:
- [ ] Open in Chrome
- [ ] See install banner
- [ ] Tap install
- [ ] Verify app icon appears
- [ ] Open app from home screen
- [ ] Verify it works standalone

#### On iOS:
- [ ] Open in Safari
- [ ] Tap Share button
- [ ] Tap "Add to Home Screen"
- [ ] Verify app icon appears
- [ ] Open app from home screen
- [ ] Verify it works standalone

### 8. 🔧 Feature Testing

- [ ] Login/Logout works
- [ ] Dashboard shows stats
- [ ] Navigation between views
- [ ] Side drawer opens/closes
- [ ] Bottom navigation works
- [ ] Distributor filtering
- [ ] Map displays correctly
- [ ] GPS location (if enabled)
- [ ] Offline mode (disconnect internet)
- [ ] Sync button works
- [ ] FAB menu opens
- [ ] Toast notifications appear

### 9. 👥 Share with Team

- [ ] Note the mobile URL
- [ ] Share with sales team
- [ ] Send installation instructions
- [ ] Provide login credentials
- [ ] Schedule training session

### 10. 📊 Post-Deployment

- [ ] Monitor usage
- [ ] Collect feedback
- [ ] Fix any issues
- [ ] Update as needed

---

## 🚨 Common Issues & Quick Fixes

### Issue: Service Worker won't register
**Fix:** Check all paths in `service-worker.js` include your repo name

### Issue: Icons not showing
**Fix:** Verify icon files exist with exact names in `/mobile/icons/`

### Issue: App won't install
**Fix:** 
- Must use HTTPS (GitHub Pages is HTTPS by default ✅)
- Clear browser cache
- Try incognito mode

### Issue: Data not loading
**Fix:** Check `config.js` has correct username, repo, and data file name

### Issue: 404 on /mobile/
**Fix:** 
- Verify files uploaded to GitHub
- Wait 2-3 minutes after enabling Pages
- Check Pages settings in repo

---

## 📞 Final Pre-Launch Checklist

- [ ] Config files updated with YOUR details
- [ ] Icons created and uploaded
- [ ] All files in correct locations
- [ ] GitHub Pages enabled
- [ ] Old tool still works
- [ ] New PWA loads correctly
- [ ] Can login successfully
- [ ] Can install on mobile
- [ ] Works offline
- [ ] Team members notified

---

## 🎉 Ready to Launch!

Once all items are checked:

1. **Old Tool URL:** `https://YOUR-USERNAME.github.io/YOUR-REPO/`
2. **New Mobile PWA:** `https://YOUR-USERNAME.github.io/YOUR-REPO/mobile/`

**Both apps are live and using the same data!** 🚀

---

## 📝 Credentials to Share

**Admin:**
- Username: admin
- Password: admin2024!
- Role: Admin

**Manager:**
- Username: manager
- Password: manager123
- Role: Sales Manager

**Sales:**
- Username: soumen
- Password: soumen123
- Role: Sales Person

---

**Good luck with your deployment! 🎊**

For help, refer to:
- `QUICKSTART.md` - Quick deployment guide
- `README.md` - Full documentation
- `/icons/ICONS-NEEDED.md` - Icon creation guide
