import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.component.html',
  styleUrls: ['./qrscan.component.scss'],
})
export class QRScanComponent implements OnInit {

  restaurantLat = 18.5204;
  restaurantLng = 73.8567;
  allowedRadiusInMeters = 100;

  constructor(private alertCtrl: AlertController) { }


  ngOnInit() {
    this.checkUserLocation();
  }

  async checkUserLocation() {
    try {
      const permission = await Geolocation.requestPermissions();
      const coordinates = await Geolocation.getCurrentPosition();

      const userLat = coordinates.coords.latitude;
      const userLng = coordinates.coords.longitude;

      const distance = this.getDistanceFromLatLonInMeters(
        userLat,
        userLng,
        this.restaurantLat,
        this.restaurantLng
      );

      if (distance <= this.allowedRadiusInMeters) {
        this.showAlert('Success', 'You are within the allowed radius.');
      } else {
        this.showAlert('Access Denied', `You are too far away (${distance.toFixed(2)}m).`);
      }

    } catch (error) {
      console.error('Geolocation error:', error);
      this.showAlert('Error', 'Could not get your location.');
    }
  }

  // Haversine Formula to calculate distance in meters
  getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Radius of the earth in meters
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters
    return d;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
