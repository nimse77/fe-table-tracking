import { Component, OnInit } from '@angular/core';
import {WaiterInfo } from '../../interface/WaiterInfo';
import {AuthService} from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
   imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  
})
export class LoginComponent  implements OnInit {

   errorMessage: string = '';

waiterInfo: WaiterInfo = {
  username: '',
  password:'',
  restaurantId: '',
  waiterName: '',
  fcmToken: ''
};

  constructor(
    private authService:AuthService,
    private router:Router,
  ) { }

  ngOnInit() {}

    async login() {
    this.errorMessage = '';
    this.authService.login(this.waiterInfo).subscribe({
      next: (res) => {
        this.router.navigate(['/notifications',this.waiterInfo.username]);
      },
      error: (err) => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }






  // onLogin() {
  //   this.firebaseMessagingService.requestPermissionAndSaveToken(this.WaiterInfo.waiterId);

  //   this.WaiterInfo.fcmToken=this.firebaseMessagingService.fcmToken;
  //   if(this.WaiterInfo.fcmToken){
  //       this.firebaseMessagingService.saveTokenToBackend(this.WaiterInfo);
  //   }
  //   console.log('Login data:', this.WaiterInfo);
  // }
//   async onLogin() {
//   try {
//      await this.firebaseMessagingService.requestPermissionAndSaveToken(this.waiterInfo.username);

//     this.waiterInfo.fcmToken = this.firebaseMessagingService.fcmToken;

//     if (this.waiterInfo.fcmToken) {
//       await this.firebaseMessagingService.saveTokenToBackend(this.waiterInfo);
//       console.log('✅ Token saved:', this.waiterInfo);
//     }
//   } catch (error) {
//     console.error('❌ Error during token request:', error);
//   }
// }

}
