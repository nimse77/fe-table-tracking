import { Component, OnInit } from '@angular/core';
import { WaiterInfo } from '../../interface/WaiterInfo';
import { AuthService } from '../../services/auth/auth.service';
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
export class LoginComponent implements OnInit {

  errorMessage: string = '';

  waiterInfo: WaiterInfo = {
    username: '',
    password: '',
    restaurantId: '',
    waiterName: '',
    fcmToken: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() { }

  async login() {
    this.authService.checkUser(this.waiterInfo.username).subscribe({
  next: (res) => {
    if (res.success) {
      this.router.navigate(['/notifications', this.waiterInfo.username]);
    } else {
      this.errorMessage = 'User not registered. Please sign up.';
    }
  }
});
}

  goToRegister() {
       this.router.navigate(['/waiter-register']);
  }
}
