import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TableService } from '../../services/Table/table.service';
import { FirebaseMessagingService } from '../../services/fcm/firebase-messaging.service';
import { switchMap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 



@Component({
  selector: 'app-table-request',
  imports: [CommonModule, IonicModule,FormsModule],
  templateUrl: './table-request.component.html',
  styleUrls: ['./table-request.component.scss'],
})
export class TableRequestComponent implements OnInit {

  restaurantId!: string;
  tableId!: string;
  showOptions = true;
  actionType: string[] = [];
  selectedAction='';
  constructor(
    private tableService: TableService,
    private firebaseService: FirebaseMessagingService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.restaurantId = this.route.snapshot.paramMap.get('restaurantId') || '';
    this.tableId = this.route.snapshot.paramMap.get('tableId') || '';

    console.log("Restaurant:", this.restaurantId);
    console.log("Table:", this.tableId);

    this.getRestaruantInfo(this.restaurantId);
  }

  getRestaruantInfo(restaurantId: string) {
    this.tableService.getRestaruantInfo(restaurantId).subscribe(
      (res) => {
        console.log(res);
        this.actionType = res.actionType
      }
    )
  }

  async sendRequest(actionType: string) {

    try {
      const res = await firstValueFrom(
        this.tableService.sendRequest(this.tableId, actionType, this.restaurantId)
      );
      console.log('Backend Response:', res);

      // Step 3: Listen for push messages
      this.firebaseService.listenToMessages();
      alert(`${actionType.replace('_', ' ')} request sent.`);

    } catch (err: any) {
      console.error('❌ Error:', err);
      alert('Failed: ' + (err?.message || 'Unknown error'));
    }

  }
}
