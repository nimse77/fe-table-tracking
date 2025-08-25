import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// Import only if running on Web
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // if (Capacitor.getPlatform() === 'web') {
    //   this.initFirebaseWeb();
    // } else {
    //   this.initPushNative();
    // }
  }

  // 👉 WEB (browser/PWA)
  async initFirebaseWeb() {
    try {
      const app = initializeApp(environment.firebase);
      const messaging = getMessaging(app);

      const token = await getToken(messaging, {
        vapidKey: environment.firebase.vapidKey,
      });

      console.log('✅ Web FCM Token:', token);

      onMessage(messaging, (payload) => {
        console.log('📩 Web Message received:', payload);
        if (payload.notification?.title) {
          alert(`Notification: ${payload.notification.title}`);
        }
      });
    } catch (err) {
      console.error('❌ Firebase Web error:', err);
    }
  }

  // 👉 NATIVE (Android/iOS via Capacitor)
  async initPushNative() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive !== 'granted') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
    }

    // Get device token
    PushNotifications.addListener('registration', (token) => {
      console.log('✅ Native FCM Token:', token.value);
    });

    // Foreground notifications
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('📩 Native Push received:', notification);
      alert(`Notification: ${notification.title}`);
    });

    // User taps on notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('👉 Push action performed:', notification);
    });
  }
}
