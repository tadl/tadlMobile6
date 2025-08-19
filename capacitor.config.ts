import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.TADL.TADLMobile',
  appName: 'TADL',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: false
    }
  }
};

export default config;
