# Podcast Stats Guide - Where to Get Real Data

## 🎯 Quick Answer
Your stats are currently pulling from `config.json`. Update that file manually, or use the sources below to get real numbers.

---

## 📊 Where to Get Real Podcast Stats

### 1. **Spotify for Podcasters** (Recommended - Free & Comprehensive)
**Best for:** Episode count, total plays, unique listeners, countries

**How to access:**
1. Go to [Spotify for Podcasters](https://podcasters.spotify.com/)
2. Log in with your podcast account
3. Click on your show dashboard
4. Navigate to **"Analytics"** or **"Audience"**

**What you'll find:**
- ✅ **Episodes**: Total episode count (exact number)
- ✅ **Listeners**: Total streams or unique listeners
- ✅ **Countries**: Geographic reach data
- ✅ **Demographics**: Age, gender breakdown
- ✅ **Performance**: Episode-by-episode stats
- ✅ **Retention**: How long people listen

**Current show:** `https://creators.spotify.com/pod/profile/ashley-bradshaw2`

---

### 2. **Apple Podcasts Connect**
**Best for:** Apple ecosystem stats, reviews

**How to access:**
1. Go to [Apple Podcasts Connect](https://podcastsconnect.apple.com/)
2. Sign in with your Apple ID
3. Select your show

**What you'll find:**
- Episodes published
- Plays and downloads
- Engaged listeners
- Average consumption
- Follower count

**Your show:** `https://podcasts.apple.com/si/podcast/wandering-wild/id1825568624`

---

### 3. **YouTube Analytics** (If You Publish Video Versions)
**Best for:** Video engagement, watch time

**How to access:**
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Select your channel: `@WanderingWildThePodcast`
3. Click **"Analytics"**

**What you'll find:**
- Views, watch time
- Subscribers
- Geographic data
- Traffic sources

---

### 4. **RSS Feed Analytics** (Via Hosting Platform)
If you use **Anchor, Buzzsprout, Libsyn, Podbean**, etc.:

**Anchor/Spotify:**
- Built into Spotify for Podcasters (see #1)

**Buzzsprout:**
- Dashboard → Statistics
- Shows downloads, locations, listening apps

**Libsyn:**
- Stats → Downloads
- Geographic distribution
- Episode rankings

**Podbean:**
- Analytics tab
- Download stats, listener demographics

---

## 🔧 How to Update Your Website Stats

### Method 1: Manual Update (Easiest)
Edit `config.json`:

```json
{
  "stats": {
    "episodes": 50,        // Update from Spotify dashboard
    "listeners": 10000,    // Total streams or unique listeners
    "countries": 25,       // Number of countries from analytics
    "lastUpdated": "2025-12-15"
  }
}
```

Save the file, commit, and push to GitHub. Your site will update automatically.

---

### Method 2: Automated Stats (Advanced)

#### Option A: Spotify Web API
1. Create a [Spotify Developer Account](https://developer.spotify.com/)
2. Register your app
3. Use the **Show API** to fetch:
   - Total episodes
   - Show metadata
4. **Note:** Listener stats are NOT available via public API (only via Podcasters dashboard)

#### Option B: RSS Feed Parser
Your RSS feed auto-updates episode count. The current implementation in `script.js` already:
- Fetches episodes from RSS
- Counts total episodes
- Could be extended to update `config.json` programmatically

#### Option C: GitHub Actions Automation
Create `.github/workflows/update-stats.yml`:

```yaml
name: Update Podcast Stats
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update stats from RSS
        run: |
          # Fetch RSS, parse episode count, update config.json
          # You'd write a script here
      - name: Commit changes
        run: |
          git config --global user.name 'Stats Bot'
          git config --global user.email 'bot@wanderingwild.com'
          git add config.json
          git commit -m 'chore: update stats' || echo "No changes"
          git push
```

---

## 📈 Recommended Stats to Display

### Current Setup (Good baseline):
- ✅ Episodes
- ✅ Listeners/Streams
- ✅ Countries

### Optional Additions:
- **Hours streamed** (total listen time)
- **Average rating** (from Apple Podcasts reviews)
- **Top episode** (most popular)
- **Latest milestone** ("Just hit 15K listeners!")

---

## 🎯 Pro Tips

### 1. **Be Honest About Numbers**
- Use "streams" or "plays" instead of "listeners" if counting plays
- Round to nearest thousand for big numbers (10.5K instead of 10,473)
- Update quarterly if you don't have automation

### 2. **Focus on Growth Metrics**
Instead of just totals, consider showing:
- "+2K listeners this month"
- "Growing in 30+ countries"
- "Top 1% in [category]"

### 3. **Cross-Platform Reality**
Your **total reach** = Spotify + Apple + YouTube + others
- Spotify usually has the most detailed analytics
- Apple provides good demographic data
- YouTube shows video engagement

### 4. **Current Estimate for Wandering Wild**
Based on your Spotify show ID and typical podcast metrics:
- Check Spotify for Podcasters for **exact numbers**
- Episodes: Count from RSS or dashboard
- Listeners: Use "Total streams" ÷ episodes for rough average
- Countries: Check "Top Territories" in Spotify analytics

---

## 🚀 Next Steps

1. **Right now:** Log into [Spotify for Podcasters](https://podcasters.spotify.com/) and note your stats
2. **Update:** Change the numbers in `config.json` to match reality
3. **Commit:** Push changes to GitHub
4. **Verify:** Refresh your site to see updated stats
5. **Schedule:** Set a calendar reminder to update monthly

---

## 📞 Questions?

- **Can't access analytics?** Make sure you've claimed your podcast on each platform
- **Numbers seem off?** Different platforms count differently (streams vs. downloads vs. unique listeners)
- **Want automation?** Consider a cron job or GitHub Action to fetch from APIs

---

**Last Updated:** December 15, 2025  
**Config File:** `config.json`  
**Current Stats:** Episodes: 50 | Listeners: 10K | Countries: 25
