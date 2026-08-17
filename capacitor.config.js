import { defineConfig } from '@capacitor/configure';

export default defineConfig({
  appId: 'com.guerreirosdatribo.app',
  appName: 'Guerreiros da Tribo',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
});
