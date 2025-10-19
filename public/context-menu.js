// Sistema de menu de contexto (botão direito)

document.addEventListener('DOMContentLoaded', () => {
  console.log('🖱️ Sistema de menu de contexto carregado');
  
  // Prevenir menu padrão do navegador
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e);
  });
});

function showContextMenu(event) {
  // Remove qualquer menu existente
  const existingMenu = document.getElementById('custom-context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Verifica se há texto selecionado
  const selectedText = window.getSelection().toString();
  
  // Cria o menu
  const menu = document.createElement('div');
  menu.id = 'custom-context-menu';
  menu.className = 'context-menu';
  menu.style.position = 'fixed';
  menu.style.left = event.pageX + 'px';
  menu.style.top = event.pageY + 'px';
  menu.style.zIndex = '999999';
  
  // Opções do menu baseado no contexto
  let menuItems = [];
  
  if (selectedText) {
    // Menu para texto selecionado
    menuItems = [
      { icon: 'fas fa-copy', text: 'Copiar', shortcut: 'Ctrl+C', action: () => copyText(selectedText) },
      { icon: 'fas fa-cut', text: 'Recortar', shortcut: 'Ctrl+X', action: () => cutText() },
      { icon: 'fas fa-paste', text: 'Colar', shortcut: 'Ctrl+V', action: () => pasteText() },
      { divider: true },
      { icon: 'fas fa-search', text: 'Pesquisar "' + selectedText.substring(0, 20) + (selectedText.length > 20 ? '...' : '') + '"', action: () => searchText(selectedText) },
      { divider: true },
      { icon: 'fas fa-check-square', text: 'Selecionar tudo', shortcut: 'Ctrl+A', action: () => selectAll() }
    ];
  } else {
    // Menu geral da página
    menuItems = [
      { icon: 'fas fa-arrow-left', text: 'Voltar', shortcut: 'Alt+Seta esquerda', action: () => navigateBack() },
      { icon: 'fas fa-arrow-right', text: 'Avançar', shortcut: 'Alt+Seta direita', action: () => navigateForward() },
      { icon: 'fas fa-redo', text: 'Recarregar', shortcut: 'Ctrl+R', action: () => reloadPage() },
      { divider: true },
      { icon: 'fas fa-save', text: 'Salvar como...', shortcut: 'Ctrl+S', action: () => savePage() },
      { icon: 'fas fa-print', text: 'Imprimir...', shortcut: 'Ctrl+P', action: () => printPage() },
      { icon: 'fas fa-share-alt', text: 'Transmitir...', action: () => sharePage() },
      { divider: true },
      { icon: 'fas fa-eye', text: 'Abrir no modo de leitura', action: () => openReaderMode() },
      { divider: true },
      { icon: 'fas fa-code', text: 'Exibir código fonte da página', shortcut: 'Ctrl+U', action: () => viewSource() },
      { icon: 'fas fa-search', text: 'Inspecionar', action: () => inspectElement() }
    ];
  }
  
  // Cria os itens do menu
  menuItems.forEach(item => {
    if (item.divider) {
      const divider = document.createElement('div');
      divider.className = 'context-menu-divider';
      menu.appendChild(divider);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = 'context-menu-item';
      
      menuItem.innerHTML = `
        <div class="context-menu-item-content">
          <i class="${item.icon}"></i>
          <span>${item.text}</span>
        </div>
        ${item.shortcut ? `<span class="context-menu-shortcut">${item.shortcut}</span>` : ''}
      `;
      
      menuItem.addEventListener('click', () => {
        item.action();
        menu.remove();
      });
      
      menu.appendChild(menuItem);
    }
  });
  
  document.body.appendChild(menu);
  
  // Ajusta posição se o menu sair da tela
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
  }
  if (rect.bottom > window.innerHeight) {
    menu.style.top = (window.innerHeight - rect.height - 10) + 'px';
  }
  
  // Remove o menu ao clicar fora
  setTimeout(() => {
    document.addEventListener('click', function removeMenu() {
      menu.remove();
      document.removeEventListener('click', removeMenu);
    });
  }, 100);
}

// Funções do menu de contexto

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('✅ Texto copiado:', text);
    showNotification('Texto copiado!');
  }).catch(err => {
    console.error('❌ Erro ao copiar:', err);
  });
}

function cutText() {
  const text = window.getSelection().toString();
  copyText(text);
  document.execCommand('delete');
}

function pasteText() {
  navigator.clipboard.readText().then(text => {
    document.execCommand('insertText', false, text);
    console.log('✅ Texto colado');
  }).catch(err => {
    console.error('❌ Erro ao colar:', err);
  });
}

function searchText(text) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
  const webview = document.getElementById('webview');
  const homePage = document.getElementById('home-page');
  const webviewContainer = document.getElementById('webview-container');
  
  if (webview) {
    webview.src = searchUrl;
    if (homePage) homePage.style.display = 'none';
    if (webviewContainer) webviewContainer.classList.remove('hidden');
  } else {
    window.open(searchUrl, '_blank');
  }
}

function selectAll() {
  document.execCommand('selectAll');
}

function navigateBack() {
  const webview = document.getElementById('webview');
  const btnBack = document.getElementById('btn-back');
  if (webview && webview.canGoBack()) {
    webview.goBack();
  } else if (btnBack) {
    btnBack.click();
  }
}

function navigateForward() {
  const webview = document.getElementById('webview');
  const btnForward = document.getElementById('btn-forward');
  if (webview && webview.canGoForward()) {
    webview.goForward();
  } else if (btnForward) {
    btnForward.click();
  }
}

function reloadPage() {
  const webview = document.getElementById('webview');
  const btnReload = document.getElementById('btn-reload');
  if (webview) {
    webview.reload();
  } else if (btnReload) {
    btnReload.click();
  }
}

function savePage() {
  const webview = document.getElementById('webview');
  if (webview) {
    // Envia mensagem para o processo principal para salvar
    console.log('💾 Salvando página...');
    showNotification('Funcionalidade de salvar será implementada');
  }
}

function printPage() {
  const webview = document.getElementById('webview');
  if (webview) {
    webview.print();
  } else {
    window.print();
  }
}

function sharePage() {
  console.log('📤 Compartilhar página');
  showNotification('Funcionalidade de compartilhar será implementada');
}

function openReaderMode() {
  const btnReader = document.getElementById('btn-reader');
  if (btnReader) {
    btnReader.click();
  }
  console.log('📖 Modo de leitura');
}

function viewSource() {
  const webview = document.getElementById('webview');
  if (webview) {
    const currentUrl = webview.src;
    webview.src = 'view-source:' + currentUrl;
  }
}

function inspectElement() {
  const webview = document.getElementById('webview');
  if (webview) {
    webview.openDevTools();
  }
  console.log('🔍 Inspecionar elemento');
}

function showNotification(message) {
  // Remove notificação existente
  const existing = document.getElementById('context-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.id = 'context-notification';
  notification.className = 'context-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
  // Ctrl+C - Copiar
  if (e.ctrlKey && e.key === 'c') {
    const text = window.getSelection().toString();
    if (text) copyText(text);
  }
  
  // Ctrl+A - Selecionar tudo
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault();
    selectAll();
  }
  
  // Ctrl+R ou F5 - Recarregar
  if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
    e.preventDefault();
    reloadPage();
  }
  
  // Ctrl+P - Imprimir
  if (e.ctrlKey && e.key === 'p') {
    e.preventDefault();
    printPage();
  }
  
  // Ctrl+U - Ver código fonte
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    viewSource();
  }
});
