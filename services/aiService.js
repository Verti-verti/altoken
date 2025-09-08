// Servicio para integración con APIs de IA (OpenAI, Grok, etc.)

import { aiConfig, getAIConfig, isAIConfigured } from '../config/ai-config.js';

class AIService {
    constructor() {
        this.apiKey = null;
        this.provider = 'openai'; // Por defecto usar OpenAI
    }

    // Configurar el proveedor de IA
    setProvider(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
    }

    // Usar configuración desde aiConfig
    useConfig() {
        if (isAIConfigured()) {
            const config = getAIConfig();
            this.provider = config.provider;
            this.apiKey = config.apiKey;
            return true;
        }
        return false;
    }

    // Generar encuestas automáticamente
    async generateSurveys(topic = null, count = 3) {
        try {
            // Usar configuración actual
            if (!this.useConfig()) {
                throw new Error('IA no configurada. Por favor configura las API keys en la página de configuración.');
            }
            
            const surveys = [];
            
            for (let i = 0; i < count; i++) {
                const survey = await this.generateSingleSurvey(topic);
                if (survey) {
                    surveys.push(survey);
                }
            }
            
            return surveys;
        } catch (error) {
            console.error('Error generando encuestas:', error);
            throw error;
        }
    }

    // Generar una sola encuesta
    async generateSingleSurvey(topic = null) {
        try {
            // Usar configuración actual
            if (!this.useConfig()) {
                throw new Error('IA no configurada. Por favor configura las API keys en la página de configuración.');
            }
            
            const selectedTopic = topic || this.getRandomTopic();
            const prompt = this.buildSurveyPrompt(selectedTopic);
            
            console.log('Generando encuesta con tema:', selectedTopic);
            console.log('Proveedor de IA:', this.provider);
            
            const response = await this.callAI(prompt);
            console.log('Respuesta de IA:', response);
            
            return this.parseSurveyResponse(response, selectedTopic);
        } catch (error) {
            console.error('Error generando encuesta individual:', error);
            return null;
        }
    }

    // Construir prompt para la IA
    buildSurveyPrompt(topic) {
        return `Crea una encuesta sobre "${topic}" para la comunidad de criptomonedas y Web3.

REQUISITOS:
- Título atractivo y claro
- Descripción breve del contexto
- Exactamente 4 opciones de respuesta
- Enfoque que genere debate

RESPONDE SOLO EN FORMATO JSON VÁLIDO:
{
    "title": "Título de la encuesta",
    "description": "Descripción breve del contexto",
    "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
    "reward": 10
}

Las opciones deben ser mutuamente excluyentes y cubrir diferentes perspectivas sobre ${topic}.`;
    }

    // Llamar a la API de IA
    async callAI(prompt) {
        switch (this.provider) {
            case 'openai':
                return await this.callOpenAI(prompt);
            case 'grok':
                return await this.callGrok(prompt);
            case 'google':
                return await this.callGoogleAI(prompt);
            default:
                throw new Error(`Proveedor de IA no soportado: ${this.provider}`);
        }
    }

