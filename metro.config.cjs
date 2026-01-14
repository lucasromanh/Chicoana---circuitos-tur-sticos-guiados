const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Agregar soporte para CSS (NativeWind v2)
config.resolver.sourceExts.push('css');

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

module.exports = config;
