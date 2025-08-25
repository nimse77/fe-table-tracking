// firebase-messaging-sw.js

// ✅ Import Firebase scripts for service worker (compat version)
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

// ✅ Initialize Firebase using your config
firebase.initializeApp({
  apiKey: "AIzaSyApJCgC0bWtwYem7kXRlqkbrRcpdn_oIBQ",
  authDomain: "cust-table-track.firebaseapp.com",
  projectId: "cust-table-track",
  storageBucket: "cust-table-track.firebasestorage.app",
  messagingSenderId: "817628663703",
  appId: "1:817628663703:web:621eaa87b8c5ec70683ed2",
  measurementId: "G-GMXQ2TRW8V"
});

// ✅ Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/assets/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message:', payload);

//   const notificationTitle = payload.notification?.title || 'Background Message';
//   const notificationOptions = {
//     body: payload.notification?.body || '',
//     icon: payload.notification?.icon || '/assets/icons/icon-72x72.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
