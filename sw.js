importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

console.log("Service worker starting");

const URL = 'https://profcase.github.io/44-563-webapps-syllabus/'

//const CACHE = '44-563-v1'
const CACHE_CONTAINING_ERROR_MESSAGES = '44-563-error-cache'

workbox.core.setCacheNameDetails({
  prefix: '44-563',
  suffix: 'v1',
  precache: 'webapps-precache',
  runtime: 'webapps-runtime'
});

const urlsToCache = [
  './images/N60-2Stack-Full.jpg',
  './images/northwestlogo.jpg',
  './images/checkmark.png',
  './images/multiply.png',
  '/images/AppImages/android/android-launchericon-48-48.png',
  '/images/AppImages/android/android-launchericon-72-72.png',
  '/images/AppImages/android/android-launchericon-96-96.png',
  '/images/AppImages/android/android-launchericon-144-144.png',
  '/images/AppImages/android/android-launchericon-192-192.png',
  '/images/AppImages/android/android-launchericon-512-512.png',
  '/images/AppImages/chrome/chrome-extensionmanagementpage-48-48.png',
  '/images/AppImages/chrome/chrome-favicon-16-16.png',
  '/images/AppImages/chrome/chrome-installprocess-128-128.png',
  '/images/AppImages/firefox/firefox-general-16-16.png',
  '/images/AppImages/firefox/firefox-general-32-32.png',
  '/images/AppImages/firefox/firefox-general-48-48.png',
  '/images/AppImages/firefox/firefox-general-64-64.png',
  '/images/AppImages/firefox/firefox-general-90-90.png',
  '/images/AppImages/firefox/firefox-general-128-128.png',
  '/images/AppImages/firefox/firefox-general-256-256.png',
  '/images/AppImages/firefox/firefox-marketplace-128-128.png',
  '/images/AppImages/firefox/firefox-marketplace512-512.png',
  '/styles/case-syllabus.css',
  '/scripts/main.js'
];

self.addEventListener('install', event => {
  console.log("Service worker install starting");
  const CACHE = workbox.core.cacheNames.precache;

  // Perform install steps - open cache, cache files, confirm
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => {
        console.log('Opened cache ', CACHE);
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Error opening cache ', CACHE);
        return;
      })
  );
  console.log("Service worker installed");
});

self.addEventListener('activate', event => {
  console.log("Service worker activated");
});

self.addEventListener('beforeinstallprompt', event => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = event;
});

self.addEventListener('fetch', event => {
  console.log("Service worker got a fetch request");
  const CACHE = workbox.core.cacheNames.precache;
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Service worker found ', event.request.url, ' in the cache');
          return response;
        }
        else {
          console.log("Service worker fetching updated content from the web");
          return fetch(event.request)
            .then(res => {
              console.log("Service worker saving response and returning fetched data")
              return caches.open(CACHE)
                .then(cache => {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function (err) {
              console.log("Service worker fetch unsuccessful - replying with error page or message")
              return fetch(event.request);
            });
        }
      })
  );
  console.log("Service worker finished fetch");
});


self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
  const action = event.action;
  if (action !== 'close') { clients.openWindow(URL); }
  notification.close();
});

self.addEventListener('notificationclose', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
  console.log(`Closed notification: ${primaryKey}`);
});

self.addEventListener('push', event => {
  const options = {
    body: 'This notification was generated from a push!',
    icon: './images/icons8-info-24.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      { action: 'explore', title: 'Explore this new world', icon: './images/icons8-checkmark-26.png' },
      { action: 'close', title: 'Close', icon: './images/icons8-multiply-26.png' },
    ]
  };
  event.waitUntil(
    self.registration.showNotification('Hello world!', options)
  );



});