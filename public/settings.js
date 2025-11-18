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
    <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden" style="max-height: 450px; width: 100%;">
      <div class="sticky top-0 bg-blue-600 px-4 py-3 flex items-center justify-between z-10">
        <h3 class="text-base font-bold text-white flex items-center">
          <i class="fas fa-newspaper mr-2"></i>
          Notícias
        </h3>
        <button onclick="toggleNewsFeed()" class="text-white hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div id="news-articles" class="overflow-y-auto p-4" style="max-height: 390px;">
        <div class="flex items-center justify-center py-8">
          <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
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
    // Buscar notícias do Supabase
    console.log('📡 Buscando notícias do Supabase...');
    
    if (!supabaseClient) {
      console.warn('⚠️ Supabase não inicializado, usando notícias padrão');
      loadDefaultNews(articlesContainer);
      return;
    }
    
    const { data: newsData, error } = await supabaseClient
      .from('Noticias')
      .select('*')
      .order('id', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Erro ao buscar notícias:', error);
      loadDefaultNews(articlesContainer);
      return;
    }
    
    if (!newsData || newsData.length === 0) {
      console.warn('⚠️ Nenhuma notícia encontrada no banco');
      loadDefaultNews(articlesContainer);
      return;
    }
    
    // Renderizar notícias do Supabase de forma simples e limpa
    articlesContainer.innerHTML = newsData.map((article, index) => {
      const hasImage = article.Imagem && article.Imagem.trim() !== '';
      
      return `
        <div class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200 mb-3 cursor-pointer" onclick="openNewsInNewTab('${article.Link || '#'}', event)">
          ${hasImage ? `
            <div class="relative h-40 overflow-hidden">
              <img src="${article.Imagem}" 
                   alt="${article.Titulo}" 
                   class="w-full h-full object-cover"
                   onerror="this.parentElement.style.display='none'"/>
            </div>
          ` : ''}
          <div class="p-3">
            <h4 class="text-sm font-bold text-gray-900 mb-1 leading-tight">
              ${article.Titulo}
            </h4>
            ${article.Manchete ? `
              <p class="text-xs text-gray-600 leading-relaxed mb-2">${article.Manchete}</p>
            ` : ''}
            <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
              <span><i class="fas fa-newspaper mr-1"></i>Flow News</span>
              <span class="text-blue-600">Ler mais →</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    console.log(`✅ ${newsData.length} notícias carregadas do Supabase`);
    
  } catch (error) {
    console.error("❌ Erro ao carregar notícias:", error);
    loadDefaultNews(articlesContainer);
  }
}

function loadDefaultNews(container) {
  const defaultNews = [
    {
      Titulo: "MEC anuncia novas diretrizes para o ENEM 2025",
      Manchete: "Mudanças nas provas visam melhor avaliar competências dos estudantes",
      Link: "https://www.gov.br/mec",
      Imagem: ""
    },
    {
      Titulo: "Universidades brasileiras entre as melhores da América Latina",
      Manchete: "Ranking internacional destaca qualidade do ensino superior no Brasil",
      Link: "https://www.folha.uol.com.br/educacao",
      Imagem: ""
    },
    {
      Titulo: "Plataformas digitais revolucionam o aprendizado online",
      Manchete: "Tecnologia permite personalização e flexibilidade nos estudos",
      Link: "https://www.example.com",
      Imagem: ""
    }
  ];
  
  container.innerHTML = defaultNews.map(article => `
    <div class="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
      <a href="${article.Link}" target="_blank" class="block">
        <h4 class="text-xs font-medium text-gray-800 mb-1 line-clamp-1">${article.Titulo}</h4>
        <div class="flex items-center text-[10px] text-gray-500">
          <i class="fas fa-newspaper mr-1"></i>
          <span>Flow News</span>
        </div>
      </a>
    </div>
  `).join('');
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

// Função para abrir notícia em nova aba do navegador
function openNewsInNewTab(url, event) {
  if (event) {
    event.preventDefault();
  }
  
  if (url && url !== '#') {
    console.log(`📰 Abrindo notícia em nova aba: ${url}`);
    
    // Simular clique no botão de nova aba
    if (typeof addNewTab === 'function') {
      addNewTab();
      
      // Pequeno delay para garantir que a aba foi criada
      setTimeout(() => {
        const inputUrl = document.getElementById('input-url');
        if (inputUrl) {
          inputUrl.value = url;
          inputUrl.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, which: 13 }));
        }
      }, 100);
    }
  }
}

window.toggleSidebar = toggleSidebar;
window.toggleNewsFeed = toggleNewsFeed;
window.openNewsInNewTab = openNewsInNewTab;
