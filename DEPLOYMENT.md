# 🚀 Guía de Despliegue - Altoken en Farcaster

## 📋 Requisitos Previos

1. **Cuenta de Farcaster**: Necesitas una cuenta activa en Farcaster
2. **Dominio**: Un dominio estable para hostear tu app (no se puede cambiar después)
3. **Servicio de Hosting**: Vercel, Netlify, o similar

## 🛠️ Pasos para Desplegar

### 1. Preparar la Aplicación

```bash
# Instalar dependencias
npm install

# Crear build de producción
npm run build

# Verificar que el build se creó correctamente
ls -la dist/
```

### 2. Configurar el Dominio

1. **Compra un dominio** (ej: `altoken.app`, `altoken.xyz`)
2. **Configura DNS** para apuntar a tu servicio de hosting

### 3. Desplegar en Hosting

#### Opción A: Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod

# O conectar con GitHub y desplegar automáticamente
```

#### Opción B: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Desplegar
netlify deploy --prod --dir=dist
```

### 4. Actualizar Manifest

Una vez desplegado, actualiza el archivo `.well-known/farcaster.json`:

```json
{
  "name": "Altoken",
  "description": "Tokenized Survey App with AI and Gamification",
  "icon": "https://TU-DOMINIO.com/icon.png",
  "homeUrl": "https://TU-DOMINIO.com",
  "tags": ["surveys", "tokens", "ai", "gamification", "web3"],
  "primaryCategory": "social",
  "version": "1.0.0"
}
```

### 5. Asociar con Farcaster

1. Ve a [Farcaster Developer Tools](https://miniapps.farcaster.xyz/)
2. Usa el **Embed Tool**
3. Ingresa tu URL: `https://TU-DOMINIO.com`
4. Escanea el QR con tu app de Farcaster
5. Firma la solicitud
6. Copia el `accountAssociation` al manifest
7. Redespliega la app

### 6. Verificar Despliegue

- ✅ App accesible en `https://TU-DOMINIO.com`
- ✅ Manifest en `https://TU-DOMINIO.com/.well-known/farcaster.json`
- ✅ Icono en `https://TU-DOMINIO.com/icon.png`
- ✅ Funciona en Farcaster Embed Tool

## 🔧 Configuración de Producción

### Variables de Entorno

```bash
NODE_ENV=production
FARCASTER_MODE=production
```

### Optimizaciones

- ✅ Minificación de archivos
- ✅ Compresión gzip
- ✅ Cache headers
- ✅ HTTPS habilitado

## 🎯 Checklist Final

- [ ] Dominio configurado y funcionando
- [ ] App desplegada y accesible
- [ ] Manifest creado y accesible
- [ ] Icono subido y accesible
- [ ] Asociación con Farcaster completada
- [ ] Pruebas en Farcaster Embed Tool exitosas
- [ ] App visible en Farcaster

## 🆘 Solución de Problemas

### Error: "Manifest not found"
- Verifica que `.well-known/farcaster.json` esté en la raíz
- Confirma que el archivo sea accesible públicamente

### Error: "Invalid manifest"
- Valida el JSON en [jsonlint.com](https://jsonlint.com)
- Verifica que todos los campos requeridos estén presentes

### App no aparece en Farcaster
- Espera 24-48 horas para propagación
- Verifica que la asociación de cuenta esté correcta
- Contacta soporte de Farcaster si persiste

## 📞 Soporte

- **Farcaster Docs**: [miniapps.farcaster.xyz](https://miniapps.farcaster.xyz)
- **Discord**: Farcaster Developer Community
- **GitHub**: Issues en este repositorio

---

¡Tu app Altoken estará lista para ser descubierta por la comunidad de Farcaster! 🎉
