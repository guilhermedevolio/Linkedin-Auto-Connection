// Background service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('LinkedIn Auto Connect Pro instalado com sucesso!');
});

// Escutar mensagens e retransmitir se necessário
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Retransmitir atualizações de status para o popup
    if (message.action === 'updateStatus') {
        chrome.runtime.sendMessage(message);
    }
    return true;
});
