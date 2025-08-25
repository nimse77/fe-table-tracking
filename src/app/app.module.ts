import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { QRScanComponent } from './component/qrscan/qrscan.component';
import { TableRequestComponent } from './component/table-request/table-request.component';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { LoginComponent } from './component/login/login.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    LoginComponent,
    QRScanComponent,
    TableRequestComponent,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,

    // ✅ Initialize Firebase once here
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,

    //  provideAuth(() => getAuth()),
    // provideMessaging(() => getMessaging()),
    // ✅ Enable Firebase services
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    // provideMessaging(() => getMessaging()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
