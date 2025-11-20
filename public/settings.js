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

  // Habilitar scroll vertical suave na home page
  homePage.style.overflowY = 'auto';
  homePage.style.overflowX = 'hidden';
  homePage.style.alignItems = 'flex-start';
  homePage.style.paddingTop = '8rem';
  homePage.style.paddingBottom = '4rem';

  let newsContainer = document.getElementById('news-feed-container');
  
  if (!newsContainer) {
    newsContainer = document.createElement('div');
    newsContainer.id = 'news-feed-container';
    newsContainer.className = 'w-full max-w-5xl mx-auto px-6 mt-20 transition-all duration-700';
    newsContainer.style.opacity = '0';
    newsContainer.style.transform = 'translateY(30px)';
    homePage.appendChild(newsContainer);
    
    setTimeout(() => {
      newsContainer.style.opacity = '1';
      newsContainer.style.transform = 'translateY(0)';
    }, 100);
    
    loadNewsContent(newsContainer);
  }
  
  console.log("📰 Feed de notícias ativado");
}

function hideNewsFeed() {
  const homePage = document.getElementById('home-page');
  const newsContainer = document.getElementById('news-feed-container');
  
  if (newsContainer) {
    newsContainer.style.opacity = '0';
    newsContainer.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      newsContainer.remove();
    }, 700);
  }
  
  // Restaurar estilo original da home page
  if (homePage) {
    homePage.style.overflowY = 'hidden';
    homePage.style.alignItems = 'center';
    homePage.style.paddingTop = '0';
    homePage.style.paddingBottom = '0';
  }
  
  console.log("🔕 Feed de notícias desativado");
}

function loadNewsContent(container) {
  container.innerHTML = `
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-4xl font-bold text-white drop-shadow-2xl flex items-center">
        <i class="fas fa-newspaper mr-4 text-blue-400"></i>
        Notícias Educacionais
      </h2>
      <button onclick="toggleNewsFeed()" 
              class="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full px-6 py-3 transition-all duration-300 flex items-center space-x-2 shadow-lg">
        <i class="fas fa-times"></i>
        <span class="font-medium">Fechar</span>
      </button>
    </div>
    
    <div id="news-articles" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="col-span-full flex items-center justify-center py-16">
        <i class="fas fa-spinner fa-spin text-5xl text-white/50"></i>
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
    
    // Renderizar notícias do Supabase com design minimalista e elegante
    articlesContainer.innerHTML = newsData.map((article, index) => {
      const hasImage = article.Imagem && article.Imagem.trim() !== '';
      
      return `
        <article class="group bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.02]" 
                 onclick="openNewsInNewTab('${article.Link || '#'}', event)">
          ${hasImage ? `
            <div class="relative h-56 overflow-hidden">
              <img src="${article.Imagem}" 
                   alt="${article.Titulo}" 
                   class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                   onerror="this.parentElement.style.display='none'"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            </div>
          ` : `
            <div class="h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>
          `}
          
          <div class="p-6 space-y-3">
            <h3 class="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
              ${article.Titulo}
            </h3>
            
            ${article.Manchete ? `
              <p class="text-sm text-gray-600 leading-relaxed line-clamp-3">
                ${article.Manchete}
              </p>
            ` : ''}
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <i class="fas fa-newspaper text-blue-500"></i>
                <span class="font-medium">Flow News</span>
              </div>
              <div class="flex items-center space-x-2 text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                <span>Ler mais</span>
                <i class="fas fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </article>
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
      Manchete: "Mudanças nas provas visam melhor avaliar competências dos estudantes e preparar melhor os jovens para o ensino superior",
      Link: "https://www.gov.br/mec",
      Imagem: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80"
    },
    {
      Titulo: "Universidades brasileiras entre as melhores da América Latina",
      Manchete: "Ranking internacional destaca qualidade do ensino superior no Brasil e reconhece avanços em pesquisa científica",
      Link: "https://www.folha.uol.com.br/educacao",
      Imagem: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80"
    },
    {
      Titulo: "Plataformas digitais revolucionam o aprendizado online",
      Manchete: "Tecnologia permite personalização e flexibilidade nos estudos, democratizando o acesso à educação de qualidade",
      Link: "https://www.example.com",
      Imagem: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80"
    },
    {
      Titulo: "Novas metodologias ativas transformam salas de aula",
      Manchete: "Escolas adotam abordagens inovadoras que colocam o aluno como protagonista do próprio aprendizado",
      Link: "https://www.example.com",
      Imagem: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
    }
  ];
  
  container.innerHTML = defaultNews.map(article => `
    <article class="group bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.02]" 
             onclick="openNewsInNewTab('${article.Link}', event)">
      ${article.Imagem ? `
        <div class="relative h-56 overflow-hidden">
          <img src="${article.Imagem}" 
               alt="${article.Titulo}" 
               class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
      ` : `
        <div class="h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>
      `}
      
      <div class="p-6 space-y-3">
        <h3 class="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          ${article.Titulo}
        </h3>
        
        ${article.Manchete ? `
          <p class="text-sm text-gray-600 leading-relaxed line-clamp-3">
            ${article.Manchete}
          </p>
        ` : ''}
        
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <i class="fas fa-newspaper text-blue-500"></i>
            <span class="font-medium">Flow News</span>
          </div>
          <div class="flex items-center space-x-2 text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            <span>Ler mais</span>
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </article>
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
