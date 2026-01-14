const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Agregar soporte para TypeScript y alias
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'css'];

// Configurar el template HTML para web
config.transformer = {
    ...config.transformer,
    getTransformOptions: async () => ({
        transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
        },
    }),
};

// Especificar el template HTML personalizado para web
config.server = {
    ...config.server,
    enhanceMiddleware: (middleware) => {
        return (req, res, next) => {
            // Servir el index.html personalizado para la ruta raíz
            if (req.url === '/' || req.url === '/index.html') {
                const fs = require('fs');
                const indexPath = path.join(__dirname, 'index.html');
                if (fs.existsSync(indexPath)) {
                    res.setHeader('Content-Type', 'text/html');
                    res.end(fs.readFileSync(indexPath, 'utf8'));
                    return;
                }
            }
            return middleware(req, res, next);
        };
    },
};

module.exports = withNativeWind(config, { input: './src/global.css' });

