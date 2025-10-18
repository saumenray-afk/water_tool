# RTM Mobile PWA - Route to Market Sales Tool

A comprehensive Progressive Web App for sales teams and managers to manage distributors, track visits, create orders, and expand market reach.

## 🚀 Features

### For Sales People:
- **Dashboard** - Real-time sales stats, today's visits, and activity timeline
- **Map View** - Interactive map with distributors, retailers, and POIs
- **GPS Tracking** - Automatic location tracking during visits
- **Distributor Management** - View and manage distributor information
- **Retailer Management** - Add new retailers and track existing ones
- **Visit Tracking** - Plan, execute, and complete visits with GPS check-in
- **Order Creation** - Create orders on-the-go during visits
- **Expense Tracking** - Log daily expenses with photo capture
- **Offline Mode** - Work without internet, auto-sync when online
- **Performance Dashboard** - Track your targets and achievements

### For Sales Managers:
- **Team Dashboard** - Monitor entire team performance
- **Team Leaderboard** - See top performers and achievements
- **Team Reports** - Generate comprehensive team analytics
- **Coverage Analysis** - Identify gaps and expansion opportunities
- **Real-time Tracking** - See team member locations and activities

### Technical Features:
- ✅ **Progressive Web App** - Install on any device (Android/iOS/Desktop)
- ✅ **Offline First** - Works without internet connection
- ✅ **Auto-sync** - Automatic data synchronization when online
- ✅ **GPS Integration** - Real-time location tracking
- ✅ **Push Notifications** - Get alerts for important events
- ✅ **Mobile-First Design** - Optimized for smartphones
- ✅ **Fast & Lightweight** - Quick loading, minimal data usage
- ✅ **Secure** - Role-based access control

## 📱 Installation

### For End Users:

#### On Android:
1. Open Chrome browser
2. Visit the app URL
3. Tap the "Install" banner at the top
4. Or tap menu (⋮) → "Add to Home Screen"
5. App icon will appear on your home screen

#### On iOS:
1. Open Safari browser
2. Visit the app URL
3. Tap the Share button (□ with ↑)
4. Scroll and tap "Add to Home Screen"
5. Tap "Add" in the top right

#### On Desktop:
1. Open Chrome/Edge browser
2. Visit the app URL
3. Look for install icon (⊕) in address bar
4. Click "Install"

## 🔧 Deployment to GitHub Pages

### Prerequisites:
- GitHub account
- Your existing `water_tool` repository

### Step-by-Step Deployment:

#### 1. **Prepare Your Repository**

```bash
# Navigate to your water_tool repository
cd water_tool

# Create mobile folder
mkdir mobile

# Copy all PWA files to mobile folder
# (index.html, styles.css, app.js, config.js, pwa.js, service-worker.js, manifest.json)
```

#### 2. **File Structure**
Your repository should look like this:
```
water_tool/
├── index.html                          ← Your OLD web tool
├── app.js                              ← Your OLD web tool
├── DENSE_CONTINUOUS_POI_...zip         ← Shared data file
└── mobile/                             ← NEW PWA app
    ├── index.html
    ├── styles.css
    ├── app.js
    ├── config.js
    ├── pwa.js
    ├── service-worker.js
    ├── manifest.json
    └── icons/
        ├── icon-72x72.png
        ├── icon-96x96.png
        ├── icon-128x128.png
        ├── icon-144x144.png
        ├── icon-152x152.png
        ├── icon-192x192.png
        ├── icon-384x384.png
        └── icon-512x512.png
```

#### 3. **Create App Icons**

You need to create PNG icons in these sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Option A: Use Online Tool**
- Visit https://www.pwabuilder.com/imageGenerator
- Upload a 512x512 logo
- Download generated icons
- Place in `/mobile/icons/` folder

**Option B: Use Design Tool**
- Create icons in Photoshop/Figma/Canva
- Export in required sizes
- Name them exactly as shown above

#### 4. **Update Config File**

