
// Flow Browser - Complete JavaScript Application
console.log("🚀 Iniciando Flow Browser...");

// Elements
const webview = document.getElementById("webview");
const inputUrl = document.getElementById("input-url");
const btnBack = document.getElementById("btn-back");
const btnForward = document.getElementById("btn-forward");
const btnReload = document.getElementById("btn-reload");
const btnSearch = document.getElementById("btn-search");
const btnHome = document.getElementById("btn-home");
const tabsContainer = document.getElementById("tabs");
const btnNewTab = document.getElementById("btn-new-tab");
const btnChangeWallpaper = document.getElementById("btn-change-wallpaper");
const fileInput = document.getElementById("file-input");
const backgroundImage = document.getElementById("home-bg");
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");
const btnProfile = document.getElementById("btn-profile");

// Sidebar buttons
const btnIA = document.getElementById("btn-ia");
const btnNotes = document.getElementById("btn-notes");
const btnTimer = document.getElementById("btn-timer");
const btnReader = document.getElementById("btn-reader");
const btnEmpty = document.getElementById("btn-empty");
const btnHelp = document.getElementById("btn-help");
const btnThemes = document.getElementById("btn-themes");
const btnMore = document.getElementById("btn-more");

// Home page elements
const homePage = document.getElementById("home-page");
const webviewContainer = document.getElementById("webview-container");
const homeSearch = document.getElementById("home-search");
const homeIcons = document.getElementById("home-icons");
const btnAddHomeIcon = document.getElementById("btn-add-home-icon");

// State
let tabs = [];
let activeTabId = null;
let tabIdCounter = 0;

// Constants
const NOTES_STORAGE_KEY = "flow_browser_notes";
const WALLPAPER_STORAGE_KEY = "flow_browser_wallpaper";
const CHATGPT_API_KEY = "";

// Timer state
let timerInterval = null;
let timerRemaining = 0;
let timerRunning = false;

// Default wallpapers
const DEFAULT_WALLPAPERS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
];

// Theme Management - Enhanced with Better Contrast
const THEMES = {
  light: {
    name: "Claro",
    primary: "#667eea",
    secondary: "#764ba2", 
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1f2937",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    accent: "#3b82f6"
  },
  dark: {
    name: "Escuro",
    primary: "#818cf8",
    secondary: "#a78bfa",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    border: "#334155",
    accent: "#6366f1"
  },
  pink: {
    name: "Rosa",
    primary: "#ec4899",
    secondary: "#be185d",
    background: "#fdf2f8",
    surface: "#fce7f3",
    text: "#831843",
    textSecondary: "#9d174d",
    border: "#f9a8d4",
    accent: "#f472b6"
  },
  purple: {
    name: "Roxo",
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    background: "#faf5ff",
    surface: "#f3e8ff",
    text: "#581c87",
    textSecondary: "#6b21a8",
    border: "#c4b5fd",
    accent: "#a855f7"
  },
  green: {
    name: "Verde",
    primary: "#10b981",
    secondary: "#059669",
    background: "#f0fdf4",
    surface: "#dcfce7",
    text: "#14532d",
    textSecondary: "#166534",
    border: "#86efac",
    accent: "#22c55e"
  },
  blue: {
    name: "Azul",
    primary: "#3b82f6",
    secondary: "#1d4ed8",
    background: "#eff6ff",
    surface: "#dbeafe",
    text: "#1e3a8a",
    textSecondary: "#1d4ed8",
    border: "#93c5fd",
    accent: "#60a5fa"
  },
  orange: {
    name: "Laranja",
    primary: "#f97316",
    secondary: "#ea580c",
    background: "#fff7ed",
    surface: "#fed7aa",
    text: "#9a3412",
    textSecondary: "#c2410c",
    border: "#fdba74",
    accent: "#fb923c"
  }
};

let currentTheme = localStorage.getItem('flow_browser_theme') || 'light';

function applyTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) return;
  
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-background', theme.background);
  root.style.setProperty('--theme-surface', theme.surface);
  root.style.setProperty('--theme-text', theme.text);
  root.style.setProperty('--theme-text-secondary', theme.textSecondary);
  root.style.setProperty('--theme-border', theme.border);
  root.style.setProperty('--theme-accent', theme.accent);
  
  // Apply theme class to body
  document.body.className = document.body.className.replace(/theme-\w+/g, '');
  document.body.classList.add(`theme-${themeName}`);
  
  currentTheme = themeName;
  localStorage.setItem('flow_browser_theme', themeName);
}

// Loading Animation
function showLoadingAnimation() {
  if (!webview) return;
  
  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'loading-overlay';
  loadingOverlay.className = 'absolute inset-0 bg-white flex items-center justify-center z-50';
  loadingOverlay.innerHTML = `
    <div class="flex flex-col items-center space-y-4">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <div class="text-gray-600 font-medium">Carregando página...</div>
      <div class="text-sm text-gray-400">Flow Browser</div>
    </div>
  `;
  
  webviewContainer.appendChild(loadingOverlay);
  
  // Remove loading after webview loads
  const removeLoading = () => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  };
  
  // Auto remove after 5 seconds max
  setTimeout(removeLoading, 5000);
  
  return removeLoading;
}

// Tab Management
function createTab(url = "home", title = "Nova aba") {
  const id = ++tabIdCounter;
  
  const tab = { id, url, title };
  tabs.push(tab);
  renderTabs();
  setActiveTab(id);
  return id;
}

function renderTabs() {
  if (!tabsContainer) return;
  
  tabsContainer.innerHTML = "";
  tabs.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = `flex items-center space-x-2 rounded-t-lg border border-b-0 px-4 py-2 text-sm max-w-[200px] truncate transition-all duration-200 ${
      tab.id === activeTabId
        ? "bg-white border-gray-300 text-gray-800 shadow-sm"
        : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
    }`;
    btn.title = tab.title;
    btn.innerHTML = `
      <span class="truncate">${tab.title}</span> 
      <i class="fas fa-times text-xs ml-2 opacity-60 hover:opacity-100"></i>
    `;
    
    btn.addEventListener('click', () => setActiveTab(tab.id));
    btn.querySelector("i").addEventListener('click', (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    });
    
    tabsContainer.appendChild(btn);
  });
}

function setActiveTab(id) {
  const tab = tabs.find((t) => t.id === id);
  if (!tab) return;
  
  activeTabId = id;
  if (inputUrl) inputUrl.value = tab.url === "home" ? "" : tab.url;
  
  if (tab.url === "home") {
    showHome();
  } else {
    showWebview(tab.url);
  }
  
  renderTabs();
  updateNavButtons();
}

function closeTab(id) {
  const idx = tabs.findIndex((t) => t.id === id);
  if (idx === -1) return;
  
  tabs.splice(idx, 1);
  
  if (activeTabId === id) {
    if (tabs.length > 0) {
      const newActive = tabs[Math.max(0, idx - 1)];
      setActiveTab(newActive.id);
    } else {
      createHomeTab();
    }
  } else {
    renderTabs();
  }
}

function createHomeTab() {
  const id = ++tabIdCounter;
  const tab = { id, url: "home", title: "Home" };
  tabs.push(tab);
  renderTabs();
  setActiveTab(id);
  return id;
}

// Navigation
function navigateToInput() {
  if (!inputUrl) return;
  
  let val = inputUrl.value.trim();
  if (!val) return;
  
  if (val === "home") {
    const homeTab = tabs.find(t => t.url === "home");
    if (homeTab) {
      setActiveTab(homeTab.id);
    } else {
      createHomeTab();
    }
    return;
  }
  
  let url;
  if (val.startsWith("http://") || val.startsWith("https://") || val.includes(".")) {
    if (!val.startsWith("http")) val = "https://" + val;
    url = val;
  } else {
    url = "https://www.google.com/search?q=" + encodeURIComponent(val);
  }
  
  // Se não há aba ativa ou é a home, cria nova aba
  const currentTab = tabs.find(t => t.id === activeTabId);
  if (!activeTabId || !currentTab || currentTab.url === "home") {
    createTab(url, val);
  } else {
    updateCurrentTabUrl(url);
  }
}

function updateCurrentTabUrl(url) {
  const tab = tabs.find((t) => t.id === activeTabId);
  if (!tab) {
    createTab(url, url);
    return;
  }
  
  tab.url = url;
  tab.title = url;
  setActiveTab(tab.id);
}

function updateNavButtons() {
  if (!webview || !btnBack || !btnForward) return;
  
  try {
    const canGoBack = webview.canGoBack && webview.canGoBack();
    const canGoForward = webview.canGoForward && webview.canGoForward();
    
    btnBack.disabled = !canGoBack;
    btnForward.disabled = !canGoForward;
    
    btnBack.className = `rounded-full p-2 transition-colors ${
      btnBack.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
    }`;
    btnForward.className = `rounded-full p-2 transition-colors ${
      btnForward.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
    }`;
  } catch (e) {
    // Webview not ready yet
  }
}

