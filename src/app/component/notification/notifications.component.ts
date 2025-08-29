import { Component, OnInit } from '@angular/core';
import { FirebaseMessagingService} from '../../services/fcm/firebase-messaging.service'
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class NotificationsComponent  implements OnInit {

  requests: any[] = [];
  username: string = '';
  constructor(
    private fcm:FirebaseMessagingService,
    private route:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username') || '';

    this.fcm.requestPermissionAndSaveToken(this.username);
    this.getRequests();
  }
  getRequests(){
    this.fcm.getRequests(this.username).subscribe((reqs: any[]) => {
      this.requests = reqs.filter(r => r.username === this.username);
    });
  }

    acknowledge(req: any) {
      this.fcm.acknowledgeRequest(req.id);
  }

}
