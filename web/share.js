// Stash Share Handler
// Processes URLs shared from other apps via Web Share Target API

(async function() {
  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  const sharedUrl = params.get('url') || params.get('text') || '';
  const sharedTitle = params.get('title') || '';

  // Extract URL from text if needed (some apps send URL in text field)
  function extractUrl(text) {
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    return urlMatch ? urlMatch[0] : text;
  }

  const url = extractUrl(sharedUrl);

  // Show URL preview
  if (url) {
    const urlPreview = document.getElementById('url-preview');
    urlPreview.textContent = url;
    urlPreview.classList.remove('hidden');
  }

  // Validate configuration
  if (!CONFIG.SUPABASE_URL || CONFIG.SUPABASE_URL.includes('YOUR_PROJECT')) {
    showError('Configuration Required', 'Please configure your Supabase connection in config.js');
    console.error('Stash configuration error: config.js contains placeholder values');
    return;
  }

  // Validate URL
  if (!url || !url.startsWith('http')) {
    showError('Invalid URL', 'Please share a valid web page URL');
    return;
  }

  try {
    // Check if we're online
    const isOnline = navigator.onLine;

    if (!isOnline) {
      // Queue for offline save
      await queueOfflineSave(url, sharedTitle);
      showSuccess('Saved offline! Will sync when online.');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;
    }

    // Call Edge Function to save the page
    const response = await fetch(`${CONFIG.SUPABASE_URL}/functions/v1/save-page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        user_id: CONFIG.USER_ID,
        source: 'mobile-share',
        prefetched: sharedTitle ? { title: sharedTitle } : null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.message || `Server error (${response.status})`;
      console.error('Save failed:', errorMsg, errorData);
      throw new Error(errorMsg);
    }

    const result = await response.json();

    // Success!
    showSuccess();

    // Redirect to main app after short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);

  } catch (error) {
    console.error('Save error:', error);
    showError('Save Failed', error.message);
  }
})();

function showSuccess(customMessage) {
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('error-state').classList.add('hidden');

  const successState = document.getElementById('success-state');
  successState.classList.remove('hidden');

  if (customMessage) {
    successState.querySelector('.message').textContent = customMessage;
  }
}

function showError(title, message) {
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('success-state').classList.add('hidden');

  const errorState = document.getElementById('error-state');
  errorState.classList.remove('hidden');

  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;

  const errorDetails = document.getElementById('error-details');
  errorDetails.textContent = `Error: ${title}`;
  errorDetails.classList.remove('hidden');
}

// Offline save queue using IndexedDB
async function queueOfflineSave(url, title) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('StashOfflineQueue', 1);

    request.onerror = () => reject(request.error);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('saves')) {
        db.createObjectStore('saves', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['saves'], 'readwrite');
      const store = transaction.objectStore('saves');

      const saveData = {
        url: url,
        title: title,
        timestamp: Date.now(),
        user_id: CONFIG.USER_ID,
        source: 'mobile-share-offline',
      };

      const addRequest = store.add(saveData);

      addRequest.onsuccess = () => {
        console.log('Queued offline save:', url);
        resolve();
      };

      addRequest.onerror = () => reject(addRequest.error);
    };
  });
}