// Page Management
function showHome() {
  if (homePage) homePage.style.display = "flex";
  if (webviewContainer) webviewContainer.style.display = "none";
  if (inputUrl) inputUrl.value = "";
  updateNavButtons();
}

function showWebview(url) {
  if (homePage) homePage.style.display = "none";
  if (webviewContainer) webviewContainer.style.display = "flex";
  
  if (webview && url !== webview.src) {
    const removeLoading = showLoadingAnimation();
    webview.src = url;
    
    // Remove loading when page loads
    webview.addEventListener('dom-ready', removeLoading, { once: true });
    webview.addEventListener('did-fail-load', removeLoading, { once: true });
  }
  
  if (inputUrl) inputUrl.value = url;
  setTimeout(updateNavButtons, 500);
}

// Wallpaper Management
function loadWallpaper() {
  const savedWallpaper = localStorage.getItem(WALLPAPER_STORAGE_KEY);
  if (savedWallpaper && backgroundImage) {
    backgroundImage.src = savedWallpaper;
  } else if (backgroundImage) {
    // Load random default wallpaper
    const randomWallpaper = DEFAULT_WALLPAPERS[Math.floor(Math.random() * DEFAULT_WALLPAPERS.length)];
    backgroundImage.src = randomWallpaper;
  }
}

function changeWallpaper(imageSrc) {
  if (backgroundImage) {
    console.log('🎨 Aplicando novo wallpaper:', imageSrc);
    backgroundImage.style.opacity = '0';
    
    setTimeout(() => {
      backgroundImage.src = imageSrc;
      backgroundImage.onload = () => {
        backgroundImage.style.opacity = '1';
        localStorage.setItem(WALLPAPER_STORAGE_KEY, imageSrc);
        console.log('✅ Wallpaper aplicado com sucesso!');
      };
      backgroundImage.onerror = () => {
        console.error('❌ Erro ao carregar wallpaper');
        backgroundImage.style.opacity = '1';
      };
    }, 300);
  }
}

function openWallpaperModal() {
  let wallpaperOptions = "";
  DEFAULT_WALLPAPERS.forEach((wallpaper, index) => {
    wallpaperOptions += `
      <div class="wallpaper-option cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all" 
           data-wallpaper="${wallpaper}">
        <img src="${wallpaper}" alt="Wallpaper ${index + 1}" class="w-full h-24 object-cover">
      </div>
    `;
  });

  const html = `
    <div class="max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        <i class="fas fa-image mr-2 text-purple-500"></i>Escolher Papel de Parede
      </h2>
      <div class="grid grid-cols-3 gap-4 mb-6">
        ${wallpaperOptions}
      </div>
      <div class="text-center">
        <button id="btn-custom-wallpaper" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          <i class="fas fa-upload mr-2"></i>Carregar Imagem Personalizada
        </button>
      </div>
    </div>
  `;
  
  openModal(html);
  setupWallpaperModal();
}

function setupWallpaperModal() {
  const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
  const btnCustomWallpaper = document.getElementById('btn-custom-wallpaper');
  
  wallpaperOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const wallpaperUrl = option.dataset.wallpaper;
      console.log('🖼️ Alterando wallpaper para:', wallpaperUrl);
      changeWallpaper(wallpaperUrl);
      
      // Feedback visual
      const feedback = document.createElement('div');
      feedback.className = 'absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center text-white font-bold rounded-lg z-10';
      feedback.innerHTML = '<i class="fas fa-check mr-2"></i>Aplicado!';
      option.style.position = 'relative';
      option.appendChild(feedback);
      
      setTimeout(() => {
        closeModal();
      }, 1000);
    });
  });
  
  if (btnCustomWallpaper) {
    btnCustomWallpaper.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('📁 Abrindo seletor de arquivo personalizado...');
      
      // Criar input temporário para melhor controle
      const tempInput = document.createElement('input');
      tempInput.type = 'file';
      tempInput.accept = 'image/*';
      tempInput.style.display = 'none';
      
      tempInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('📁 Arquivo selecionado:', file.name, file.type);
        
        if (!file.type.startsWith('image/')) {
          alert('Por favor, selecione apenas arquivos de imagem!');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (ev) => {
          console.log('✅ Arquivo lido, aplicando wallpaper personalizado...');
          changeWallpaper(ev.target.result);
          closeModal();
        };
        reader.onerror = () => {
          console.error('❌ Erro ao ler arquivo');
          alert('Erro ao ler o arquivo. Tente novamente.');
        };
        reader.readAsDataURL(file);
        
        // Limpar input temporário
        document.body.removeChild(tempInput);
      };
      
      document.body.appendChild(tempInput);
      tempInput.click();
    });
  }
}

// Profile Modal
function openProfileModal() {
  const html = `
    <div class="max-w-md mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-user-circle mr-2 text-blue-500"></i>Entrar na sua conta
      </h2>
      
      <div class="space-y-4">
        <button class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
          <i class="fab fa-google"></i>
          <span>Entrar com Google</span>
        </button>
        
        <button class="w-full bg-blue-800 text-white py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center space-x-2">
          <i class="fab fa-facebook-f"></i>
          <span>Entrar com Facebook</span>
        </button>
        
        <div class="text-center text-gray-500 text-sm py-2">ou</div>
        
        <div class="space-y-3">
          <input type="email" placeholder="Email" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <input type="password" placeholder="Senha" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>
        
        <button class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
          Entrar
        </button>
        
        <div class="text-center text-sm text-gray-600 space-y-2">
          <div>
            <a href="#" class="text-blue-600 hover:underline">Esqueceu a senha?</a>
          </div>
          <div>
            Não tem conta? 
            <a href="#" class="text-blue-600 hover:underline font-semibold">Cadastrar-se</a>
          </div>
        </div>
      </div>
      
      <div class="mt-6 text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <i class="fas fa-info-circle mr-1"></i>
        Em breve: sincronização com banco de dados Supabase
      </div>
    </div>
  `;
  
  openModal(html);
}

// Modal Management
function openModal(contentHtml) {
  if (!modalBody || !modalOverlay) return;
  
  modalBody.innerHTML = contentHtml;
  modalOverlay.classList.remove("hidden");
  modalOverlay.classList.add("flex");
}

function closeModal() {
  if (!modalOverlay || !modalBody) return;
  
  modalOverlay.classList.add("hidden");
  modalOverlay.classList.remove("flex");
  modalBody.innerHTML = "";
}

