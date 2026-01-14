import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// Importar la versión correcta de App según la plataforma
let App;

if (Platform.OS === 'web') {
    // Para web, usar el App.tsx original con react-router-dom
    App = require('./App').default;
} else {
    // Para iOS/Android, usar App.native.tsx con React Navigation
    App = require('./App.native').default;
}

registerRootComponent(App);
