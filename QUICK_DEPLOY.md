# 🚀 Despliegue Rápido - Altoken en Farcaster

## ⚡ Pasos Rápidos (5 minutos)

### 1. 🏗️ Preparar Build
```bash
npm run build
```

### 2. 🌐 Elegir Hosting

#### Opción A: Vercel (Más Fácil)
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu GitHub
3. Importa este repositorio
4. Configura:
   - **Framework Preset**: Other
   - **Root Directory**: `dist`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Opción B: Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist` a Netlify
3. O conecta con GitHub y configura:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 3. 🔗 Obtener URL
Una vez desplegado, obtienes una URL como:
- `https://altoken-abc123.vercel.app`
- `https://altoken-xyz.netlify.app`

### 4. 📝 Actualizar Manifest
```bash
node deploy.js TU-URL-AQUI
```

### 5. 🎯 Asociar con Farcaster
1. Ve a [miniapps.farcaster.xyz](https://miniapps.farcaster.xyz)
2. Usa el **Embed Tool**
3. Ingresa tu URL
4. Escanea QR con Farcaster
5. Firma la solicitud
6. Copia el `accountAssociation` al manifest
7. Redespliega

## ✅ Checklist Final

- [ ] App desplegada y accesible
- [ ] Manifest en `/.well-known/farcaster.json`
- [ ] Icono en `/icon.png`
- [ ] Asociación con Farcaster completada
- [ ] Pruebas en Embed Tool exitosas

## 🎉 ¡Listo!

Tu app Altoken estará disponible en Farcaster en 24-48 horas.

---

**¿Necesitas ayuda?** Revisa `DEPLOYMENT.md` para instrucciones detalladas.
