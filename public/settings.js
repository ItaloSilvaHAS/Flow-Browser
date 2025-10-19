// Settings.js - Funcionalidades de Configurações do Flow Browser
// Gerencia: Esconder/Mostrar barra lateral, Feed de Notícias e Tradução de Páginas

console.log("⚙️ Settings module carregado");

// Estado das configurações
let sidebarVisible = localStorage.getItem('flow_sidebar_visible') !== 'false';
let newsFeedEnabled = localStorage.getItem('flow_news_feed_enabled') === 'true';

// Elementos
const sidebar = document.getElementById('sidebar');

// ========================================
// 1. FUNCIONALIDADE: ESCONDER BARRA LATERAL
// ========================================

function initSidebarToggle() {
  // Aplica estado salvo
  if (!sidebarVisible) {
    hideSidebar();
  }

  // Encontra o botão pelo texto
  const buttons = document.querySelectorAll('button');
  let sidebarBtn = null;
  
  buttons.forEach(btn => {
    const span = btn.querySelector('span');
    if (span && span.textContent.includes('Esconder barra lateral')) {
      sidebarBtn = btn;
    }
  });

  if (sidebarBtn) {
    sidebarBtn.addEventListener('click', toggleSidebar);
    console.log("✅ Botão 'Esconder barra lateral' conectado");
  } else {
    console.warn("⚠️ Botão 'Esconder barra lateral' não encontrado");
  }
}

function toggleSidebar() {
  sidebarVisible = !sidebarVisible;
  localStorage.setItem('flow_sidebar_visible', sidebarVisible);
  
  if (sidebarVisible) {
    showSidebar();
  } else {
    hideSidebar();
  }
  
  updateSidebarButtonText();
}

function hideSidebar() {
  if (sidebar) {
    sidebar.style.transition = 'all 0.3s ease';
    sidebar.style.width = '0';
    sidebar.style.padding = '0';
    sidebar.style.overflow = 'hidden';
    sidebar.style.borderRight = 'none';
    console.log("🔒 Barra lateral ocultada");
  }
}

function showSidebar() {
  if (sidebar) {
    sidebar.style.transition = 'all 0.3s ease';
    sidebar.style.width = '3.5rem';
    sidebar.style.padding = '';
    sidebar.style.overflow = '';
    sidebar.style.borderRight = '';
    console.log("🔓 Barra lateral visível");
  }
}

function updateSidebarButtonText() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    const span = btn.querySelector('span');
    const icon = btn.querySelector('i.fa-eye-slash, i.fa-eye');
    
    if (span && (span.textContent.includes('Esconder barra lateral') || span.textContent.includes('Mostrar barra lateral'))) {
      span.textContent = sidebarVisible ? 'Esconder barra lateral' : 'Mostrar barra lateral';
      
      if (icon) {
        icon.className = sidebarVisible ? 'fas fa-eye-slash w-5 h-5 mr-3 text-gray-500' : 'fas fa-eye w-5 h-5 mr-3 text-gray-500';
      }
    }
  });
}

// ========================================
// 2. FUNCIONALIDADE: FEED DE NOTÍCIAS (MINIMALISTA)
// ========================================

function initNewsFeed() {
  const buttons = document.querySelectorAll('button');
  let newsBtn = null;
  
  buttons.forEach(btn => {
    const span = btn.querySelector('span');
    if (span && span.textContent.includes('feed de notícia')) {
      newsBtn = btn;
    }
  });

  if (newsBtn) {
    newsBtn.addEventListener('click', toggleNewsFeed);
    console.log("✅ Botão 'Ativar feed de notícia' conectado");
  } else {
    console.warn("⚠️ Botão 'Ativar feed de notícia' não encontrado");
  }

  if (newsFeedEnabled) {
    showNewsFeed();
  }
}

function toggleNewsFeed() {
  newsFeedEnabled = !newsFeedEnabled;
  localStorage.setItem('flow_news_feed_enabled', newsFeedEnabled);
  
  if (newsFeedEnabled) {
    showNewsFeed();
  } else {
    hideNewsFeed();
  }
  
  updateNewsFeedButtonText();
}

function updateNewsFeedButtonText() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    const span = btn.querySelector('span');
    if (span && (span.textContent.includes('Ativar feed de notícia') || span.textContent.includes('Desativar feed de notícia'))) {
      span.textContent = newsFeedEnabled ? 'Desativar feed de notícia' : 'Ativar feed de notícia';
    }
  });
}

