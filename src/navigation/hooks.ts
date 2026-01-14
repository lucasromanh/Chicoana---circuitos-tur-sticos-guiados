/**
 * Platform-aware navigation hooks
 * Exports the correct navigation hooks based on platform
 */

import { Platform } from 'react-native';

// For web, use react-router-dom
// For native, use the router adapter
if (Platform.OS === 'web') {
    // Web platform - use react-router-dom
    export { useNavigate, useLocation, useParams } from 'react-router-dom';
} else {
    // Native platform - use router adapter
    export { useNavigate, useLocation, useParams } from '@/navigation/routerAdapter';
}