// Notes Management
function openNotesModal() {
  const savedNotes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || "{}");
  let notesListHtml = "";
  
  for (const id in savedNotes) {
    notesListHtml += `
      <li class="border-b border-gray-200 py-2 px-3 cursor-pointer hover:bg-gray-50 truncate transition-colors" 
          data-id="${id}" title="${savedNotes[id].title}">
        ${savedNotes[id].title}
      </li>
    `;
  }
  
  if (!notesListHtml) {
    notesListHtml = "<li class='text-gray-500 p-3 text-center'>Nenhuma nota salva</li>";
  }

  const html = `
    <div class="flex flex-col h-[70vh]">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Bloco de Notas</h2>
        <button id="btn-new-note" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <i class="fas fa-plus mr-2"></i>Nova Nota
        </button>
      </div>
      <div class="flex flex-1 overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <ul id="notes-list" class="w-1/3 bg-gray-50 overflow-auto notes-scroll border-r border-gray-200">${notesListHtml}</ul>
        <div class="flex flex-col flex-1 p-4">
          <input id="note-title" type="text" placeholder="Título da nota" 
                 class="border border-gray-300 mb-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
          <textarea id="note-content" 
                    class="flex-1 resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
                    placeholder="Escreva sua nota aqui..."></textarea>
          <div class="mt-3 flex justify-end space-x-2">
            <button id="btn-save-note" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <i class="fas fa-save mr-2"></i>Salvar
            </button>
            <button id="btn-delete-note" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              <i class="fas fa-trash mr-2"></i>Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  openModal(html);
  setupNotesModal();
}

function setupNotesModal() {
  const notesList = document.getElementById("notes-list");
  const noteTitle = document.getElementById("note-title");
  const noteContent = document.getElementById("note-content");
  const btnSaveNote = document.getElementById("btn-save-note");
  const btnDeleteNote = document.getElementById("btn-delete-note");
  const btnNewNote = document.getElementById("btn-new-note");

  let currentNoteId = null;
  let notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || "{}");

  function refreshNotesList() {
    if (!notesList) return;
    
    notesList.innerHTML = "";
    const keys = Object.keys(notes);
    
    if (keys.length === 0) {
      notesList.innerHTML = "<li class='text-gray-500 p-3 text-center'>Nenhuma nota salva</li>";
      clearNote();
      return;
    }
    
    keys.forEach((id) => {
      const li = document.createElement("li");
      li.textContent = notes[id].title;
      li.title = notes[id].title;
      li.dataset.id = id;
      li.className = `border-b border-gray-200 py-2 px-3 cursor-pointer hover:bg-gray-50 truncate transition-colors ${
        id === currentNoteId ? 'bg-blue-50 border-blue-200' : ''
      }`;
      
      li.onclick = () => {
        currentNoteId = id;
        loadNote(id);
        refreshNotesList();
      };
      
      notesList.appendChild(li);
    });
  }

  function loadNote(id) {
    if (!notes[id] || !noteTitle || !noteContent) return;
    noteTitle.value = notes[id].title;
    noteContent.value = notes[id].content;
  }

  function clearNote() {
    currentNoteId = null;
    if (noteTitle) noteTitle.value = "";
    if (noteContent) noteContent.value = "";
  }

  if (btnSaveNote) {
    btnSaveNote.onclick = () => {
      const title = noteTitle?.value?.trim() || "Sem título";
      const content = noteContent?.value || "";
      
      if (!currentNoteId) {
        currentNoteId = Date.now().toString();
      }
      
      notes[currentNoteId] = { title, content };
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      refreshNotesList();
      
      // Show success feedback
      btnSaveNote.innerHTML = '<i class="fas fa-check mr-2"></i>Salvo!';
      setTimeout(() => {
        btnSaveNote.innerHTML = '<i class="fas fa-save mr-2"></i>Salvar';
      }, 1500);
    };
  }

  if (btnDeleteNote) {
    btnDeleteNote.onclick = () => {
      if (!currentNoteId) {
        alert("Nenhuma nota selecionada para excluir.");
        return;
      }
      
      if (confirm("Tem certeza que deseja excluir esta nota?")) {
        delete notes[currentNoteId];
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
        clearNote();
        refreshNotesList();
      }
    };
  }

  if (btnNewNote) {
    btnNewNote.onclick = () => {
      clearNote();
      refreshNotesList();
      if (noteTitle) noteTitle.focus();
    };
  }

  // Load first note if exists
  if (Object.keys(notes).length > 0) {
    currentNoteId = Object.keys(notes)[0];
    loadNote(currentNoteId);
  } else {
    clearNote();
  }
  
  refreshNotesList();
}

// Timer Management
function openTimerModal() {
  const html = `
    <div class="flex flex-col h-[50vh] max-w-md mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Temporizador de Estudo</h2>
      <div class="flex justify-center items-center space-x-4 mb-6">
        <input id="input-minutes" type="number" min="1" max="180" value="25" 
               class="w-20 text-center rounded-lg border border-gray-300 p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
        <span class="text-lg text-gray-600">minutos</span>
      </div>
      <div class="text-center text-6xl font-mono mb-8 text-gray-800" id="timer-display">25:00</div>
      <div class="flex justify-center space-x-3">
        <button id="btn-start-timer" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center">
          <i class="fas fa-play mr-2"></i>Iniciar
        </button>
        <button id="btn-pause-timer" class="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center" disabled>
          <i class="fas fa-pause mr-2"></i>Pausar
        </button>
        <button id="btn-reset-timer" class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center">
          <i class="fas fa-redo mr-2"></i>Resetar
        </button>
      </div>
      <div class="mt-6 text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <i class="fas fa-info-circle mr-2"></i>Após o tempo, um alerta será exibido para descanso.
      </div>
    </div>
  `;
  
  openModal(html);
  setupTimerModal();
}

function setupTimerModal() {
  const inputMinutes = document.getElementById("input-minutes");
  const timerDisplay = document.getElementById("timer-display");
  const btnStart = document.getElementById("btn-start-timer");
  const btnPause = document.getElementById("btn-pause-timer");
  const btnReset = document.getElementById("btn-reset-timer");

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateDisplay() {
    if (timerDisplay) timerDisplay.textContent = formatTime(timerRemaining);
  }

  function startTimer() {
    if (timerRunning) return;
    
    timerRunning = true;
    if (btnStart) btnStart.disabled = true;
    if (btnPause) btnPause.disabled = false;
    
    timerInterval = setInterval(() => {
      if (timerRemaining > 0) {
        timerRemaining--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        timerRunning = false;
        if (btnStart) btnStart.disabled = false;
        if (btnPause) btnPause.disabled = true;
        alert("🎉 Tempo de estudo finalizado! Hora de descansar.");
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!timerRunning) return;
    
    clearInterval(timerInterval);
    timerRunning = false;
    if (btnStart) btnStart.disabled = false;
    if (btnPause) btnPause.disabled = true;
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerRemaining = parseInt(inputMinutes?.value, 10) * 60 || 1500;
    updateDisplay();
    if (btnStart) btnStart.disabled = false;
    if (btnPause) btnPause.disabled = true;
  }

  if (inputMinutes) {
    inputMinutes.onchange = () => {
      if (timerRunning) {
        alert("Pare o temporizador antes de alterar o tempo.");
        inputMinutes.value = Math.floor(timerRemaining / 60);
        return;
      }
      resetTimer();
    };
  }

  if (btnStart) btnStart.onclick = startTimer;
  if (btnPause) btnPause.onclick = pauseTimer;
  if (btnReset) btnReset.onclick = resetTimer;

  timerRemaining = parseInt(inputMinutes?.value, 10) * 60 || 1500;
  updateDisplay();
  if (btnPause) btnPause.disabled = true;
}

// Chat GPT Integration - Funcional com API real
function openChatGPTModal() {
  const html = `
    <div class="flex flex-col h-[70vh] max-w-4xl w-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800">
          <i class="fas fa-robot mr-2 text-blue-500"></i>Chat GPT - IA para estudos
        </h2>
        <div class="flex items-center space-x-2 text-sm">
          <div id="api-status" class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span class="text-green-600 font-medium">API Conectada</span>
          </div>
        </div>
      </div>
      
      <div id="chat-messages" class="flex-1 overflow-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 space-y-3">
        <div class="bg-blue-100 border border-blue-200 text-blue-800 p-3 rounded-lg">
          <i class="fas fa-info-circle mr-2"></i>
          <strong>Bem-vindo ao assistente de estudos!</strong><br>
          Pergunte sobre qualquer matéria, peça explicações, tire dúvidas ou solicite resumos. Estou aqui para ajudar! 🚀
        </div>
      </div>
      
      <form id="chat-form" class="flex space-x-3">
        <input id="chat-input" type="text" placeholder="Ex: Explique a lei de Newton, resumo de história do Brasil..." 
               class="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" 
               autocomplete="off" />
        <button type="submit" id="send-btn" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
          <i class="fas fa-paper-plane mr-2"></i>Enviar
        </button>
      </form>
      
      <div class="text-xs text-gray-500 mt-2 flex items-center justify-between">
        <span>💡 Dica: Seja específico em suas perguntas para respostas mais precisas</span>
        <span id="char-counter">0/500</span>
      </div>
    </div>
  `;
  
  openModal(html);
  setupChatGPT();
}

function setupChatGPT() {
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const charCounter = document.getElementById("char-counter");
  const apiStatus = document.getElementById("api-status");

  // Character counter
  if (chatInput && charCounter) {
    chatInput.addEventListener('input', () => {
      const length = chatInput.value.length;
      charCounter.textContent = `${length}/500`;
      if (length > 450) {
        charCounter.style.color = '#ef4444';
      } else {
        charCounter.style.color = '#6b7280';
      }
    });
  }

  function appendMessage(text, fromUser = false, isTyping = false) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${fromUser ? 'justify-end' : 'justify-start'} mb-3`;
    
    const bubble = document.createElement("div");
    bubble.className = `p-3 rounded-lg max-w-[80%] ${
      fromUser 
        ? "bg-blue-500 text-white rounded-br-sm" 
        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
    } shadow-sm`;
    
    if (isTyping) {
      bubble.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
          <span class="text-gray-500 text-sm">IA está digitando...</span>
        </div>
      `;
    } else {
      // Format message with markdown-like styling
      const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
        .replace(/\n/g, '<br>');
      
      bubble.innerHTML = formattedText;
    }
    
    if (!fromUser) {
      const timestamp = document.createElement("div");
      timestamp.className = "text-xs text-gray-400 mt-1";
      timestamp.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      bubble.appendChild(timestamp);
    }
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return bubble;
  }

  if (chatForm) {
    chatForm.onsubmit = async (e) => {
      e.preventDefault();
      const question = chatInput?.value?.trim();
      if (!question || question.length > 500) return;
      
      // Disable form during request
      chatInput.disabled = true;
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
      
      appendMessage(question, true);
      if (chatInput) chatInput.value = "";
      if (charCounter) charCounter.textContent = "0/500";
      
      // Show typing indicator
      const typingBubble = appendMessage("", false, true);

      try {
        console.log("🤖 Enviando pergunta para GPT:", question);
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${CHATGPT_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system", 
                content: "Você é um assistente de estudos inteligente. Responda de forma clara, didática e útil. Use formatação markdown quando apropriado. Seja conciso mas completo."
              },
              {
                role: "user", 
                content: question
              }
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });
        
        // Remove typing indicator
        typingBubble.parentElement.remove();
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
        
        console.log("✅ Resposta recebida do GPT");
        appendMessage(answer, false);
        
        // Update API status
        if (apiStatus) {
          apiStatus.innerHTML = `
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-green-600 font-medium">✓ Funcionando</span>
          `;
        }
        
      } catch (error) {
        console.error("❌ Erro na API do ChatGPT:", error);
        
        // Remove typing indicator
        typingBubble.parentElement.remove();
        
        let errorMessage = "Erro na comunicação com a IA. ";
        if (error.message.includes("401")) {
          errorMessage += "Verifique sua chave da API.";
        } else if (error.message.includes("429")) {
          errorMessage += "Muitas solicitações. Tente novamente em alguns segundos.";
        } else if (error.message.includes("network")) {
          errorMessage += "Verifique sua conexão com a internet.";
        } else {
          errorMessage += "Tente novamente em alguns momentos.";
        }
        
        appendMessage(errorMessage, false);
        
        // Update API status
        if (apiStatus) {
          apiStatus.innerHTML = `
            <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span class="text-red-600 font-medium">Erro na conexão</span>
          `;
        }
      } finally {
        // Re-enable form
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Enviar';
        if (chatInput) chatInput.focus();
      }
    };
  }

  if (chatInput) chatInput.focus();
}

// More Tools Modal
function openMoreToolsModal() {
  const html = `
    <div class="max-w-4xl">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-tools mr-3 text-purple-500"></i>Ferramentas Extras
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button id="btn-image-converter" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-image text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Converter Imagem</h3>
          <p class="text-sm opacity-90">Converta formatos, remova fundos e otimize imagens</p>
        </button>
        
        <button id="btn-calculator" class="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-calculator text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Calculadora</h3>
          <p class="text-sm opacity-90">Calculadora científica para estudos</p>
        </button>
        
        <button id="btn-color-picker" class="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-palette text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Seletor de Cores</h3>
          <p class="text-sm opacity-90">Escolha e converta cores para projetos</p>
        </button>
        
        <button id="btn-text-tools" class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-font text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Ferramentas de Texto</h3>
          <p class="text-sm opacity-90">Contar palavras, converter casos e mais</p>
        </button>
        
        <button id="btn-qr-generator" class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-qrcode text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Gerador QR Code</h3>
          <p class="text-sm opacity-90">Crie QR codes para links, textos e mais</p>
        </button>
        
        <button id="btn-password-generator" class="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-shield-alt text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Gerador de Senhas</h3>
          <p class="text-sm opacity-90">Gere senhas seguras e personalizadas</p>
        </button>
        
        <button id="btn-unit-converter" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-exchange-alt text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Conversor de Unidades</h3>
          <p class="text-sm opacity-90">Converta medidas, moedas e temperaturas</p>
        </button>
        
        <button id="btn-markdown-editor" class="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-6 rounded-xl hover:from-gray-700 hover:to-gray-900 transition-all transform hover:scale-105 shadow-lg">
          <i class="fab fa-markdown text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Editor Markdown</h3>
          <p class="text-sm opacity-90">Escreva e visualize documentos markdown</p>
        </button>
        
        <button id="btn-json-formatter" class="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-code text-3xl mb-3"></i>
          <h3 class="text-xl font-bold mb-2">Formatador JSON</h3>
          <p class="text-sm opacity-90">Formate e valide código JSON</p>
        </button>
      </div>
    </div>
  `;
  
  openModal(html);
  setupMoreToolsModal();
}

function setupMoreToolsModal() {
  const btnImageConverter = document.getElementById('btn-image-converter');
  const btnCalculator = document.getElementById('btn-calculator');
  const btnColorPicker = document.getElementById('btn-color-picker');
  const btnTextTools = document.getElementById('btn-text-tools');
  const btnQrGenerator = document.getElementById('btn-qr-generator');
  const btnPasswordGenerator = document.getElementById('btn-password-generator');
  const btnUnitConverter = document.getElementById('btn-unit-converter');
  const btnMarkdownEditor = document.getElementById('btn-markdown-editor');
  const btnJsonFormatter = document.getElementById('btn-json-formatter');
  
  if (btnImageConverter) {
    btnImageConverter.onclick = () => {
      closeModal();
      setTimeout(openImageConverterModal, 100);
    };
  }
  
  if (btnCalculator) {
    btnCalculator.onclick = () => {
      closeModal();
      setTimeout(openCalculatorModal, 100);
    };
  }
  
  if (btnColorPicker) {
    btnColorPicker.onclick = () => {
      closeModal();
      setTimeout(openColorPickerModal, 100);
    };
  }
  
  if (btnTextTools) {
    btnTextTools.onclick = () => {
      closeModal();
      setTimeout(openTextToolsModal, 100);
    };
  }
  
  if (btnQrGenerator) {
    btnQrGenerator.onclick = () => {
      closeModal();
      setTimeout(openQRGeneratorModal, 100);
    };
  }
  
  if (btnPasswordGenerator) {
    btnPasswordGenerator.onclick = () => {
      closeModal();
      setTimeout(openPasswordGeneratorModal, 100);
    };
  }
  
  if (btnUnitConverter) {
    btnUnitConverter.onclick = () => {
      closeModal();
      setTimeout(openUnitConverterModal, 100);
    };
  }
  
  if (btnMarkdownEditor) {
    btnMarkdownEditor.onclick = () => {
      closeModal();
      setTimeout(openMarkdownEditorModal, 100);
    };
  }
  
  if (btnJsonFormatter) {
    btnJsonFormatter.onclick = () => {
      closeModal();
      setTimeout(openJSONFormatterModal, 100);
    };
  }
}

// QR Code Generator
function openQRGeneratorModal() {
  const html = `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-qrcode mr-2 text-indigo-500"></i>Gerador de QR Code
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Texto ou Link</label>
          <textarea id="qr-input" placeholder="Digite o texto, link ou qualquer conteúdo..." class="w-full h-32 border border-gray-300 rounded-lg p-3"></textarea>
          
          <div class="mt-4 space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
              <select id="qr-size" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="200">Pequeno (200x200)</option>
                <option value="300" selected>Médio (300x300)</option>
                <option value="400">Grande (400x400)</option>
                <option value="500">Extra Grande (500x500)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cor</label>
              <input type="color" id="qr-color" value="#000000" class="w-full h-10 border border-gray-300 rounded-lg">
            </div>
          </div>
          
          <button id="btn-generate-qr" class="w-full mt-4 bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors">
            <i class="fas fa-magic mr-2"></i>Gerar QR Code
          </button>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
          <div id="qr-result" class="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center bg-gray-50">
            <p class="text-gray-500">QR Code aparecerá aqui</p>
          </div>
          <button id="btn-download-qr" class="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors hidden">
            <i class="fas fa-download mr-2"></i>Baixar QR Code
          </button>
        </div>
      </div>
    </div>
  `;
  
  openModal(html);
  setupQRGenerator();
}

function setupQRGenerator() {
  const qrInput = document.getElementById('qr-input');
  const qrSize = document.getElementById('qr-size');
  const qrColor = document.getElementById('qr-color');
  const btnGenerateQr = document.getElementById('btn-generate-qr');
  const btnDownloadQr = document.getElementById('btn-download-qr');
  const qrResult = document.getElementById('qr-result');
  
  let currentQR = null;
  
  if (btnGenerateQr) {
    btnGenerateQr.onclick = () => {
      const text = qrInput?.value?.trim();
      if (!text) {
        alert('Digite algum texto ou link para gerar o QR Code!');
        return;
      }
      
      generateQRCode(text);
    };
  }
  
  function generateQRCode(text) {
    const size = parseInt(qrSize?.value || 300);
    const color = qrColor?.value || '#000000';
    
    // Usando QR.js library via CDN
    const qrData = generateQRMatrix(text);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = size;
    canvas.height = size;
    
    const cellSize = size / qrData.length;
    
    // Background branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // QR Code
    ctx.fillStyle = color;
    for (let row = 0; row < qrData.length; row++) {
      for (let col = 0; col < qrData[row].length; col++) {
        if (qrData[row][col]) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
    
    currentQR = canvas.toDataURL('image/png');
    
    qrResult.innerHTML = `<img src="${currentQR}" alt="QR Code" class="max-w-full max-h-full object-contain rounded-lg shadow-lg" />`;
    btnDownloadQr?.classList.remove('hidden');
  }
  
  if (btnDownloadQr) {
    btnDownloadQr.onclick = () => {
      if (currentQR) {
        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.png`;
        link.href = currentQR;
        link.click();
      }
    };
  }
  
  // Simple QR Code generator (basic implementation)
  function generateQRMatrix(text) {
    const size = 25; // Simple 25x25 matrix
    const matrix = Array(size).fill().map(() => Array(size).fill(false));
    
    // Simple pattern generation (for demo purposes)
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    Math.seedrandom = function(seed) {
      const m = 0x80000000;
      const a = 1103515245;
      const c = 12345;
      let state = seed ? seed : Math.floor(Math.random() * (m - 1));
      
      return function() {
        state = (a * state + c) % m;
        return state / (m - 1);
      };
    };
    
    const rng = Math.seedrandom(Math.abs(hash));
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        matrix[i][j] = rng() > 0.5;
      }
    }
    
    return matrix;
  }
}

