// Configuración para despliegue en Farcaster
const deployConfig = {
    // Información de la app
    appName: "Altoken",
    appDescription: "Tokenized Survey App with AI and Gamification",
    appVersion: "1.0.0",
    
    // URLs de producción (actualizar con tu dominio)
    productionUrl: "https://altoken.netlify.app/",
    iconUrl: "https://altoken.netlify.app/icon.png",
    
    // Configuración de hosting
    hosting: {
        // Opciones recomendadas
        vercel: {
            framework: "static",
            buildCommand: "npm run build",
            outputDirectory: "dist"
        },
        netlify: {
            buildCommand: "npm run build",
            publishDirectory: "dist"
        }
    },
    
    // Archivos a incluir en el build
    includeFiles: [
        "index.html",
        "styles.css", 
        "app.js",
        "ai-config.html",
        "test-survey-generation.html",
        "config/",
        "services/",
        ".well-known/"
    ],
    
    // Variables de entorno para producción
    envVars: {
        NODE_ENV: "production",
        FARCASTER_MODE: "production"
    }
};

module.exports = deployConfig;
