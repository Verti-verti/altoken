import { sdk } from '@farcaster/miniapp-sdk';
import { aiConfig, getAIConfig, isAIConfigured } from './config/ai-config.js';
import { aiService } from './services/aiService.js';

// App State
class SurveyApp {
    constructor() {
        this.currentUser = null;
        this.tokenBalance = 0;
        this.surveys = [];
        this.leaderboard = [];
        this.currentTab = 'surveys';
        this.isReady = false;
        
        this.init();
    }

    async init() {
        try {
            await this.initializeSDK();
            this.setupEventListeners();
            this.loadInitialData();
            this.updateStatus('Altoken inicializada correctamente', 'success');
        } catch (error) {
            console.error('Error inicializando app:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    }

    async initializeSDK() {
        try {
            // Verificar si estamos en Farcaster
            const isInFarcaster = await sdk.context.isInFarcaster();
            if (!isInFarcaster) {
                console.log('Ejecutándose fuera de Farcaster - modo desarrollo');
                this.updateStatus('Modo desarrollo - Funcionalidades limitadas', 'info');
                
                // Initialize demo mode
                this.initializeDemoMode();
                return;
            }

            // Obtener información del usuario
            try {
                this.currentUser = await sdk.context.getUser();
                this.updateUserProfile();
            } catch (error) {
                console.log('Usuario no autenticado aún');
            }

            // Mostrar botón de ready solo en Farcaster
            document.getElementById('readyBtn').style.display = 'inline-block';
        } catch (error) {
            console.log('Error inicializando SDK:', error);
            this.updateStatus('Modo desarrollo - SDK no disponible', 'info');
            
            // Initialize demo mode as fallback
            this.initializeDemoMode();
        }
    }

    initializeDemoMode() {
        // Set up demo user
        this.currentUser = {
            fid: 12345,
            username: 'DemoUser',
            displayName: 'Usuario Demo'
        };
        
        // Initialize demo token balance
        this.tokenBalance = 1000;
        
        // Update UI for demo mode
        this.updateUserProfile();
        this.updateTokenBalance();
        
        // Hide ready button in demo mode
        document.getElementById('readyBtn').style.display = 'none';
        
        // Update wallet button for demo mode
        document.getElementById('walletText').textContent = 'Demo';
        document.getElementById('walletBtn').classList.add('connected');
        
        console.log('Demo mode initialized successfully');
    }

    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Wallet connection
        document.getElementById('walletBtn').addEventListener('click', () => {
            this.connectWallet();
        });

        // App ready
        document.getElementById('readyBtn').addEventListener('click', () => {
            this.makeAppReady();
        });

        // Survey creation
        document.getElementById('manualCreate').addEventListener('click', () => {
            this.showSurveyForm();
        });

        document.getElementById('aiCreate').addEventListener('click', () => {
            this.createAISurvey();
        });

        document.getElementById('addOptionBtn').addEventListener('click', () => {
            this.addSurveyOption();
        });

        document.getElementById('publishSurveyBtn').addEventListener('click', () => {
            this.publishSurvey();
        });

        // AI Generator
        document.getElementById('aiGenerateBtn').addEventListener('click', () => {
            this.generateAISurveys();
        });

        // AI Config
        document.getElementById('aiConfigBtn').addEventListener('click', () => {
            window.open('ai-config.html', '_blank');
        });

        // Leaderboard filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterLeaderboard(e.currentTarget.dataset.filter);
            });
        });

        // Profile actions
        document.getElementById('claimRewardsBtn').addEventListener('click', () => {
            this.claimRewards();
        });

        document.getElementById('viewHistoryBtn').addEventListener('click', () => {
            this.viewHistory();
        });

        // FAB
        document.getElementById('fabBtn').addEventListener('click', () => {
            this.switchTab('create');
        });

        // Modal
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('surveyModal').addEventListener('click', (e) => {
            if (e.target.id === 'surveyModal') {
                this.closeModal();
            }
        });
    }

    async makeAppReady() {
        try {
            // Solo llamar ready() si estamos en Farcaster
            const isInFarcaster = await sdk.context.isInFarcaster();
            if (isInFarcaster) {
                await sdk.actions.ready();
                // Haptic feedback
                await sdk.actions.haptic('light');
            }
            
            this.isReady = true;
            this.updateStatus('App lista y visible!', 'success');
            document.getElementById('readyBtn').style.display = 'none';
        } catch (error) {
            console.error('Error calling ready():', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    }

    // Helper function para enviar notificaciones de manera segura
    async sendNotification(notification) {
        try {
            const isInFarcaster = await sdk.context.isInFarcaster();
            if (isInFarcaster) {
                await sdk.actions.sendNotification(notification);
            } else {
                console.log('Notificación (modo desarrollo):', notification);
            }
        } catch (error) {
            console.log('Error enviando notificación:', error);
        }
    }

    async connectWallet() {
        try {
            this.updateStatus('Conectando wallet...', 'loading');
            
            // Simular conexión de wallet (en producción usarías OnchainKit)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.tokenBalance = 1000; // Simular balance inicial
            this.updateTokenBalance();
            this.updateStatus('Wallet conectado!', 'success');
            
            // Actualizar UI
            document.getElementById('walletText').textContent = 'Conectado';
            document.getElementById('walletBtn').classList.add('connected');
            
            // Haptic feedback solo si estamos en Farcaster
            try {
                const isInFarcaster = await sdk.context.isInFarcaster();
                if (isInFarcaster) {
                    await sdk.actions.haptic('light');
                }
            } catch (error) {
                console.log('Haptic feedback no disponible');
            }
            
        } catch (error) {
            console.error('Error conectando wallet:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific data
        switch (tabName) {
            case 'surveys':
                this.loadSurveys();
                break;
            case 'leaderboard':
                this.loadLeaderboard();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    loadInitialData() {
        this.loadSurveys();
        this.loadLeaderboard();
        this.updateTokenBalance();
    }

    loadSurveys() {
        // Datos de ejemplo
        this.surveys = [
            {
                id: 1,
                title: "¿Cuál es tu criptomoneda favorita?",
                description: "Vota por tu criptomoneda preferida y gana tokens ALTK",
                options: ["Bitcoin", "Ethereum", "Solana", "Base"],
                votes: [45, 32, 18, 5],
                reward: 10,
                creator: "CryptoFan123",
                timeLeft: "2 días",
                totalVotes: 100
            },
            {
                id: 2,
                title: "¿Qué tecnología será más importante en 2024?",
                description: "Predice el futuro de la tecnología",
                options: ["IA", "Blockchain", "Realidad Virtual", "IoT"],
                votes: [60, 25, 10, 5],
                reward: 15,
                creator: "TechGuru",
                timeLeft: "5 días",
                totalVotes: 100
            },
            {
                id: 3,
                title: "¿Cuál es tu red social favorita?",
                description: "Comparte tu plataforma social preferida",
                options: ["Farcaster", "Twitter", "Instagram", "TikTok"],
                votes: [70, 15, 10, 5],
                reward: 8,
                creator: "SocialBee",
                timeLeft: "1 día",
                totalVotes: 100
            }
        ];

        this.renderSurveys();
    }

    renderSurveys() {
        const grid = document.getElementById('surveysGrid');
        grid.innerHTML = '';

        this.surveys.forEach(survey => {
            const surveyCard = this.createSurveyCard(survey);
            grid.appendChild(surveyCard);
        });
    }

    createSurveyCard(survey) {
        const card = document.createElement('div');
        card.className = 'survey-card fade-in';
        card.innerHTML = `
            <div class="survey-header">
                <div>
                    <h3 class="survey-title">${survey.title}</h3>
                    <div class="survey-reward">+${survey.reward} SURV</div>
                </div>
            </div>
            <p class="survey-description">${survey.description}</p>
            <div class="survey-stats">
                <span class="survey-votes">${survey.totalVotes} votos</span>
                <span class="survey-time">${survey.timeLeft}</span>
            </div>
            <div class="survey-options">
                ${survey.options.map((option, index) => `
                    <div class="option-item" data-survey="${survey.id}" data-option="${index}">
                        ${option}
                        <div class="vote-count">${survey.votes[index]} votos</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click listeners to options
        card.querySelectorAll('.option-item').forEach(option => {
            option.addEventListener('click', (e) => {
                this.voteOnSurvey(
                    parseInt(e.currentTarget.dataset.survey),
                    parseInt(e.currentTarget.dataset.option)
                );
            });
        });

        return card;
    }

    async voteOnSurvey(surveyId, optionIndex) {
        try {
            this.updateStatus('Votando...', 'loading');
            
            // Simular voto
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const survey = this.surveys.find(s => s.id === surveyId);
            if (survey) {
                survey.votes[optionIndex]++;
                survey.totalVotes++;
                this.tokenBalance += survey.reward;
                this.updateTokenBalance();
                this.renderSurveys();
                
                this.updateStatus(`Voto registrado! +${survey.reward} ALTK`, 'success');
                
                // Haptic feedback
                await sdk.actions.haptic('light');
                
                // Notification
                await this.sendNotification({
                    title: 'Voto registrado!',
                    body: `Ganaste ${survey.reward} tokens ALTK`,
                    icon: '🎉'
                });
            }
        } catch (error) {
            console.error('Error votando:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    }

    showSurveyForm() {
        document.getElementById('surveyForm').style.display = 'block';
    }

    addSurveyOption() {
        const container = document.getElementById('optionsContainer');
        const optionCount = container.children.length + 1;
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Opción ${optionCount}`;
        input.className = 'form-input option-input';
        container.appendChild(input);
    }

    async publishSurvey() {
        try {
            const title = document.getElementById('surveyTitle').value;
            const description = document.getElementById('surveyDescription').value;
            const reward = parseInt(document.getElementById('voteReward').value);
            const options = Array.from(document.querySelectorAll('.option-input'))
                .map(input => input.value)
                .filter(value => value.trim() !== '');

            if (!title || !description || options.length < 2) {
                this.updateStatus('Por favor completa todos los campos', 'error');
                return;
            }

            this.updateStatus('Publicando encuesta...', 'loading');

            // Simular publicación
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newSurvey = {
                id: Date.now(),
                title,
                description,
                options,
                votes: new Array(options.length).fill(0),
                reward,
                creator: this.currentUser?.username || 'Usuario',
                timeLeft: '7 días',
                totalVotes: 0
            };

            this.surveys.unshift(newSurvey);
            this.renderSurveys();
            this.switchTab('surveys');

            this.updateStatus('Encuesta publicada!', 'success');
            
            // Haptic feedback
            await sdk.actions.haptic('medium');
            
            // Notification
            await this.sendNotification({
                title: 'Encuesta publicada!',
                body: 'Tu encuesta ya está disponible para votar',
                icon: '📊'
            });

        } catch (error) {
            console.error('Error publicando encuesta:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    }

    async createAISurvey() {
        try {
            // Verificar si la IA está configurada
            if (!isAIConfigured()) {
                this.updateStatus('IA no configurada. Configura las API keys primero.', 'error');
                // Abrir página de configuración
                window.open('ai-config.html', '_blank');
                return;
            }
            
            this.updateStatus('Generando encuesta con IA...', 'loading');
            
            // Usar el servicio de IA real
            const aiSurvey = await aiService.generateSingleSurvey();
            
            if (!aiSurvey) {
                throw new Error('No se pudo generar la encuesta');
            }
            
            // Llenar el formulario
            document.getElementById('surveyTitle').value = aiSurvey.title;
            document.getElementById('surveyDescription').value = aiSurvey.description;
            document.getElementById('voteReward').value = aiSurvey.reward;
            
            const container = document.getElementById('optionsContainer');
            container.innerHTML = '';
            aiSurvey.options.forEach(option => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = option;
                input.className = 'form-input option-input';
                container.appendChild(input);
            });
            
            this.showSurveyForm();
            this.updateStatus('Encuesta generada por IA!', 'success');
            
            // Haptic feedback
            await sdk.actions.haptic('light');
            
        } catch (error) {
            console.error('Error generando encuesta con IA:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    }

    async generateAISurveys() {
        try {
            // Verificar si la IA está configurada
            if (!isAIConfigured()) {
                this.updateStatus('IA no configurada. Configura las API keys primero.', 'error');
                // Abrir página de configuración
                window.open('ai-config.html', '_blank');
                return;
            }
            
            this.updateStatus('Generando encuestas con IA...', 'loading');
            
            // Usar el servicio de IA real
            const aiSurveys = await aiService.generateSurveys(null, 2);
            
            if (!aiSurveys || aiSurveys.length === 0) {
                throw new Error('No se pudieron generar las encuestas');
            }
            
            // Convertir a formato de la aplicación
            const formattedSurveys = aiSurveys.map((survey, index) => ({
                id: Date.now() + index + 1,
                title: survey.title,
                description: survey.description,
                options: survey.options,
                votes: new Array(survey.options.length).fill(0),
                reward: survey.reward,
                creator: "AI Assistant",
                timeLeft: "7 días",
                totalVotes: 0
            }));
            
            this.surveys.unshift(...formattedSurveys);
            this.renderSurveys();
            
            this.updateStatus('Encuestas generadas por IA!', 'success');
            
            // Haptic feedback
            await sdk.actions.haptic('medium');
            
            // Notification
            await this.sendNotification({
                title: 'Nuevas encuestas IA!',
                body: `Se generaron ${formattedSurveys.length} nuevas encuestas automáticamente`,
                icon: '🤖'
            });
            
        } catch (error) {
            console.error('Error generando encuestas con IA:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    }

    loadLeaderboard() {
        // Datos de ejemplo
        this.leaderboard = [
            { rank: 1, name: "CryptoMaster", avatar: "👑", tokens: 2500, surveys: 15, votes: 89 },
            { rank: 2, name: "SurveyKing", avatar: "🏆", tokens: 2200, surveys: 12, votes: 76 },
            { rank: 3, name: "VoteChamp", avatar: "🥇", tokens: 1900, surveys: 8, votes: 92 },
            { rank: 4, name: "PollPro", avatar: "🥈", tokens: 1650, surveys: 10, votes: 67 },
            { rank: 5, name: "DataGuru", avatar: "🥉", tokens: 1400, surveys: 6, votes: 54 },
            { rank: 6, name: "QuestionQueen", avatar: "👑", tokens: 1200, surveys: 9, votes: 43 },
            { rank: 7, name: "AnswerAce", avatar: "🎯", tokens: 980, surveys: 5, votes: 38 },
            { rank: 8, name: "SurveyStar", avatar: "⭐", tokens: 850, surveys: 7, votes: 31 }
        ];

        this.renderLeaderboard();
    }

    renderLeaderboard() {
        const list = document.getElementById('leaderboardList');
        list.innerHTML = '';

        this.leaderboard.forEach(user => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item fade-in';
            item.innerHTML = `
                <div class="leaderboard-rank">${user.rank}</div>
                <div class="leaderboard-avatar">${user.avatar}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-stats">
                        ${user.surveys} encuestas • ${user.votes} votos
                    </div>
                </div>
                <div class="leaderboard-tokens">${user.tokens} SURV</div>
            `;
            list.appendChild(item);
        });
    }

    filterLeaderboard(filter) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filter logic (simplified for demo)
        this.renderLeaderboard();
    }

    loadProfile() {
        if (this.currentUser) {
            this.updateUserProfile();
        }
        
        // Update stats (simplified for demo)
        document.getElementById('surveysCreated').textContent = '3';
        document.getElementById('votesCast').textContent = '15';
        document.getElementById('tokensEarned').textContent = this.tokenBalance.toString();
    }

    updateUserProfile() {
        if (this.currentUser) {
            document.getElementById('profileName').textContent = this.currentUser.displayName || this.currentUser.username || 'Usuario';
            document.getElementById('profileFid').textContent = `FID: ${this.currentUser.fid}`;
            document.getElementById('profileAvatar').textContent = '👤';
        }
    }

    updateTokenBalance() {
        document.getElementById('balanceAmount').textContent = this.tokenBalance.toLocaleString();
    }

    async claimRewards() {
        try {
            this.updateStatus('Reclamando recompensas...', 'loading');
            
            // Simular claim
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const claimedAmount = 50;
            this.tokenBalance += claimedAmount;
            this.updateTokenBalance();
            
            this.updateStatus(`Recompensas reclamadas! +${claimedAmount} ALTK`, 'success');
            
            // Haptic feedback
            await sdk.actions.haptic('heavy');
            
            // Notification
            await this.sendNotification({
                title: 'Recompensas reclamadas!',
                body: `Ganaste ${claimedAmount} tokens ALTK`,
                icon: '💰'
            });
            
        } catch (error) {
            console.error('Error reclamando recompensas:', error);
            this.updateStatus(`Error: ${error.message}`, 'error');
        }
    }

    viewHistory() {
        this.updateStatus('Abriendo historial...', 'loading');
        // Implementar vista de historial
        setTimeout(() => {
            this.updateStatus('Historial cargado', 'success');
        }, 1000);
    }

    updateStatus(message, type = 'info') {
        const statusText = document.getElementById('statusText');
        statusText.textContent = message;
        
        // Update status bar class
        const statusBar = document.getElementById('statusBar');
        statusBar.className = `status-bar ${type}`;
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                statusText.textContent = 'Listo';
                statusBar.className = 'status-bar';
            }, 3000);
        }
        
        // Auto-hide info messages in demo mode
        if (type === 'info' && message.includes('desarrollo')) {
            setTimeout(() => {
                statusText.textContent = 'Modo Demo - Listo';
                statusBar.className = 'status-bar';
            }, 2000);
        }
    }

    closeModal() {
        document.getElementById('surveyModal').classList.remove('active');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.surveyApp = new SurveyApp();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.surveyApp) {
        window.surveyApp.updateStatus(`Error: ${event.error.message}`, 'error');
    }
});