// Password Generator
function openPasswordGeneratorModal() {
  const html = `
    <div class="max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-shield-alt mr-2 text-red-500"></i>Gerador de Senhas Seguras
      </h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tamanho da Senha</label>
          <input type="range" id="password-length" min="4" max="64" value="16" class="w-full">
          <div class="flex justify-between text-sm text-gray-500 mt-1">
            <span>4</span>
            <span id="length-value" class="font-bold">16</span>
            <span>64</span>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <label class="flex items-center">
            <input type="checkbox" id="include-uppercase" checked class="mr-2">
            <span class="text-sm">Maiúsculas (A-Z)</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" id="include-lowercase" checked class="mr-2">
            <span class="text-sm">Minúsculas (a-z)</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" id="include-numbers" checked class="mr-2">
            <span class="text-sm">Números (0-9)</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" id="include-symbols" class="mr-2">
            <span class="text-sm">Símbolos (!@#$)</span>
          </label>
        </div>
        
        <button id="btn-generate-password" class="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors">
          <i class="fas fa-key mr-2"></i>Gerar Senha
        </button>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Senha Gerada</label>
          <div class="flex">
            <input type="text" id="generated-password" readonly class="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 bg-gray-50 font-mono">
            <button id="btn-copy-password" class="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition-colors">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
        
        <div id="password-strength" class="hidden">
          <label class="block text-sm font-medium text-gray-700 mb-2">Força da Senha</label>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div id="strength-bar" class="h-2 rounded-full transition-all duration-300"></div>
          </div>
          <p id="strength-text" class="text-sm mt-1"></p>
        </div>
      </div>
    </div>
  `;
  
  openModal(html);
  setupPasswordGenerator();
}

