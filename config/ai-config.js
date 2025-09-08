// Configuración de API Keys para IA en Altoken
// Este archivo maneja la configuración de las APIs de IA

class AIConfig {
    constructor() {
        this.providers = {
            openai: {
                apiKey: null,
                model: 'gpt-4',
                maxTokens: 500,
                baseUrl: 'https://api.openai.com/v1'
            },
            grok: {
                apiKey: null,
                model: 'grok-beta',
                maxTokens: 500,
                baseUrl: 'https://api.x.ai/v1'
            },
            google: {
                apiKey: null,
                model: 'gemini-1.5-flash',
                maxTokens: 500,
                baseUrl: 'https://generativelanguage.googleapis.com/v1beta'
            }
        };
        
        this.currentProvider = 'openai';
        this.isConfigured = false;
        
        this.loadFromStorage();
    }

    // Cargar configuración desde localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('altoken_ai_config');
            if (saved) {
                const config = JSON.parse(saved);
                this.providers = { ...this.providers, ...config.providers };
                this.currentProvider = config.currentProvider || 'openai';
                this.isConfigured = this.hasValidKeys();
            }
        } catch (error) {
            console.warn('Error loading AI config from storage:', error);
        }
    }

    // Guardar configuración en localStorage
    saveToStorage() {
        try {
            const config = {
                providers: this.providers,
                currentProvider: this.currentProvider,
                timestamp: Date.now()
            };
            localStorage.setItem('altoken_ai_config', JSON.stringify(config));
        } catch (error) {
            console.warn('Error saving AI config to storage:', error);
        }
    }

    // Configurar API key para un proveedor
    setAPIKey(provider, apiKey) {
        if (this.providers[provider]) {
            this.providers[provider].apiKey = apiKey;
            this.saveToStorage();
            this.isConfigured = this.hasValidKeys();
            return true;
        }
        return false;
    }

    // Obtener API key de un proveedor
    getAPIKey(provider) {
        return this.providers[provider]?.apiKey || null;
    }

    // Verificar si hay keys válidas configuradas
    hasValidKeys() {
        return Object.values(this.providers).some(provider => 
            provider.apiKey && provider.apiKey.length > 0
        );
    }

    // Cambiar proveedor actual
    setCurrentProvider(provider) {
        if (this.providers[provider]) {
            this.currentProvider = provider;
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Obtener configuración del proveedor actual
    getCurrentConfig() {
        return {
            ...this.providers[this.currentProvider],
            provider: this.currentProvider
        };
    }

    // Obtener todos los proveedores disponibles
    getAvailableProviders() {
        return Object.keys(this.providers).filter(provider => 
            this.providers[provider].apiKey && this.providers[provider].apiKey.length > 0
        );
    }

    // Limpiar configuración
    clearConfig() {
        Object.keys(this.providers).forEach(provider => {
            this.providers[provider].apiKey = null;
        });
        this.isConfigured = false;
        this.saveToStorage();
    }

    // Validar API key (test básico)
    async validateAPIKey(provider, apiKey) {
        if (!apiKey || apiKey.length === 0) {
            return { valid: false, error: 'API key vacía' };
        }

        try {
            const config = this.providers[provider];
            if (!config) {
                return { valid: false, error: 'Proveedor no válido' };
            }

            // Test básico de conectividad
            const testPrompt = 'Responde solo "OK" si puedes procesar este mensaje.';
            
            let response;
            
            if (provider === 'google') {
                // Google AI API tiene un formato diferente
                response = await fetch(`${config.baseUrl}/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: testPrompt
                            }]
                        }],
                        generationConfig: {
                            maxOutputTokens: 10,
                            temperature: 0
                        }
                    })
                });
            } else {
                // OpenAI y Grok usan el formato estándar
                response = await fetch(`${config.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: config.model,
                        messages: [
                            {
                                role: 'user',
                                content: testPrompt
                            }
                        ],
                        max_tokens: 10,
                        temperature: 0
                    })
                });
            }

            if (response.ok) {
                return { valid: true, message: 'API key válida' };
            } else {
                const error = await response.json();
                return { 
                    valid: false, 
                    error: error.error?.message || `Error ${response.status}` 
                };
            }
        } catch (error) {
            return { 
                valid: false, 
                error: `Error de conexión: ${error.message}` 
            };
        }
    }

    // Obtener estado de configuración
    getStatus() {
        return {
            isConfigured: this.isConfigured,
            currentProvider: this.currentProvider,
            availableProviders: this.getAvailableProviders(),
            hasOpenAI: !!this.providers.openai.apiKey,
            hasGrok: !!this.providers.grok.apiKey
        };
    }
}

// Instancia singleton
export const aiConfig = new AIConfig();

// Funciones helper para uso en la aplicación
export function configureAI(provider, apiKey) {
    return aiConfig.setAPIKey(provider, apiKey);
}

export function getAIConfig() {
    return aiConfig.getCurrentConfig();
}

export function isAIConfigured() {
    return aiConfig.isConfigured;
}

export function getAIStatus() {
    return aiConfig.getStatus();
}

export async function validateAIKey(provider, apiKey) {
    return await aiConfig.validateAPIKey(provider, apiKey);
}

// Configuración por defecto para desarrollo
export const DEFAULT_AI_CONFIG = {
    openai: {
        model: 'gpt-4',
        maxTokens: 500,
        temperature: 0.7
    },
    grok: {
        model: 'grok-beta',
        maxTokens: 500,
        temperature: 0.7
    }
};

// Temas predefinidos para generación de encuestas
export const SURVEY_TOPICS = [
    'Tecnología',
    'Criptomonedas',
    'DeFi',
    'NFTs',
    'Gaming',
    'IA',
    'Blockchain',
    'Web3',
    'Metaverso',
    'Trading',
    'Base Network',
    'Farcaster',
    'Altcoin',
    'Staking',
    'Yield Farming'
];

// Prompts predefinidos para diferentes tipos de encuestas
export const SURVEY_PROMPTS = {
    crypto: 'Genera una encuesta sobre criptomonedas y blockchain que sea relevante para la comunidad de Farcaster y Base.',
    tech: 'Crea una encuesta sobre tecnología emergente que genere debate en la comunidad crypto.',
    defi: 'Diseña una encuesta sobre protocolos DeFi y yield farming.',
    nft: 'Genera una encuesta sobre NFTs y arte digital.',
    gaming: 'Crea una encuesta sobre gaming y blockchain.',
    general: 'Genera una encuesta interesante sobre cualquier tema relevante para la comunidad crypto.'
};
