// Basic service worker
self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => self.clients.claim());
self.addEventListener('fetch', event => { /* pass through */ });