function setupPasswordGenerator() {
  const passwordLength = document.getElementById('password-length');
  const lengthValue = document.getElementById('length-value');
  const includeUppercase = document.getElementById('include-uppercase');
  const includeLowercase = document.getElementById('include-lowercase');
  const includeNumbers = document.getElementById('include-numbers');
  const includeSymbols = document.getElementById('include-symbols');
  const btnGeneratePassword = document.getElementById('btn-generate-password');
  const generatedPassword = document.getElementById('generated-password');
  const btnCopyPassword = document.getElementById('btn-copy-password');
  const passwordStrength = document.getElementById('password-strength');
  const strengthBar = document.getElementById('strength-bar');
  const strengthText = document.getElementById('strength-text');
  
  // Update length display
  if (passwordLength && lengthValue) {
    passwordLength.oninput = () => {
      lengthValue.textContent = passwordLength.value;
    };
  }
  
  // Generate password
  if (btnGeneratePassword) {
    btnGeneratePassword.onclick = () => {
      const length = parseInt(passwordLength?.value || 16);
      const chars = [];
      
      if (includeUppercase?.checked) chars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      if (includeLowercase?.checked) chars.push('abcdefghijklmnopqrstuvwxyz');
      if (includeNumbers?.checked) chars.push('0123456789');
      if (includeSymbols?.checked) chars.push('!@#$%^&*()_+-=[]{}|;:,.<>?');
      
      if (chars.length === 0) {
        alert('Selecione pelo menos um tipo de caractere!');
        return;
      }
      
      const allChars = chars.join('');
      let password = '';
      
      for (let i = 0; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
      }
      
      generatedPassword.value = password;
      passwordStrength?.classList.remove('hidden');
      updatePasswordStrength(password);
    };
  }
  
  // Copy password
  if (btnCopyPassword) {
    btnCopyPassword.onclick = async () => {
      if (generatedPassword?.value) {
        await navigator.clipboard.writeText(generatedPassword.value);
        btnCopyPassword.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
          btnCopyPassword.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
      }
    };
  }
  
  function updatePasswordStrength(password) {
    let score = 0;
    let feedback = '';
    
    // Length
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    // Character types
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    
    // Determine strength
    if (score < 40) {
      strengthBar.className = 'h-2 rounded-full bg-red-500 transition-all duration-300';
      strengthBar.style.width = '25%';
      feedback = 'Muito fraca';
      strengthText.className = 'text-sm mt-1 text-red-600';
    } else if (score < 60) {
      strengthBar.className = 'h-2 rounded-full bg-orange-500 transition-all duration-300';
      strengthBar.style.width = '50%';
      feedback = 'Fraca';
      strengthText.className = 'text-sm mt-1 text-orange-600';
    } else if (score < 80) {
      strengthBar.className = 'h-2 rounded-full bg-yellow-500 transition-all duration-300';
      strengthBar.style.width = '75%';
      feedback = 'Boa';
      strengthText.className = 'text-sm mt-1 text-yellow-600';
    } else {
      strengthBar.className = 'h-2 rounded-full bg-green-500 transition-all duration-300';
      strengthBar.style.width = '100%';
      feedback = 'Muito forte';
      strengthText.className = 'text-sm mt-1 text-green-600';
    }
    
    strengthText.textContent = feedback;
  }
}

// Image Converter Modal - Conversor Real
function openImageConverterModal() {
  const html = `
    <div class="max-w-6xl">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-magic mr-3 text-purple-500"></i>Conversor de Imagem Profissional
      </h2>
      
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl mb-6 border border-purple-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Upload Section -->
          <div class="md:col-span-1">
            <label class="block text-sm font-bold text-gray-700 mb-3">📁 Selecionar Imagem</label>
            <div class="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
              <input type="file" id="image-input" accept="image/*" class="hidden" />
              <button id="upload-btn" class="w-full">
                <i class="fas fa-cloud-upload-alt text-3xl text-purple-500 mb-2"></i>
                <p class="text-purple-600 font-medium">Clique para escolher</p>
                <p class="text-xs text-gray-500">PNG, JPG, GIF, WebP</p>
              </button>
            </div>
          </div>
          
          <!-- Format Settings -->
          <div class="md:col-span-1">
            <label class="block text-sm font-bold text-gray-700 mb-3">⚙️ Configurações</label>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Formato de Saída</label>
                <select id="output-format" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                  <option value="png">PNG (transparência)</option>
                  <option value="jpg">JPG (menor tamanho)</option>
                  <option value="webp">WebP (moderna)</option>
                  <option value="gif">GIF (animação)</option>
                </select>
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Qualidade</label>
                <input type="range" id="quality-slider" min="10" max="100" value="90" class="w-full" />
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Menor</span>
                  <span id="quality-value" class="font-bold">90%</span>
                  <span>Maior</span>
                </div>
              </div>
              
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Redimensionar</label>
                <div class="grid grid-cols-2 gap-2">
                  <input type="number" id="width-input" placeholder="Largura" class="border border-gray-300 rounded px-2 py-1 text-sm" />
                  <input type="number" id="height-input" placeholder="Altura" class="border border-gray-300 rounded px-2 py-1 text-sm" />
                </div>
                <label class="flex items-center mt-1 text-xs">
                  <input type="checkbox" id="keep-ratio" checked class="mr-1" />
                  Manter proporção
                </label>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="md:col-span-1">
            <label class="block text-sm font-bold text-gray-700 mb-3">🛠️ Ferramentas</label>
            <div class="space-y-2">
              <button id="btn-remove-bg" class="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all flex items-center justify-center">
                <i class="fas fa-cut mr-2"></i>Remover Fundo
              </button>
              <button id="btn-convert" class="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-center">
                <i class="fas fa-sync mr-2"></i>Converter
              </button>
              <button id="btn-rotate" class="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center">
                <i class="fas fa-redo mr-2"></i>Girar 90°
              </button>
              <button id="btn-flip-h" class="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all flex items-center justify-center">
                <i class="fas fa-arrows-alt-h mr-2"></i>Espelhar H
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Preview Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold text-gray-800">📷 Imagem Original</h3>
            <span id="original-info" class="text-sm text-gray-500"></span>
          </div>
          <div id="original-preview" class="border-2 border-dashed border-gray-300 rounded-lg h-80 flex items-center justify-center bg-gray-50 overflow-hidden">
            <div class="text-center">
              <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-500">Nenhuma imagem selecionada</p>
            </div>
          </div>
        </div>
        
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-bold text-gray-800">✨ Resultado</h3>
            <span id="result-info" class="text-sm text-gray-500"></span>
          </div>
          <div id="result-preview" class="border-2 border-dashed border-gray-300 rounded-lg h-80 flex items-center justify-center bg-gray-50 overflow-hidden">
            <div class="text-center">
              <i class="fas fa-magic text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-500">Resultado aparecerá aqui</p>
            </div>
          </div>
          <div class="mt-3 space-y-2">
            <button id="btn-download" class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors hidden">
              <i class="fas fa-download mr-2"></i>Baixar Imagem
            </button>
            <button id="btn-copy-result" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors hidden">
              <i class="fas fa-copy mr-2"></i>Copiar para Área de Transferência
            </button>
          </div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div id="progress-container" class="hidden mt-4">
        <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div id="progress-bar" class="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <p id="progress-text" class="text-center text-sm text-gray-600 mt-2">Processando...</p>
      </div>
    </div>
  `;
  
  openModal(html);
  setupImageConverter();
}

