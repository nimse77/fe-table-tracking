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

   register(WaiterInfo:any): Observable<any> {
    console.log('📡 Sending username to backend:', WaiterInfo);
    return this.http.post<any>(`${this.baseUrl}/waiter/save`, WaiterInfo);
  }
  
   checkUser(username:any): Observable<any> {
    console.log('📡 Sending username to backend:', username);
    return this.http.get<any>(`${this.baseUrl}/waiter/login/${username}`);
  }
  
}
