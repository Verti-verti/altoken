# 🚀 Instrucciones de Despliegue en Vercel - Altoken

## 📋 Estado Actual
✅ **Build completado** - Carpeta `dist/` lista  
✅ **Manifest configurado** - `.well-known/farcaster.json` listo  
✅ **Vercel CLI instalado** - Versión 47.0.5  

## 🎯 Opciones de Despliegue

### **Opción A: Vercel CLI (Requiere Login)**

1. **Hacer Login**:
   ```bash
   vercel login
   ```
   - Selecciona "Continue with GitHub"
   - Autoriza la aplicación
   - Completa el proceso

2. **Desplegar**:
   ```bash
   vercel --prod
   ```

3. **Configurar**:
   - Framework: Other
   - Root Directory: `dist`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### **Opción B: Vercel Web (Más Fácil)**

1. **Subir a GitHub**:
   - Crea repositorio en GitHub
   - Sube todos los archivos
   - Incluye carpeta `dist/`

2. **Desplegar en Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - "New Project" → Import from GitHub
   - Selecciona tu repositorio
   - Configura:
     - **Framework Preset**: Other
     - **Root Directory**: `dist`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Deploy**:
   - Click "Deploy"
   - Espera a que termine
   - Obtén tu URL (ej: `https://altoken-abc123.vercel.app`)

## 🔧 Configuración Post-Despliegue

### 1. **Actualizar Manifest**
Una vez que tengas tu URL de Vercel:
```bash
node deploy.js TU-URL-DE-VERCEL
```

### 2. **Verificar Archivos**
- ✅ App: `https://TU-URL.vercel.app`
- ✅ Manifest: `https://TU-URL.vercel.app/.well-known/farcaster.json`
- ✅ Icono: `https://TU-URL.vercel.app/icon.png`

### 3. **Asociar con Farcaster**
1. Ve a [miniapps.farcaster.xyz](https://miniapps.farcaster.xyz)
2. Usa el **Embed Tool**
3. Ingresa tu URL
4. Escanea QR con Farcaster
5. Firma la solicitud
6. Copia el `accountAssociation` al manifest
7. Redespliega

## 📁 Archivos Listos para Despliegue

```
dist/
├── index.html              # App principal
├── styles.css              # Estilos
├── app.js                  # Lógica de la app
├── ai-config.html          # Configuración IA
├── test-survey-generation.html # Testing IA
├── package.json            # Dependencias
├── config/
│   ├── ai-config.js        # Configuración IA
│   └── web3.js             # Configuración Web3
├── services/
│   └── aiService.js        # Servicio IA
└── .well-known/
    └── farcaster.json      # Manifest Farcaster
```

## 🎉 ¡Listo para Desplegar!

Tu aplicación Altoken está completamente preparada para Vercel. Solo necesitas elegir una de las opciones de despliegue y seguir los pasos.

**¿Cuál opción prefieres usar?**
