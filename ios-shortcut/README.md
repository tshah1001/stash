# Stash iOS Shortcut

Save articles to Stash from your iPhone's share sheet with full content extraction.

## Quick Start

Choose the option that works best for you:

### Option 1: Enhanced Shortcut (Recommended for Paywalled Content)
Extracts article content client-side, perfect for NYT, Medium, Substack, etc.

### Option 2: Simple Shortcut (Quick Setup)
Saves URL and title only, lets server extract content.

---

## Enhanced Shortcut Setup (Full Content Extraction)

This version extracts the full article content before sending to Stash, so it works with paywalled sites you're logged into.

### Step 1: Create the Shortcut

1. Open the **Shortcuts** app on your iPhone
2. Tap the **+** button to create a new shortcut
3. Add the following actions in order:

#### Action 1: Receive Input
- Search for and add: **Receive** what's passed to the shortcut
- Accept types: **URLs** and **Safari web pages**

#### Action 2: Run JavaScript on Web Page
- Search for and add: **Run JavaScript on Web Page**
- Tap "Show More"
- Web Page: Select **Shortcut Input** (from previous action)
- JavaScript: Copy and paste the entire content from `extraction-script.js` in this folder

#### Action 3: Set Variable
- Search for and add: **Set variable**
- Variable name: `ExtractedData`
- Input: **Shortcut Input** (the JavaScript result)

#### Action 4: Get Contents of URL
- Search for and add: **Get Contents of URL**
- URL: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/save-page`
- Method: **POST**
- Headers:
  - Tap "Add new field" → Add **Request Body**
- Request Body: **JSON**
  - Tap the Request Body field
  - Delete the default `{}`
  - Add a **Text** field
  - Paste this template:
    ```
    {
      "url": "[URL from ExtractedData]",
      "user_id": "YOUR_USER_ID",
      "source": "ios-shortcut",
      "prefetched": {
        "title": "[title from ExtractedData]",
        "content": "[content from ExtractedData]",
        "excerpt": "[excerpt from ExtractedData]",
        "image_url": "[image_url from ExtractedData]",
        "site_name": "[site_name from ExtractedData]",
        "author": "[author from ExtractedData]"
      },
      "highlight": "[highlight from ExtractedData]"
    }
    ```
  - Replace the bracketed values with variables from ExtractedData (parse the JSON from Action 3)

#### Action 5: Show Notification
- Search for and add: **Show Notification**
- Title: **Saved to Stash!**
- Body: (leave blank or add custom message)

### Step 2: Configure the Shortcut

1. Tap the shortcut name at the top (probably "New Shortcut")
2. Rename it to: **Save to Stash**
3. Tap the **(i)** info icon in the top right
4. Enable **Show in Share Sheet**
5. Accept types: Make sure **URLs** and **Safari web pages** are checked
6. Tap **Done**

### Step 3: Replace Configuration Values

You need to replace these placeholders in the shortcut:

- `YOUR_PROJECT_ID`: Your Supabase project ID (from your Supabase dashboard URL)
- `YOUR_USER_ID`: Your user UUID (from Supabase → Authentication → Users)

Find these values in your `web/config.js` file.

### Step 4: Test It!

1. Open Safari and navigate to any article
2. Tap the **Share** button
3. Scroll down and select **Save to Stash**
4. Wait for the "Saved to Stash!" notification
5. Open your Stash web app to see the saved article

---

## Simple Shortcut Setup (No Content Extraction)

If you just want to save URLs quickly without content extraction:

### Actions:

1. **Receive** URLs and Safari web pages
2. **Get URLs from** Shortcut Input
3. **Get Contents of URL**
   - URL: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/save-page`
   - Method: **POST**
   - Headers: `Content-Type: application/json`
   - Request Body (JSON):
     ```json
     {
       "url": [URLs from step 2],
       "user_id": "YOUR_USER_ID",
       "source": "ios-shortcut"
     }
     ```
4. **Show Notification**: "Saved to Stash!"

### Enable in Share Sheet:
1. Tap shortcut name → Info icon
2. Enable "Show in Share Sheet"
3. Accept: URLs and Safari web pages

---

## Usage

### From Safari:
1. While viewing an article, tap the Share button
2. Scroll down and select "Save to Stash"
3. Done!

### From Apps (NYT, Substack, Twitter, etc.):
1. Tap the Share button in the app
2. Select "Save to Stash"
3. The shortcut will extract the article content

### Saving Highlights:
1. Select text on a web page
2. Tap Share → "Save to Stash"
3. The selected text will be saved as a highlight

---

## Troubleshooting

### "Could not run JavaScript" error
- Make sure you're sharing from Safari or a web page
- Some apps don't allow JavaScript execution
- Try copying the URL and pasting it in Safari first

### Notification says "Failed to save"
- Check your Supabase URL and user ID are correct
- Make sure you're connected to the internet
- Verify your Supabase project is running

### Shortcut doesn't appear in Share Sheet
- Make sure "Show in Share Sheet" is enabled in shortcut settings
- Accepted types must include "URLs" and "Safari web pages"
- Try restarting your iPhone

### Content not extracted (empty article)
- The JavaScript extraction might not work on all sites
- Try the Simple Shortcut instead (server will fetch content)
- Some sites actively block content extraction

---

## What Gets Extracted?

The enhanced shortcut extracts:
- ✅ Article title (from `<h1>` or `<title>`)
- ✅ Full article text (from article, main, and content selectors)
- ✅ Description/excerpt (from meta tags)
- ✅ Featured image (from Open Graph tags)
- ✅ Author name (from meta tags or author elements)
- ✅ Site name (from domain or meta tags)
- ✅ Selected text (if you highlight before sharing)

---

## Advanced: Customizing the Extraction

The extraction script (`extraction-script.js`) can be customized to work better with specific sites.

For example, if you frequently save from a site with a unique article structure, you can add custom selectors:

```javascript
// Add custom selectors for specific sites
if (window.location.hostname.includes('example.com')) {
  document.querySelectorAll('.custom-article-class p').forEach(p => {
    paragraphs.push(p.innerText?.trim());
  });
}
```

---

## Comparison: Enhanced vs Simple vs Web Share Target

| Feature | Enhanced Shortcut | Simple Shortcut | Web Share Target (PWA) |
|---------|-------------------|-----------------|------------------------|
| Content extraction | ✅ Client-side | ❌ Server-side | ❌ Server-side |
| Works with paywalls | ✅ Yes | ❌ No | ❌ No |
| Setup difficulty | Medium | Easy | Easy |
| Works in all apps | ✅ Yes | ✅ Yes | ✅ Yes |
| Saves highlights | ✅ Yes | ❌ No | ❌ No |
| Offline support | ❌ No | ❌ No | ✅ Yes |

**Recommendation:**
- Use **Enhanced Shortcut** for paywalled content (NYT, Medium, Substack)
- Use **Web Share Target** (PWA) for quick public article saves
- Use both! They complement each other perfectly

---

## Files in This Directory

- `README.md` - This file
- `extraction-script.js` - JavaScript code for content extraction (copy into Shortcuts app)

---

## Getting Help

If you encounter issues:
1. Check that your Supabase URL and user ID are correct in `web/config.js`
2. Verify the Edge Function is deployed: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/save-page`
3. Test saving from the web app first to make sure your setup is working
4. Open an issue on GitHub if problems persist

---

## Privacy & Security

- The extraction happens on your device (client-side)
- Article content is sent directly to your Supabase instance
- No third-party servers involved
- Your credentials stay on your device
