import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { navigationRef } from '@/navigation/routerAdapter';

// Import views
import Splash from '@/views/Splash';
import Home from '@/views/Home';
import CircuitDetail from '@/views/CircuitDetail';
import MapOverview from '@/views/MapOverview';
import ActiveNavigation from '@/views/ActiveNavigation';
import PoiDetail from '@/views/PoiDetail';
import Downloads from '@/views/Downloads';
import Settings from '@/views/Settings';

// Import types
import type { RootStackParamList } from '@/navigation/routerAdapter';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    const { settings } = useUser();

    useEffect(() => {
        console.log('🎨 AppNavigator: darkMode cambió a', settings.darkMode);
    }, [settings.darkMode]);

    console.log('🔄 AppNavigator renderizando con darkMode:', settings.darkMode);

    return (
        <View className={settings.darkMode ? 'dark flex-1' : 'flex-1'}>
            <NavigationContainer ref={navigationRef}>
                <StatusBar style={settings.darkMode ? 'light' : 'dark'} />
            <Stack.Navigator
                id="RootStack"
                    initialRouteName="Splash"
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
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
        </View>
    );
}

export default function AppNative() {
    return (
        <UserProvider>
            <AppNavigator />
        </UserProvider>
    );
}
