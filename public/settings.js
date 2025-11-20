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
  const homeSearch = document.getElementById('home-search');
  const homeIcons = document.getElementById('home-icons');
  
  if (!homePage) {
    console.warn("⚠️ Elemento home-page não encontrado");
    return;
  }

  // Habilitar scroll vertical suave
  homePage.style.overflowY = 'auto';
  homePage.style.overflowX = 'hidden';
  homePage.style.justifyContent = 'flex-start';
  homePage.style.paddingTop = '0';
  
  // Customizar scrollbar
  homePage.style.scrollbarWidth = 'thin';
  homePage.style.scrollbarColor = 'rgba(255,255,255,0.3) transparent';
  
  // Criar wrapper para centralizar os elementos da home
  let homeWrapper = document.getElementById('home-wrapper');
  if (!homeWrapper && homeSearch && homeIcons) {
    homeWrapper = document.createElement('div');
    homeWrapper.id = 'home-wrapper';
    homeWrapper.className = 'w-full flex flex-col items-center justify-center';
    homeWrapper.style.minHeight = '100vh';
    homeWrapper.style.paddingTop = '0';
    
    // Mover search e icons para dentro do wrapper
    const searchParent = homeSearch.parentElement;
    const iconsParent = homeIcons.parentElement;
    
    if (searchParent === homePage) {
      homeWrapper.appendChild(homeSearch);
    }
    if (iconsParent === homePage) {
      homeWrapper.appendChild(homeIcons);
    }
    
    homePage.insertBefore(homeWrapper, homePage.firstChild);
  }

  let newsContainer = document.getElementById('news-feed-container');
  
  if (!newsContainer) {
    newsContainer = document.createElement('div');
    newsContainer.id = 'news-feed-container';
    newsContainer.className = 'w-full mx-auto px-8 transition-all duration-700';
    newsContainer.style.opacity = '0';
    newsContainer.style.transform = 'translateY(30px)';
    newsContainer.style.maxWidth = '1400px';
    newsContainer.style.paddingTop = '2rem';
    newsContainer.style.paddingBottom = '4rem';
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
  const homeWrapper = document.getElementById('home-wrapper');
  const homeSearch = document.getElementById('home-search');
  const homeIcons = document.getElementById('home-icons');
  
  if (newsContainer) {
    newsContainer.style.opacity = '0';
    newsContainer.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      newsContainer.remove();
    }, 700);
  }
  
  // Restaurar estrutura original
  if (homeWrapper && homePage) {
    // Mover search e icons de volta para homePage
    if (homeSearch && homeSearch.parentElement === homeWrapper) {
      homePage.appendChild(homeSearch);
    }
    if (homeIcons && homeIcons.parentElement === homeWrapper) {
      homePage.appendChild(homeIcons);
    }
    
    // Remover wrapper
    homeWrapper.remove();
  }
  
  // Restaurar estilos
  if (homePage) {
    homePage.style.overflowY = 'hidden';
    homePage.style.justifyContent = 'center';
    homePage.style.paddingTop = '0';
  }
  
  console.log("🔕 Feed de notícias desativado");
}

