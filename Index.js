import { registerRootComponent } from 'expo';
import React from 'react';
import App from './App';

import { activateKeepAwake } from 'expo-keep-awake';

if (__DEV__) {
  activateKeepAwake();
}

// App.js already wraps everything with Context Providers
registerRootComponent(App);