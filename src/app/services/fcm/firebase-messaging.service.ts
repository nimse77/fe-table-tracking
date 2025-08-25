import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { firstValueFrom } from 'rxjs';
import { LocalNotifications } from '@capacitor/local-notifications';

// Web-only Firebase imports
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {
  messaging?: Messaging;
  fcmToken:string='';
  baseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {
    // Only init Web SDK if running in browser
    if (Capacitor.getPlatform() === 'web') {
      const firebaseApp = initializeApp(environment.firebase);
      this.messaging = getMessaging(firebaseApp);
    }
  }

  /**
   * Request notification permission and register FCM
   */
  async requestPermissionAndSaveToken(waiterId: string): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.requestWebPermission(waiterId);
    } else {
      await this.requestMobilePermission(waiterId);
    }
  }

  // Web push
  private async requestWebPermission(waiterId: string) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }
 0
      // Register Service Worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const token = await getToken(this.messaging!, {
        vapidKey: environment.firebase.vapidKey,
        serviceWorkerRegistration: registration
      });
      this.fcmToken=token;

      if (!token) throw new Error('Failed to get FCM token');

    } catch (err) {
      console.error(' Web FCM error:', err);
      throw err;
    }
  }
  async requestMobilePermission(waiterId: string): Promise<void> {
  try {
    const permStatus = await PushNotifications.requestPermissions();
    if (permStatus.receive !== 'granted') {
      throw new Error('Push notification permission not granted');
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      console.log('📱 Native push token (not FCM):', token.value);

      const fcmToken = await FirebaseMessaging.getToken();
      if (!fcmToken.token) {
        throw new Error('Failed to get Firebase token');
      }
      this.fcmToken = fcmToken.token;
      console.log('🔥 Firebase FCM token:', fcmToken.token);

      // TODO: Save to backend
      // await this.saveTokenToBackend(waiterId, fcmToken.token);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('❌ Push registration error:', err);
    });

    // 👇 Handle incoming messages
FirebaseMessaging.addListener(
  'notificationReceived',
  async (event) => {
    console.log('📩 FCM notification received:', event);

    // Show local notification when app is in foreground
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Date.now(),
          title: event.notification?.title || 'New Notification',
          body: event.notification?.body || '',
          schedule: { at: new Date(Date.now() + 1000) }, // optional 1-second delay
        },
      ],
    });
  }
);

  } catch (err) {
    console.error('Mobile FCM error:', err);
    throw err;
  }
}

//   async requestMobilePermission(waiterId: string): Promise<void> {
//   try {
//     // Ask OS permissions
//     const permStatus = await PushNotifications.requestPermissions();
//     if (permStatus.receive !== 'granted') {
//       throw new Error('Push notification permission not granted');
//     }

//     // Register with APNS/Android Push
//     await PushNotifications.register();

//     // Listen for native registration (APNS/Android push token)
//     PushNotifications.addListener('registration', async (token) => {
//       console.log('📱 Native push token (not FCM):', token.value);

//       // Now fetch FCM token
//       const fcmToken = await FirebaseMessaging.getToken();
//       if (!fcmToken.token) {
//         throw new Error('Failed to get Firebase token');
//       }
//       this.fcmToken=fcmToken.token;
//       console.log('🔥 Firebase FCM token:', fcmToken.token);

//       // Save FCM token to backend
//      // await this.saveTokenToBackend(waiterId, fcmToken.token);
//       // console.log('✔ Token saved successfully to backend');
//     });

//     PushNotifications.addListener('registrationError', (err) => {
//       console.error('❌ Push registration error:', err);
//     });

//   } catch (err) {
//     console.error('Mobile FCM error:', err);
//     throw err;
//   }
// }

 async saveTokenToBackend(WaiterInfo: any): Promise<void> {
  console.log('📡 Sending token to backend:', WaiterInfo);
  await firstValueFrom(
  this.http.post<{ message: string }>(`${this.baseUrl}/waiter/save`, WaiterInfo)
);

}


//  private async requestMobilePermission(waiterId: string): Promise<void> {
//   try {
//     const permStatus = await PushNotifications.requestPermissions();
//     if (permStatus.receive !== 'granted') {
//       throw new Error('Push notification permission not granted');
//     }

//     // Register device for push
//     await PushNotifications.register();

//     // Return a promise that resolves when token is saved
//     return new Promise<void>((resolve, reject) => {
//       PushNotifications.addListener('registration', async (token) => {
//         try {
//           console.log('📱 APNS/FCM registration token:', token.value);

//           // Get actual Firebase FCM token
//           const fcmToken = await FirebaseMessaging.getToken();
//             if (!fcmToken.token) {
//               throw new Error('Failed to get FCM token on mobile');
//             }
//             console.log('📱 Firebase FCM token:', fcmToken.token);
//             // Save to backend (await because saveTokenToBackend returns Observable)
//            await this.saveTokenToBackend(waiterId, fcmToken.token);


//           console.log('✔ Token saved successfully (mobile)');
//           resolve();
//         } catch (err) {
//           reject(err);
//         }
//       });

//       PushNotifications.addListener('registrationError', (err) => {
//         reject(err);
//       });
//     });
//   } catch (err) {
//     console.error('Mobile FCM error:', err);
//     throw err;
//   }
// }


  /**
   * Save FCM token to backend
   */
  // private saveTokenToBackend(waiterId: string, token: string) {
  //   const payload = { waiterId, token };
  //   this.http.post(
  //     `${this.baseUrl}/table/save-token`,
  //     payload,
  //     { responseType: 'text' }
  //   )
  //   .subscribe({
  //     next: res => console.log('✔ Token saved successfully:', res),
  //     error: err => console.error('Error saving token:', err)
  //   });
  // }
//  async saveTokenToBackend(waiterId: string, token: string): Promise<void> {
//   const payload = { waiterId, token };
//   console.log('📡 Sending token to backend:', payload);
//   await firstValueFrom(
//     this.http.post(`${this.baseUrl}/table/save-token`, payload, { responseType: 'text' })
//   );
// }

// private saveTokenToBackend(waiterId: string, token: string): Promise<any> {
//   const payload = { waiterId, token };

//   console.log('📡 Sending token to backend:', payload);

//   return firstValueFrom(
//     this.http.post(
//       `${this.baseUrl}/table/save-token`,
//       payload,
//       { headers: { 'Content-Type': 'application/json' } }
//     )
//   );
// }




  /**
   * Foreground message listener (only works on Web)
   */
  listenToMessages() {
    if (Capacitor.getPlatform() === 'web' && this.messaging) {
      onMessage(this.messaging, (payload) => {
        console.log('📩 Web Foreground message:', payload);

        if (payload.notification?.title) {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/assets/icons/icon-192x192.png'
          });
        }
      });
    } else {
      // On mobile, use Capacitor listeners
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('📩 Foreground notification:', notification);
        alert('New Request: ' + notification.title);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('📩 Mobile Notification action:', action);
      });
    }
  }
}
