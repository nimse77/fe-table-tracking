import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   baseUrl=`${environment.baseUrl}`;

  constructor(
    private http:HttpClient,
  ) { }

   login(WaiterInfo:any): Observable<any> {
    console.log('📡 Sending username to backend:', WaiterInfo);
    return this.http.post<any>(`${this.baseUrl}/waiter/save`, WaiterInfo);
  }
}