Open `/mobile/config.js` and verify:
```javascript
const GITHUB_CONFIG = {
    username: 'saumenray-afk',           // ✅ Already correct
    repo: 'water_tool',                   // ✅ Already correct
    branch: 'main',                       // ✅ Check your branch name
    dataFile: 'DENSE_CONTINUOUS_POI_150KM_20251010_225505.zip'  // ✅ Your data file
};
```

#### 5. **Update Manifest URLs**

Open `/mobile/manifest.json` and update:
```json
{
  "start_url": "/water_tool/mobile/",     ← Change this
  "scope": "/water_tool/mobile/",         ← Change this
  ...
}
```

Replace `/mobile/` with `/water_tool/mobile/` (your repo name)

#### 6. **Update Service Worker**

Open `/mobile/service-worker.js` and update paths:
```javascript
const PRECACHE_ASSETS = [
    '/water_tool/mobile/',                    ← Add repo name
    '/water_tool/mobile/index.html',          ← Add repo name
    '/water_tool/mobile/styles.css',          ← Add repo name
    // ... update all paths
];
```

#### 7. **Commit and Push**

```bash
# Add all files
git add .

# Commit
git commit -m "Add RTM Mobile PWA app"

# Push to GitHub
git push origin main
```

#### 8. **Enable GitHub Pages**

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll to "Pages" in left sidebar
4. Under "Source", select branch: `main`
5. Select folder: `/ (root)`
6. Click "Save"
7. Wait 2-3 minutes for deployment

#### 9. **Access Your Apps**

- **Old Web Tool:** `https://saumenray-afk.github.io/water_tool/`
- **New Mobile PWA:** `https://saumenray-afk.github.io/water_tool/mobile/`

## 🎯 Usage

### Login Credentials:

**Admin:**
- Username: `admin`
- Password: `admin2024!`
- Role: Admin

**Sales Manager:**
- Username: `manager`
- Password: `manager123`
- Role: Sales Manager

**Sales Person:**
- Username: `soumen`
- Password: `soumen123`
- Role: Sales Person

### Quick Start Guide:

1. **Login** with your credentials
2. **Install** the app on your device
3. **Dashboard** - View your daily stats
4. **Enable GPS** - Allow location access
5. **Start Visit** - Begin your first customer visit
6. **Create Order** - Place orders during visits
7. **Sync Data** - Data syncs automatically when online

## 📊 Data Source

Both apps (old web tool and new mobile PWA) use the **same data source**:
- Distributor data from `config.js`
- POI data from ZIP file in GitHub repository
- No database required - everything loads from GitHub!

## 🔄 Updates

To update the app:

1. Make changes to files
2. Commit and push to GitHub
3. Users will see update notification
4. They can refresh to get latest version

Service Worker handles caching and updates automatically.

## 🎨 Customization

### Change Colors:
Edit `styles.css`:
```css
:root {
    --primary: #667eea;      /* Main color */
    --secondary: #764ba2;    /* Secondary color */
}
```

### Change App Name:
Edit `manifest.json`:
```json
{
  "name": "Your Company RTM",
  "short_name": "RTM"
}
```

### Add Your Logo:
Replace icon files in `/mobile/icons/`

## 🐛 Troubleshooting

### App not installing?
- Check if HTTPS is enabled (required for PWA)
- Clear browser cache
- Try different browser

### Data not loading?
- Check internet connection
- Verify GitHub repo is public
- Check browser console for errors

### Offline mode not working?
- Service Worker requires HTTPS
- Check if Service Worker registered (console)
- Clear cache and reload

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are uploaded correctly
3. Ensure GitHub Pages is enabled
4. Check manifest.json and service-worker.js paths

## 📝 License

This PWA tool is created for internal business use.

## 🎉 Success!

Your RTM Mobile PWA is now live and ready to use! Share the link with your sales team:

**🔗 App URL:** `https://saumenray-afk.github.io/water_tool/mobile/`

Both your old web tool and new mobile app are running side-by-side, using the same data! 🚀
