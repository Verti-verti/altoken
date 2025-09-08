// Configuración para integración con Base, OnchainKit y MiniKit

export const CHAIN_CONFIG = {
    base: {
        id: 8453,
        name: 'Base',
        rpcUrl: 'https://mainnet.base.org',
        blockExplorer: 'https://basescan.org',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        }
    },
    baseSepolia: {
        id: 84532,
        name: 'Base Sepolia',
        rpcUrl: 'https://sepolia.base.org',
        blockExplorer: 'https://sepolia.basescan.org',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        }
    }
};

export const CONTRACT_ADDRESSES = {
    // Direcciones de contratos (actualizar con las direcciones reales después del deploy)
    surveyToken: {
        base: '0x...', // Dirección del token en Base mainnet
        baseSepolia: '0x...' // Dirección del token en Base Sepolia
    },
    surveyContract: {
        base: '0x...', // Dirección del contrato principal en Base mainnet
        baseSepolia: '0x...' // Dirección del contrato principal en Base Sepolia
    }
};

export const TOKEN_CONFIG = {
    name: 'SurveyVerse Token',
    symbol: 'SURV',
    decimals: 18,
    totalSupply: '1000000000000000000000000', // 1M tokens
    voteReward: '10000000000000000000', // 10 tokens
    createReward: '50000000000000000000' // 50 tokens
};

export const SURVEY_CONFIG = {
    minOptions: 2,
    maxOptions: 10,
    minDuration: 3600, // 1 hora en segundos
    maxDuration: 2592000, // 30 días en segundos
    defaultReward: '10000000000000000000' // 10 tokens por defecto
};

export const AI_CONFIG = {
    // Configuración para integración con APIs de IA
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4',
        maxTokens: 500
    },
    grok: {
        apiKey: process.env.GROK_API_KEY,
        model: 'grok-beta',
        maxTokens: 500
    },
    // Configuración para generación de encuestas
    surveyGeneration: {
        topics: [
            'Tecnología',
            'Criptomonedas',
            'DeFi',
            'NFTs',
            'Gaming',
            'IA',
            'Blockchain',
            'Web3',
            'Metaverso',
            'Trading'
        ],
        languages: ['es', 'en'],
        maxSurveysPerGeneration: 5
    }
};

export const GAMIFICATION_CONFIG = {
    // Sistema de puntos y recompensas
    points: {
        vote: 10,
        createSurvey: 50,
        dailyLogin: 5,
        shareSurvey: 15,
        viralSurvey: 100 // Cuando una encuesta supera 100 votos
    },
    levels: [
        { level: 1, name: 'Novato', minPoints: 0, color: '#6B7280' },
        { level: 2, name: 'Explorador', minPoints: 100, color: '#10B981' },
        { level: 3, name: 'Experto', minPoints: 500, color: '#3B82F6' },
        { level: 4, name: 'Maestro', minPoints: 1000, color: '#8B5CF6' },
        { level: 5, name: 'Leyenda', minPoints: 2500, color: '#F59E0B' }
    ],
    achievements: [
        {
            id: 'first_vote',
            name: 'Primer Voto',
            description: 'Vota en tu primera encuesta',
            icon: '🗳️',
            reward: 10
        },
        {
            id: 'first_survey',
            name: 'Creador',
            description: 'Crea tu primera encuesta',
            icon: '📊',
            reward: 50
        },
        {
            id: 'viral_survey',
            name: 'Viral',
            description: 'Crea una encuesta con más de 100 votos',
            icon: '🔥',
            reward: 100
        },
        {
            id: 'active_voter',
            name: 'Votante Activo',
            description: 'Vota en 50 encuestas',
            icon: '🎯',
            reward: 200
        },
        {
            id: 'survey_master',
            name: 'Maestro de Encuestas',
            description: 'Crea 20 encuestas',
            icon: '👑',
            reward: 500
        }
    ]
};

export const NOTIFICATION_CONFIG = {
    types: {
        vote: {
            title: 'Voto registrado!',
            icon: '🎉',
            duration: 3000
        },
        surveyCreated: {
            title: 'Encuesta creada!',
            icon: '📊',
            duration: 3000
        },
        rewardClaimed: {
            title: 'Recompensa reclamada!',
            icon: '💰',
            duration: 3000
        },
        achievement: {
            title: 'Logro desbloqueado!',
            icon: '🏆',
            duration: 5000
        },
        viralSurvey: {
            title: '¡Tu encuesta se volvió viral!',
            icon: '🔥',
            duration: 5000
        }
    }
};

export const API_ENDPOINTS = {
    // Endpoints para integración con backend (si se implementa)
    base: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
    surveys: '/api/surveys',
    users: '/api/users',
    leaderboard: '/api/leaderboard',
    ai: '/api/ai/generate'
};

export const STORAGE_KEYS = {
    userProfile: 'surveyverse_user_profile',
    tokenBalance: 'surveyverse_token_balance',
    achievements: 'surveyverse_achievements',
    settings: 'surveyverse_settings',
    lastSync: 'surveyverse_last_sync'
};

// Función para obtener la configuración del chain actual
export function getCurrentChainConfig() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return isDevelopment ? CHAIN_CONFIG.baseSepolia : CHAIN_CONFIG.base;
}

// Función para obtener las direcciones de contratos del chain actual
export function getCurrentContractAddresses() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const chain = isDevelopment ? 'baseSepolia' : 'base';
    
    return {
        surveyToken: CONTRACT_ADDRESSES.surveyToken[chain],
        surveyContract: CONTRACT_ADDRESSES.surveyContract[chain]
    };
}

// Función para formatear tokens
export function formatTokens(amount, decimals = 18) {
    const formatted = (parseFloat(amount) / Math.pow(10, decimals)).toFixed(2);
    return `${formatted} SURV`;
}

// Función para calcular el nivel del usuario basado en puntos
export function getUserLevel(points) {
    const levels = GAMIFICATION_CONFIG.levels;
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

// Función para verificar si se desbloqueó un logro
export function checkAchievement(userStats, achievementId) {
    const achievements = GAMIFICATION_CONFIG.achievements;
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement) return false;
    
    switch (achievementId) {
        case 'first_vote':
            return userStats.totalVotes >= 1;
        case 'first_survey':
            return userStats.totalSurveys >= 1;
        case 'viral_survey':
            return userStats.viralSurveys >= 1;
        case 'active_voter':
            return userStats.totalVotes >= 50;
        case 'survey_master':
            return userStats.totalSurveys >= 20;
        default:
            return false;
    }
}
