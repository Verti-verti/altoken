#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Altoken - Script de Despliegue a Farcaster');
console.log('==============================================\n');

// Verificar que estamos en el directorio correcto
if (!fs.existsSync('package.json')) {
    console.error('❌ Error: No se encontró package.json. Ejecuta este script desde la raíz del proyecto.');
    process.exit(1);
}

// Función para ejecutar comandos
function runCommand(command, description) {
    console.log(`📦 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} completado\n`);
    } catch (error) {
        console.error(`❌ Error en ${description}:`, error.message);
        process.exit(1);
    }
}

// Función para verificar archivos requeridos
function checkRequiredFiles() {
    console.log('🔍 Verificando archivos requeridos...');
    
    const requiredFiles = [
        'index.html',
        'app.js',
        'styles.css',
        '.well-known/farcaster.json',
        'icon.svg'
    ];
    
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
        console.error('❌ Archivos faltantes:', missingFiles.join(', '));
        process.exit(1);
    }
    
    console.log('✅ Todos los archivos requeridos están presentes\n');
}

// Función para actualizar manifest con dominio
function updateManifest(domain) {
    console.log(`📝 Actualizando manifest para dominio: ${domain}`);
    
    const manifestPath = '.well-known/farcaster.json';
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    manifest.homeUrl = `https://${domain}`;
    manifest.icon = `https://${domain}/icon.png`;
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Manifest actualizado\n');
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    const domain = args[0];
    
    if (!domain) {
        console.log('Uso: node deploy.js <dominio>');
        console.log('Ejemplo: node deploy.js altoken.vercel.app');
        process.exit(1);
    }
    
    // Verificar archivos
    checkRequiredFiles();
    
    // Actualizar manifest
    updateManifest(domain);
    
    // Crear build
    runCommand('npm run build', 'Creando build de producción');
    
    // Verificar build
    if (!fs.existsSync('dist')) {
        console.error('❌ Error: El directorio dist no se creó');
        process.exit(1);
    }
    
    console.log('🎉 ¡Build completado exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Sube el contenido de la carpeta "dist" a tu hosting');
    console.log('2. Configura tu dominio para apuntar al hosting');
    console.log('3. Ve a https://miniapps.farcaster.xyz/');
    console.log('4. Usa el Embed Tool con tu URL');
    console.log('5. Asocia tu cuenta de Farcaster');
    console.log('\n🌐 Tu app estará disponible en:', `https://${domain}`);
    console.log('📄 Manifest en:', `https://${domain}/.well-known/farcaster.json`);
}

// Ejecutar
main().catch(console.error);