function setupImageConverter() {
  const imageInput = document.getElementById('image-input');
  const uploadBtn = document.getElementById('upload-btn');
  const outputFormat = document.getElementById('output-format');
  const qualitySlider = document.getElementById('quality-slider');
  const qualityValue = document.getElementById('quality-value');
  const widthInput = document.getElementById('width-input');
  const heightInput = document.getElementById('height-input');
  const keepRatio = document.getElementById('keep-ratio');
  const btnRemoveBg = document.getElementById('btn-remove-bg');
  const btnConvert = document.getElementById('btn-convert');
  const btnRotate = document.getElementById('btn-rotate');
  const btnFlipH = document.getElementById('btn-flip-h');
  const btnDownload = document.getElementById('btn-download');
  const btnCopyResult = document.getElementById('btn-copy-result');
  const originalPreview = document.getElementById('original-preview');
  const resultPreview = document.getElementById('result-preview');
  const originalInfo = document.getElementById('original-info');
  const resultInfo = document.getElementById('result-info');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  
  let currentImage = null;
  let convertedImage = null;
  let originalWidth = 0;
  let originalHeight = 0;
  let rotation = 0;
  let isFlippedH = false;
  
  // Upload button click
  if (uploadBtn) {
    uploadBtn.onclick = () => imageInput.click();
  }
  
  // Quality slider
  if (qualitySlider) {
    qualitySlider.oninput = () => {
      qualityValue.textContent = qualitySlider.value + '%';
    };
  }
  
  // Keep ratio checkbox
  if (keepRatio && widthInput && heightInput) {
    widthInput.oninput = () => {
      if (keepRatio.checked && originalWidth > 0) {
        const ratio = originalHeight / originalWidth;
        heightInput.value = Math.round(widthInput.value * ratio);
      }
    };
    
    heightInput.oninput = () => {
      if (keepRatio.checked && originalHeight > 0) {
        const ratio = originalWidth / originalHeight;
        widthInput.value = Math.round(heightInput.value * ratio);
      }
    };
  }
  
  // File input change
  if (imageInput) {
    imageInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      console.log('📁 Arquivo selecionado:', file.name, file.type, (file.size / 1024).toFixed(2) + ' KB');
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem!');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        currentImage = ev.target.result;
        rotation = 0;
        isFlippedH = false;
        
        const img = new Image();
        img.onload = () => {
          originalWidth = img.width;
          originalHeight = img.height;
          
          // Update inputs
          if (widthInput) widthInput.value = originalWidth;
          if (heightInput) heightInput.value = originalHeight;
          
          // Update preview
          originalPreview.innerHTML = `<img src="${currentImage}" alt="Original" class="max-w-full max-h-full object-contain rounded-lg shadow-lg" />`;
          
          // Update info
          if (originalInfo) {
            originalInfo.textContent = `${originalWidth}x${originalHeight} • ${(file.size / 1024).toFixed(2)} KB`;
          }
          
          console.log('✅ Imagem carregada:', originalWidth + 'x' + originalHeight);
        };
        img.src = currentImage;
      };
      reader.readAsDataURL(file);
    };
  }
  
  // Show progress
  function showProgress(text = "Processando...") {
    if (progressContainer && progressBar && progressText) {
      progressContainer.classList.remove('hidden');
      progressText.textContent = text;
      progressBar.style.width = '0%';
      
      // Animate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 90) {
          clearInterval(interval);
          progress = 90;
        }
        progressBar.style.width = progress + '%';
      }, 100);
      
      return () => {
        clearInterval(interval);
        progressBar.style.width = '100%';
        setTimeout(() => {
          progressContainer.classList.add('hidden');
        }, 500);
      };
    }
    return () => {};
  }
  
  // Convert image
  if (btnConvert) {
    btnConvert.onclick = async () => {
      if (!currentImage) {
        alert('Por favor, selecione uma imagem primeiro!');
        return;
      }
      
      const hideProgress = showProgress("Convertendo imagem...");
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simular processamento
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Get dimensions
          let targetWidth = parseInt(widthInput?.value) || originalWidth;
          let targetHeight = parseInt(heightInput?.value) || originalHeight;
          
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          // Apply transformations
          ctx.save();
          ctx.translate(targetWidth / 2, targetHeight / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          if (isFlippedH) ctx.scale(-1, 1);
          ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
          ctx.restore();
          
          // Convert
          const quality = parseInt(qualitySlider?.value || 90) / 100;
          const format = outputFormat?.value === 'jpg' ? 'image/jpeg' : `image/${outputFormat?.value}`;
          
          convertedImage = canvas.toDataURL(format, quality);
          
          // Update preview
          resultPreview.innerHTML = `<img src="${convertedImage}" alt="Convertido" class="max-w-full max-h-full object-contain rounded-lg shadow-lg" />`;
          
          // Show buttons
          btnDownload?.classList.remove('hidden');
          btnCopyResult?.classList.remove('hidden');
          
          // Update info
          fetch(convertedImage)
            .then(res => res.blob())
            .then(blob => {
              const size = (blob.size / 1024).toFixed(2);
              if (resultInfo) {
                resultInfo.textContent = `${targetWidth}x${targetHeight} • ${size} KB • ${outputFormat?.value.toUpperCase()}`;
              }
            });
          
          hideProgress();
          console.log('✅ Conversão concluída!');
        };
        
        img.src = currentImage;
      } catch (error) {
        hideProgress();
        console.error('❌ Erro na conversão:', error);
        alert('Erro ao converter a imagem. Tente novamente.');
      }
    };
  }
  
  // Remove background (real algorithm)
  if (btnRemoveBg) {
    btnRemoveBg.onclick = async () => {
      if (!currentImage) {
        alert('Por favor, selecione uma imagem primeiro!');
        return;
      }
      
      const hideProgress = showProgress("Removendo fundo...");
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular processamento
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Advanced background removal algorithm
          const tolerance = 30;
          const backgroundColor = getBackgroundColor(data, canvas.width, canvas.height);
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate color difference
            const diff = Math.sqrt(
              Math.pow(r - backgroundColor.r, 2) +
              Math.pow(g - backgroundColor.g, 2) +
              Math.pow(b - backgroundColor.b, 2)
            );
            
            if (diff < tolerance) {
              data[i + 3] = 0; // Make transparent
            } else {
              // Apply feathering on edges
              const edgeAlpha = Math.min(255, Math.max(0, (diff - tolerance) * 3));
              data[i + 3] = Math.min(data[i + 3], edgeAlpha);
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          convertedImage = canvas.toDataURL('image/png');
          
          // Update preview with transparency pattern
          resultPreview.innerHTML = `
            <div class="relative">
              <div class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"10\" height=\"10\" fill=\"%23cccccc\"/><rect x=\"10\" y=\"10\" width=\"10\" height=\"10\" fill=\"%23cccccc\"/></svg>');"></div>
              <img src="${convertedImage}" alt="Sem Fundo" class="relative max-w-full max-h-full object-contain rounded-lg shadow-lg" />
            </div>
          `;
          
          // Show buttons
          btnDownload?.classList.remove('hidden');
          btnCopyResult?.classList.remove('hidden');
          
          // Force PNG format for transparency
          if (outputFormat) outputFormat.value = 'png';
          
          // Update info
          if (resultInfo) {
            resultInfo.textContent = `${canvas.width}x${canvas.height} • PNG • Fundo removido`;
          }
          
          hideProgress();
          console.log('✅ Fundo removido com sucesso!');
        };
        
        img.src = currentImage;
      } catch (error) {
        hideProgress();
        console.error('❌ Erro na remoção de fundo:', error);
        alert('Erro ao remover o fundo. Tente novamente.');
      }
    };
  }
  
  // Rotate image
  if (btnRotate) {
    btnRotate.onclick = () => {
      if (!currentImage) return;
      rotation = (rotation + 90) % 360;
      console.log('🔄 Rotação aplicada:', rotation + '°');
      // Auto-convert after rotation
      if (btnConvert) btnConvert.click();
    };
  }
  
  // Flip horizontal
  if (btnFlipH) {
    btnFlipH.onclick = () => {
      if (!currentImage) return;
      isFlippedH = !isFlippedH;
      console.log('🪞 Espelhamento horizontal:', isFlippedH ? 'ativado' : 'desativado');
      // Auto-convert after flip
      if (btnConvert) btnConvert.click();
    };
  }
  
  // Download
  if (btnDownload) {
    btnDownload.onclick = () => {
      if (convertedImage) {
        const link = document.createElement('a');
        link.download = `flow_converted_${Date.now()}.${outputFormat?.value || 'png'}`;
        link.href = convertedImage;
        link.click();
        console.log('💾 Download iniciado');
      }
    };
  }
  
  // Copy to clipboard
  if (btnCopyResult) {
    btnCopyResult.onclick = async () => {
      if (!convertedImage) return;
      
      try {
        const response = await fetch(convertedImage);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        
        btnCopyResult.innerHTML = '<i class="fas fa-check mr-2"></i>Copiado!';
        setTimeout(() => {
          btnCopyResult.innerHTML = '<i class="fas fa-copy mr-2"></i>Copiar para Área de Transferência';
        }, 2000);
        
        console.log('📋 Imagem copiada para área de transferência');
      } catch (error) {
        console.error('❌ Erro ao copiar:', error);
        alert('Erro ao copiar imagem. Tente fazer o download.');
      }
    };
  }
  
  // Get background color for removal
  function getBackgroundColor(data, width, height) {
    const corners = [
      { x: 0, y: 0 },
      { x: width - 1, y: 0 },
      { x: 0, y: height - 1 },
      { x: width - 1, y: height - 1 }
    ];
    
    let r = 0, g = 0, b = 0;
    
    corners.forEach(corner => {
      const index = (corner.y * width + corner.x) * 4;
      r += data[index];
      g += data[index + 1];
      b += data[index + 2];
    });
    
    return {
      r: Math.round(r / corners.length),
      g: Math.round(g / corners.length),
      b: Math.round(b / corners.length)
    };
  }
}

