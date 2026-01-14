import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/contexts/UserContext';
import { navigationRef, RootStackParamList } from '@/navigation/routerAdapter';

// Importar vistas existentes (sin modificar)
import Splash from '@/views/Splash';
import Home from '@/views/Home';
import CircuitDetail from '@/views/CircuitDetail';
import MapOverview from '@/views/MapOverview';
import ActiveNavigation from '@/views/ActiveNavigation';
import PoiDetail from '@/views/PoiDetail';
import Downloads from '@/views/Downloads';
import Settings from '@/views/Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <UserProvider>
            <NavigationContainer ref={navigationRef}>
                <StatusBar style="auto" />
                <Stack.Navigator
                    id="RootStack"
                    initialRouteName="Splash"
                    screenOptions={{
                        headerShown: false,
                        animation: 'fade',
                    }}
                >
                    <Stack.Screen name="Splash" component={Splash} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="CircuitDetail" component={CircuitDetail} />
                    <Stack.Screen name="MapOverview" component={MapOverview} />
                    <Stack.Screen name="ActiveNavigation" component={ActiveNavigation} />
                    <Stack.Screen name="PoiDetail" component={PoiDetail} />
                    <Stack.Screen name="Downloads" component={Downloads} />
                    <Stack.Screen name="Settings" component={Settings} />
                </Stack.Navigator>
            </NavigationContainer>
        </UserProvider>
    );
};

export default App;
