import { Component, OnInit } from '@angular/core';
import {FirebaseMessagingService} from '../../services/fcm/firebase-messaging.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {WaiterInfo } from '../../interface/WaiterInfo';
@Component({
  selector: 'app-login',
   imports: [IonicModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  constructor(
    private firebaseMessagingService:FirebaseMessagingService,
  ) { }

  ngOnInit() {}

  //  WaiterInfo = {
  //   waiterId: '',
  //   restaurantId: '',
  //   waiterName: '',
  //   fcmToken:'',
  // };
 WaiterInfo: WaiterInfo = {
  waiterId: '',
  restaurantId: '',
  waiterName: '',
  fcmToken: ''
};




  // onLogin() {
  //   this.firebaseMessagingService.requestPermissionAndSaveToken(this.WaiterInfo.waiterId);

  //   this.WaiterInfo.fcmToken=this.firebaseMessagingService.fcmToken;
  //   if(this.WaiterInfo.fcmToken){
  //       this.firebaseMessagingService.saveTokenToBackend(this.WaiterInfo);
  //   }
  //   console.log('Login data:', this.WaiterInfo);
  // }
  async onLogin() {
  try {
     await this.firebaseMessagingService.requestPermissionAndSaveToken(this.WaiterInfo.waiterId);

    this.WaiterInfo.fcmToken = this.firebaseMessagingService.fcmToken;

    if (this.WaiterInfo.fcmToken) {
      await this.firebaseMessagingService.saveTokenToBackend(this.WaiterInfo);
      console.log('✅ Token saved:', this.WaiterInfo);
    }
  } catch (error) {
    console.error('❌ Error during token request:', error);
  }
}

}
