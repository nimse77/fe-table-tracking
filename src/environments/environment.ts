// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
production: true,
  baseUrl: 'http://localhost:8080/api',
  //baseUrl: 'https://10.41.131.88/api',
  firebase: 
     {
      apiKey: "AIzaSyApJCgC0bWtwYem7kXRlqkbrRcpdn_oIBQ",
      authDomain: "cust-table-track.firebaseapp.com",
      projectId: "cust-table-track",
      storageBucket: "cust-table-track.firebasestorage.app",
      messagingSenderId: "817628663703",
      appId: "1:817628663703:web:621eaa87b8c5ec70683ed2",
      measurementId: "G-GMXQ2TRW8V",
      vapidKey: "BIUNHe857C8p6JryUbDeYx3MWqimXs6i9PfdmTkWRhvMYlfkrVPOAL0669goz7KFFQQSnUP_esTWPWhhPpUFj-k"
    }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
