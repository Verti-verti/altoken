// Archivo de configuración de ejemplo para SurveyVerse
// Copia este archivo a config.js y configura tus valores

export const CONFIG = {
    // API Keys para IA (opcional)
    ai: {
        openai: {
            apiKey: 'tu_api_key_de_openai_aqui',
            model: 'gpt-4',
            maxTokens: 500
        },
        grok: {
            apiKey: 'tu_api_key_de_grok_aqui',
            model: 'grok-beta',
            maxTokens: 500
        }
    },

    // Configuración de Base Network
    blockchain: {
        base: {
            rpcUrl: 'https://mainnet.base.org',
            chainId: 8453,
            blockExplorer: 'https://basescan.org'
        },
        baseSepolia: {
            rpcUrl: 'https://sepolia.base.org',
            chainId: 84532,
            blockExplorer: 'https://sepolia.basescan.org'
        }
    },

    // Direcciones de contratos (actualizar después del deploy)
    contracts: {
        surveyToken: {
            base: '0x...', // Dirección del token en Base mainnet
            baseSepolia: '0x...' // Dirección del token en Base Sepolia
        },
        surveyContract: {
            base: '0x...', // Dirección del contrato principal en Base mainnet
            baseSepolia: '0x...' // Dirección del contrato principal en Base Sepolia
        }
    },

    // Configuración de recompensas (en wei)
    rewards: {
        vote: '10000000000000000000', // 10 tokens
        createSurvey: '50000000000000000000', // 50 tokens
        dailyBonus: '5000000000000000000', // 5 tokens
        viralSurvey: '100000000000000000000' // 100 tokens
    },

    // Configuración de encuestas
    surveys: {
        minDuration: 3600, // 1 hora en segundos
        maxDuration: 2592000, // 30 días en segundos
        maxOptions: 10,
        minOptions: 2,
        defaultReward: '10000000000000000000' // 10 tokens
    },

    // Configuración de gamificación
    gamification: {
        points: {
            vote: 10,
            createSurvey: 50,
            dailyLogin: 5,
            shareSurvey: 15,
            viralSurvey: 100
        },
        levels: [
            { level: 1, name: 'Novato', minPoints: 0, color: '#6B7280' },
            { level: 2, name: 'Explorador', minPoints: 100, color: '#10B981' },
            { level: 3, name: 'Experto', minPoints: 500, color: '#3B82F6' },
            { level: 4, name: 'Maestro', minPoints: 1000, color: '#8B5CF6' },
            { level: 5, name: 'Leyenda', minPoints: 2500, color: '#F59E0B' }
        ]
    },

    // Configuración de la aplicación
    app: {
        name: 'SurveyVerse',
        version: '1.0.0',
        environment: 'development', // development, staging, production
        apiBaseUrl: 'http://localhost:3001',
        maxSurveysPerPage: 20,
        refreshInterval: 30000 // 30 segundos
    }
};

// Función para obtener la configuración del entorno actual
export function getCurrentConfig() {
    const isDevelopment = CONFIG.app.environment === 'development';
    return {
        ...CONFIG,
        blockchain: isDevelopment ? CONFIG.blockchain.baseSepolia : CONFIG.blockchain.base,
        contracts: {
            surveyToken: isDevelopment ? CONFIG.contracts.surveyToken.baseSepolia : CONFIG.contracts.surveyToken.base,
            surveyContract: isDevelopment ? CONFIG.contracts.surveyContract.baseSepolia : CONFIG.contracts.surveyContract.base
        }
    };
}

// Función para formatear tokens
export function formatTokens(amount, decimals = 18) {
    const formatted = (parseFloat(amount) / Math.pow(10, decimals)).toFixed(2);
    return `${formatted} SURV`;
}

// Función para calcular el nivel del usuario
export function getUserLevel(points) {
    const levels = CONFIG.gamification.levels;
    let currentLevel = levels[0];
    
    for (const level of levels) {
        if (points >= level.minPoints) {
            currentLevel = level;
        } else {
            break;
        }
    }
    
    return currentLevel;
}
