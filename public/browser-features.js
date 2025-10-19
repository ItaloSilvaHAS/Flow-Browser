// Browser Features - Funcionalidades avançadas do navegador
// Gerencia: Tradução, Impressão, Favoritos, Histórico, Downloads, Extensões

console.log("🔧 Browser Features carregado");

// ========================================
// SISTEMA DE ARMAZENAMENTO
// ========================================

const STORAGE_KEYS = {
  FAVORITES: 'flow_browser_favorites',
  HISTORY: 'flow_browser_history',
  DOWNLOADS: 'flow_browser_downloads',
  EXTENSIONS: 'flow_browser_extensions'
};

// ========================================
// 1. TRADUZIR PÁGINA (Funciona no Electron Webview)
// ========================================

function initPageTranslation() {
  const buttons = document.querySelectorAll('button');
  let translateBtn = null;
  
  buttons.forEach(btn => {
    const span = btn.querySelector('span');
    if (span && span.textContent.includes('Traduzir página')) {
      translateBtn = btn;
    }
  });

  if (translateBtn) {
    translateBtn.addEventListener('click', openTranslateDialog);
    console.log("✅ Botão 'Traduzir página' conectado");
  }
}

function openTranslateDialog() {
  const modal = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i class="fas fa-language mr-3 text-blue-500"></i>
        Traduzir Página
      </h2>
      
      <p class="text-sm text-gray-600 mb-4">
        Selecione o idioma para traduzir a página atual:
      </p>
      
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        ${getLanguageButtons()}
      </div>
      
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <p class="text-xs text-gray-600">
          <i class="fas fa-info-circle text-blue-500 mr-2"></i>
          A tradução será aplicada na página atual. Para voltar ao original, recarregue a página.
        </p>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function getLanguageButtons() {
  const languages = [
    { code: 'en', name: 'Inglês', icon: '🇬🇧' },
    { code: 'es', name: 'Espanhol', icon: '🇪🇸' },
    { code: 'fr', name: 'Francês', icon: '🇫🇷' },
    { code: 'de', name: 'Alemão', icon: '🇩🇪' },
    { code: 'it', name: 'Italiano', icon: '🇮🇹' },
    { code: 'pt', name: 'Português', icon: '🇧🇷' },
    { code: 'ru', name: 'Russo', icon: '🇷🇺' },
    { code: 'ja', name: 'Japonês', icon: '🇯🇵' },
    { code: 'zh-CN', name: 'Chinês', icon: '🇨🇳' },
    { code: 'ko', name: 'Coreano', icon: '🇰🇷' },
    { code: 'ar', name: 'Árabe', icon: '🇸🇦' },
    { code: 'hi', name: 'Hindi', icon: '🇮🇳' }
  ];
  
  return languages.map(lang => `
    <button 
      onclick="translatePage('${lang.code}')" 
      class="flex items-center justify-center space-x-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-400 rounded-lg px-4 py-3 transition-all shadow-sm hover:shadow-md group"
    >
      <span class="text-2xl">${lang.icon}</span>
      <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600">${lang.name}</span>
    </button>
  `).join('');
}

async function translatePage(targetLang) {
  const webview = document.getElementById('webview');
  
  if (!webview) {
    alert('⚠️ Nenhuma página aberta para traduzir');
    return;
  }
  
  console.log(`🌐 Traduzindo página para: ${targetLang}`);
  
  try {
    const translateScript = `
      (function() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        
        window.googleTranslateElementInit = function() {
          new google.translate.TranslateElement({
            pageLanguage: 'auto',
            includedLanguages: 'en,es,fr,de,it,pt,ru,ja,zh-CN,ko,ar,hi',
            autoDisplay: false
          }, 'google_translate_element');
          
          setTimeout(() => {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
              select.value = '${targetLang}';
              select.dispatchEvent(new Event('change'));
            }
          }, 1000);
        };
        
        if (!document.getElementById('google_translate_element')) {
          const div = document.createElement('div');
          div.id = 'google_translate_element';
          div.style.display = 'none';
          document.body.appendChild(div);
        }
        
        document.head.appendChild(script);
      })();
    `;
    
    await webview.executeJavaScript(translateScript);
    
    const modal = document.getElementById('modal-overlay');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    
    console.log(`✅ Tradução aplicada para ${targetLang}`);
    
  } catch (error) {
    console.error('❌ Erro ao traduzir página:', error);
    alert('Erro ao traduzir a página. Tente novamente.');
  }
}

// ========================================
// 2. IMPRIMIR PÁGINA (Gerar PDF)
// ========================================

function initPrintPage() {
  const buttons = document.querySelectorAll('button');
  let printBtn = null;
  
  buttons.forEach(btn => {
    const span = btn.querySelector('span');
    if (span && span.textContent.includes('Imprimir')) {
      printBtn = btn;
    }
  });

  if (printBtn) {
    printBtn.addEventListener('click', printCurrentPage);
    console.log("✅ Botão 'Imprimir' conectado");
  }
}

async function printCurrentPage() {
  const webview = document.getElementById('webview');
  
  if (!webview) {
    alert('⚠️ Nenhuma página aberta para imprimir');
    return;
  }
  
  try {
    console.log('🖨️ Iniciando impressão...');
    await webview.print();
    console.log('✅ Diálogo de impressão aberto');
  } catch (error) {
    console.error('❌ Erro ao imprimir:', error);
    alert('Erro ao abrir o diálogo de impressão.');
  }
}

// ========================================
// 3. SALVAR PÁGINA COMO
// ========================================

function initSavePage() {
  const buttons = document.querySelectorAll('button');
  let saveBtn = null;
  
  buttons.forEach(btn => {
    const span = btn.querySelector('span');
    if (span && span.textContent.includes('Salvar página como')) {
      saveBtn = btn;
    }
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', saveCurrentPage);
    console.log("✅ Botão 'Salvar página como' conectado");
  }
}

async function saveCurrentPage() {
  const webview = document.getElementById('webview');
  
  if (!webview) {
    alert('⚠️ Nenhuma página aberta para salvar');
    return;
  }
  
  try {
    const url = webview.src;
    const title = await webview.executeJavaScript('document.title') || 'pagina';
    
    const html = await webview.executeJavaScript(`
      (function() {
        return document.documentElement.outerHTML;
      })();
    `);
    
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.html`;
    link.click();
    
    console.log('✅ Página salva como HTML');
    
  } catch (error) {
    console.error('❌ Erro ao salvar página:', error);
    alert('Erro ao salvar a página.');
  }
}

// ========================================
// 4. SISTEMA DE FAVORITOS
// ========================================

function initFavorites() {
  const buttons = document.querySelectorAll('button');
  let favBtn = null;
  
  buttons.forEach(btn => {
    const span = btn.querySelector('span');
    if (span && span.textContent === 'Favorito') {
      favBtn = btn;
    }
  });

  if (favBtn) {
    favBtn.addEventListener('click', toggleFavorite);
    console.log("✅ Botão 'Favorito' conectado");
  }
  
  const historyBtn = Array.from(buttons).find(btn => {
    const span = btn.querySelector('span');
    return span && span.textContent === 'Histórico';
  });
  
  if (historyBtn) {
    historyBtn.addEventListener('click', openHistoryModal);
  }
}

function getFavorites() {
  const favs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

async function toggleFavorite() {
  const webview = document.getElementById('webview');
  
  if (!webview || !webview.src) {
    alert('⚠️ Nenhuma página aberta');
    return;
  }
  
  const url = webview.src;
  const title = await webview.executeJavaScript('document.title').catch(() => url);
  
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(f => f.url === url);
  
  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
    alert('⭐ Removido dos favoritos!');
  } else {
    favorites.push({
      url: url,
      title: title,
      timestamp: Date.now()
    });
    alert('⭐ Adicionado aos favoritos!');
  }
  
  saveFavorites(favorites);
  console.log(`Favoritos: ${favorites.length} itens`);
}

function openFavoritesModal() {
  const favorites = getFavorites();
  
  const modal = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i class="fas fa-star mr-3 text-yellow-500"></i>
        Favoritos
      </h2>
      
      ${favorites.length === 0 ? `
        <div class="text-center py-12">
          <i class="fas fa-star text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Nenhum favorito ainda</p>
          <p class="text-sm text-gray-400 mt-2">Clique na estrela para adicionar páginas aos favoritos</p>
        </div>
      ` : `
        <div class="space-y-2 max-h-[500px] overflow-y-auto">
          ${favorites.map((fav, index) => `
            <div class="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div class="flex-1 cursor-pointer" onclick="window.loadUrl('${fav.url}'); document.getElementById('modal-overlay').classList.add('hidden');">
                <h3 class="font-medium text-gray-800">${fav.title}</h3>
                <p class="text-xs text-gray-500 truncate">${fav.url}</p>
              </div>
              <button onclick="removeFavorite(${index})" class="ml-4 text-red-500 hover:text-red-700 transition">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function removeFavorite(index) {
  const favorites = getFavorites();
  favorites.splice(index, 1);
  saveFavorites(favorites);
  openFavoritesModal();
}

// ========================================
// 5. SISTEMA DE HISTÓRICO
// ========================================

function getHistory() {
  const hist = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return hist ? JSON.parse(hist) : [];
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

async function addToHistory(url) {
  if (!url || url === 'about:blank') return;
  
  const webview = document.getElementById('webview');
  const title = webview ? await webview.executeJavaScript('document.title').catch(() => url) : url;
  
  const history = getHistory();
  
  const username = localStorage.getItem('flow_username') || 'guest';
  
  history.unshift({
    url: url,
    title: title,
    timestamp: Date.now(),
    user: username
  });
  
  if (history.length > 1000) {
    history.splice(1000);
  }
  
  saveHistory(history);
}

function openHistoryModal() {
  const history = getHistory();
  const username = localStorage.getItem('flow_username') || 'guest';
  
  const userHistory = history.filter(h => h.user === username);
  
  const modal = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
          <i class="fas fa-history mr-3 text-blue-500"></i>
          Histórico (${userHistory.length} itens)
        </h2>
        <button onclick="clearHistory()" class="text-sm text-red-500 hover:text-red-700">
          <i class="fas fa-trash mr-1"></i>Limpar histórico
        </button>
      </div>
      
      ${userHistory.length === 0 ? `
        <div class="text-center py-12">
          <i class="fas fa-history text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Nenhum histórico ainda</p>
        </div>
      ` : `
        <div class="space-y-2 max-h-[500px] overflow-y-auto">
          ${userHistory.map((item, index) => `
            <div class="flex items-start justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                 onclick="window.loadUrl('${item.url}'); document.getElementById('modal-overlay').classList.add('hidden');">
              <div class="flex-1">
                <h3 class="font-medium text-gray-800 text-sm">${item.title}</h3>
                <p class="text-xs text-gray-500 truncate">${item.url}</p>
                <p class="text-xs text-gray-400 mt-1">${new Date(item.timestamp).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function clearHistory() {
  if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
    saveHistory([]);
    openHistoryModal();
  }
}

// ========================================
// 6. SISTEMA DE DOWNLOADS
// ========================================

function initDownloads() {
  const webview = document.getElementById('webview');
  
  if (webview) {
    webview.addEventListener('will-download', (event) => {
      console.log('📥 Download iniciado:', event);
    });
  }
  
  const buttons = document.querySelectorAll('button');
  const downloadBtn = Array.from(buttons).find(btn => {
    const span = btn.querySelector('span');
    return span && span.textContent === 'Downloads';
  });
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', openDownloadsModal);
    console.log("✅ Botão 'Downloads' conectado");
  }
}

function openDownloadsModal() {
  const modal = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i class="fas fa-download mr-3 text-green-500"></i>
        Downloads
      </h2>
      
      <div class="text-center py-12">
        <i class="fas fa-download text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Gerenciamento de downloads</p>
        <p class="text-sm text-gray-400 mt-2">Os downloads aparecerão aqui automaticamente</p>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// ========================================
// 7. SISTEMA DE EXTENSÕES
// ========================================

function initExtensions() {
  const buttons = document.querySelectorAll('button');
  const extBtn = Array.from(buttons).find(btn => {
    const span = btn.querySelector('span');
    return span && span.textContent === 'Extensões';
  });
  
  if (extBtn) {
    extBtn.addEventListener('click', openExtensionsModal);
    console.log("✅ Botão 'Extensões' conectado");
  }
}

function openExtensionsModal() {
  const modal = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  modalBody.innerHTML = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i class="fas fa-puzzle-piece mr-3 text-purple-500"></i>
        Extensões
      </h2>
      
      <div class="text-center py-12">
        <i class="fas fa-puzzle-piece text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Sistema de extensões</p>
        <p class="text-sm text-gray-400 mt-2">Em desenvolvimento</p>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// ========================================
// INICIALIZAÇÃO
// ========================================

function initBrowserFeatures() {
  console.log("🚀 Inicializando Browser Features...");
  
  initPageTranslation();
  initPrintPage();
  initSavePage();
  initFavorites();
  initDownloads();
  initExtensions();
  
  const webview = document.getElementById('webview');
  if (webview) {
    webview.addEventListener('did-navigate', (event) => {
      addToHistory(event.url);
    });
    
    webview.addEventListener('did-navigate-in-page', (event) => {
      addToHistory(event.url);
    });
  }
  
  console.log("✅ Browser Features inicializado");
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrowserFeatures);
} else {
  initBrowserFeatures();
}

window.translatePage = translatePage;
window.removeFavorite = removeFavorite;
window.clearHistory = clearHistory;
window.openFavoritesModal = openFavoritesModal;
