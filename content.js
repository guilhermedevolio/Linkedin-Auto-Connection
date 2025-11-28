// Estado global da extensão
let state = {
    isRunning: false,
    isPaused: false,
    totalConnections: 0,
    currentPage: 1,
    maxConnections: 50,
    settings: null
};

// Utilitários
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function getCurrentPageFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    return page ? parseInt(page) : 1;
}

// Processar modal com Shadow DOM
async function processConnectionModal() {
    await sleep(2500);

    const host = document.querySelector("#interop-outlet");
    if (!host || !host.shadowRoot) return false;

    const shadow = host.shadowRoot;

    // 1. Clicar em "Adicionar nota"
    const btnAddNote = shadow.querySelector('button[aria-label="Adicionar nota"]');
    if (!btnAddNote) {
        const btnClose = shadow.querySelector('button[aria-label="Fechar"]');
        if (btnClose) btnClose.click();
        return false;
    }

    btnAddNote.click();
    await sleep(randomDelay(1000, 2000));

    // 2. Escrever mensagem
    const textArea = shadow.querySelector('textarea');
    if (textArea) {
        textArea.value = state.settings.message;
        textArea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    await sleep(randomDelay(1000, 2000));

    // 3. Clicar em enviar
    const btnSend = shadow.querySelector('.artdeco-modal__actionbar .artdeco-button--primary');
    if (btnSend && !btnSend.disabled) {
        btnSend.click();
        return true;
    }

    return false;
}

// Navegar para próxima página
async function goToNextPage(currentPage) {
    console.log(`\n--- FIM DA PÁGINA ${currentPage}. INDO PARA PRÓXIMA... ---`);
    
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    await sleep(3000);

    const nextPageNumber = currentPage + 1;
    
    // Estratégia 1: Botão específico da página
    let btnNext = document.querySelector(`button[aria-label="Página ${nextPageNumber}"]`);
    
    // Estratégia 2: Botão genérico "Próxima"
    if (!btnNext) {
        console.log(`⚠️ Botão 'Página ${nextPageNumber}' não encontrado. Usando botão 'Próxima'...`);
        btnNext = document.querySelector('button[data-testid="pagination-controls-next-button-visible"]');
    }

    if (btnNext && !btnNext.disabled) {
        console.log(`➡️ Navegando para página ${nextPageNumber}...`);
        btnNext.click();
        
        await sleep(7000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await sleep(2000);
        return true;
    } else {
        console.warn("🚫 Não há mais páginas disponíveis.");
        return false;
    }
}

// Enviar atualização de status para o popup
function sendStatusUpdate() {
    chrome.runtime.sendMessage({
        action: 'updateStatus',
        status: {
            state: state.isPaused ? 'paused' : (state.isRunning ? 'running' : 'idle'),
            connections: state.totalConnections,
            maxConnections: state.maxConnections,
            page: state.currentPage
        }
    });
}

// Processo principal
async function runAutomation() {
    console.log('🚀 INICIANDO AUTOMAÇÃO...');
    state.isRunning = true;
    state.isPaused = false;
    state.currentPage = getCurrentPageFromUrl();
    
    sendStatusUpdate();

    while (state.isRunning && state.totalConnections < state.maxConnections) {
        // Verificar se está pausado
        while (state.isPaused && state.isRunning) {
            await sleep(1000);
        }
        
        if (!state.isRunning) break;

        console.log(`\n📄 PROCESSANDO PÁGINA ${state.currentPage}...`);

        // Buscar links de conexão
        const connectionLinks = Array.from(document.querySelectorAll('a[aria-label*="para se conectar"]'));
        const connectButtons = connectionLinks.filter(link => link.innerText.includes("Conectar"));
        
        console.log(`🔎 Encontrados ${connectButtons.length} botões de conectar nesta página.`);

        if (connectButtons.length > 0) {
            for (const link of connectButtons) {
                // Verificar pausas e limite
                while (state.isPaused && state.isRunning) {
                    await sleep(1000);
                }
                
                if (!state.isRunning || state.totalConnections >= state.maxConnections) break;

                console.log(`\n👉 Processando conexão ${state.totalConnections + 1}/${state.maxConnections} (Página ${state.currentPage})`);
                
                // Scroll até o botão
                link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await sleep(randomDelay(1500, 3000));
                
                // Clicar no botão conectar
                link.click();

                // Processar modal
                const sent = await processConnectionModal();

                if (sent) {
                    state.totalConnections++;
                    console.log("✅ Convite enviado com sucesso!");
                    
                    sendStatusUpdate();
                    
                    const waitTime = randomDelay(state.settings.minDelay, state.settings.maxDelay);
                    console.log(`⏳ Aguardando ${(waitTime/1000).toFixed(1)}s antes do próximo...`);
                    await sleep(waitTime);
                } else {
                    console.log("⏭️ Conexão pulada.");
                    await sleep(2000);
                }
            }
        } else {
            console.log("⚠️ Página sem botões de conectar.");
        }

        // Verificar se deve continuar
        if (state.totalConnections >= state.maxConnections) {
            console.log("🎯 Limite de conexões atingido!");
            break;
        }

        // Ir para próxima página
        const hasNextPage = await goToNextPage(state.currentPage);
        if (!hasNextPage) {
            console.log("🏁 Não há mais páginas.");
            break;
        }
        
        state.currentPage++;
        sendStatusUpdate();
    }

    console.log(`\n🎉 AUTOMAÇÃO FINALIZADA! Total de conexões enviadas: ${state.totalConnections}`);
    
    state.isRunning = false;
    state.isPaused = false;
    sendStatusUpdate();
}

// Listener de mensagens do popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Mensagem recebida:', message);
    
    switch(message.action) {
        case 'start':
            if (!state.isRunning) {
                state.settings = message.settings;
                state.maxConnections = message.settings.maxConnections;
                state.totalConnections = 0;
                runAutomation();
            } else if (state.isPaused) {
                // Retomar
                state.isPaused = false;
                sendStatusUpdate();
            }
            sendResponse({ success: true });
            break;
            
        case 'pause':
            if (state.isRunning) {
                state.isPaused = true;
                sendStatusUpdate();
            }
            sendResponse({ success: true });
            break;
            
        case 'stop':
            state.isRunning = false;
            state.isPaused = false;
            state.totalConnections = 0;
            state.currentPage = getCurrentPageFromUrl();
            sendStatusUpdate();
            sendResponse({ success: true });
            break;
            
        case 'getStatus':
            sendResponse({
                state: state.isPaused ? 'paused' : (state.isRunning ? 'running' : 'idle'),
                connections: state.totalConnections,
                maxConnections: state.maxConnections,
                page: state.currentPage
            });
            break;
            
        default:
            sendResponse({ success: false, error: 'Ação desconhecida' });
    }
    
    return true; // Mantém o canal de mensagem aberto
});

console.log('✅ LinkedIn Auto Connect - Content Script carregado!');
