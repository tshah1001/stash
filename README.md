# Stash

A simple, self-hosted read-it-later app. Save articles, highlights, and Kindle notes to your own database.

**Your data. Your server. No subscription.**

## Features

- **Chrome Extension** - Save pages and highlights with one click
- **Mobile Share Sheet** - 📱 **NEW!** Save from any mobile app (NYT, Substack, Safari, etc.) with 2 taps
- **Web App** - Access your saves from any device
- **Kindle Sync** - Import highlights from your Kindle library
- **Full-Text Search** - Find anything you've saved
- **Text-to-Speech** - Listen to articles with neural voices (free)
- **iOS Shortcut** - Save from Safari on iPhone/iPad (with content extraction for paywalled sites)
- **Bookmarklet** - Works in any browser
- **Offline Support** - Save articles offline, sync automatically when online

## Why Stash?

- **Free forever** - Runs on Supabase free tier (500MB, unlimited API calls)
- **You own your data** - Everything stored in your own database
- **No account needed** - Single-user mode, no sign-up friction
- **Works offline** - PWA support for mobile
- **Open source** - Fork it, modify it, make it yours

## Quick Start

1. **Create a Supabase project** (free) at [supabase.com](https://supabase.com)
2. **Run the schema** from `supabase/schema.sql`
3. **Add your credentials** to `extension/config.js` and `web/config.js`
4. **Load the extension** in Chrome (`chrome://extensions` > Load unpacked)
5. **Deploy the web app** to Vercel/Netlify (free)

See [SETUP.md](SETUP.md) for detailed instructions.

## 📱 Mobile Setup

Stash now supports native mobile save functionality! Save articles from any app on your phone.

**For iOS/Android users:**
1. Open Stash in Safari (iOS) or Chrome (Android)
2. Add to Home Screen / Install app
3. Open Stash once from home screen
4. Now Share → "Stash" works from ANY app!

**For paywalled content on iOS:**
Set up the enhanced iOS Shortcut for client-side content extraction.

👉 **[Full Mobile Setup Guide](MOBILE.md)** | **[iOS Shortcut Guide](ios-shortcut/README.md)**

## Project Structure

```
stash/
├── extension/       # Chrome extension
├── web/            # Web app (PWA)
├── tts/            # Text-to-speech generator
├── bookmarklet/    # Universal save bookmarklet
├── ios-shortcut/   # iOS Shortcut for Safari
└── supabase/       # Database schema & Edge Functions
```

## Tech Stack

- **Frontend**: Vanilla JS, HTML, CSS (no framework bloat)
- **Backend**: Supabase (PostgreSQL + REST API)
- **Hosting**: Any static host (Vercel, Netlify, GitHub Pages)

## Screenshots

*Coming soon*

## License

MIT
