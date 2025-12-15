# RSS Feed Setup Guide

## How to Get Your Podcast RSS Feed URL

### From Spotify for Podcasters
1. Go to https://podcasters.spotify.com/
2. Log in with your account
3. Click on **"Wandering Wild"** (your show)
4. Navigate to **"Availability"** or **"Distribution"** in the left menu
5. Look for **"RSS feed"** section
6. Copy the full RSS feed URL

Your RSS URL will look something like:
- `https://anchor.fm/s/abc12345/podcast/rss`
- Or another format depending on your host

### Add RSS Feed to Website

1. Open `config.json` file
2. Find the `podcastInfo` section
3. Paste your RSS URL:

```json
{
  "podcastInfo": {
    "rssFeedUrl": "https://anchor.fm/s/YOUR-FEED-ID/podcast/rss"
  },
  "settings": {
    "enableRSSAutoUpdate": true
  }
}
```

4. Set `enableRSSAutoUpdate` to `true`
5. Save the file
6. Refresh your website

## What This Does

✅ **Episode Archive section auto-populates** with all your episodes
✅ **Titles, descriptions, and links** pulled automatically from RSS
✅ **New episodes appear automatically** when you publish
✅ **Search and filter** work on all episodes
✅ **No manual updating needed** - just publish to Spotify!

## Troubleshooting

### RSS feed not loading?
- Check that the URL is correct (copy-paste carefully)
- Make sure `enableRSSAutoUpdate` is set to `true`
- RSS feed must be publicly accessible
- Check browser console (F12) for error messages

### Episodes not showing?
- Default episodes will show if RSS is not configured
- The Spotify player widget always works independently
- RSS service (rss2json.com) may have rate limits on free tier

### Want to use a different RSS service?
Edit `script.js` line 247 to use a different RSS-to-JSON converter:
```javascript
const rssToJsonUrl = `https://YOUR-RSS-SERVICE.com/convert?url=${encodeURIComponent(config.podcastInfo.rssFeedUrl)}`;
```

## Benefits of RSS Auto-Update

📱 **Publish once, update everywhere** - Just publish to Spotify
⏱️ **Saves time** - No manual website updates needed
✨ **Always current** - Website stays in sync with podcast
🔍 **Better SEO** - Fresh content helps search rankings

---

**Note**: The episode archive section will show placeholder episodes until you configure the RSS feed. The Spotify embed player will always work regardless of RSS configuration.
