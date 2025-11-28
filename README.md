# 🚀 LinkedIn Auto Connect Pro

Extensão Chrome moderna e elegante para automatizar conexões no LinkedIn com mensagens personalizadas.

![LinkedIn Auto Connect](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)

## ✨ Recursos

- 🎨 **Interface Moderna e Intuitiva** - Design limpo com gradientes e animações suaves
- ⏯️ **Controles Completos** - Iniciar, pausar e parar a automação a qualquer momento
- 📊 **Dashboard em Tempo Real** - Acompanhe progresso, estatísticas e tempo decorrido
- ✏️ **Mensagens Personalizadas** - Configure sua mensagem de conexão personalizada
- ⚙️ **Configurações Flexíveis** - Ajuste limites de conexões e intervalos entre ações
- 💾 **Salvamento Automático** - Suas configurações são salvas automaticamente
- 🔒 **Seguro e Confiável** - Intervalos aleatórios para comportamento natural

## 📦 Instalação

### 1. Preparar os Ícones

**IMPORTANTE:** Antes de instalar, você precisa criar os ícones da extensão.

**Opção A - Converter o SVG fornecido:**
1. Abra o arquivo `icons/icon.svg` em um editor de imagens (Photoshop, GIMP, Inkscape, ou online em https://www.photopea.com/)
2. Exporte/salve como PNG nos seguintes tamanhos:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
3. Salve todos os arquivos PNG na pasta `icons/`

**Opção B - Usar gerador online:**
1. Acesse https://icon.kitchen/ ou https://www.favicon-generator.org/
2. Crie um ícone com o logo do LinkedIn ou design personalizado
3. Baixe nas dimensões necessárias e coloque na pasta `icons/`

**Opção C - Ícones temporários (para teste rápido):**
- Você pode usar qualquer imagem PNG temporariamente
- Copie a mesma imagem 4 vezes e renomeie para icon16.png, icon32.png, icon48.png, icon128.png
- O Chrome redimensionará automaticamente (não é o ideal para produção)

### 2. Instalar a Extensão no Chrome

1. **Abra o Chrome** e navegue até: `chrome://extensions/`

2. **Ative o Modo de Desenvolvedor** (canto superior direito)

3. **Clique em "Carregar sem compactação"**

4. **Selecione a pasta** `linkedin-connection`

5. **Pronto!** A extensão está instalada ✅

## 🎯 Como Usar

### Passo 1: Acessar o LinkedIn
1. Abra o [LinkedIn](https://www.linkedin.com)
2. Navegue até a página de busca de pessoas ou "Minha Rede"
3. Use filtros para encontrar as pessoas que deseja conectar

### Passo 2: Configurar a Extensão
1. **Clique no ícone da extensão** na barra de ferramentas do Chrome
2. **Abra as Configurações** clicando na seção "Configurações"
3. **Configure:**
   - **Limite de Conexões:** Quantas conexões deseja enviar (padrão: 50)
   - **Tempo Mínimo:** Intervalo mínimo entre conexões em segundos (padrão: 8)
   - **Tempo Máximo:** Intervalo máximo entre conexões em segundos (padrão: 20)
   - **Mensagem Personalizada:** Sua mensagem de convite (máx. 300 caracteres)
4. **Clique em "Salvar Configurações"**

### Passo 3: Iniciar a Automação
1. **Clique no botão "Iniciar"** (verde com ícone de play)
2. A extensão começará a processar automaticamente
3. **Acompanhe o progresso** no dashboard em tempo real:
   - Conexões enviadas
   - Página atual
   - Tempo decorrido
   - Barra de progresso

### Passo 4: Controlar a Execução
- **⏸️ Pausar:** Suspende temporariamente (pode retomar depois)
- **▶️ Retomar:** Continua de onde parou
- **⏹️ Parar:** Encerra completamente a automação

## 📋 Requisitos

- Google Chrome (versão 88 ou superior)
- Conta LinkedIn ativa
- Acesso a páginas de pesquisa/rede do LinkedIn

## ⚙️ Configurações Padrão

```
Limite de Conexões: 50
Tempo Mínimo: 8 segundos
Tempo Máximo: 20 segundos
Mensagem: (personalizável)
```

## 🎨 Interface

A extensão possui uma interface moderna com:

- **Header azul LinkedIn** com logo e versão
- **Card de status** com indicador visual (verde/amarelo/cinza)
- **Barra de progresso animada** mostrando conclusão
- **Grade de estatísticas** com métricas em tempo real
- **Botões de controle** grandes e intuitivos
- **Seção de configurações** retrátil e elegante
- **Animações suaves** e feedback visual

## ⚠️ Avisos Importantes

### Limites do LinkedIn
- **Não abuse!** O LinkedIn tem limites diários de conexões
- Recomenda-se **não enviar mais de 100 conexões por dia**
- Use intervalos realistas (8-20 segundos é seguro)
- Adicione mensagens personalizadas relevantes

### Boas Práticas
- ✅ Use mensagens autênticas e personalizadas
- ✅ Conecte apenas com pessoas relevantes ao seu network
- ✅ Respeite os termos de uso do LinkedIn
- ✅ Pause se notar qualquer comportamento estranho
- ❌ Não envie spam ou mensagens genéricas
- ❌ Não use para marketing agressivo

## 🔧 Estrutura do Projeto

```
linkedin-connection/
├── manifest.json          # Configuração da extensão
├── popup.html            # Interface do usuário
├── popup.css             # Estilos da interface
├── popup.js              # Lógica da interface
├── content.js            # Script de automação principal
├── background.js         # Service worker
├── icons/                # Ícones da extensão
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon.svg
│   └── LEIA-ME-ICONES.txt
├── script-exemplo.js     # Script original (referência)
└── README.md             # Este arquivo
```

## 🐛 Solução de Problemas

### A extensão não aparece
- Verifique se o modo desenvolvedor está ativado
- Recarregue a extensão em `chrome://extensions/`
- Certifique-se de que os ícones estão na pasta correta

### Botão "Iniciar" não funciona
- Verifique se você está em uma página do LinkedIn
- Abra o Console (F12) para ver mensagens de erro
- Recarregue a página do LinkedIn

### Conexões não são enviadas
- Certifique-se de que está na página correta (pesquisa/rede)
- Verifique se há botões "Conectar" visíveis na página
- Confira se a mensagem personalizada não está vazia

### Status não atualiza
- Feche e abra o popup novamente
- Verifique a aba do Console para erros
- Recarregue a extensão

## 🚀 Próximas Melhorias

- [ ] Suporte a templates de mensagens
- [ ] Estatísticas históricas
- [ ] Exportação de relatórios
- [ ] Filtros avançados
- [ ] Modo escuro
- [ ] Notificações desktop

## 📄 Licença

Este projeto é fornecido "como está" para fins educacionais. Use com responsabilidade e respeite os termos de serviço do LinkedIn.

## ⚖️ Disclaimer

**IMPORTANTE:** Esta ferramenta é fornecida apenas para fins educacionais e de automação pessoal. O uso excessivo ou inadequado pode violar os Termos de Serviço do LinkedIn e resultar em restrições ou banimento da conta. Use com responsabilidade e moderação.

- Esta extensão **NÃO é** afiliada, endossada ou patrocinada pelo LinkedIn
- O desenvolvedor **NÃO se responsabiliza** por qualquer consequência do uso desta ferramenta
- Você é **100% responsável** pelo uso que fizer desta extensão

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novos recursos
- Melhorar a documentação
- Otimizar o código

## 👨‍💻 Autor

Desenvolvido com ❤️ para automatizar networking no LinkedIn de forma inteligente e responsável.

---

**Versão:** 1.0.0  
**Última atualização:** Novembro 2025
