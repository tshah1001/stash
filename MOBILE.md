# Mobile Save Functionality

Stash now supports saving articles from mobile devices with native share sheet integration!

## Quick Start

### iOS (iPhone/iPad)
1. Open Stash in Safari
2. Tap Share → "Add to Home Screen"
3. Open Stash from home screen once
4. Now in ANY app, tap Share → "Stash" to save articles

### Android
1. Open Stash in Chrome
2. Tap menu → "Install app" or "Add to Home screen"
3. Open Stash from home screen once
4. Now in ANY app, tap Share → "Stash" to save articles

## Features

✅ Save from **any app** - Safari, Chrome, NYT, Substack, Twitter, Reddit, etc.
✅ Works **offline** - saves queue and sync when online
✅ **Full content extraction** - article text, images, metadata
✅ **2-tap save** - Share → Stash
✅ **iOS Shortcut** for paywalled content (NYT, Medium, etc.)

## What's New

### Web Share Target API
Your Stash PWA now registers as a share target on iOS and Android. This means:
- Appears in the native share sheet across ALL apps
- Seamless one-tap sharing experience
- Offline support with automatic syncing
- No additional installation beyond PWA

**Files Added:**
- `web/share.html` - Share handler page
- `web/share.js` - Save logic with offline queue
- `web/manifest.json` - Updated with share_target config
- `web/sw.js` - Enhanced with offline queue processing

### Enhanced iOS Shortcut
For paywalled sites (NYT, Medium, Substack) that you're logged into:
- Client-side content extraction before sending to server
- Works with sites that block server-side fetching
- Extracts full article text, images, metadata
- Supports highlight saving

**Files Added:**
- `ios-shortcut/extraction-script.js` - Content extraction code
- `ios-shortcut/README.md` - Comprehensive setup guide

### Mobile Setup Guide
User-friendly guide for setting up mobile save functionality:
- Platform-specific instructions (iOS/Android)
- Step-by-step walkthroughs
- Troubleshooting section
- Comparison tables

**Files Added:**
- `web/mobile-setup.html` - Interactive setup guide

## Architecture

### Web Share Target Flow
```
Mobile App → Share → Stash
  ↓
share.html receives URL via query params
  ↓
share.js calls Edge Function /save-page
  ↓
Edge Function fetches & extracts content
  ↓
Saves to Supabase → Success message → Redirect to app
```

### iOS Shortcut Flow (Paywalled Content)
```
Safari/App → Share → "Save to Stash" Shortcut
  ↓
JavaScript extracts content from current page
  ↓
Sends extracted content to Edge Function
  ↓
Edge Function uses prefetched data (no server fetch)
  ↓
Saves to Supabase → Notification
```

### Offline Support
```
User shares while offline
  ↓
share.js detects offline state
  ↓
Saves to IndexedDB queue
  ↓
Shows "Saved (will sync when online)" message
  ↓
Service worker processes queue when connection restored
  ↓
Sends queued saves to Edge Function
  ↓
Shows sync notification
```

## Configuration

No additional configuration required! The mobile features use the same config as your existing Stash setup:

- `CONFIG.SUPABASE_URL` - Your Supabase project URL
- `CONFIG.USER_ID` - Your user UUID
- Edge Function endpoint: `/functions/v1/save-page`

## Testing

### Test on iOS:
1. Install PWA (Add to Home Screen)
2. Open NYT app or Safari with an article
3. Tap Share → "Stash"
4. Verify article saves and appears in Stash

### Test iOS Shortcut:
1. Follow setup in `ios-shortcut/README.md`
2. Open paywalled NYT article (while logged in)
3. Tap Share → "Save to Stash" shortcut
4. Verify full content is extracted and saved

### Test Offline:
1. Enable airplane mode on phone
2. Try to save an article via share sheet
3. Verify "Saved (will sync when online)" message
4. Disable airplane mode
5. Open Stash app
6. Verify article syncs to Supabase

### Test Android:
1. Install PWA from Chrome
2. Share from any app
3. Verify "Stash" appears in share menu
4. Verify article saves

## Browser Compatibility

| Platform | Browser | Web Share Target | iOS Shortcut | Status |
|----------|---------|------------------|--------------|--------|
| iOS 15+ | Safari | ✅ | ✅ | Fully supported |
| iOS 15+ | Chrome | ⚠️ Limited | ✅ | Chrome uses WKWebView |
| Android 6+ | Chrome | ✅ | ❌ | Web Share only |
| Android 6+ | Firefox | ✅ | ❌ | Web Share only |

## Usage Examples

### Save from NYT App (iOS)
1. Reading an article in NYT app
2. Tap Share icon
3. Scroll to find "Stash"
4. Tap "Stash"
5. See success message
6. Article saved with full content

### Save Paywalled Article (iOS)
1. Reading paywalled Medium article in Safari (logged in)
2. Tap Share
3. Select "Save to Stash" (iOS Shortcut)
4. Shortcut extracts content from your authenticated session
5. Full article saved to Stash

### Save While Offline
1. On airplane or poor connection
2. Tap Share → "Stash" as normal
3. See "Saved (will sync when online)"
4. Continue browsing
5. When online, saves auto-sync in background

## Troubleshooting

### Stash doesn't appear in share menu
- Ensure PWA is installed (Add to Home Screen)
- Open Stash app at least once
- Restart phone
- Make sure sharing a URL (not image/file)

### Content not extracted (empty article)
- Site may block server-side fetching
- Use iOS Shortcut for paywalled sites
- Article URL and title still saved

### Offline saves not syncing
- Open Stash app to trigger sync
- Check internet connection
- Service worker may need time to process queue

## Files Changed

### Modified Files
- `web/manifest.json` - Added share_target configuration
- `web/sw.js` - Added offline queue processing, updated cache
- `ios-shortcut/README.md` - Complete rewrite with enhanced setup

### New Files
- `web/share.html` - Share target handler UI
- `web/share.js` - Share logic and offline queue
- `web/mobile-setup.html` - User setup guide
- `ios-shortcut/extraction-script.js` - Content extraction code
- `MOBILE.md` - This file

## Next Steps

1. **Deploy Updated Web App**
   - Upload modified files to your hosting (Vercel/Netlify)
   - Service worker will auto-update on user devices

2. **Test on Real Devices**
   - Test on iPhone with iOS 15+
   - Test on Android phone with Chrome
   - Verify both online and offline scenarios

3. **Share Setup Guide**
   - Link to `mobile-setup.html` from main app settings
   - Add prominent "Mobile Setup" button for first-time mobile users

4. **Monitor Usage**
   - Check `source` field in Supabase saves table
   - Look for: `mobile-share`, `mobile-share-offline`, `ios-shortcut`

## Future Enhancements

- Safari Extension for iOS (requires Xcode, App Store)
- Background Sync API for better offline support
- Push notifications for sync status
- Share Extension (native iOS) for better integration
- Android TWA (Trusted Web Activity) for Play Store distribution

## Support

For issues or questions:
- Check `web/mobile-setup.html` for setup help
- Review `ios-shortcut/README.md` for shortcut troubleshooting
- Test saving from web app first to verify backend is working
- Ensure Edge Function is deployed and accessible

---

**Ready to test!** Open `mobile-setup.html` on your phone to get started.