function showNewsFeed() {
  const homePage = document.getElementById('home-page');
  
  if (!homePage) {
    console.warn("⚠️ Elemento home-page não encontrado");
    return;
  }

  let newsContainer = document.getElementById('news-feed-container');
  
  if (!newsContainer) {
    newsContainer = document.createElement('div');
    newsContainer.id = 'news-feed-container';
    newsContainer.className = 'absolute bottom-0 left-0 right-0 pb-6 px-8';
    newsContainer.style.opacity = '0';
    newsContainer.style.transition = 'opacity 0.5s ease';
    
    homePage.appendChild(newsContainer);
    
    setTimeout(() => {
      newsContainer.style.opacity = '1';
    }, 10);
    
    loadNewsContent(newsContainer);
  }
  
  console.log("📰 Feed de notícias ativado");
}

function hideNewsFeed() {
  const newsContainer = document.getElementById('news-feed-container');
  
  if (newsContainer) {
    newsContainer.style.opacity = '0';
    
    setTimeout(() => {
      newsContainer.remove();
    }, 500);
  }
  
  console.log("🔕 Feed de notícias desativado");
}

function loadNewsContent(container) {
  container.innerHTML = `
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 max-h-[200px] overflow-y-auto">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-700 flex items-center">
          <i class="fas fa-newspaper mr-2 text-blue-500 text-xs"></i>
          Notícias Educacionais
        </h3>
        <button onclick="toggleNewsFeed()" class="text-gray-400 hover:text-gray-600 transition">
          <i class="fas fa-times text-sm"></i>
        </button>
      </div>
      
      <div id="news-articles" class="space-y-2">
        <div class="flex items-center justify-center py-4">
          <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
        </div>
      </div>
    </div>
  `;
  
  fetchEducationNews();
}

async function fetchEducationNews() {
  const articlesContainer = document.getElementById('news-articles');
  
  if (!articlesContainer) return;
  
  try {
    const newsData = [
      {
        title: "MEC anuncia novas diretrizes para o ENEM 2025",
        source: "Portal do MEC",
        url: "https://www.gov.br/mec",
        publishedAt: "2h atrás"
      },
      {
        title: "Universidades brasileiras entre as melhores da América Latina",
        source: "Folha Educação",
        url: "https://www.folha.uol.com.br/educacao",
        publishedAt: "5h atrás"
      },
      {
        title: "Plataformas digitais revolucionam o aprendizado online",
        source: "Tech Edu",
        url: "https://www.example.com",
        publishedAt: "1 dia atrás"
      },
      {
        title: "Dicas para melhorar o desempenho nos vestibulares",
        source: "Guia do Estudante",
        url: "https://guiadoestudante.abril.com.br",
        publishedAt: "2 dias atrás"
      },
      {
        title: "Bolsas de estudo: programas abrem inscrições para 2025",
        source: "Educa Mais",
        url: "https://www.example.com",
        publishedAt: "3 dias atrás"
      }
    ];
    
    articlesContainer.innerHTML = newsData.map(article => `
      <div class="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
        <a href="${article.url}" target="_blank" class="block">
          <h4 class="text-xs font-medium text-gray-800 mb-1 line-clamp-1">${article.title}</h4>
          <div class="flex items-center justify-between text-[10px] text-gray-500">
            <span class="flex items-center">
              <i class="fas fa-newspaper mr-1"></i>
              ${article.source}
            </span>
            <span>${article.publishedAt}</span>
          </div>
        </a>
      </div>
    `).join('');
    
    console.log("✅ Notícias carregadas com sucesso");
    
  } catch (error) {
    console.error("❌ Erro ao carregar notícias:", error);
    articlesContainer.innerHTML = `
      <div class="text-center py-4 text-gray-500 text-xs">
        <i class="fas fa-exclamation-circle mb-1"></i>
        <p>Não foi possível carregar as notícias.</p>
      </div>
    `;
  }
}

// Tradução de páginas agora está em browser-features.js

// ========================================
// INICIALIZAÇÃO
// ========================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSettings);
} else {
  initSettings();
}

function initSettings() {
  console.log("🔧 Inicializando configurações...");
  initSidebarToggle();
  initNewsFeed();
}

window.toggleSidebar = toggleSidebar;
window.toggleNewsFeed = toggleNewsFeed;
