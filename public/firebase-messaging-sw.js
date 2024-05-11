// /* global importScripts, firebase */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyBNFPGMec_IzW6pkH5eMfgoU8krldRTDq4',
  authDomain: 'ecaraid-uat-new.firebaseapp.com',
  projectId: 'ecaraid-uat-new',
  storageBucket: 'ecaraid-uat-new.appspot.com',
  messagingSenderId: '48651848312',
  appId: '1:48651848312:web:ce1c2ca4789066807f7b8d',
  measurementId: 'G-VF91RQ0CJT'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

const channel = new BroadcastChannel('notifications');

messaging.onBackgroundMessage(function (payload) {
  channel.postMessage(payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://i.pinimg.com/originals/57/93/fa/5793fa77a347969c747ecf703c2aee90.png',
    click_action: 'https://google.com',
    data: { url: process.env.HOST_NAME || 'https://google.com' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  // Click actions support only secure HTTPS URLs.
  let url = process.env.HOST_NAME || 'https://google.com';
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