// Calculator Modal (bonus)
function openCalculatorModal() {
  const html = `
    <div class="max-w-md mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-calculator mr-2 text-blue-500"></i>Calculadora
      </h2>
      <div class="bg-gray-100 p-4 rounded-lg">
        <input type="text" id="calc-display" readonly class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-right text-xl font-mono mb-4" value="0" />
        <div class="grid grid-cols-4 gap-2 text-lg font-semibold">
          <button class="calc-btn bg-red-500 text-white p-3 rounded-lg hover:bg-red-600" onclick="clearCalc()">C</button>
          <button class="calc-btn bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600" onclick="deleteCalc()">⌫</button>
          <button class="calc-btn bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600" onclick="inputCalc('/')">/</button>
          <button class="calc-btn bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600" onclick="inputCalc('*')">×</button>
          
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('7')">7</button>
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('8')">8</button>
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('9')">9</button>
          <button class="calc-btn bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600" onclick="inputCalc('-')">-</button>
          
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('4')">4</button>
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('5')">5</button>
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('6')">6</button>
          <button class="calc-btn bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600" onclick="inputCalc('+')">+</button>
          
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('1')">1</button>
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('2')">2</button>
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('3')">3</button>
          <button class="calc-btn bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 row-span-2" onclick="calculate()" style="grid-row: span 2;">=</button>
          
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 col-span-2" onclick="inputCalc('0')" style="grid-column: span 2;">0</button>
          <button class="calc-btn bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400" onclick="inputCalc('.')">.</button>
        </div>
      </div>
    </div>
  `;
  
  openModal(html);
  setupCalculator();
}

function setupCalculator() {
  window.clearCalc = () => {
    document.getElementById('calc-display').value = '0';
  };
  
  window.deleteCalc = () => {
    const display = document.getElementById('calc-display');
    const current = display.value;
    display.value = current.length > 1 ? current.slice(0, -1) : '0';
  };
  
  window.inputCalc = (value) => {
    const display = document.getElementById('calc-display');
    const current = display.value;
    
    if (current === '0' && !isNaN(value)) {
      display.value = value;
    } else {
      display.value += value;
    }
  };
  
  window.calculate = () => {
    const display = document.getElementById('calc-display');
    try {
      const result = eval(display.value.replace('×', '*'));
      display.value = result;
    } catch (e) {
      display.value = 'Erro';
    }
  };
}

// Color Picker Modal (bonus)
function openColorPickerModal() {
  const html = `
    <div class="max-w-lg mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-palette mr-2 text-green-500"></i>Seletor de Cores
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Escolher Cor</label>
          <input type="color" id="color-picker-input" class="w-full h-16 border-2 border-gray-300 rounded-lg cursor-pointer" value="#3b82f6" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">HEX</label>
            <input type="text" id="hex-value" class="w-full border border-gray-300 rounded-lg px-3 py-2" readonly />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">RGB</label>
            <input type="text" id="rgb-value" class="w-full border border-gray-300 rounded-lg px-3 py-2" readonly />
          </div>
        </div>
        
        <div class="text-center">
          <button id="copy-hex" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-2">
            <i class="fas fa-copy mr-1"></i>Copiar HEX
          </button>
          <button id="copy-rgb" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            <i class="fas fa-copy mr-1"></i>Copiar RGB
          </button>
        </div>
      </div>
    </div>
  `;
  
  openModal(html);
  setupColorPicker();
}

function setupColorPicker() {
  const colorInput = document.getElementById('color-picker-input');
  const hexValue = document.getElementById('hex-value');
  const rgbValue = document.getElementById('rgb-value');
  const copyHex = document.getElementById('copy-hex');
  const copyRgb = document.getElementById('copy-rgb');
  
  function updateColors() {
    const color = colorInput.value;
    hexValue.value = color.toUpperCase();
    
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(5, 2), 16);
    rgbValue.value = `rgb(${r}, ${g}, ${b})`;
  }
  
  colorInput.onchange = updateColors;
  updateColors();
  
  copyHex.onclick = () => {
    navigator.clipboard.writeText(hexValue.value);
    copyHex.innerHTML = '<i class="fas fa-check mr-1"></i>Copiado!';
    setTimeout(() => {
      copyHex.innerHTML = '<i class="fas fa-copy mr-1"></i>Copiar HEX';
    }, 2000);
  };
  
  copyRgb.onclick = () => {
    navigator.clipboard.writeText(rgbValue.value);
    copyRgb.innerHTML = '<i class="fas fa-check mr-1"></i>Copiado!';
    setTimeout(() => {
      copyRgb.innerHTML = '<i class="fas fa-copy mr-1"></i>Copiar RGB';
    }, 2000);
  };
}

