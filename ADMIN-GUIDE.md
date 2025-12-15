# Wandering Wild Podcast - Admin Guide

## 🔐 Admin Mode Access

### How to Enter Admin Mode
1. **Add `?admin=true` to your website URL**
   - Example: `https://yourwebsite.com/?admin=true`
   - Or: `https://yourwebsite.com/?edit=true`
2. **Enter Password**: `wandering2024` (change this in `config.json`)
3. **That's it!** No visible buttons for regular visitors

### What You Can Edit
- ✏️ **Any text** on the page - just click and type
- 🔗 **Links** - click any link to change the URL
- 🖼️ **Images** - click images to add new URLs
- 🎨 **All content** saves automatically

---

## 📊 Updating Podcast Stats (Episodes, Listeners, Countries)

### Edit the config.json File (Easiest!)
1. Open the file `config.json` in any text editor
2. Update the stats section:
```json
{
  "stats": {
    "episodes": 52,
    "listeners": 12500,
    "countries": 30,
    "lastUpdated": "2024-12-15"
  }
}
```
3. Save the file
4. Refresh your website - stats update automatically!

### Method 2: Get Real-Time Stats from Spotify

To automatically pull real stats from Spotify for Podcasters:

1. **Get Your RSS Feed URL**:
   - Go to [Spotify for Podcasters](https://podcasters.spotify.com/)
   - Navigate to your show dashboard
   - Find your RSS feed URL

2. **Update `script.js`**:
   - Find the `loadEpisodesFromRSS()` function
   - Replace `YOUR_FEED_ID` with your actual feed ID
   - The episodes will auto-update from your RSS feed!

### Method 3: Spotify API Integration (Advanced)

For real-time listener stats:
1. Create a Spotify Developer account
2. Get API credentials
3. Use the Spotify Web API to fetch show analytics
4. Update the stats JSON automatically via a script

---

## 📝 Updating Episodes (RSS Feed Setup)

### Get Your RSS Feed URL
1. Go to [Spotify for Podcasters](https://podcasters.spotify.com/)
2. Click on your show
3. Go to **"Availability"** or **"Distribution"** section
4. Copy your **RSS feed URL** (looks like: `https://anchor.fm/s/xxxxx/podcast/rss`)

### Enable Auto-Updating Episodes
1. Open `config.json`
2. Update these fields:
```json
{
  "podcastInfo": {
    "rssFeedUrl": "PASTE_YOUR_RSS_URL_HERE",
  },
  "settings": {
    "enableRSSAutoUpdate": true
  }
}
```
3. Save and refresh - episodes will load automatically from your RSS feed!

### Note
- The Spotify player widget always shows your episodes
- The archive section can auto-populate from RSS
- Manual episodes shown by default until you add RSS feed

---

## 🎨 Customization Tips

### Change Release Day
In Admin Mode:
1. Open the Admin Panel (it appears when you enable admin mode)
2. Click the "Release Day" dropdown
3. Select a different day (currently set to Tuesday)

### Update Colors
Edit `styles.css` at the top:
```css
:root {
    --primary-green: #2e7d32;  /* Main green color */
    --accent-green: #4caf50;   /* Lighter green */
}
```

### Change Password
Edit `config.json`:
```json
{
  "settings": {
    "adminPassword": "YOUR_NEW_PASSWORD"
  }
}
```

---

## 💾 Backup & Export

### Export Your Content
1. Enter Admin Mode
2. Click **"💾 Export Content"** in the Admin Panel
3. A JSON file will download with all your changes
4. Keep this file safe as a backup!

### Import Content
1. Enter Admin Mode
2. Click **"📥 Import Content"**
3. Select your saved JSON file
4. Page refreshes with your saved content

### Reset to Default
If something goes wrong:
1. Enter Admin Mode
2. Click **"🔄 Reset to Default"**
3. Confirms before resetting

---

## 🚀 Publishing Updates

### After Making Changes
1. Your changes are saved in the browser's local storage
2. To make them permanent, you need to update the actual files
3. Consider using:
   - **GitHub Pages** (free hosting)
   - **Netlify** (free, easy to update)
   - **Vercel** (free, automatic deployments)

### Recommended: Connect to Netlify
1. Push your files to GitHub
2. Connect to Netlify
3. Any file changes auto-deploy
4. Free SSL certificate included
5. Custom domain support

---

## 📱 Social Media Icons

All social icons use proper SVG graphics:
- Instagram ✅
- YouTube ✅
- Spotify ✅
- Apple Podcasts ✅
- Twitter/X (for sharing) ✅
- Facebook (for sharing) ✅

To change social links:
1. Enter Admin Mode
2. Click any social icon link
3. Enter new URL
4. Saves automatically

---

## 🆘 Troubleshooting

### Stats Not Updating
- Check that `podcast-stats.json` is in the same folder as `index.html`
- Make sure the date format is `YYYY-MM-DD`
- Refresh the page with `Cmd/Ctrl + Shift + R` to clear cache

### Admin Mode Not Working
- Make sure JavaScript is enabled in your browser
- Try a different browser (Chrome, Safari, Firefox)
- Check browser console for errors (F12 key)

### Episodes Not Loading
- The Spotify player widget always works
- For RSS integration, you need to add your RSS feed URL
- Check that your RSS feed is publicly accessible

---

## 📞 Need Help?

Contact your web developer or:
1. Check browser console (F12) for error messages
2. Make sure all files are uploaded to your server
3. Test on multiple browsers
4. Keep a backup of your `podcast-stats.json` file

---

**Last Updated**: December 2, 2024
**Website Version**: 2.0 with Admin Mode
