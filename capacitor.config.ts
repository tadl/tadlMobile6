import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.TADL.TADLMobile',
  appName: 'TADL',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    EdgeToEdge: {
      backgroundColor: '#ffffff' // match your header color
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: false
    }
  }
};

export default config;
