// Elementos DOM
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const saveBtn = document.getElementById('saveBtn');
const settingsToggle = document.getElementById('settingsToggle');
const settingsContent = document.getElementById('settingsContent');
const toggleIcon = document.querySelector('.toggle-icon');

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const percentText = document.getElementById('percentText');
const successCount = document.getElementById('successCount');
const currentPage = document.getElementById('currentPage');
const timeElapsed = document.getElementById('timeElapsed');

const maxConnectionsInput = document.getElementById('maxConnections');
const minDelayInput = document.getElementById('minDelay');
const maxDelayInput = document.getElementById('maxDelay');
const messageTextArea = document.getElementById('messageText');
const charCount = document.getElementById('charCount');

let startTime = null;
let timerInterval = null;

// Carregar configurações salvas
async function loadSettings() {
    const result = await chrome.storage.local.get({
        maxConnections: 50,
        minDelay: 8,
        maxDelay: 20,
        message: 'Olá! Sou Desenvolvedor/Tech Lead focado em AWS e Node.js. Tenho experiência sólida em migrações de arquitetura e sistemas de alta disponibilidade. Gostaria de conectar para acompanhar oportunidades na área'
    });

    maxConnectionsInput.value = result.maxConnections;
    minDelayInput.value = result.minDelay;
    maxDelayInput.value = result.maxDelay;
    messageTextArea.value = result.message;
    updateCharCount();
}

// Salvar configurações
async function saveSettings() {
    const settings = {
        maxConnections: parseInt(maxConnectionsInput.value),
        minDelay: parseInt(minDelayInput.value),
        maxDelay: parseInt(maxDelayInput.value),
        message: messageTextArea.value
    };

    await chrome.storage.local.set(settings);
    
    // Feedback visual
    const originalHTML = saveBtn.innerHTML;
    saveBtn.textContent = '✓ Salvo!';
    saveBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalHTML;
        saveBtn.style.background = 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)';
    }, 2000);
    
    console.log('✅ Configurações salvas:', settings);
}

// Contador de caracteres
function updateCharCount() {
    charCount.textContent = messageTextArea.value.length;
}

// Toggle configurações
settingsToggle.addEventListener('click', () => {
    settingsContent.classList.toggle('expanded');
    toggleIcon.classList.toggle('rotated');
});

// Atualizar timer
function updateTimer() {
    if (!startTime) return;
    
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timeElapsed.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Atualizar status da UI
function updateStatus(status) {
    statusDot.className = 'status-dot';
    
    switch(status.state) {
        case 'running':
            statusDot.classList.add('running');
            statusText.textContent = 'Em execução...';
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            
            if (!startTime) {
                startTime = Date.now();
                timerInterval = setInterval(updateTimer, 1000);
            }
            break;
            
        case 'paused':
            statusDot.classList.add('paused');
            statusText.textContent = 'Pausado';
            startBtn.disabled = false;
            startBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.14v14l11-7-11-7z"/>
                </svg>
                Retomar
            `;
            pauseBtn.disabled = true;
            stopBtn.disabled = false;
            break;
            
        case 'stopped':
        case 'idle':
            statusDot.className = 'status-dot';
            statusText.textContent = 'Aguardando início';
            startBtn.disabled = false;
            startBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5.14v14l11-7-11-7z"/>
                </svg>
                Iniciar
            `;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            if (status.state === 'stopped') {
                startTime = null;
                timeElapsed.textContent = '0:00';
            }
            break;
            
        case 'error':
            statusDot.classList.add('error');
            statusText.textContent = status.message || 'Erro';
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            break;
    }
    
    if (status.connections !== undefined) {
        const max = status.maxConnections || parseInt(maxConnectionsInput.value);
        const percent = Math.round((status.connections / max) * 100);
        
        successCount.textContent = status.connections;
        progressText.textContent = `${status.connections} de ${max} conexões`;
        percentText.textContent = `${percent}%`;
        progressFill.style.width = `${percent}%`;
    }
    
    if (status.page !== undefined) {
        currentPage.textContent = status.page;
    }
}

// Verificar estado atual ao abrir popup
async function checkCurrentState() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('linkedin.com')) {
        updateStatus({ 
            state: 'error', 
            message: 'Abra o LinkedIn' 
        });
        return;
    }
    
    try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
        if (response) {
            updateStatus(response);
        }
    } catch (e) {
        // Content script não está pronto ainda
        updateStatus({ state: 'idle' });
    }
}

// Iniciar processo
startBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('linkedin.com')) {
        alert('Por favor, abra uma página do LinkedIn primeiro!');
        return;
    }
    
    // Recarregar configurações mais recentes antes de iniciar
    await loadSettings();
    
    const settings = {
        maxConnections: parseInt(maxConnectionsInput.value),
        minDelay: parseInt(minDelayInput.value) * 1000,
        maxDelay: parseInt(maxDelayInput.value) * 1000,
        message: messageTextArea.value
    };
    
    console.log('🚀 Iniciando com configurações:', settings);
    
    try {
        await chrome.tabs.sendMessage(tab.id, { 
            action: 'start',
            settings: settings
        });
        
        updateStatus({ state: 'running', connections: 0, page: 1 });
    } catch (e) {
        console.error('Erro ao iniciar:', e);
        alert('Erro ao iniciar. Recarregue a página do LinkedIn.');
    }
});

// Pausar processo
pauseBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    try {
        await chrome.tabs.sendMessage(tab.id, { action: 'pause' });
        updateStatus({ state: 'paused' });
    } catch (e) {
        console.error('Erro ao pausar:', e);
    }
});

// Parar processo
stopBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    try {
        await chrome.tabs.sendMessage(tab.id, { action: 'stop' });
        updateStatus({ state: 'stopped', connections: 0, page: 1 });
    } catch (e) {
        console.error('Erro ao parar:', e);
    }
});

// Salvar configurações
saveBtn.addEventListener('click', saveSettings);

// Atualizar contador de caracteres
messageTextArea.addEventListener('input', updateCharCount);

// Listener para atualizações do content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateStatus') {
        updateStatus(message.status);
    }
});

// Listener para mudanças no storage (sincroniza configurações)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        console.log('📝 Configurações alteradas, recarregando...');
        loadSettings();
    }
});

// Inicializar
loadSettings();
checkCurrentState();

// Atualizar status periodicamente
setInterval(checkCurrentState, 2000);
