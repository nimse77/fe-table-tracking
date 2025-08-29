import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { firstValueFrom } from 'rxjs';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Firestore, collection, collectionData, updateDoc, doc } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {
  messaging?: Messaging;
  fcmToken:string='';
  baseUrl = `${environment.baseUrl}`;

  constructor(
    private http: HttpClient,
    private firestore: Firestore
  ) {
    // Only init Web SDK if running in browser
    if (Capacitor.getPlatform() === 'web') {
      const firebaseApp = initializeApp(environment.firebase);
      this.messaging = getMessaging(firebaseApp);
    }
  }

  /**
   * Request notification permission and register FCM
   */
  async requestPermissionAndSaveToken(username: string): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.requestWebPermission(username);
    } else {
      await this.requestMobilePermission(username);
    }
  }

  // Web push
  private async requestWebPermission(username: string) {
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
  async requestMobilePermission(username: string): Promise<void> {
  try {
    const permStatus = await PushNotifications.requestPermissions();
    if (permStatus.receive !== 'granted') {
      throw new Error('Push notification permission not granted');
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      console.log('📱 Native push token (not FCM):', token.value);

      const fcmToken = await FirebaseMessaging.getToken();
      this.fcmToken = fcmToken.token;
      if (!fcmToken.token) {
        throw new Error('Failed to get Firebase token');
      }
      this.saveTokenToBackend(username,this.fcmToken);
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

 async saveTokenToBackend(username: any,fcmToken:string): Promise<void> {
    console.log('📡 Sending token to backend:', username,"",fcmToken);
    this.http.get(`${this.baseUrl}/waiter/tokensave/${username}/${fcmToken}`);
}

 getRequests(waiterId: string): Observable<any[]> {
    const ref = collection(this.firestore, 'waiter_requests');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
}

 async acknowledgeRequest(requestId: string) {
    const ref = doc(this.firestore, `waiter_requests/${requestId}`);
    await updateDoc(ref, { status: 'acknowledged' });
  }

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
