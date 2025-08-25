import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'table-tracking-customer',
  webDir: 'www',
  plugins: {
    Keyboard: {
      "resize": "body",
      resizeOnFullScreen: true,
    },
  },
  server: {
    androidScheme: "http",
    cleartext: true,
    allowNavigation: [
      "http://10.220.129.4:8080/*"
    ]
  }
};

export default config;
