import { registerRootComponent } from 'expo';
import App from './App';

import { activateKeepAwake } from 'expo-keep-awake';

declare const __DEV__: boolean;

if (__DEV__) {
  activateKeepAwake();
}

// App.tsx already wraps everything with Context Providers
registerRootComponent(App);
