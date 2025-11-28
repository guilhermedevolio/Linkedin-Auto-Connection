(async function() {
    // --- CONFIGURAÇÕES ---
    const CONFIG = {
        mensagem: "Olá! Sou Desenvolvedor/Tech Lead focado em AWS e Node.js. Tenho experiência sólida em migrações de arquitetura e sistemas de alta disponibilidade. Gostaria de conectar para acompanhar oportunidades na área",
        limiteTotalConexoes: 50, 
        tempoMinimo: 8000,       
        tempoMaximo: 20000,      
        tempoTrocaPagina: 7000   
    };

    // --- UTILITÁRIOS ---
    const dormir = (ms) => new Promise(r => setTimeout(r, ms));
    const randomizar = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    function lerPaginaDaUrl() {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        return page ? parseInt(page) : 1;
    }

    // --- MODAL / SHADOW DOM ---
    async function processarModalShadow() {
        await dormir(2500); 

        const host = document.querySelector("#interop-outlet");
        if (!host || !host.shadowRoot) return false;

        const shadow = host.shadowRoot;

        // 1. Botão Adicionar Nota
        const btnAddNota = shadow.querySelector('button[aria-label="Adicionar nota"]');
        if (!btnAddNota) {
            const btnFechar = shadow.querySelector('button[aria-label="Fechar"]');
            if (btnFechar) btnFechar.click();
            return false;
        }

        btnAddNota.click();
        await dormir(randomizar(1000, 2000));

        // 2. Escrever Mensagem
        const caixaTexto = shadow.querySelector('textarea');
        if (caixaTexto) {
            caixaTexto.value = CONFIG.mensagem;
            caixaTexto.dispatchEvent(new Event('input', { bubbles: true }));
        }
        await dormir(randomizar(1000, 2000));

        // 3. Enviar
        const btnEnviar = shadow.querySelector('.artdeco-modal__actionbar .artdeco-button--primary');
        if (btnEnviar && !btnEnviar.disabled) {
            btnEnviar.click();
            return true;
        }
        return false;
    }

    // --- PAGINAÇÃO INTELIGENTE (AJUSTADA PARA O SEU HTML) ---
    async function irParaProximaPagina(paginaAtual) {
        console.log(`\n--- FIM DA PÁGINA ${paginaAtual}. BUSCANDO PRÓXIMA... ---`);
        
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        await dormir(3000);

        const proximaPaginaNumero = paginaAtual + 1;
        
        // ESTRATÉGIA 1: Tenta achar o botão específico "Página X" (Ex: Página 13)
        let btnProximo = document.querySelector(`button[aria-label="Página ${proximaPaginaNumero}"]`);
        
        // ESTRATÉGIA 2: Se não achar o número, busca o botão genérico "Próxima" pelo data-testid
        if (!btnProximo) {
            console.log(`⚠️ Botão 'Página ${proximaPaginaNumero}' não visível. Tentando botão 'Próxima' genérico...`);
            btnProximo = document.querySelector('button[data-testid="pagination-controls-next-button-visible"]');
        }

        if (btnProximo && !btnProximo.disabled) {
            console.log(`➡️ Clicando para ir à página ${proximaPaginaNumero}...`);
            btnProximo.click();
            
            await dormir(CONFIG.tempoTrocaPagina);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            await dormir(2000);
            return true;
        } else {
            console.warn("🚫 Nenhum botão de avanço encontrado. Fim da lista.");
            return false;
        }
    }

    // --- EXECUÇÃO ---
    let totalConexoesRealizadas = 0;
    let paginaAtual = lerPaginaDaUrl(); 

    console.log(`🚀 INICIANDO NA PÁGINA ${paginaAtual}`);

    while (totalConexoesRealizadas < CONFIG.limiteTotalConexoes) {
        
        console.log(`\n📄 LENDO PÁGINA ${paginaAtual}...`);

        // Filtra links de conexão
        const linksPagina = Array.from(document.querySelectorAll('a[aria-label*="para se conectar"]'));
        const alvos = linksPagina.filter(link => link.innerText.includes("Conectar"));
        
        console.log(`🔎 Encontrados ${alvos.length} candidatos nesta página.`);

        if (alvos.length > 0) {
            for (const link of alvos) {
                if (totalConexoesRealizadas >= CONFIG.limiteTotalConexoes) break;

                console.log(`\n👉 Processando ${totalConexoesRealizadas + 1}/${CONFIG.limiteTotalConexoes} (Pág ${paginaAtual})`);
                
                link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await dormir(randomizar(1500, 3000));
                link.click();

                const enviado = await processarModalShadow();

                if (enviado) {
                    totalConexoesRealizadas++;
                    console.log("✅ Convite enviado.");
                    const espera = randomizar(CONFIG.tempoMinimo, CONFIG.tempoMaximo);
                    console.log(`⏳ Aguardando ${(espera/1000).toFixed(1)}s...`);
                    await dormir(espera);
                } else {
                    console.log("⏭️ Pulado.");
                    await dormir(2000);
                }
            }
        } else {
            console.log("⚠️ Página vazia ou sem botões 'Conectar'.");
        }

        // Avança paginação
        const mudou = await irParaProximaPagina(paginaAtual);
        if (!mudou) break;
        
        paginaAtual++;
    }

    console.log(`\n🎉 FIM. Total enviado: ${totalConexoesRealizadas}`);

})();