function loadNewsContent(container) {
  container.innerHTML = `
    <div class="mb-12 flex items-center justify-between sticky top-0 z-10 py-4 backdrop-blur-xl bg-gradient-to-r from-black/10 via-black/5 to-transparent rounded-2xl px-6">
      <h2 class="text-5xl font-black text-white drop-shadow-2xl flex items-center tracking-tight">
        <i class="fas fa-newspaper mr-4 text-blue-400"></i>
        Flow News
      </h2>
      <button onclick="toggleNewsFeed()" 
              class="text-white hover:text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-8 py-3 transition-all duration-300 flex items-center space-x-3 shadow-2xl border border-white/20 hover:border-white/40 hover:scale-105">
        <i class="fas fa-times-circle text-lg"></i>
        <span class="font-semibold">Fechar</span>
      </button>
    </div>
    
    <div id="news-articles" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-8">
      <div class="col-span-full flex items-center justify-center py-20">
        <div class="flex flex-col items-center space-y-4">
          <i class="fas fa-spinner fa-spin text-6xl text-white drop-shadow-2xl"></i>
          <p class="text-white text-xl font-medium drop-shadow-lg">Carregando notícias...</p>
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
    
    // Renderizar notícias do Supabase com design minimalista e elegante
    articlesContainer.innerHTML = newsData.map((article, index) => {
      const hasImage = article.Imagem && article.Imagem.trim() !== '';
      
      return `
        <article class="group bg-white/98 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.03] hover:-translate-y-2 border border-white/50" 
                 onclick="openNewsInNewTab('${article.Link || '#'}', event)">
          ${hasImage ? `
            <div class="relative h-64 overflow-hidden">
              <img src="${article.Imagem}" 
                   alt="${article.Titulo}" 
                   class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                   onerror="this.parentElement.style.display='none'"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500"></div>
              <div class="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                <i class="fas fa-graduation-cap mr-1"></i>
                Educação
              </div>
            </div>
          ` : `
            <div class="h-64 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 relative overflow-hidden">
              <div class="absolute inset-0 opacity-20">
                <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
              </div>
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-purple-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                <i class="fas fa-graduation-cap mr-1"></i>
                Educação
              </div>
            </div>
          `}
          
          <div class="p-7 space-y-4">
            <h3 class="text-2xl font-extrabold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
              ${article.Titulo}
            </h3>
            
            ${article.Manchete ? `
              <p class="text-base text-gray-600 leading-relaxed line-clamp-3 min-h-[4.5rem]">
                ${article.Manchete}
              </p>
            ` : ''}
            
            <div class="flex items-center justify-between pt-5 border-t-2 border-gray-100">
              <div class="flex items-center space-x-3 text-sm text-gray-500">
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <i class="fas fa-newspaper text-white text-xs"></i>
                </div>
                <span class="font-semibold text-gray-700">Flow News</span>
              </div>
              <div class="flex items-center space-x-2 text-blue-600 font-bold text-sm group-hover:translate-x-2 transition-transform bg-blue-50 px-4 py-2 rounded-full group-hover:bg-blue-100">
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
    <article class="group bg-white/98 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.03] hover:-translate-y-2 border border-white/50" 
             onclick="openNewsInNewTab('${article.Link}', event)">
      ${article.Imagem ? `
        <div class="relative h-64 overflow-hidden">
          <img src="${article.Imagem}" 
               alt="${article.Titulo}" 
               class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500"></div>
          <div class="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
            <i class="fas fa-graduation-cap mr-1"></i>
            Educação
          </div>
        </div>
      ` : `
        <div class="h-64 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
          </div>
          <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-purple-600 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
            <i class="fas fa-graduation-cap mr-1"></i>
            Educação
          </div>
        </div>
      `}
      
      <div class="p-7 space-y-4">
        <h3 class="text-2xl font-extrabold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
          ${article.Titulo}
        </h3>
        
        ${article.Manchete ? `
          <p class="text-base text-gray-600 leading-relaxed line-clamp-3 min-h-[4.5rem]">
            ${article.Manchete}
          </p>
        ` : ''}
        
        <div class="flex items-center justify-between pt-5 border-t-2 border-gray-100">
          <div class="flex items-center space-x-3 text-sm text-gray-500">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <i class="fas fa-newspaper text-white text-xs"></i>
            </div>
            <span class="font-semibold text-gray-700">Flow News</span>
          </div>
          <div class="flex items-center space-x-2 text-blue-600 font-bold text-sm group-hover:translate-x-2 transition-transform bg-blue-50 px-4 py-2 rounded-full group-hover:bg-blue-100">
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
    event.stopPropagation();
  }
  
  if (url && url !== '#') {
    console.log(`📰 Abrindo notícia em nova aba: ${url}`);
    
    // Usar a função createTab do app.js
    if (typeof createTab === 'function') {
      createTab(url, 'Notícia');
    } else if (typeof window.createTab === 'function') {
      window.createTab(url, 'Notícia');
    } else {
      console.error('❌ Função createTab não encontrada');
    }
  }
}

window.toggleSidebar = toggleSidebar;
window.toggleNewsFeed = toggleNewsFeed;
window.openNewsInNewTab = openNewsInNewTab;
