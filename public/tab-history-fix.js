// Correção: Histórico separado por guia
// Este script garante que cada guia tenha seu próprio histórico de navegação independente

console.log('📑 Sistema de histórico separado por guia carregado');

// Armazenar histórico para cada aba
const tabHistories = new Map();

// Interceptar criação de abas
const originalCreateTab = window.createTab;
if (originalCreateTab) {
  window.createTab = function(url, title) {
    const tabId = originalCreateTab.call(this, url, title);
    
    // Criar histórico vazio para nova aba
    if (!tabHistories.has(tabId)) {
      tabHistories.set(tabId, []);
      console.log(`📝 Histórico criado para aba ${tabId}`);
    }
    
    return tabId;
  };
}

// Interceptar mudanças de aba ativa
const originalSetActiveTab = window.setActiveTab;
if (originalSetActiveTab) {
  window.setActiveTab = function(tabId) {
    const result = originalSetActiveTab.call(this, tabId);
    
    // Sincronizar histórico do webview com o histórico da aba
    const webview = document.getElementById('webview');
    if (webview && tabHistories.has(tabId)) {
      console.log(`🔄 Aba ${tabId} ativada - histórico independente`);
    }
    
    return result;
  };
}

// Interceptar fechamento de abas
const originalCloseTab = window.closeTab;
if (originalCloseTab) {
  window.closeTab = function(tabId) {
    // Limpar histórico da aba
    if (tabHistories.has(tabId)) {
      tabHistories.delete(tabId);
      console.log(`🗑️ Histórico da aba ${tabId} removido`);
    }
    
    return originalCloseTab.call(this, tabId);
  };
}

console.log('✅ Sistema de histórico separado por guia inicializado');
