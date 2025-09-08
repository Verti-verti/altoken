# Altoken - Encuestas Tokenizadas con IA

Una aplicación de encuestas tokenizadas construida para Farcaster con integración de IA, gamificación y blockchain.

## 🚀 Características Principales

### Stack Tecnológico
- **Base**: OnchainKit, MiniKit, Base Account para login suave
- **Blockchain**: Contratos inteligentes en Base para tokenización
- **IA**: Integración con OpenAI y Grok para generación automática de encuestas
- **Gamificación**: Sistema de tokens, rankings y recompensas
- **UI/UX**: Interfaz moderna y responsive

### Funcionalidades
- 📊 **Encuestas Tokenizadas**: Crear y votar en encuestas con recompensas
- 🤖 **IA Generativa**: Generación automática de encuestas con IA
- 🏆 **Gamificación**: Sistema de puntos, niveles y logros
- 👛 **Wallet Integration**: Conexión con Base Account
- 🎯 **Feed Social**: Rankings y competencias entre usuarios
- 💰 **Tokenización**: Tokens ALTK por participación
- 📱 **Farcaster SDK**: Integración completa con Farcaster

## 🛠️ Stack Técnico

### Frontend
- **HTML5/CSS3/JavaScript**: Base de la aplicación
- **Farcaster Mini App SDK**: Integración con Farcaster
- **OnchainKit**: Integración con Base blockchain
- **MiniKit**: Wallet connection suave

### Backend/Blockchain
- **Solidity**: Contratos inteligentes
- **Base Network**: Blockchain principal
- **ERC20 Token**: Token ALTK para recompensas
- **OpenZeppelin**: Librerías de seguridad

### IA y APIs
- **OpenAI GPT-4**: Generación de encuestas
- **Grok (X/Twitter)**: IA alternativa
- **APIs de tendencias**: Para encuestas trending

## 📋 Prerrequisitos

- **Node.js 22.11.0 o superior** (versión LTS recomendada)
- **npm, pnpm o yarn**
- **Cuenta de Farcaster** con Developer Mode habilitado
- **Wallet compatible** (Base Account, MetaMask, etc.)
- **API Keys** (opcional): OpenAI, Grok para funcionalidades de IA

## 🚀 Instalación y Configuración

### 1. Instalar Node.js
```bash
# Verificar versión
node --version  # Debe ser 22.11.0 o superior

# Si no está instalado, descargar de nodejs.org
```

