import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {QRScanComponent }  from './component/qrscan/qrscan.component';
import { LocationCheckComponent } from './component/location-check/location-check.component';
import {TableRequestComponent } from './component/table-request/table-request.component';
import { LoginComponent } from './component/login/login.component';
import { NotificationsComponent} from './component/notification/notifications.component'
import { WaiterRegistrationComponent } from './component/registeration/waiter-registration.component';
const routes: Routes = [
  //  {
  //   path: '',
  //   redirectTo: 'table-request/table123',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '',
  //   redirectTo: 'location-check',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'notifications/:username',
    component:NotificationsComponent
  },
   {
    path: 'location-check/:restaurantId/:tableId',
    component: LocationCheckComponent,
   },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'location-check',
    component: LocationCheckComponent,
  },
  {
    path: 'table-request/:restaurantId/:tableId',
    component: TableRequestComponent
  },
 {
    path: 'qr',
    component: QRScanComponent
  },
  {
    path:'waiter-register',
    component: WaiterRegistrationComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
