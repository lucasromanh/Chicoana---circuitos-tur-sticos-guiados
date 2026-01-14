/**
 * Adaptador de navegación para React Native
 * Este archivo proporciona funciones compatibles con react-router-dom
 * pero usando React Navigation para React Native
 */

import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    CircuitDetail: { id: string };
    MapOverview: undefined;
    ActiveNavigation: undefined;
    PoiDetail: { id: string };
    Downloads: undefined;
    Settings: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    ...params: RootStackParamList[RouteName] extends undefined
        ? [undefined?]
        : [RootStackParamList[RouteName]]
) {
    if (navigationRef.isReady()) {
        // @ts-expect-error - React Navigation's navigate has complex overloads
        navigationRef.navigate(name, params[0]);
    }
}

export function goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack();
    }
}

// Hook compatible con useNavigate de react-router-dom
export function useNavigate() {
    return (path: string | number, options?: any) => {
        if (typeof path === 'number') {
            // Navegar hacia atrás
            if (path === -1) {
                goBack();
            }
            return;
        }

        // Parsear la ruta
        const pathParts = path.split('/').filter(Boolean);

        if (pathParts.length === 0) {
            navigate('Splash');
        } else if (pathParts[0] === 'home') {
            navigate('Home');
        } else if (pathParts[0] === 'circuit' && pathParts[1]) {
            navigate('CircuitDetail', { id: pathParts[1] });
        } else if (pathParts[0] === 'map') {
            navigate('MapOverview');
        } else if (pathParts[0] === 'navigation') {
            navigate('ActiveNavigation');
        } else if (pathParts[0] === 'poi' && pathParts[1]) {
            navigate('PoiDetail', { id: pathParts[1] });
        } else if (pathParts[0] === 'downloads') {
            navigate('Downloads');
        } else if (pathParts[0] === 'settings') {
            navigate('Settings');
        }
    };
}

// Hook compatible con useLocation de react-router-dom
export function useLocation() {
    // En RN, retornamos un objeto compatible
    // La navegación real se maneja por React Navigation
    return {
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'default',
    };
}

// Hook para obtener parámetros de ruta
export function useParams() {
    // Este hook será reemplazado por useRoute de React Navigation en los componentes
    return {};
}
