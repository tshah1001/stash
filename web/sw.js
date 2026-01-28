// Stash Service Worker
const CACHE_NAME = 'stash-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/config.js',
  '/manifest.json',
  '/share.html',
  '/share.js',
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();

  // Start processing offline queue
  processOfflineQueue();
});

// Fetch - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API requests (let them go to network)
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })
  );
});

// Process offline save queue when connection is restored
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PROCESS_QUEUE') {
    processOfflineQueue();
  }
});

// Listen for online event
self.addEventListener('online', () => {
  processOfflineQueue();
});

// Process queued offline saves
async function processOfflineQueue() {
  try {
    const db = await openOfflineDB();
    const transaction = db.transaction(['saves'], 'readonly');
    const store = transaction.objectStore('saves');
    const allSaves = await getAllFromStore(store);

    if (allSaves.length === 0) {
      return;
    }

    console.log(`Processing ${allSaves.length} offline saves`);

    for (const save of allSaves) {
      try {
        // Attempt to save via Edge Function
        const response = await fetch(`${save.functionUrl || 'https://YOUR_PROJECT_ID.supabase.co'}/functions/v1/save-page`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: save.url,
            user_id: save.user_id,
            source: save.source,
            prefetched: save.title ? { title: save.title } : null,
          }),
        });

        if (response.ok) {
          // Successfully saved, remove from queue
          await removeFromQueue(save.id);
          console.log('Synced offline save:', save.url);

          // Notify user
          self.registration.showNotification('Stash', {
            body: 'Offline save synced successfully',
            icon: '/icons/icon192.png',
            badge: '/icons/icon192.png',
          });
        }
      } catch (error) {
        console.error('Failed to sync offline save:', error);
        // Keep in queue for next retry
      }
    }
  } catch (error) {
    console.error('Error processing offline queue:', error);
  }
}

function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('StashOfflineQueue', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('saves')) {
        db.createObjectStore('saves', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removeFromQueue(id) {
  const db = await openOfflineDB();
  const transaction = db.transaction(['saves'], 'readwrite');
  const store = transaction.objectStore('saves');
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