### 2. Habilitar Developer Mode en Farcaster
1. Ir a [Farcaster Developer Tools](https://farcaster.xyz/~/settings/developer-tools)
2. Activar "Developer Mode"
3. Usar las herramientas de desarrollador para preview

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno (Opcional)
```bash
# Crear archivo .env
OPENAI_API_KEY=tu_api_key_aqui
GROK_API_KEY=tu_api_key_aqui
REACT_APP_API_BASE_URL=http://localhost:3001
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

### 6. Acceder a la Aplicación
- **Local**: http://localhost:3000
- **Farcaster**: Usar developer tools para preview

## 📁 Estructura del Proyecto

```
├── index.html                 # HTML principal
├── styles.css                 # Estilos CSS
├── app.js                     # Lógica principal de la aplicación
├── package.json               # Dependencias y scripts
├── contracts/                 # Contratos inteligentes
│   ├── SurveyToken.sol        # Token ERC20 SURV
│   └── SurveyContract.sol     # Contrato principal de encuestas
├── config/                    # Configuración
│   └── web3.js               # Configuración Web3 y Base
├── services/                  # Servicios
│   └── aiService.js          # Servicio de IA
└── README.md                  # Documentación
```

## 🎯 Funcionalidades Detalladas

### Sistema de Encuestas
- **Creación Manual**: Formulario intuitivo para crear encuestas
- **IA Asistida**: Generación automática con OpenAI/Grok
- **Votación**: Sistema de votación con recompensas
- **Tendencias**: Encuestas basadas en temas trending

### Tokenización
- **Token ALTK**: ERC20 token en Base network
- **Recompensas**: Tokens por votar y crear encuestas
- **Claiming**: Sistema de reclamación de recompensas
- **Balance**: Visualización de balance en tiempo real

### Gamificación
- **Puntos**: Sistema de puntos por actividades
- **Niveles**: 5 niveles de usuario (Novato → Leyenda)
- **Logros**: Sistema de achievements
- **Rankings**: Leaderboard de usuarios

### Integración Farcaster
- **SDK Completo**: Todas las funcionalidades del SDK
- **Notificaciones**: Push notifications
- **Haptic Feedback**: Retroalimentación táctil
- **Ready State**: Manejo correcto del estado de la app

## 🔧 Configuración Avanzada

### Configurar IA
```javascript
import { configureAI } from './services/aiService.js';

// Configurar OpenAI
configureAI('openai', 'tu_api_key');

// Configurar Grok
configureAI('grok', 'tu_api_key');
```

### Configurar Blockchain
```javascript
import { getCurrentChainConfig } from './config/web3.js';

const chainConfig = getCurrentChainConfig();
// Usar configuración para conectar a Base
```

### Deploy de Contratos
```bash
# Instalar Hardhat (si se usa)
npm install --save-dev hardhat

# Compilar contratos
npx hardhat compile

# Deploy a Base Sepolia (testnet)
npx hardhat run scripts/deploy.js --network baseSepolia

# Deploy a Base (mainnet)
npx hardhat run scripts/deploy.js --network base
```

## 🎮 Uso de la Aplicación

### Para Usuarios
1. **Conectar Wallet**: Conectar Base Account o MetaMask
2. **Explorar Encuestas**: Ver encuestas activas
3. **Votar**: Participar y ganar tokens ALTK
4. **Crear**: Crear encuestas propias o con IA
5. **Competir**: Subir en el ranking y desbloquear logros

### Para Desarrolladores
1. **Customizar UI**: Modificar estilos en `styles.css`
2. **Añadir Funciones**: Extender `app.js`
3. **Integrar APIs**: Usar `aiService.js` para IA
4. **Deploy Contratos**: Actualizar direcciones en `config/web3.js`

## 🔐 Seguridad

### Contratos Inteligentes
- **ReentrancyGuard**: Protección contra ataques de reentrancia
- **Ownable**: Control de acceso a funciones administrativas
- **Validaciones**: Validación exhaustiva de inputs
- **OpenZeppelin**: Librerías probadas y auditadas

### Frontend
- **Validación**: Validación de inputs del usuario
- **Error Handling**: Manejo robusto de errores
- **API Keys**: Manejo seguro de claves API

## 📊 Métricas y Analytics

### Métricas de Usuario
- Encuestas creadas
- Votos emitidos
- Tokens ganados
- Tiempo de sesión

### Métricas de Encuestas
- Votos totales
- Tasa de participación
- Tiempo promedio de respuesta
- Viralización

## 🚀 Próximos Pasos

### Fase 1: MVP (Actual)
- ✅ Interfaz básica
- ✅ Sistema de encuestas
- ✅ Integración Farcaster
- ✅ Tokenización básica

### Fase 2: IA y Gamificación
- 🔄 Integración completa de IA
- 🔄 Sistema de logros
- 🔄 Rankings avanzados
- 🔄 Análisis de sentimiento

### Fase 3: Escalabilidad
- 📋 Backend propio
- 📋 Base de datos
- 📋 APIs REST
- 📋 Caching avanzado

### Fase 4: Funcionalidades Avanzadas
- 📋 Encuestas en tiempo real
- 📋 Integración con otras blockchains
- 📋 Marketplace de encuestas
- 📋 DAO governance

## 🛠️ Troubleshooting

### Problemas Comunes

#### Node.js Version
```bash
# Verificar versión
node --version

# Actualizar si es necesario
nvm install --lts
nvm use --lts
```

#### SDK Not Loading
- Verificar que la app se ejecute en Farcaster
- Usar developer tools para preview
- Verificar conexión a internet

#### Wallet Connection
- Verificar que Base Account esté configurado
- Comprobar red (Base Sepolia para test, Base para mainnet)
- Verificar gas fees

#### IA Not Working
- Verificar API keys en variables de entorno
- Comprobar límites de API
- Verificar conectividad a internet

## 📚 Recursos

### Documentación
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/docs/getting-started)
- [OnchainKit](https://onchainkit.xyz/)
- [Base Network](https://base.org/)
- [OpenAI API](https://platform.openai.com/docs)

### Comunidad
- [Farcaster Discord](https://discord.gg/farcaster)
- [Base Discord](https://discord.gg/buildonbase)
- [Twitter/X](https://twitter.com/farcaster_xyz)

## 📄 Licencia

MIT License - Ver archivo LICENSE para detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📞 Soporte

Para soporte técnico:
- Abrir un issue en GitHub
- Contactar en Discord de Farcaster
- Email: support@surveyverse.app

---

**Altoken** - Construyendo el futuro de las encuestas tokenizadas en Farcaster 🚀
