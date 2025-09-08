#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Altoken - Actualizador de Manifest de Farcaster');
console.log('================================================\n');

// Función para actualizar el manifest
function updateManifest(accountAssociation, signature, timestamp) {
    const manifestPath = '.well-known/farcaster.json';
    
    try {
        // Leer el manifest actual
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        // Actualizar la información de asociación
        manifest.accountAssociation = {
            accountAssociation: accountAssociation,
            signature: signature,
            timestamp: timestamp
        };
        
        // Escribir el manifest actualizado
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        
        console.log('✅ Manifest actualizado exitosamente!');
        console.log('📄 Archivo:', manifestPath);
        console.log('🔗 URL:', manifest.homeUrl);
        console.log('📋 Manifest URL:', `${manifest.homeUrl}/.well-known/farcaster.json`);
        
        return true;
    } catch (error) {
        console.error('❌ Error actualizando manifest:', error.message);
        return false;
    }
}

// Función para validar la información
function validateInput(accountAssociation, signature, timestamp) {
    if (!accountAssociation || !accountAssociation.startsWith('0x')) {
        console.error('❌ accountAssociation debe empezar con 0x');
        return false;
    }
    
    if (!signature || !signature.startsWith('0x')) {
        console.error('❌ signature debe empezar con 0x');
        return false;
    }
    
    if (!timestamp || isNaN(timestamp)) {
        console.error('❌ timestamp debe ser un número válido');
        return false;
    }
    
    return true;
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log('Uso: node update-manifest.js <accountAssociation> <signature> <timestamp>');
        console.log('');
        console.log('Ejemplo:');
        console.log('node update-manifest.js 0x1234... 0xabcd... 1757357561989');
        console.log('');
        console.log('Para obtener esta información:');
        console.log('1. Ve a https://miniapps.farcaster.xyz/');
        console.log('2. Usa el Embed Tool');
        console.log('3. Ingresa: https://altoken-9hun.vercel.app');
        console.log('4. Escanea el QR con Farcaster');
        console.log('5. Firma la solicitud');
        console.log('6. Copia los valores que se generan');
        return;
    }
    
    const [accountAssociation, signature, timestamp] = args;
    
    // Validar entrada
    if (!validateInput(accountAssociation, signature, timestamp)) {
        process.exit(1);
    }
    
    // Actualizar manifest
    if (updateManifest(accountAssociation, signature, parseInt(timestamp))) {
        console.log('\n🎉 ¡Manifest actualizado!');
        console.log('📋 Próximos pasos:');
        console.log('1. git add .well-known/farcaster.json');
        console.log('2. git commit -m "Update Farcaster manifest with real account association"');
        console.log('3. git push');
        console.log('4. Vercel se redesplegará automáticamente');
        console.log('5. ¡Tu app estará lista para Farcaster!');
    }
}

// Ejecutar
main().catch(console.error);

