const fs = require('fs');
const path = require('path');

// Script de build para optimizar la aplicación para producción
console.log('🚀 Iniciando build para producción...');

// Crear directorio dist si no existe
const distDir = './dist';
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Función para copiar archivos
function copyFile(src, dest) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`✅ Copiado: ${src} -> ${dest}`);
    } catch (error) {
        console.error(`❌ Error copiando ${src}:`, error.message);
    }
}

// Función para copiar directorio recursivamente
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    });
}

// Archivos principales
const mainFiles = [
    'index.html',
    'styles.css',
    'app.js',
    'ai-config.html',
    'test-survey-generation.html',
    'package.json',
    'icon.svg'
];

// Create frame image from SVG (simple copy for now)
function createFrameImage() {
    try {
        // For now, just copy the SVG as PNG reference
        // In production, you'd convert SVG to PNG
        const svgContent = fs.readFileSync('icon.svg', 'utf8');
        console.log('📸 Frame image ready (using SVG as reference)');
    } catch (error) {
        console.log('⚠️  Could not process frame image:', error.message);
    }
}

// Copiar archivos principales
mainFiles.forEach(file => {
    if (fs.existsSync(file)) {
        copyFile(file, path.join(distDir, file));
    }
});

// Copiar directorios
const directories = ['config', 'services', '.well-known', 'api'];
directories.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`📁 Copiando directorio: ${dir}`);
        copyDir(dir, path.join(distDir, dir));
    } else {
        console.log(`⚠️  Directorio no encontrado: ${dir}`);
    }
});

// Crear archivo de información del build
const buildInfo = {
    buildTime: new Date().toISOString(),
    version: "1.0.0",
    environment: "production"
};

fs.writeFileSync(
    path.join(distDir, 'build-info.json'), 
    JSON.stringify(buildInfo, null, 2)
);

console.log('✅ Build completado!');
console.log(`📁 Archivos generados en: ${distDir}`);
console.log('🌐 Listo para desplegar en Vercel, Netlify, o tu hosting preferido');
