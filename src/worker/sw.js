if ('function' === typeof importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

  self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });

  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');

    const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = workbox.strategies;

    // Used for filtering matches based on status code, header, or both
    const { CacheableResponsePlugin } = workbox.cacheableResponse;

    // Used to limit entries in cache, remove entries after a certain period of time
    const { ExpirationPlugin } = workbox.expiration;

    const { registerRoute } = workbox.routing;

    const { precacheAndRoute } = workbox.precaching;

    // Use with precache injection
    precacheAndRoute(self.__WB_MANIFEST);

    // Catch routing errors, like if the user is offline
    // setCatchHandler(async ({ event }) => {
    //   console.log('%c [ event ]', 'font-size:13px; background:pink; color:#bf2c9f;', event)
    //   // Return the precached offline page if a document is being requested
    //   if (event.request.destination === "document") {
    //     return matchPrecache("/offline.html");
    //   }

    //   return Response.error();
    // });

    // Cache page navigations (html) with a Network First strategy
    registerRoute(
      // Check to see if the request is a navigation to a new page
      ({ request }) => request.mode === 'navigate',
      // Use a Network First caching strategy
      new NetworkFirst({
        // Put all cached files in a cache named 'pages'
        cacheName: 'pages',
        plugins: [
          // Ensure that only requests that result in a 200 status are cached
          new CacheableResponsePlugin({
            statuses: [200]
          }),
          // Don't cache more than 50 pages, and expire them after 30 days
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
          })
        ]
      })
    );

    // Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
    registerRoute(
      // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
      ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
      // Use a Stale While Revalidate caching strategy
      new StaleWhileRevalidate({
        // Put all cached files in a cache named 'assets'
        cacheName: 'assets',
        plugins: [
          // Ensure that only requests that result in enum [0,200] status are cached
          new CacheableResponsePlugin({
            statuses: [0, 200]
          })
        ]
      })
    );

    // Cache images with a Cache First strategy
    registerRoute(
      // Check to see if the request's destination is style for an image
      ({ request }) => {
        return request.destination === 'image';
      },
      // Use a Cache First caching strategy
      new CacheFirst({
        // Put all cached files in a cache named 'images'
        cacheName: 'images',
        plugins: [
          // Ensure that only requests that result in a 200 status are cached
          new CacheableResponsePlugin({
            statuses: [200]
          }),
          // Don't cache more than 100 items, and expire them after 30 days
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
          })
        ]
      })
    );

    registerRoute(
      // Check to see if the request's end with .svg
      /\.svg$/,
      // Use a Cache First caching strategy
      new CacheFirst({
        // Put all cached files in a cache named 'svgs'
        cacheName: 'svgs',
        plugins: [
          // Ensure that only requests that result in a 200 status are cached
          new CacheableResponsePlugin({
            statuses: [200]
          }),
          // Don't cache more than 100 items, and expire them after 30 days
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
          })
        ]
      })
    );

    // Cache fonts with a Cache First strategy
    registerRoute(
      // Check to see if the request's destination is style for an font
      ({ request }) => request.destination === 'font',
      // Use a Cache First caching strategy
      new CacheFirst({
        // Put all cached files in a cache named 'fonts'
        cacheName: 'fonts',
        plugins: [
          // Ensure that only requests that result in a 200 status are cached
          new CacheableResponsePlugin({
            statuses: [200]
          }),
          new ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
          })
        ]
      })
    );

    registerRoute(
      ({ url }) => {
        return url.href === 'https://api.malu.company/api/v1/vendor/authenticate';
      },
      // Use a Cache First caching strategy
      new NetworkFirst({
        // Put all cached files in a cache named 'apis'
        cacheName: 'apis',
        plugins: [
          // Ensure that only requests that result in a 200 status are cached
          new CacheableResponsePlugin({
            statuses: [200]
          }),
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 7 Days
          })
        ]
      })
    );
  } else {
    console.error('Workbox could not be loaded. No Offline support');
  }
}
