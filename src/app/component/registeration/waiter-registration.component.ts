import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseMessagingService } from '../../services/fcm/firebase-messaging.service'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { WaiterInfo } from '../../interface/WaiterInfo';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-waiter-registration',
  templateUrl: './waiter-registration.component.html',
  styleUrls: ['./waiter-registration.component.scss'],
  imports: [IonicModule, FormsModule,CommonModule],
})
export class WaiterRegistrationComponent  implements OnInit {

  loading = true;
  message = '';

    waiterInfo: WaiterInfo = {
      username: '',
      password: '',
      restaurantId: '',
      waiterName: '',
      fcmToken: ''
    };

  constructor(
    private fcmService: FirebaseMessagingService,
      private authService: AuthService,
    private router: Router,
  ) {
  }
    ngOnInit() {}


async onRegister() {  
  this.authService.register(this.waiterInfo).subscribe({
    next: async (res) => {
      console.log('Waiter registered:', res);
      await this.fcmService.requestPermissionAndSaveToken(this.waiterInfo.username);
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.message = 'Invalid username or password';
    }
  });
}

}
