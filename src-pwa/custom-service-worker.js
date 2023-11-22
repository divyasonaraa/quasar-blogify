/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { CacheFirst } from "workbox-strategies";
import { Queue } from "workbox-background-sync";

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

let backgroundSync = "sync" in self.registration ? true : false;

/*
   queue- create post
 */
let createBlogQueue = null;
if (backgroundSync) {
  createBlogQueue = new Queue("createBlogQueue", {
    onSync: async ({ queue }) => {
      let entry;
      while ((entry = await queue.shiftRequest())) {
        try {
          await fetch(entry.request);
          console.log("Replay successful for request", entry.request);
          const channel = new BroadcastChannel("sw-messages");
          channel.postMessage({ msg: "offline-post-uploaded" });
        } catch (error) {
          console.error("Replay failed for request", entry.request, error);

          // Put the entry back in the queue and re-throw the error:
          await queue.unshiftRequest(entry);
          throw error;
        }
      }
      console.log("Replay complete!");
    },
  });
}

/*
  caching strategies
*/

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
if (process.env.MODE !== "ssr" || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
    )
  );
}

registerRoute(
  ({ url }) => url.host.startsWith("fonts.googleapi.com"),
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/blogs"),
  new NetworkFirst()
);

registerRoute(
  ({ url }) => url.protocol === "http:" || url.protocol === "https:",
  new StaleWhileRevalidate()
);

/*
    Events - fetch
*/
if (backgroundSync) {
  self.addEventListener("fetch", (event) => {
    // Add in your own criteria here to return early if this
    // isn't a request that should use background sync.
    if (event.request.method !== "POST") {
      return;
    }

    const bgSyncLogic = async () => {
      try {
        const response = await fetch(event.request.clone());
        return response;
      } catch (error) {
        await createBlogQueue.pushRequest({ request: event.request });
        return error;
      }
    };

    event.respondWith(bgSyncLogic());
  });
}
