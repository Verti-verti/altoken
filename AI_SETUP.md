# 🤖 Configuración de IA para Altoken

Esta guía te ayudará a configurar las API keys para las funcionalidades de IA en Altoken.

## 📋 Prerrequisitos

- Cuenta en OpenAI (para GPT-4)
- Cuenta en X/Twitter (para Grok) - Opcional
- Acceso a internet

## 🔑 Configuración de OpenAI

### 1. Crear cuenta en OpenAI
1. Ve a [platform.openai.com](https://platform.openai.com)
2. Crea una cuenta o inicia sesión
3. Verifica tu email y teléfono

### 2. Obtener API Key
1. Ve a [API Keys](https://platform.openai.com/api-keys)
2. Haz clic en "Create new secret key"
3. Dale un nombre descriptivo (ej: "Altoken App")
4. Copia la API key (empieza con `sk-`)
5. **¡Importante!** Guárdala en un lugar seguro, no la compartas

### 3. Configurar en Altoken
1. Abre Altoken en tu navegador
2. Haz clic en el botón "Config IA" (⚙️)
3. Pega tu API key de OpenAI en el campo correspondiente
4. Haz clic en "Probar" para verificar que funciona
5. Haz clic en "Guardar"

## 🐦 Configuración de Grok (Opcional)

### 1. Acceder a Grok
1. Ve a [console.x.ai](https://console.x.ai)
2. Inicia sesión con tu cuenta de X/Twitter
3. Acepta los términos de servicio

### 2. Obtener API Key
1. Ve a la sección de API Keys
2. Crea una nueva API key
3. Copia la API key (empieza con `xai-`)
4. **¡Importante!** Guárdala en un lugar seguro

### 3. Configurar en Altoken
1. En la página de configuración de IA
2. Pega tu API key de Grok en el campo correspondiente
3. Haz clic en "Probar" para verificar
4. Haz clic en "Guardar"

## ⚙️ Configuración Avanzada

### Cambiar Proveedor por Defecto
1. En la página de configuración
2. Selecciona tu proveedor preferido en "Proveedor por defecto"
3. Haz clic en "Guardar Preferencia"

### Limpiar Configuración
Si necesitas limpiar todas las API keys:
1. Haz clic en "Limpiar Configuración"
2. Confirma la acción
3. Todas las API keys se eliminarán

## 💰 Costos y Límites

### OpenAI
- **Modelo**: GPT-4
- **Costo**: ~$0.03 por 1K tokens de entrada, ~$0.06 por 1K tokens de salida
- **Uso estimado**: ~$0.01-0.05 por encuesta generada
- **Límites**: Dependen de tu plan de OpenAI

### Grok
- **Modelo**: Grok-beta
- **Costo**: Varía según el plan
- **Uso estimado**: Similar a OpenAI
- **Límites**: Dependen de tu plan de X/Twitter

## 🔒 Seguridad

### Protección de API Keys
- **Nunca compartas** tus API keys
- **No las publiques** en código o repositorios
- **Usa variables de entorno** en producción
- **Rota las keys** regularmente

### Almacenamiento Local
- Las API keys se guardan en `localStorage` de tu navegador
- Solo son accesibles desde tu navegador
- Se eliminan si limpias los datos del navegador

## 🚨 Troubleshooting

### Error: "API key inválida"
- Verifica que copiaste la key completa
- Asegúrate de que no hay espacios extra
- Verifica que la key no haya expirado

### Error: "Límite de rate excedido"
- Espera unos minutos antes de intentar de nuevo
- Verifica tu plan de OpenAI/X
- Considera actualizar tu plan

### Error: "Sin créditos"
- Verifica tu saldo en OpenAI/X
- Añade créditos a tu cuenta
- Verifica tu método de pago

### La IA no genera encuestas
- Verifica que las API keys estén configuradas
- Prueba con una key diferente
- Verifica tu conexión a internet

## 📞 Soporte

Si tienes problemas:

1. **Verifica la configuración**: Asegúrate de que las API keys estén correctamente configuradas
2. **Prueba las keys**: Usa el botón "Probar" para verificar que funcionan
3. **Revisa los logs**: Abre las herramientas de desarrollador (F12) para ver errores
4. **Contacta soporte**: Si el problema persiste, contacta al equipo de desarrollo

## 🎯 Funcionalidades de IA

Una vez configurada, la IA te permitirá:

- **Generar encuestas automáticamente** sobre temas trending
- **Crear encuestas personalizadas** con IA asistida
- **Analizar sentimiento** de las encuestas
- **Sugerir mejoras** para aumentar engagement
- **Generar contenido viral** para la comunidad

## 🔄 Actualizaciones

La configuración de IA se actualiza automáticamente. Si hay cambios en las APIs:

1. Las nuevas funcionalidades estarán disponibles automáticamente
2. Los modelos se actualizarán según disponibilidad
3. Los costos pueden cambiar según las políticas de los proveedores

---

**¡Disfruta creando encuestas con IA en Altoken!** 🚀
