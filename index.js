import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// Importar la versión correcta de App según la plataforma
const App =
    Platform.OS === "web"
        ? require("./App.web").default
        : require("./App.native").default;

registerRootComponent(App);