    // Llamar a OpenAI API
    async callOpenAI(prompt) {
        if (!this.apiKey) {
            throw new Error('API Key de OpenAI no configurada');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: AI_CONFIG.openai.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un experto en crear encuestas atractivas para comunidades de criptomonedas y Web3. Siempre responde en formato JSON válido.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: AI_CONFIG.openai.maxTokens,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Error en OpenAI API: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Llamar a Grok API (X/Twitter)
    async callGrok(prompt) {
        if (!this.apiKey) {
            throw new Error('API Key de Grok no configurada');
        }

        // Nota: Esta es una implementación de ejemplo
        // La API real de Grok puede tener un formato diferente
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    {
                        role: 'system',
                        content: 'Eres Grok, el asistente de IA de X. Crea encuestas atractivas para la comunidad crypto. Responde en JSON válido.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Error en Grok API: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Llamar a Google AI API (Gemini)
    async callGoogleAI(prompt) {
        if (!this.apiKey) {
            throw new Error('API Key de Google AI no configurada');
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Eres un experto en crear encuestas atractivas para comunidades de criptomonedas y Web3. Siempre responde en formato JSON válido.

${prompt}`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error en Google AI API: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Parsear respuesta de la IA
    parseSurveyResponse(response, topic) {
        try {
            console.log('Parseando respuesta de IA:', response);
            
            // Limpiar la respuesta (remover markdown si existe)
            let cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            
            // Buscar JSON en la respuesta si está embebido en texto
            const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanResponse = jsonMatch[0];
            }
            
            console.log('Respuesta limpia:', cleanResponse);
            
            const surveyData = JSON.parse(cleanResponse);
            
            // Validar estructura
            if (!surveyData.title || !surveyData.description || !surveyData.options) {
                throw new Error('Estructura de encuesta inválida');
            }
            
            if (surveyData.options.length < 2 || surveyData.options.length > 10) {
                throw new Error('Número de opciones inválido');
            }
            
            // Añadir metadatos
            const result = {
                ...surveyData,
                topic: topic,
                generatedBy: 'AI',
                timestamp: Date.now(),
                reward: surveyData.reward || 10
            };
            
            console.log('Encuesta parseada exitosamente:', result);
            return result;
        } catch (error) {
            console.error('Error parseando respuesta de IA:', error);
            console.log('Respuesta original:', response);
            // Fallback: crear encuesta básica
            return this.createFallbackSurvey(topic);
        }
    }

    // Crear encuesta de respaldo si falla la IA
    createFallbackSurvey(topic) {
        const fallbackSurveys = {
            'Tecnología': {
                title: `¿Cuál es tu opinión sobre ${topic}?`,
                description: `Comparte tu perspectiva sobre ${topic} y su impacto en el futuro.`,
                options: ['Muy positivo', 'Positivo', 'Neutral', 'Negativo'],
                reward: 10
            },
            'Criptomonedas': {
                title: `¿Cuál es tu estrategia de inversión en ${topic}?`,
                description: `Describe tu enfoque para invertir en ${topic}.`,
                options: ['HODL a largo plazo', 'Trading activo', 'Diversificación', 'Solo stablecoins'],
                reward: 10
            },
            'DeFi': {
                title: `¿Qué protocolo de ${topic} prefieres?`,
                description: `Elige tu protocolo favorito en el ecosistema ${topic}.`,
                options: ['Uniswap', 'Compound', 'Aave', 'MakerDAO'],
                reward: 10
            }
        };

        return fallbackSurveys[topic] || fallbackSurveys['Tecnología'];
    }

    // Obtener tema aleatorio
    getRandomTopic() {
        const topics = AI_CONFIG.surveyGeneration.topics;
        return topics[Math.floor(Math.random() * topics.length)];
    }

    // Generar encuestas basadas en tendencias
    async generateTrendingSurveys() {
        try {
            // Obtener temas trending (esto podría conectarse a APIs de redes sociales)
            const trendingTopics = await this.getTrendingTopics();
            
            const surveys = [];
            for (const topic of trendingTopics.slice(0, 3)) {
                const survey = await this.generateSingleSurvey(topic);
                if (survey) {
                    surveys.push(survey);
                }
            }
            
            return surveys;
        } catch (error) {
            console.error('Error generando encuestas trending:', error);
            return [];
        }
    }

    // Obtener temas trending (simulado)
    async getTrendingTopics() {
        // En una implementación real, esto podría conectarse a:
        // - Twitter API para hashtags trending
        // - Google Trends
        // - APIs de noticias crypto
        // - Datos de Farcaster
        
        const trendingTopics = [
            'Bitcoin ETF',
            'Ethereum Layer 2',
            'AI Tokens',
            'Real World Assets',
            'DeFi Yield Farming',
            'NFT Gaming',
            'Cross-chain Bridges',
            'Stablecoin Adoption'
        ];
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return trendingTopics;
    }

    // Analizar sentimiento de encuestas
    async analyzeSurveySentiment(surveyData) {
        try {
            const prompt = `
            Analiza el sentimiento y la probabilidad de viralización de esta encuesta:
            
            Título: ${surveyData.title}
            Descripción: ${surveyData.description}
            Opciones: ${surveyData.options.join(', ')}
            
            Responde en formato JSON:
            {
                "sentiment": "positive|neutral|negative",
                "viralPotential": 1-10,
                "engagementPrediction": "low|medium|high",
                "targetAudience": "descripción del público objetivo",
                "suggestions": ["sugerencia 1", "sugerencia 2"]
            }
            `;
            
            const response = await this.callAI(prompt);
            return JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());
        } catch (error) {
            console.error('Error analizando sentimiento:', error);
            return {
                sentiment: 'neutral',
                viralPotential: 5,
                engagementPrediction: 'medium',
                targetAudience: 'Comunidad crypto general',
                suggestions: []
            };
        }
    }

    // Generar sugerencias de mejora para encuestas
    async generateSurveySuggestions(surveyData) {
        try {
            const prompt = `
            Sugiere mejoras para esta encuesta para aumentar su engagement:
            
            Título: ${surveyData.title}
            Descripción: ${surveyData.description}
            Opciones: ${surveyData.options.join(', ')}
            
            Responde en formato JSON:
            {
                "titleSuggestions": ["sugerencia 1", "sugerencia 2"],
                "descriptionImprovements": ["mejora 1", "mejora 2"],
                "optionOptimizations": ["optimización 1", "optimización 2"],
                "engagementTips": ["tip 1", "tip 2"]
            }
            `;
            
            const response = await this.callAI(prompt);
            return JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim());
        } catch (error) {
            console.error('Error generando sugerencias:', error);
            return {
                titleSuggestions: [],
                descriptionImprovements: [],
                optionOptimizations: [],
                engagementTips: []
            };
        }
    }
}

// Instancia singleton
export const aiService = new AIService();

// Función helper para configurar la IA
export function configureAI(provider = 'openai', apiKey = null) {
    aiService.setProvider(provider, apiKey);
}

// Función helper para generar encuestas con IA
export async function generateAISurveys(topic = null, count = 3) {
    return await aiService.generateSurveys(topic, count);
}

// Función helper para generar encuestas trending
export async function generateTrendingSurveys() {
    return await aiService.generateTrendingSurveys();
}