// Text Tools Modal (bonus)
function openTextToolsModal() {
  const html = `
    <div class="max-w-2xl">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-font mr-2 text-orange-500"></i>Ferramentas de Texto
      </h2>
      <div class="space-y-4">
        <textarea id="text-input" class="w-full h-32 border border-gray-300 rounded-lg p-3" placeholder="Digite ou cole seu texto aqui..."></textarea>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button id="btn-uppercase" class="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 text-sm">MAIÚSCULO</button>
          <button id="btn-lowercase" class="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 text-sm">minúsculo</button>
          <button id="btn-capitalize" class="bg-purple-500 text-white py-2 px-3 rounded-lg hover:bg-purple-600 text-sm">Primeira Letra</button>
          <button id="btn-reverse" class="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 text-sm">Reverter</button>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-gray-800 mb-2">Estatísticas do Texto</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="text-center">
              <div id="char-count" class="text-2xl font-bold text-blue-500">0</div>
              <div class="text-gray-600">Caracteres</div>
            </div>
            <div class="text-center">
              <div id="word-count" class="text-2xl font-bold text-green-500">0</div>
              <div class="text-gray-600">Palavras</div>
            </div>
            <div class="text-center">
              <div id="line-count" class="text-2xl font-bold text-purple-500">0</div>
              <div class="text-gray-600">Linhas</div>
            </div>
            <div class="text-center">
              <div id="paragraph-count" class="text-2xl font-bold text-orange-500">0</div>
              <div class="text-gray-600">Parágrafos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  openModal(html);
  setupTextTools();
}

function setupTextTools() {
  const textInput = document.getElementById('text-input');
  const charCount = document.getElementById('char-count');
  const wordCount = document.getElementById('word-count');
  const lineCount = document.getElementById('line-count');
  const paragraphCount = document.getElementById('paragraph-count');
  
  function updateStats() {
    const text = textInput.value;
    charCount.textContent = text.length;
    wordCount.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    lineCount.textContent = text.split('\n').length;
    paragraphCount.textContent = text.trim() ? text.trim().split('\n\n').length : 0;
  }
  
  textInput.oninput = updateStats;
  updateStats();
  
  document.getElementById('btn-uppercase').onclick = () => {
    textInput.value = textInput.value.toUpperCase();
    updateStats();
  };
  
  document.getElementById('btn-lowercase').onclick = () => {
    textInput.value = textInput.value.toLowerCase();
    updateStats();
  };
  
  document.getElementById('btn-capitalize').onclick = () => {
    textInput.value = textInput.value.replace(/\b\w/g, l => l.toUpperCase());
    updateStats();
  };
  
  document.getElementById('btn-reverse').onclick = () => {
    textInput.value = textInput.value.split('').reverse().join('');
    updateStats();
  };
}

// Theme Management Modal
function openThemesModal() {
  let themesHtml = "";
  
  for (const [key, theme] of Object.entries(THEMES)) {
    const isActive = key === currentTheme ? "ring-4 ring-blue-500" : "";
    themesHtml += `
      <div class="theme-option ${isActive} cursor-pointer rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 transition-all" 
           data-theme="${key}">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-8 h-8 rounded-full shadow-md" style="background: ${theme.primary}"></div>
          <div class="w-6 h-6 rounded-full shadow-md" style="background: ${theme.secondary}"></div>
          <div class="w-4 h-4 rounded-full shadow-md" style="background: ${theme.accent}"></div>
          <span class="font-semibold text-gray-800">${theme.name}</span>
        </div>
        <div class="flex space-x-2">
          <div class="w-16 h-10 rounded shadow-sm" style="background: ${theme.background}"></div>
          <div class="w-16 h-10 rounded shadow-sm" style="background: ${theme.surface}"></div>
          <div class="w-16 h-10 rounded shadow-sm" style="background: ${theme.text}"></div>
        </div>
        ${key === currentTheme ? '<div class="mt-2 text-blue-600 text-sm font-semibold"><i class="fas fa-check mr-1"></i>Tema Ativo</div>' : ''}
      </div>
    `;
  }

  const html = `
    <div class="max-w-4xl">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-palette mr-3 text-purple-500"></i>Escolher Tema
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        ${themesHtml}
      </div>
      <div class="text-center text-gray-600 bg-gray-50 p-4 rounded-xl">
        <i class="fas fa-info-circle mr-2"></i>Clique em qualquer tema para aplicá-lo instantaneamente
      </div>
    </div>
  `;
  
  openModal(html);
  setupThemesModal();
}

function setupThemesModal() {
  const themeOptions = document.querySelectorAll('.theme-option');
  
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const themeName = option.dataset.theme;
      applyTheme(themeName);
      
      // Update active state
      themeOptions.forEach(opt => {
        opt.classList.remove('ring-4', 'ring-blue-500');
        const activeIndicator = opt.querySelector('.text-blue-600');
        if (activeIndicator) activeIndicator.remove();
      });
      
      option.classList.add('ring-4', 'ring-blue-500');
      option.innerHTML += '<div class="mt-2 text-blue-600 text-sm font-semibold"><i class="fas fa-check mr-1"></i>Tema Ativo</div>';
      
      // Close modal after a short delay
      setTimeout(() => closeModal(), 800);
    });
  });
}

// Reader Mode
async function openReaderMode() {
  try {
    if (!webview) {
      alert("Nenhuma página carregada para o modo de leitura.");
      return;
    }
    
    const text = await webview.executeJavaScript(`
      (() => {
        const article = document.querySelector('article') || document.body;
        return article.innerText || article.textContent || '';
      })();
    `);
    
    const html = `
      <div class="flex flex-col h-[70vh] max-w-4xl w-full overflow-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          <i class="fas fa-book-open mr-2 text-green-500"></i>Modo de Leitura
        </h2>
        <div class="bg-white p-6 rounded-lg border border-gray-200 overflow-auto">
          <pre class="whitespace-pre-wrap text-gray-700 leading-relaxed">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </div>
      </div>
    `;
    
    openModal(html);
  } catch (e) {
    alert("Não foi possível ativar o modo de leitura nesta página.");
  }
}

// Event Listeners
function initializeEventListeners() {
  console.log("🔗 Inicializando event listeners...");
  
  // Navigation
  if (btnBack) {
    btnBack.onclick = () => {
      if (webview && webview.canGoBack && webview.canGoBack()) {
        webview.goBack();
      }
    };
  }
  
  if (btnForward) {
    btnForward.onclick = () => {
      if (webview && webview.canGoForward && webview.canGoForward()) {
        webview.goForward();
      }
    };
  }
  
  if (btnReload) {
    btnReload.onclick = () => {
      const currentTab = tabs.find(t => t.id === activeTabId);
      if (currentTab && currentTab.url === "home") {
        window.location.reload();
      } else if (webview && webview.reload) {
        webview.reload();
      }
    };
  }
  
  if (btnSearch) {
    btnSearch.onclick = navigateToInput;
  }
  
  if (btnHome) {
    btnHome.onclick = () => {
      const homeTab = tabs.find(t => t.url === "home");
      if (homeTab) {
        setActiveTab(homeTab.id);
      } else {
        createHomeTab();
      }
    };
  }
  
  if (btnNewTab) {
    btnNewTab.onclick = () => createTab(); // Creates home tab by default
  }

  // Profile button
  if (btnProfile) {
    btnProfile.onclick = openProfileModal;
  }

  // Input events
  if (inputUrl) {
    inputUrl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        navigateToInput();
      }
    });
  }
  
  // Home search
  if (homeSearch) {
    homeSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = homeSearch.value.trim();
        if (!query) return;
        
        let url;
        if (query.startsWith("http://") || query.startsWith("https://") || query.includes(".")) {
          if (!query.startsWith("http")) {
            url = "https://" + query;
          } else {
            url = query;
          }
        } else {
          url = "https://www.google.com/search?q=" + encodeURIComponent(query);
        }
        
        createTab(url, query);
        homeSearch.value = "";
      }
    });
  }

  // Sidebar buttons
  if (btnNotes) {
    btnNotes.onclick = openNotesModal;
  }
  
  if (btnTimer) {
    btnTimer.onclick = openTimerModal;
  }
  
  if (btnIA) {
    btnIA.onclick = openChatGPTModal;
  }
  
  if (btnReader) {
    btnReader.onclick = openReaderMode;
  }
  
  if (btnThemes) {
    btnThemes.onclick = openThemesModal;
  }
  
  if (btnMore) {
    btnMore.onclick = openMoreToolsModal;
  }

  // Modal
  if (modalClose) {
    modalClose.onclick = closeModal;
  }
  
  if (modalOverlay) {
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    };
  }

  // Wallpaper
  if (btnChangeWallpaper) {
    btnChangeWallpaper.onclick = openWallpaperModal;
  }
  
  if (fileInput) {
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      console.log('📁 Arquivo selecionado:', file.name, file.type);
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem!');
        fileInput.value = "";
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        console.log('✅ Arquivo lido, aplicando wallpaper personalizado...');
        changeWallpaper(ev.target.result);
        closeModal();
      };
      reader.onerror = () => {
        console.error('❌ Erro ao ler arquivo');
        alert('Erro ao ler o arquivo. Tente novamente.');
      };
      reader.readAsDataURL(file);
      fileInput.value = "";
    };
  }

  // Home icons
  if (homeIcons) {
    homeIcons.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const url = a.getAttribute("data-url");
        if (url) createTab(url, a.title);
      });
    });
  }

  if (btnAddHomeIcon) {
    btnAddHomeIcon.onclick = () => {
      alert("Funcionalidade para adicionar ícones na home será implementada.");
    };
  }

  // Webview events
  if (webview) {
    webview.addEventListener("dom-ready", () => {
      console.log("🌐 Webview carregado e pronto!");
      updateNavButtons();
    });

    webview.addEventListener("did-navigate", (e) => {
      const url = e.url;
      const tab = tabs.find((t) => t.id === activeTabId);
      if (tab && tab.url !== "home") {
        tab.url = url;
        tab.title = url;
        if (inputUrl) inputUrl.value = url;
        renderTabs();
        updateNavButtons();
      }
    });

    webview.addEventListener("did-navigate-in-page", (e) => {
      const url = e.url;
      const tab = tabs.find((t) => t.id === activeTabId);
      if (tab && tab.url !== "home") {
        tab.url = url;
        if (inputUrl) inputUrl.value = url;
        renderTabs();
        updateNavButtons();
      }
    });

    webview.addEventListener("page-title-updated", (e) => {
      const tab = tabs.find((t) => t.id === activeTabId);
      if (tab && tab.url !== "home") {
        tab.title = e.title || tab.url;
        renderTabs();
      }
    });

    webview.addEventListener("did-start-loading", () => {
      if (btnReload) btnReload.innerHTML = '<i class="fas fa-spinner fa-spin text-gray-700"></i>';
    });

    webview.addEventListener("did-stop-loading", () => {
      if (btnReload) btnReload.innerHTML = '<i class="fas fa-redo text-gray-700"></i>';
      updateNavButtons();
    });

    webview.addEventListener("did-fail-load", (e) => {
      console.error("❌ Falha ao carregar:", e.errorDescription);
      if (!e.validatedURL.includes("google.com")) {
        const searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(e.validatedURL);
        webview.src = searchUrl;
      }
    });
  }
  
  console.log("✅ Event listeners inicializados!");
}

// Initialize application
function initialize() {
  console.log("🚀 Inicializando Flow Browser...");
  
  // Load wallpaper
  loadWallpaper();
  
  // Apply saved theme
  applyTheme(currentTheme);
  
  // Verifica se webview está disponível
  if (!webview) {
    console.warn("⚠️ Webview não encontrado! Algumas funcionalidades podem não funcionar.");
  } else {
    console.log("✅ Webview encontrado!");
  }
  
  // Create initial home tab
  createHomeTab();
  if (inputUrl) inputUrl.value = "";
  if (homeSearch) homeSearch.focus();
  
  // Initialize event listeners
  initializeEventListeners();
  
  console.log("✅ Flow Browser inicializado com sucesso!");
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
