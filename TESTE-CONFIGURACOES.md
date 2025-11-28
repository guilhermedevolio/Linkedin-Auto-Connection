# ✅ TESTE DE CONFIGURAÇÕES - CHECKLIST

## Como testar se as configurações estão sendo salvas e carregadas corretamente:

### 1️⃣ **Teste de Salvamento**
- [ ] Abra a extensão no LinkedIn
- [ ] Clique em "Configurações" para expandir
- [ ] Altere o **Limite de Conexões** para `100`
- [ ] Altere o **Tempo Mínimo** para `10`
- [ ] Altere o **Tempo Máximo** para `25`
- [ ] Altere a **Mensagem** para algo diferente
- [ ] Clique em "Salvar Configurações"
- [ ] Veja a mensagem "✓ Salvo!" aparecer (feedback visual verde)

### 2️⃣ **Teste de Persistência (Fechar e Reabrir)**
- [ ] Feche o popup da extensão
- [ ] Reabra o popup
- [ ] Verifique se os valores alterados estão lá:
  - Limite: 100
  - Min: 10
  - Max: 25
  - Mensagem: a nova que você digitou

### 3️⃣ **Teste de Sincronização Automática**
- [ ] Abra o popup da extensão
- [ ] Abra o DevTools (F12) e vá para Application > Storage > Local Storage > chrome-extension://...
- [ ] Verifique se os valores estão salvos:
  - `maxConnections: 100`
  - `minDelay: 10`
  - `maxDelay: 25`
  - `message: "sua mensagem"`

### 4️⃣ **Teste de Uso em Execução**
- [ ] Com as configurações salvas (100 conexões, 10-25 seg)
- [ ] Clique em "Iniciar"
- [ ] Abra o Console (F12)
- [ ] Veja a mensagem: "🚀 Iniciando com configurações: {...}"
- [ ] Confirme que os valores estão corretos:
  - `maxConnections: 100`
  - `minDelay: 10000` (em milissegundos)
  - `maxDelay: 25000` (em milissegundos)
  - `message: "sua mensagem"`

### 5️⃣ **Teste de Mudança em Tempo Real**
- [ ] Com a extensão aberta
- [ ] Altere a mensagem
- [ ] Salve
- [ ] O contador de caracteres atualiza automaticamente?
- [ ] As configurações são recarregadas automaticamente?

## 🔍 Como Verificar no Console

Abra o console do popup (clique com direito no popup > Inspecionar) e você verá:

```javascript
// Quando salvar:
✅ Configurações salvas: {maxConnections: 100, minDelay: 10, maxDelay: 25, message: "..."}

// Quando detectar mudanças:
📝 Configurações alteradas, recarregando...

// Quando iniciar:
🚀 Iniciando com configurações: {maxConnections: 100, minDelay: 10000, maxDelay: 25000, message: "..."}
```

## ⚠️ Possíveis Problemas e Soluções

### Problema: Valores não são salvos
**Solução:** 
- Verifique se clicou em "Salvar Configurações"
- Veja o console para erros
- Certifique-se de que a permissão "storage" está no manifest.json

### Problema: Valores não são carregados ao reabrir
**Solução:**
- Recarregue a extensão em chrome://extensions/
- Limpe o storage: Application > Storage > Clear Site Data
- Teste novamente

### Problema: Mensagem não aparece no modal
**Solução:**
- Veja o console do content script (F12 na página do LinkedIn)
- Verifique se `state.settings.message` está definido
- Confirme que iniciou após salvar as configurações

## ✅ Confirmação Final

Se todos os testes passarem, você verá:
- ✅ Valores salvos persistem após fechar/reabrir
- ✅ Configurações são carregadas automaticamente
- ✅ Botão Iniciar usa as configurações mais recentes
- ✅ Mensagem personalizada aparece nos convites
- ✅ Intervalos de tempo respeitam os valores configurados
