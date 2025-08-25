import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TableService {
  baseUrl=`${environment.baseUrl}`;

 // private baseUrl='http://localhost:8080/api'
  //private baseUrl='http://10.198.190.4:8080/api'
  
  constructor(
    private http:HttpClient,
  ) { }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters

  const φ1 = lat1 * Math.PI / 180; // φ = latitude in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in meters

  return distance;
}

sendRequest(tableId: string, actionType: string,restaurantId:string): Observable<any> {
  const body = {
    tableId: tableId,
    restaurantId:restaurantId,
    actionType: actionType
  };

  return this.http.post(`${this.baseUrl}/table/table-requests`, body);
}

getRestaruantInfo(restaurantId:string):Observable<any>{
  return this.http.get(`${this.baseUrl}/rest/id/${restaurantId}`);
}


}
