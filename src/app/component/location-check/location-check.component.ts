
import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TableService } from '../../services/Table/table.service';
import { Capacitor } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location-check',
  templateUrl: './location-check.component.html',
  styleUrls: ['./location-check.component.scss']
})
export class LocationCheckComponent {

  allowedRadiusInMeters = 100;
   restaurantId!: string;
  tableId!: string;
  restlat!:any;
  restlng!:any;
  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private tableService: TableService
  ) {}

  ngOnInit() {
      this.restaurantId = this.route.snapshot.paramMap.get('restaurantId') || '';
    this.tableId = this.route.snapshot.paramMap.get('tableId') || '';

    console.log("Restaurant:", this.restaurantId);
    console.log("Table:", this.tableId);
    this.getRestaruantInfo(this.restaurantId);
    this.checkUserLocation();
  }


  getRestaruantInfo(restaurantId:string){
    this.tableService.getRestaruantInfo(restaurantId).subscribe(
      (res)=>{
        console.log(res);
        this.restlat=res.latitude,
        this.restlng=res.longitude
      }
    )
  }

  async checkUserLocation() {
    try {
      let lat: number;
      let lng: number;

      // 🔹 Check if running on web or native
      if (Capacitor.getPlatform() === 'web') {
        // Browser fallback
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              lat = pos.coords.latitude;
              lng = pos.coords.longitude;
              resolve();
            },
            (err) => reject(err)
          );
        });
      } else {
        // Native (Android/iOS) – Capacitor plugin
        const coords = await Geolocation.getCurrentPosition();
        lat = coords.coords.latitude;
        lng = coords.coords.longitude;
      }

      // 🔹 Reference location (replace with your table’s lat/lng)
      const distance = this.tableService.calculateDistance(
        lat!,
        lng!,
        this.restlat,
        this.restlng
      );

      if (distance <= this.allowedRadiusInMeters) {
        this.showAlert('Success', 'You are within the allowed radius.', true);
      } else {
        this.showAlert('Success', 'You are within the allowed radius.', true);
        //this.showAlert('Access Denied', 'You are not within the allowed radius.', false);
      }

    } catch (error) {
      console.error('Error getting location', error);
      this.showAlert('Error', 'Unable to fetch location. Please allow permissions.', false);
    }
  }

  async showAlert(header: string, message: string, shouldRedirect: boolean) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (shouldRedirect) {
              this.router.navigate(['/table-request', this.restaurantId, this.tableId]);

            }
          }
        }
      ]
    });

    await alert.present();
  }
}


// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-location-check',
//   templateUrl: './location-check.component.html',
//   styleUrls: ['./location-check.component.scss']
// })
// export class LocationCheckComponent  implements OnInit {

//   constructor() { }

//   ngOnInit() {}

// }

// import { Component } from '@angular/core';
// import { Geolocation } from '@capacitor/geolocation';
// import { AlertController } from '@ionic/angular';
// import { Router } from '@angular/router';
// import { TableService } from '../../services/Table/table.service';

// @Component({
//   selector: 'app-location-check',
//   templateUrl: './location-check.component.html',
//   styleUrls: ['./location-check.component.scss']
// })
// export class LocationCheckComponent {

//   allowedRadiusInMeters = 100;
//   tableId = 'table123'; 

//   constructor(
//     private alertController: AlertController,
//     private router: Router,
//     private tableService: TableService
//   ) {}

//    ngOnInit() {
//     this.checkUserLocation();
//   }

//   async checkUserLocation() {
//     const coords = await Geolocation.getCurrentPosition();

//     const distance = this.tableService.calculateDistance(
//       coords.coords.latitude,
//       coords.coords.longitude,
//       18.5204, 
//       73.8567 
//     );

//     if (distance <= this.allowedRadiusInMeters) {
//       this.showAlert('Success', 'You are within the allowed radius.', true);
//     } else {
//       this.showAlert('Success', 'You are within the allowed radius.', true);
//       //this.showAlert('Access Denied', 'You are not within the allowed radius.', false);
//     }
//   }

//   async showAlert(header: string, message: string, shouldRedirect: boolean) {
//     const alert = await this.alertController.create({
//       header,
//       message,
//       buttons: [
//         {
//           text: 'OK',
//           handler: () => {
//             if (shouldRedirect) {
//               this.router.navigate(['/table-request', this.tableId]);
//             }
//           }
//         }
//       ]
//     });

//     await alert.present();
//   }
// }
