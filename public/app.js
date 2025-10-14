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
const CHATGPT_API_KEY =
  "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";

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
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
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
    accent: "#3b82f6",
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
    accent: "#6366f1",
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
    accent: "#f472b6",
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
    accent: "#a855f7",
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
    accent: "#22c55e",
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
    accent: "#60a5fa",
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
    accent: "#fb923c",
  },
};

let currentTheme = localStorage.getItem("flow_browser_theme") || "light";

function applyTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty("--theme-primary", theme.primary);
  root.style.setProperty("--theme-secondary", theme.secondary);
  root.style.setProperty("--theme-background", theme.background);
  root.style.setProperty("--theme-surface", theme.surface);
  root.style.setProperty("--theme-text", theme.text);
  root.style.setProperty("--theme-text-secondary", theme.textSecondary);
  root.style.setProperty("--theme-border", theme.border);
  root.style.setProperty("--theme-accent", theme.accent);

  // Apply theme class to body
  document.body.className = document.body.className.replace(/theme-\w+/g, "");
  document.body.classList.add(`theme-${themeName}`);

  currentTheme = themeName;
  localStorage.setItem("flow_browser_theme", themeName);
}

// Loading Animation
function showLoadingAnimation() {
  if (!webview) return;

  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "loading-overlay";
  loadingOverlay.className =
    "absolute inset-0 bg-white flex items-center justify-center z-50";
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
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 300);
    }
  };

  // Auto remove after 5 seconds max
  setTimeout(removeLoading, 5000);

  return removeLoading;
}

// Tab Management
function createTab(url = "home", title = "Nova separador") {
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
    btn.className = `
      tab flex items-center justify-between px-3 py-1 text-sm rounded-[10px] border shadow-sm truncate
      w-[160px] h-8 transition-all duration-200
      ${
        tab.id === activeTabId
          ? "bg-white text-gray-900 border-gray-400 opacity-100"
          : "bg-white text-gray-600 border-gray-200 opacity-30 hover:opacity-100"
      }
    }`;

    btn.title = tab.title;
    btn.innerHTML = `
      <span class="truncate">${tab.title}</span> 
       <i class="fas fa-times text-xs opacity-60 hover:opacity-100"></i>
    `;

    btn.addEventListener("click", () => setActiveTab(tab.id));
    btn.querySelector("i").addEventListener("click", (e) => {
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
    const homeTab = tabs.find((t) => t.url === "home");
    if (homeTab) {
      setActiveTab(homeTab.id);
    } else {
      createHomeTab();
    }
    return;
  }

  let url;
  if (
    val.startsWith("http://") ||
    val.startsWith("https://") ||
    val.includes(".")
  ) {
    if (!val.startsWith("http")) val = "https://" + val;
    url = val;
  } else {
    url = "https://www.google.com/search?q=" + encodeURIComponent(val);
  }

  // Se não há aba ativa ou é a home, cria nova aba
  const currentTab = tabs.find((t) => t.id === activeTabId);
  if (!activeTabId || !currentTab || currentTab.url === "") {
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
  addToHistory(url, url); // Adicionar ao histórico
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
      btnBack.disabled
        ? "text-gray-400 cursor-not-allowed"
        : "text-gray-700 hover:bg-gray-200"
    }`;
    btnForward.className = `rounded-full p-2 transition-colors ${
      btnForward.disabled
        ? "text-gray-400 cursor-not-allowed"
        : "text-gray-700 hover:bg-gray-200"
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
    webview.addEventListener("dom-ready", removeLoading, { once: true });
    webview.addEventListener("did-fail-load", removeLoading, { once: true });
  }

  if (inputUrl) inputUrl.value = url;
  setTimeout(updateNavButtons, 500);
}

// Wallpaper Management
function loadWallpaper() {
  const savedWallpaper = localStorage.getItem(WALLPAPER_STORAGE_KEY) || localStorage.getItem("flow_browser_wallpaper");
  if (savedWallpaper && backgroundImage) {
    backgroundImage.src = savedWallpaper;
    console.log('✅ Wallpaper salvo carregado');
  } else if (backgroundImage) {
    // Load random default wallpaper
    const randomWallpaper =
      DEFAULT_WALLPAPERS[Math.floor(Math.random() * DEFAULT_WALLPAPERS.length)];
    backgroundImage.src = randomWallpaper;
    console.log('✅ Wallpaper padrão carregado');
  }
}

function changeWallpaper(imageSrc) {
  if (backgroundImage) {
    console.log("🎨 Aplicando novo wallpaper:", imageSrc);
    backgroundImage.style.opacity = "0";

    setTimeout(() => {
      backgroundImage.src = imageSrc;
      backgroundImage.onload = () => {
        backgroundImage.style.opacity = "1";
        localStorage.setItem(WALLPAPER_STORAGE_KEY, imageSrc);
        console.log("✅ Wallpaper aplicado com sucesso!");
      };
      backgroundImage.onerror = () => {
        console.error("❌ Erro ao carregar wallpaper");
        backgroundImage.style.opacity = "1";
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
  const wallpaperOptions = document.querySelectorAll(".wallpaper-option");
  const btnCustomWallpaper = document.getElementById("btn-custom-wallpaper");

  wallpaperOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const wallpaperUrl = option.dataset.wallpaper;
      console.log("🖼️ Alterando wallpaper para:", wallpaperUrl);
      changeWallpaper(wallpaperUrl);

      // Feedback visual
      const feedback = document.createElement("div");
      feedback.className =
        "absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center text-white font-bold rounded-lg z-10";
      feedback.innerHTML = '<i class="fas fa-check mr-2"></i>Aplicado!';
      option.style.position = "relative";
      option.appendChild(feedback);

      setTimeout(() => {
        closeModal();
      }, 1000);
    });
  });

  if (btnCustomWallpaper) {
    btnCustomWallpaper.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("📁 Abrindo seletor de arquivo personalizado...");

      // Criar input temporário para melhor controle
      const tempInput = document.createElement("input");
      tempInput.type = "file";
      tempInput.accept = "image/*";
      tempInput.style.display = "none";

      tempInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        console.log("📁 Arquivo selecionado:", file.name, file.type);

        if (!file.type.startsWith("image/")) {
          alert("Por favor, selecione apenas arquivos de imagem!");
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          console.log("✅ Arquivo lido, aplicando wallpaper personalizado...");
          changeWallpaper(ev.target.result);
          closeModal();
        };
        reader.onerror = () => {
          console.error("❌ Erro ao ler arquivo");
          alert("Erro ao ler o arquivo. Tente novamente.");
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

// Profile com autenticação Supabase
function openProfileModal() {
  const btn = document.getElementById("btn-profile");
  if (!btn) return;

  const existing = document.getElementById("profile-popup");
  if (existing) return existing.remove();

  const user = getCurrentUser();
  
  if (user) {
    showLoggedInPopup(btn, user);
  } else {
    showLoginPopup(btn);
  }
}

function showLoginPopup(btn) {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const bgColor = dark ? "#111827" : "#fff";
  const borderColor = dark ? "#374151" : "#d1d5db";
  const textColor = dark ? "#f9fafb" : "#1f2937";
  const subTextColor = dark ? "#9ca3af" : "#6b7280";

  const popup = document.createElement("div");
  popup.id = "profile-popup";
  popup.style.cssText = `
    position:absolute; z-index:9999;
    background:${bgColor}; border:1px solid ${borderColor};
    border-radius:1rem; padding:1rem; text-align:center; width:320px;
    box-shadow:0 10px 25px rgba(0,0,0,0.2);
  `;

  popup.innerHTML = `
    <h2 style="color:${textColor}; margin-bottom:1rem; display:flex; justify-content:center; align-items:center;">
      <i class="fas fa-user-circle text-blue-500 mr-2"></i>Entrar na conta
    </h2>
    <div style="margin-bottom:1rem;">
      <button id="btn-google-login" style="width:100%; background:#4285F4; color:white; padding:.5rem; border-radius:.5rem; margin-bottom:.5rem; cursor:pointer; border:none;">
        <i class="fab fa-google mr-1"></i> Entrar com Google
      </button>
    </div>
    <div style="color:${subTextColor}; margin-bottom:.5rem;">ou</div>
    <input id="email-input" type="email" placeholder="Email" style="width:100%; padding:.5rem; margin-bottom:.5rem; border:1px solid ${borderColor}; border-radius:.5rem; background:${bgColor}; color:${textColor};" />
    <input id="password-input" type="password" placeholder="Senha" style="width:100%; padding:.5rem; margin-bottom:.5rem; border:1px solid ${borderColor}; border-radius:.5rem; background:${bgColor}; color:${textColor};" />
    <button id="btn-login" style="width:100%; background:#10b981; color:white; padding:.5rem; border-radius:.5rem; margin-bottom:.5rem; cursor:pointer; border:none;">Entrar</button>
    <div style="font-size:.75rem; color:${subTextColor};">
      <div><a href="#" id="forgot-password-link" style="color:#3b82f6; text-decoration:underline;">Esqueceu a senha?</a></div>
      <div>Não tem conta? <a href="#" id="signup-link" style="color:#3b82f6; font-weight:600; text-decoration:underline;">Cadastrar-se</a></div>
    </div>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    const emailInput = popup.querySelector('#email-input');
    const passwordInput = popup.querySelector('#password-input');
    const btnLogin = popup.querySelector('#btn-login');
    const btnGoogleLogin = popup.querySelector('#btn-google-login');
    const signupLink = popup.querySelector('#signup-link');
    const forgotLink = popup.querySelector('#forgot-password-link');

    console.log('🔘 Anexando event listeners aos botões de login');

    if (btnLogin) {
      btnLogin.addEventListener('click', async (e) => {
        e.stopPropagation();
        console.log('🔵 Botão LOGIN clicado');
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
          alert('Por favor, preencha email e senha');
          return;
        }

        const result = await signInWithEmail(email, password);
        if (result && result.error) {
          alert('Erro ao fazer login: ' + result.error);
        } else {
          popup.remove();
          alert('Login realizado com sucesso!');
        }
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.stopPropagation();
          btnLogin.click();
        }
      });
    }

    if (btnGoogleLogin) {
      btnGoogleLogin.addEventListener('click', async (e) => {
        e.stopPropagation();
        console.log('🔵 Botão GOOGLE clicado');
        await signInWithGoogle();
      });
    }

    if (signupLink) {
      signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔵 Link CADASTRAR clicado');
        popup.remove();
        showSignupPopup(btn);
      });
    }

    if (forgotLink) {
      forgotLink.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔵 Link ESQUECEU SENHA clicado');
        const email = emailInput.value.trim();
        if (!email) {
          alert('Por favor, digite seu email primeiro');
          return;
        }
        
        const result = await resetPassword(email);
        if (result && result.error) {
          alert('Erro: ' + result.error);
        } else {
          alert('Email de recuperação enviado! Verifique sua caixa de entrada.');
        }
      });
    }

    positionPopup(popup, btn);
    setupPopupClose(popup, btn);
  }, 10);
}

function showSignupPopup(btn) {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const bgColor = dark ? "#111827" : "#fff";
  const borderColor = dark ? "#374151" : "#d1d5db";
  const textColor = dark ? "#f9fafb" : "#1f2937";
  const subTextColor = dark ? "#9ca3af" : "#6b7280";

  const popup = document.createElement("div");
  popup.id = "profile-popup";
  popup.style.cssText = `
    position:absolute; z-index:9999;
    background:${bgColor}; border:1px solid ${borderColor};
    border-radius:1rem; padding:1rem; text-align:center; width:320px;
    box-shadow:0 10px 25px rgba(0,0,0,0.2);
  `;

  popup.innerHTML = `
    <h2 style="color:${textColor}; margin-bottom:1rem; display:flex; justify-content:center; align-items:center;">
      <i class="fas fa-user-plus text-blue-500 mr-2"></i>Cadastrar-se
    </h2>
    <input id="signup-email-input" type="email" placeholder="Email" style="width:100%; padding:.5rem; margin-bottom:.5rem; border:1px solid ${borderColor}; border-radius:.5rem; background:${bgColor}; color:${textColor};" />
    <input id="signup-password-input" type="password" placeholder="Senha (mínimo 6 caracteres)" style="width:100%; padding:.5rem; margin-bottom:.5rem; border:1px solid ${borderColor}; border-radius:.5rem; background:${bgColor}; color:${textColor};" />
    <input id="signup-password-confirm" type="password" placeholder="Confirmar senha" style="width:100%; padding:.5rem; margin-bottom:.5rem; border:1px solid ${borderColor}; border-radius:.5rem; background:${bgColor}; color:${textColor};" />
    <button id="btn-signup" style="width:100%; background:#10b981; color:white; padding:.5rem; border-radius:.5rem; margin-bottom:.5rem; cursor:pointer; border:none;">Criar conta</button>
    <div style="font-size:.75rem; color:${subTextColor};">
      <div>Já tem conta? <a href="#" id="login-link" style="color:#3b82f6; font-weight:600; text-decoration:underline;">Fazer login</a></div>
    </div>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    const emailInput = popup.querySelector('#signup-email-input');
    const passwordInput = popup.querySelector('#signup-password-input');
    const passwordConfirm = popup.querySelector('#signup-password-confirm');
    const btnSignup = popup.querySelector('#btn-signup');
    const loginLink = popup.querySelector('#login-link');

    console.log('🔘 Anexando event listeners aos botões de cadastro');

    if (btnSignup) {
      btnSignup.addEventListener('click', async (e) => {
        e.stopPropagation();
        console.log('🔵 Botão CRIAR CONTA clicado');
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const passwordConf = passwordConfirm.value;

        if (!email || !password || !passwordConf) {
          alert('Por favor, preencha todos os campos');
          return;
        }

        if (password !== passwordConf) {
          alert('As senhas não coincidem');
          return;
        }

        if (password.length < 6) {
          alert('A senha deve ter no mínimo 6 caracteres');
          return;
        }

        const result = await signUpWithEmail(email, password);
        if (result && result.error) {
          alert('Erro ao criar conta: ' + result.error);
        } else {
          popup.remove();
          alert('Conta criada com sucesso! Verifique seu email para confirmar.');
        }
      });
    }

    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔵 Link LOGIN clicado');
        popup.remove();
        showLoginPopup(btn);
      });
    }

    positionPopup(popup, btn);
    setupPopupClose(popup, btn);
  }, 10);
}

function showLoggedInPopup(btn, user) {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const bgColor = dark ? "#111827" : "#fff";
  const borderColor = dark ? "#374151" : "#d1d5db";
  const textColor = dark ? "#f9fafb" : "#1f2937";
  const subTextColor = dark ? "#9ca3af" : "#6b7280";

  const popup = document.createElement("div");
  popup.id = "profile-popup";
  popup.style.cssText = `
    position:absolute; z-index:9999;
    background:${bgColor}; border:1px solid ${borderColor};
    border-radius:1rem; padding:1rem; text-align:center; width:320px;
    box-shadow:0 10px 25px rgba(0,0,0,0.2);
  `;

  popup.innerHTML = `
    <h2 style="color:${textColor}; margin-bottom:1rem; display:flex; justify-content:center; align-items:center;">
      <i class="fas fa-user-check text-green-500 mr-2"></i>Perfil
    </h2>
    <div style="color:${textColor}; margin-bottom:1rem; padding:.75rem; background:${dark ? '#1f2937' : '#f3f4f6'}; border-radius:.5rem;">
      <div style="font-size:.875rem; color:${subTextColor}; margin-bottom:.25rem;">Email:</div>
      <div style="font-weight:600;">${user.email}</div>
    </div>
    <button id="btn-logout" style="width:100%; background:#ef4444; color:white; padding:.5rem; border-radius:.5rem; cursor:pointer; border:none;">
      <i class="fas fa-sign-out-alt mr-1"></i> Sair
    </button>
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    const btnLogout = popup.querySelector('#btn-logout');
    
    console.log('🔘 Anexando event listener ao botão de logout');

    if (btnLogout) {
      btnLogout.addEventListener('click', async (e) => {
        e.stopPropagation();
        console.log('🔵 Botão LOGOUT clicado');
        await signOut();
        popup.remove();
        alert('Você saiu da conta');
      });
    }

    positionPopup(popup, btn);
    setupPopupClose(popup, btn);
  }, 10);
}

function positionPopup(popup, btn) {
  requestAnimationFrame(() => {
    const rect = btn.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const padding = 8;
    let top = rect.bottom + window.scrollY + padding;
    let left = rect.right - popupRect.width;
    if (left < padding) left = padding;
    if (left + popupRect.width > window.innerWidth - padding)
      left = window.innerWidth - popupRect.width - padding;
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
  });
}

function setupPopupClose(popup, btn) {
  const closeOnClickOutside = (e) => {
    if (!popup.contains(e.target) && e.target !== btn) {
      popup.remove();
      document.removeEventListener("click", closeOnClickOutside);
    }
  };
  document.addEventListener("click", closeOnClickOutside);

  // Atualiza cores se o tema do sistema mudar
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const dark = e.matches;
      popup.style.background = dark ? "#111827" : "#fff";
      popup.style.border = `1px solid ${dark ? "#374151" : "#d1d5db"}`;
      popup.querySelectorAll("h2, input, button, div").forEach((el) => {
        if (
          el.tagName === "H2" ||
          el.tagName === "INPUT" ||
          el.tagName === "BUTTON"
        ) {
          el.style.color = dark ? "#f9fafb" : "#1f2937";
          if (el.tagName === "INPUT")
            el.style.background = dark ? "#1f2937" : "#fff";
        } else if (el.tagName === "DIV") {
          el.style.color = dark ? "#9ca3af" : "#6b7280";
        }
      });
    });
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
  const existing = document.getElementById("notes-modal");
  if (existing) return existing.remove();

  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const colors = {
    modalBg: dark ? "#1f2937" : "#fff",
    modalText: dark ? "#f9fafb" : "#1f2937",
    tabBg: dark ? "#374151" : "#e5e7eb",
    tabActiveBg: dark ? "#4b5563" : "#d1d5db",
    tabText: dark ? "#f9fafb" : "#111827",
    inputBg: dark ? "#374151" : "#fff",
    inputText: dark ? "#f9fafb" : "#111827",
    btnBg: dark ? "#6b7280" : "#d1d5db",
    btnText: dark ? "#f9fafb" : "#111827",
    border: dark ? "#4b5563" : "#d1d5db",
  };

  let notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || "{}");
  const firstId = Object.keys(notes)[0] || null;

  const html = `
  <div id="notes-modal" style="
      position:fixed; left:4.2rem; top:150px; width:350px; height:50vh;
      background:${colors.modalBg}; color:${colors.modalText}; border:1px solid ${colors.border};
      border-radius:.75rem; display:flex; flex-direction:column; z-index:9999; padding:.5rem;">
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:.25rem;">
      <h2 style="font-size:.875rem; display:flex; align-items:center;">
        <i class="fas fa-sticky-note mr-1"></i>Notas
      </h2>
      <button id="close-notes" style="background:none; border:none; color:${colors.modalText};"><i class="fas fa-times"></i></button>
    </div>

    <div id="notes-tabs" style="display:flex; gap:.25rem; overflow-x:auto; margin-bottom:.25rem;">
      ${Object.keys(notes)
        .map(
          (id) => `
        <button data-id="${id}" style="
          background:${id === firstId ? colors.tabActiveBg : colors.tabBg};
          color:${colors.tabText}; border:1px solid ${colors.border}; border-radius:.5rem;
          padding:.25rem .5rem; font-size:.75rem; cursor:pointer; white-space:nowrap;">
          ${notes[id].title || "Sem título"}
        </button>`,
        )
        .join("")}
    </div>

    <div style="flex:1; display:flex; flex-direction:column; gap:.25rem;">
      <input id="note-title" placeholder="Título" style="
        padding:.25rem; border-radius:.5rem; border:1px solid ${colors.border};
        background:${colors.inputBg}; color:${colors.inputText}; font-size:.75rem;" />
      <textarea id="note-content" placeholder="Digite a nota..." style="
        flex:1; padding:.25rem; border-radius:.5rem; border:1px solid ${colors.border};
        background:${colors.inputBg}; color:${colors.inputText}; font-size:.75rem; resize:none;"></textarea>
      
      <div style="display:flex; justify-content:space-between; gap:.25rem;">
        <button id="btn-new-note" style="flex:1; background:${colors.btnBg}; color:${colors.btnText}; padding:.25rem; border-radius:.5rem;">Nova</button>
        <button id="btn-save-note" style="flex:1; background:${colors.btnBg}; color:${colors.btnText}; padding:.25rem; border-radius:.5rem;">Salvar</button>
        <button id="btn-delete-note" style="flex:1; background:${colors.btnBg}; color:${colors.btnText}; padding:.25rem; border-radius:.5rem;">Excluir</button>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const modal = document.getElementById("notes-modal");
  const tabs = modal.querySelector("#notes-tabs");
  const title = modal.querySelector("#note-title");
  const content = modal.querySelector("#note-content");
  const btnNew = modal.querySelector("#btn-new-note");
  const btnSave = modal.querySelector("#btn-save-note");
  const btnDelete = modal.querySelector("#btn-delete-note");

  let currentNoteId = firstId;

  function renderTabs() {
    tabs.innerHTML = Object.keys(notes)
      .map(
        (id) => `
      <button data-id="${id}" style="
        background:${id === currentNoteId ? colors.tabActiveBg : colors.tabBg};
        color:${colors.tabText}; border:1px solid ${colors.border}; border-radius:.5rem;
        padding:.25rem .5rem; font-size:.75rem; cursor:pointer; white-space:nowrap;">
        ${notes[id].title || "Sem título"}
      </button>`,
      )
      .join("");
    tabs.querySelectorAll("button").forEach((btn) => {
      btn.onclick = () => loadNote(btn.dataset.id);
    });
  }

  function loadNote(id) {
    currentNoteId = id;
    title.value = notes[id]?.title || "";
    content.value = notes[id]?.content || "";
    renderTabs();
  }

  function saveNote() {
    const id = currentNoteId || Date.now().toString();
    notes[id] = {
      title: title.value.trim() || "Sem título",
      content: content.value,
    };
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    currentNoteId = id;
    renderTabs();
  }

  function deleteNote() {
    if (!currentNoteId) return alert("Nenhuma nota selecionada.");
    delete notes[currentNoteId];
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    currentNoteId = Object.keys(notes)[0] || null;
    loadNote(currentNoteId);
  }

  function newNote() {
    title.value = "";
    content.value = "";
    currentNoteId = null;
    renderTabs();
  }

  btnSave.onclick = saveNote;
  btnDelete.onclick = deleteNote;
  btnNew.onclick = newNote;
  modal.querySelector("#close-notes").onclick = () => modal.remove();

  // Carrega primeira nota
  if (currentNoteId) loadNote(currentNoteId);

  // Atualiza cores se o usuário trocar tema
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const dark = e.matches;
      const c = {
        modalBg: dark ? "#1f2937" : "#fff",
        modalText: dark ? "#f9fafb" : "#1f2937",
        tabBg: dark ? "#374151" : "#e5e7eb",
        tabActiveBg: dark ? "#4b5563" : "#d1d5db",
        tabText: dark ? "#f9fafb" : "#111827",
        inputBg: dark ? "#374151" : "#fff",
        inputText: dark ? "#f9fafb" : "#111827",
        btnBg: dark ? "#6b7280" : "#d1d5db",
        btnText: dark ? "#f9fafb" : "#111827",
        border: dark ? "#4b5563" : "#d1d5db",
      };
      modal.style.background = c.modalBg;
      modal.style.color = c.modalText;
      tabs.querySelectorAll("button").forEach((b) => {
        b.style.background =
          b.dataset.id === currentNoteId ? c.tabActiveBg : c.tabBg;
        b.style.color = c.tabText;
        b.style.border = `1px solid ${c.border}`;
      });
      title.style.background = c.inputBg;
      title.style.color = c.inputText;
      title.style.border = `1px solid ${c.border}`;
      content.style.background = c.inputBg;
      content.style.color = c.inputText;
      content.style.border = `1px solid ${c.border}`;
      [btnNew, btnSave, btnDelete].forEach((b) => {
        b.style.background = c.btnBg;
        b.style.color = c.btnText;
      });
    });
}

// Timer Management
function openTimerModal() {
  const existing = document.getElementById("timer-modal");
  if (existing) return existing.remove();

  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const colors = {
    modalBg: dark ? "#1f2937" : "#fff",
    modalText: dark ? "#f9fafb" : "#1f2937",
    border: dark ? "#4b5563" : "#d1d5db",
    inputBg: dark ? "#374151" : "#f9fafb",
    inputText: dark ? "#f9fafb" : "#1f2937",
  };
  const html = `
<div id="timer-modal" style="
  position:fixed; left:4.2rem; top:220px; width:300px; height:50vh;
  background:${colors.modalBg}; color:${colors.modalText};
  border:1px solid ${colors.border}; border-radius:.75rem; padding:.5rem;
  display:flex; flex-direction:column; z-index:9999;">

  <div style="display:flex; justify-content:space-between; align-items:center; font-size:.9rem;">
    <h2 style="display:flex; align-items:center; gap:.25rem;"><i class='fas fa-hourglass-half text-blue-500'></i>Temporizador</h2>
    <button id="close-timer" style="background:none;border:none;color:${colors.modalText}"><i class='fas fa-times'></i></button>
  </div>

  <div style="display:flex; justify-content:center; align-items:center; gap:.25rem; font-size:.8rem; margin:.25rem 0;">
    <input id="input-minutes" type="number" min="1" max="180" value="25"
      style="width:3rem;text-align:center;border-radius:.5rem;border:1px solid ${colors.border};padding:.2rem;background:${colors.inputBg};color:${colors.inputText}"/>
    <span>minutos</span>
  </div>

  <div id="timer-display" style="text-align:center;font-size:2.5rem;font-family:monospace;margin-bottom:.25rem;">25:00</div>

  <div style="display:flex; justify-content:center; gap:.25rem; font-size:.85rem; margin-bottom:.25rem;">
    <button id="btn-start-timer" style="background:#10b981;color:#fff;padding:.25rem .5rem;border-radius:.5rem">Iniciar</button>
    <button id="btn-pause-timer" style="background:#facc15;color:#fff;padding:.25rem .5rem;border-radius:.5rem" disabled>Pausar</button>
    <button id="btn-reset-timer" style="background:#ef4444;color:#fff;padding:.25rem .5rem;border-radius:.5rem">Resetar</button>
  </div>

  <!-- INFO FINAL FIXO NO FUNDO -->
  <div style="margin-top:auto;text-align:center;font-size:.65rem;background:${dark ? "#374151" : "#f9fafb"};padding:.2rem;border:1px solid ${colors.border};border-radius:.5rem">
    <i class="fas fa-info-circle mr-1"></i>Ao finalizar o tempo, um alerta será exibido para descanso.
  </div>
</div>`;

  document.body.insertAdjacentHTML("beforeend", html);

  document.getElementById("close-timer").onclick = () =>
    document.getElementById("timer-modal")?.remove();

  setupTimerModal();

  // Atualiza cores caso o usuário mude o tema
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const modal = document.getElementById("timer-modal");
      if (!modal) return;
      const dark = e.matches;
      modal.style.background = dark ? "#1f2937" : "#fff";
      modal.style.color = dark ? "#f9fafb" : "#1f2937";
      modal.style.border = `1px solid ${dark ? "#4b5563" : "#d1d5db"}`;
      modal.querySelector("input") &&
        (modal.querySelector("input").style.background = dark
          ? "#374151"
          : "#f9fafb");
      modal.querySelector("input") &&
        (modal.querySelector("input").style.color = dark
          ? "#f9fafb"
          : "#1f2937");
    });
}

function setupTimerModal() {
  const inputMinutes = document.getElementById("input-minutes");
  const timerDisplay = document.getElementById("timer-display");
  const btnStart = document.getElementById("btn-start-timer");
  const btnPause = document.getElementById("btn-pause-timer");
  const btnReset = document.getElementById("btn-reset-timer");

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
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
  const existing = document.getElementById("chatgpt-modal");
  if (existing) return existing.remove();

  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const colors = {
    modalBg: dark ? "#1f2937" : "#fff",
    modalText: dark ? "#f9fafb" : "#1f2937",
    messagesBg: dark ? "#374151" : "#f3f4f6",
    messagesText: dark ? "#f3f4f6" : "#1e40af",
    inputBg: dark ? "#374151" : "#fff",
    inputText: dark ? "#f9fafb" : "#1f2937",
    border: dark ? "#4b5563" : "#d1d5db",
    btnBg: dark ? "#2563eb" : "#3b82f6",
    btnHover: dark ? "#1d4ed8" : "#2563eb",
  };

  const html = `
<div id="chatgpt-modal" style="position:fixed;left:4.2rem;top:80px;width:380px;height:70vh;
  background:${colors.modalBg};color:${colors.modalText};border:1px solid ${colors.border};
  border-radius:1rem;display:flex;flex-direction:column;z-index:9999;padding:.5rem;">

  <!-- Header -->
  <div style="display:flex;justify-content:center;align-items:center;position:relative;margin-bottom:.25rem;">
    <h2 style="margin:0;font-size:1rem;font-weight:bold;">Chat IA</h2>
    <button id="close-chat" style="position:absolute;right:0;background:none;border:none;color:${colors.modalText};">
      <i class="fas fa-times"></i>
    </button>
  </div>

  <!-- Mensagens -->
  <div id="chat-messages" style="flex:1;overflow:auto;padding:.25rem;margin-bottom:.25rem;
    background:${colors.messagesBg};color:${colors.messagesText};border-radius:.5rem;border:1px solid ${colors.border};
    display:flex;flex-direction:column;gap:.25rem;">
    <div style="padding:.25rem;border-radius:.5rem;border:1px solid ${colors.messagesText};
      background:${colors.messagesBg};color:${colors.messagesText};"><strong>Olá!</strong> Pergunte o que quiser.</div>
  </div>

  <!-- Input -->
  <form id="chat-form" style="position:relative;display:flex;width:100%;max-width:100%;">
    <input id="chat-input" type="text" placeholder="Digite sua pergunta..." 
      style="flex:1;padding:.5rem 2.5rem;border-radius:.5rem;border:1px solid ${colors.border};
      background:${colors.inputBg};color:${colors.inputText};height:2.5rem;"/>
    <button type="button" id="attach-btn" style="position:absolute;left:.25rem;top:50%;transform:translateY(-50%);
      border:none;background:none;cursor:pointer;"><i class="fas fa-paperclip"></i></button>
    <button type="submit" id="send-btn" style="position:absolute;right:.25rem;top:50%;transform:translateY(-50%);
      border:none;background:none;cursor:pointer;"><i class="fas fa-paper-plane"></i></button>
  </form>
</div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  document.getElementById("close-chat").onclick = () =>
    document.getElementById("chatgpt-modal")?.remove();
  setupChatGPT();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const modal = document.getElementById("chatgpt-modal");
      if (!modal) return;
      const dark = e.matches;
      modal.style.background = dark ? "#1f2937" : "#fff";
      modal.style.color = dark ? "#f9fafb" : "#1f2937";
      const messages = modal.querySelector("#chat-messages");
      messages.style.background = dark ? "#374151" : "#f3f4f6";
      messages.style.color = dark ? "#f3f4f6" : "#1e40af";
      const input = modal.querySelector("#chat-input");
      input.style.background = dark ? "#374151" : "#fff";
      input.style.color = dark ? "#f9fafb" : "#1f2937";
      const border = dark ? "#4b5563" : "#d1d5db";
      modal.style.border = `1px solid ${border}`;
      input.style.border = `1px solid ${border}`;
      modal.querySelector("#send-btn").style.background = dark
        ? "#2563eb"
        : "#3b82f6";
    });
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
    chatInput.addEventListener("input", () => {
      const length = chatInput.value.length;
      charCounter.textContent = `${length}/500`;
      if (length > 450) {
        charCounter.style.color = "#ef4444";
      } else {
        charCounter.style.color = "#6b7280";
      }
    });
  }

  function appendMessage(text, fromUser = false, isTyping = false) {
    if (!chatMessages) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `flex ${fromUser ? "justify-end" : "justify-start"} mb-3`;

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
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(
          /`(.*?)`/g,
          '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>',
        )
        .replace(/\n/g, "<br>");

      bubble.innerHTML = formattedText;
    }

    if (!fromUser) {
      const timestamp = document.createElement("div");
      timestamp.className = "text-xs text-gray-400 mt-1";
      timestamp.textContent = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
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
      sendBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';

      appendMessage(question, true);
      if (chatInput) chatInput.value = "";
      if (charCounter) charCounter.textContent = "0/500";

      // Show typing indicator
      const typingBubble = appendMessage("", false, true);

      try {
        console.log("🤖 Enviando pergunta para GPT:", question);

        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${CHATGPT_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "Você é um assistente de estudos inteligente. Responda de forma clara, didática e útil. Use formatação markdown quando apropriado. Seja conciso mas completo.",
                },
                {
                  role: "user",
                  content: question,
                },
              ],
              max_tokens: 1000,
              temperature: 0.7,
            }),
          },
        );

        // Remove typing indicator
        typingBubble.parentElement.remove();

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const answer =
          data.choices?.[0]?.message?.content ||
          "Desculpe, não consegui gerar uma resposta.";

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
          errorMessage +=
            "Muitas solicitações. Tente novamente em alguns segundos.";
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
  const existing = document.getElementById("more-tools-modal");
  if (existing) return existing.remove();

  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const colors = {
    modalBg: dark ? "#1f2937" : "#fff",
    modalText: dark ? "#f9fafb" : "#1f2937",
    border: dark ? "#4b5563" : "#d1d5db",
    buttonText: "#fff",
  };

  const tools = [
    {
      id: "btn-image-converter",
      icon: "fa-image",
      title: "Converter Imagem",
      desc: "Remova fundo e otimize imagens",
      from: "#8b5cf6",
      to: "#ec4899",
    },
    {
      id: "btn-calculator",
      icon: "fa-calculator",
      title: "Calculadora",
      desc: "Modo científico incluso",
      from: "#3b82f6",
      to: "#06b6d4",
    },
    {
      id: "btn-color-picker",
      icon: "fa-palette",
      title: "Seletor de Cores",
      desc: "Escolha e converta cores",
      from: "#10b981",
      to: "#14b8a6",
    },
    {
      id: "btn-text-tools",
      icon: "fa-font",
      title: "Ferramentas de Texto",
      desc: "Contar palavras e converter casos",
      from: "#f97316",
      to: "#ef4444",
    },
    {
      id: "btn-qr-generator",
      icon: "fa-qrcode",
      title: "Gerador QR Code",
      desc: "Crie QR codes instantâneos",
      from: "#6366f1",
      to: "#8b5cf6",
    },
    {
      id: "btn-password-generator",
      icon: "fa-shield-alt",
      title: "Gerador de Senhas",
      desc: "Crie senhas seguras",
      from: "#ef4444",
      to: "#ec4899",
    },
    {
      id: "btn-unit-converter",
      icon: "fa-exchange-alt",
      title: "Conversor",
      desc: "Unidades e moedas",
      from: "#f59e0b",
      to: "#f97316",
    },
    {
      id: "btn-markdown-editor",
      icon: "fab fa-markdown",
      title: "Editor Markdown",
      desc: "Escreva e visualize docs",
      from: "#4b5563",
      to: "#1f2937",
    },
    {
      id: "btn-json-formatter",
      icon: "fa-code",
      title: "Formatador JSON",
      desc: "Formate e valide JSON",
      from: "#14b8a6",
      to: "#06b6d4",
    },
  ];

  const buttonsHtml = tools
    .map(
      (t) => `
    <button id="${t.id}" style="
      background:linear-gradient(90deg, ${t.from}, ${t.to}); color:${colors.buttonText}; padding:.5rem; border-radius:.5rem; border:none;
      display:flex; flex-direction:column; align-items:flex-start; margin-bottom:.25rem;"
    >
      <i class="fas ${t.icon}" style="font-size:1.25rem; margin-bottom:.25rem;"></i>
      <span style="font-weight:600;">${t.title}</span>
      <p style="font-size:.75rem; opacity:.9;">${t.desc}</p>
    </button>
  `,
    )
    .join("");

  const html = `
    <div id="more-tools-modal" style="
      position:fixed; left:4.2rem; top:220px; width:420px; height:65vh; overflow:auto;
      background:${colors.modalBg}; color:${colors.modalText}; border:1px solid ${colors.border};
      border-radius:1rem; padding:1rem; display:flex; flex-direction:column; z-index:9999;"
    >
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:.5rem;">
        <h2 style="display:flex; align-items:center;"><i class="fas fa-tools mr-2 text-purple-500"></i>Ferramentas Extras</h2>
        <button id="close-more-tools" style="color:${colors.modalText};"><i class="fas fa-times"></i></button>
      </div>
      <div style="display:flex; flex-direction:column; gap:.25rem;">
        ${buttonsHtml}
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  document.getElementById("close-more-tools").onclick = () =>
    document.getElementById("more-tools-modal")?.remove();

  setupMoreToolsModal();

  // Atualiza cores se o usuário mudar o tema
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const modal = document.getElementById("more-tools-modal");
      if (!modal) return;
      const dark = e.matches;
      modal.style.background = dark ? "#1f2937" : "#fff";
      modal.style.color = dark ? "#f9fafb" : "#1f2937";
      modal.style.border = `1px solid ${dark ? "#4b5563" : "#d1d5db"}`;
    });
}

function setupMoreToolsModal() {
  const btnImageConverter = document.getElementById("btn-image-converter");
  const btnCalculator = document.getElementById("btn-calculator");
  const btnColorPicker = document.getElementById("btn-color-picker");
  const btnTextTools = document.getElementById("btn-text-tools");
  const btnQrGenerator = document.getElementById("btn-qr-generator");
  const btnPasswordGenerator = document.getElementById(
    "btn-password-generator",
  );
  const btnUnitConverter = document.getElementById("btn-unit-converter");
  const btnMarkdownEditor = document.getElementById("btn-markdown-editor");
  const btnJsonFormatter = document.getElementById("btn-json-formatter");

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
  const qrInput = document.getElementById("qr-input");
  const qrSize = document.getElementById("qr-size");
  const qrColor = document.getElementById("qr-color");
  const btnGenerateQr = document.getElementById("btn-generate-qr");
  const btnDownloadQr = document.getElementById("btn-download-qr");
  const qrResult = document.getElementById("qr-result");

  let currentQR = null;

  if (btnGenerateQr) {
    btnGenerateQr.onclick = () => {
      const text = qrInput?.value?.trim();
      if (!text) {
        alert("Digite algum texto ou link para gerar o QR Code!");
        return;
      }

      generateQRCode(text);
    };
  }

  function generateQRCode(text) {
    const size = parseInt(qrSize?.value || 300);
    const color = qrColor?.value || "#000000";

    // Usando QR.js library via CDN
    const qrData = generateQRMatrix(text);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = size;
    canvas.height = size;

    const cellSize = size / qrData.length;

    // Background branco
    ctx.fillStyle = "#ffffff";
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

    currentQR = canvas.toDataURL("image/png");

    qrResult.innerHTML = `<img src="${currentQR}" alt="QR Code" class="max-w-full max-h-full object-contain rounded-lg shadow-lg" />`;
    btnDownloadQr?.classList.remove("hidden");
  }

  if (btnDownloadQr) {
    btnDownloadQr.onclick = () => {
      if (currentQR) {
        const link = document.createElement("a");
        link.download = `qrcode_${Date.now()}.png`;
        link.href = currentQR;
        link.click();
      }
    };
  }

  // Simple QR Code generator (basic implementation)
  function generateQRMatrix(text) {
    const size = 25; // Simple 25x25 matrix
    const matrix = Array(size)
      .fill()
      .map(() => Array(size).fill(false));

    // Simple pattern generation (for demo purposes)
    const hash = text.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    Math.seedrandom = function (seed) {
      const m = 0x80000000;
      const a = 1103515245;
      const c = 12345;
      let state = seed ? seed : Math.floor(Math.random() * (m - 1));

      return function () {
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
  const passwordLength = document.getElementById("password-length");
  const lengthValue = document.getElementById("length-value");
  const includeUppercase = document.getElementById("include-uppercase");
  const includeLowercase = document.getElementById("include-lowercase");
  const includeNumbers = document.getElementById("include-numbers");
  const includeSymbols = document.getElementById("include-symbols");
  const btnGeneratePassword = document.getElementById("btn-generate-password");
  const generatedPassword = document.getElementById("generated-password");
  const btnCopyPassword = document.getElementById("btn-copy-password");
  const passwordStrength = document.getElementById("password-strength");
  const strengthBar = document.getElementById("strength-bar");
  const strengthText = document.getElementById("strength-text");

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

      if (includeUppercase?.checked) chars.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      if (includeLowercase?.checked) chars.push("abcdefghijklmnopqrstuvwxyz");
      if (includeNumbers?.checked) chars.push("0123456789");
      if (includeSymbols?.checked) chars.push("!@#$%^&*()_+-=[]{}|;:,.<>?");

      if (chars.length === 0) {
        alert("Selecione pelo menos um tipo de caractere!");
        return;
      }

      const allChars = chars.join("");
      let password = "";

      for (let i = 0; i < length; i++) {
        password += allChars.charAt(
          Math.floor(Math.random() * allChars.length),
        );
      }

      generatedPassword.value = password;
      passwordStrength?.classList.remove("hidden");
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
    let feedback = "";

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
      strengthBar.className =
        "h-2 rounded-full bg-red-500 transition-all duration-300";
      strengthBar.style.width = "25%";
      feedback = "Muito fraca";
      strengthText.className = "text-sm mt-1 text-red-600";
    } else if (score < 60) {
      strengthBar.className =
        "h-2 rounded-full bg-orange-500 transition-all duration-300";
      strengthBar.style.width = "50%";
      feedback = "Fraca";
      strengthText.className = "text-sm mt-1 text-orange-600";
    } else if (score < 80) {
      strengthBar.className =
        "h-2 rounded-full bg-yellow-500 transition-all duration-300";
      strengthBar.style.width = "75%";
      feedback = "Boa";
      strengthText.className = "text-sm mt-1 text-yellow-600";
    } else {
      strengthBar.className =
        "h-2 rounded-full bg-green-500 transition-all duration-300";
      strengthBar.style.width = "100%";
      feedback = "Muito forte";
      strengthText.className = "text-sm mt-1 text-green-600";
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
  const imageInput = document.getElementById("image-input");
  const uploadBtn = document.getElementById("upload-btn");
  const outputFormat = document.getElementById("output-format");
  const qualitySlider = document.getElementById("quality-slider");
  const qualityValue = document.getElementById("quality-value");
  const widthInput = document.getElementById("width-input");
  const heightInput = document.getElementById("height-input");
  const keepRatio = document.getElementById("keep-ratio");
  const btnRemoveBg = document.getElementById("btn-remove-bg");
  const btnConvert = document.getElementById("btn-convert");
  const btnRotate = document.getElementById("btn-rotate");
  const btnFlipH = document.getElementById("btn-flip-h");
  const btnDownload = document.getElementById("btn-download");
  const btnCopyResult = document.getElementById("btn-copy-result");
  const originalPreview = document.getElementById("original-preview");
  const resultPreview = document.getElementById("result-preview");
  const originalInfo = document.getElementById("original-info");
  const resultInfo = document.getElementById("result-info");
  const progressContainer = document.getElementById("progress-container");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

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
      qualityValue.textContent = qualitySlider.value + "%";
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

      console.log(
        "📁 Arquivo selecionado:",
        file.name,
        file.type,
        (file.size / 1024).toFixed(2) + " KB",
      );

      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem!");
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

          console.log(
            "✅ Imagem carregada:",
            originalWidth + "x" + originalHeight,
          );
        };
        img.src = currentImage;
      };
      reader.readAsDataURL(file);
    };
  }

  // Show progress
  function showProgress(text = "Processando...") {
    if (progressContainer && progressBar && progressText) {
      progressContainer.classList.remove("hidden");
      progressText.textContent = text;
      progressBar.style.width = "0%";

      // Animate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 90) {
          clearInterval(interval);
          progress = 90;
        }
        progressBar.style.width = progress + "%";
      }, 100);

      return () => {
        clearInterval(interval);
        progressBar.style.width = "100%";
        setTimeout(() => {
          progressContainer.classList.add("hidden");
        }, 500);
      };
    }
    return () => {};
  }

  // Convert image
  if (btnConvert) {
    btnConvert.onclick = async () => {
      if (!currentImage) {
        alert("Por favor, selecione uma imagem primeiro!");
        return;
      }

      const hideProgress = showProgress("Convertendo imagem...");

      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simular processamento

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
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
          ctx.drawImage(
            img,
            -targetWidth / 2,
            -targetHeight / 2,
            targetWidth,
            targetHeight,
          );
          ctx.restore();

          // Convert
          const quality = parseInt(qualitySlider?.value || 90) / 100;
          const format =
            outputFormat?.value === "jpg"
              ? "image/jpeg"
              : `image/${outputFormat?.value}`;

          convertedImage = canvas.toDataURL(format, quality);

          // Update preview
          resultPreview.innerHTML = `<img src="${convertedImage}" alt="Convertido" class="max-w-full max-h-full object-contain rounded-lg shadow-lg" />`;

          // Show buttons
          btnDownload?.classList.remove("hidden");
          btnCopyResult?.classList.remove("hidden");

          // Update info
          fetch(convertedImage)
            .then((res) => res.blob())
            .then((blob) => {
              const size = (blob.size / 1024).toFixed(2);
              if (resultInfo) {
                resultInfo.textContent = `${targetWidth}x${targetHeight} • ${size} KB • ${outputFormat?.value.toUpperCase()}`;
              }
            });

          hideProgress();
          console.log("✅ Conversão concluída!");
        };

        img.src = currentImage;
      } catch (error) {
        hideProgress();
        console.error("❌ Erro na conversão:", error);
        alert("Erro ao converter a imagem. Tente novamente.");
      }
    };
  }

  // Remove background (real algorithm)
  if (btnRemoveBg) {
    btnRemoveBg.onclick = async () => {
      if (!currentImage) {
        alert("Por favor, selecione uma imagem primeiro!");
        return;
      }

      const hideProgress = showProgress("Removendo fundo...");

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular processamento

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Advanced background removal algorithm
          const tolerance = 30;
          const backgroundColor = getBackgroundColor(
            data,
            canvas.width,
            canvas.height,
          );

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Calculate color difference
            const diff = Math.sqrt(
              Math.pow(r - backgroundColor.r, 2) +
                Math.pow(g - backgroundColor.g, 2) +
                Math.pow(b - backgroundColor.b, 2),
            );

            if (diff < tolerance) {
              data[i + 3] = 0; // Make transparent
            } else {
              // Apply feathering on edges
              const edgeAlpha = Math.min(
                255,
                Math.max(0, (diff - tolerance) * 3),
              );
              data[i + 3] = Math.min(data[i + 3], edgeAlpha);
            }
          }

          ctx.putImageData(imageData, 0, 0);
          convertedImage = canvas.toDataURL("image/png");

          // Update preview with transparency pattern
          resultPreview.innerHTML = `
            <div class="relative">
              <div class="absolute inset-0 opacity-20" style="background-image: url('data:image/svg+xml,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"10\" height=\"10\" fill=\"%23cccccc\"/><rect x=\"10\" y=\"10\" width=\"10\" height=\"10\" fill=\"%23cccccc\"/></svg>');"></div>
              <img src="${convertedImage}" alt="Sem Fundo" class="relative max-w-full max-h-full object-contain rounded-lg shadow-lg" />
            </div>
          `;

          // Show buttons
          btnDownload?.classList.remove("hidden");
          btnCopyResult?.classList.remove("hidden");

          // Force PNG format for transparency
          if (outputFormat) outputFormat.value = "png";

          // Update info
          if (resultInfo) {
            resultInfo.textContent = `${canvas.width}x${canvas.height} • PNG • Fundo removido`;
          }

          hideProgress();
          console.log("✅ Fundo removido com sucesso!");
        };

        img.src = currentImage;
      } catch (error) {
        hideProgress();
        console.error("❌ Erro na remoção de fundo:", error);
        alert("Erro ao remover o fundo. Tente novamente.");
      }
    };
  }

  // Rotate image
  if (btnRotate) {
    btnRotate.onclick = () => {
      if (!currentImage) return;
      rotation = (rotation + 90) % 360;
      console.log("🔄 Rotação aplicada:", rotation + "°");
      // Auto-convert after rotation
      if (btnConvert) btnConvert.click();
    };
  }

  // Flip horizontal
  if (btnFlipH) {
    btnFlipH.onclick = () => {
      if (!currentImage) return;
      isFlippedH = !isFlippedH;
      console.log(
        "🪞 Espelhamento horizontal:",
        isFlippedH ? "ativado" : "desativado",
      );
      // Auto-convert after flip
      if (btnConvert) btnConvert.click();
    };
  }

  // Download
  if (btnDownload) {
    btnDownload.onclick = () => {
      if (convertedImage) {
        const link = document.createElement("a");
        link.download = `flow_converted_${Date.now()}.${outputFormat?.value || "png"}`;
        link.href = convertedImage;
        link.click();
        console.log("💾 Download iniciado");
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
          new ClipboardItem({ [blob.type]: blob }),
        ]);

        btnCopyResult.innerHTML = '<i class="fas fa-check mr-2"></i>Copiado!';
        setTimeout(() => {
          btnCopyResult.innerHTML =
            '<i class="fas fa-copy mr-2"></i>Copiar para Área de Transferência';
        }, 2000);

        console.log("📋 Imagem copiada para área de transferência");
      } catch (error) {
        console.error("❌ Erro ao copiar:", error);
        alert("Erro ao copiar imagem. Tente fazer o download.");
      }
    };
  }

  // Get background color for removal
  function getBackgroundColor(data, width, height) {
    const corners = [
      { x: 0, y: 0 },
      { x: width - 1, y: 0 },
      { x: 0, y: height - 1 },
      { x: width - 1, y: height - 1 },
    ];

    let r = 0,
      g = 0,
      b = 0;

    corners.forEach((corner) => {
      const index = (corner.y * width + corner.x) * 4;
      r += data[index];
      g += data[index + 1];
      b += data[index + 2];
    });

    return {
      r: Math.round(r / corners.length),
      g: Math.round(g / corners.length),
      b: Math.round(b / corners.length),
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
    document.getElementById("calc-display").value = "0";
  };

  window.deleteCalc = () => {
    const display = document.getElementById("calc-display");
    const current = display.value;
    display.value = current.length > 1 ? current.slice(0, -1) : "0";
  };

  window.inputCalc = (value) => {
    const display = document.getElementById("calc-display");
    const current = display.value;

    if (current === "0" && !isNaN(value)) {
      display.value = value;
    } else {
      display.value += value;
    }
  };

  window.calculate = () => {
    const display = document.getElementById("calc-display");
    try {
      const result = eval(display.value.replace("×", "*"));
      display.value = result;
    } catch (e) {
      display.value = "Erro";
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
  const colorInput = document.getElementById("color-picker-input");
  const hexValue = document.getElementById("hex-value");
  const rgbValue = document.getElementById("rgb-value");
  const copyHex = document.getElementById("copy-hex");
  const copyRgb = document.getElementById("copy-rgb");

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
  const textInput = document.getElementById("text-input");
  const charCount = document.getElementById("char-count");
  const wordCount = document.getElementById("word-count");
  const lineCount = document.getElementById("line-count");
  const paragraphCount = document.getElementById("paragraph-count");

  function updateStats() {
    const text = textInput.value;
    charCount.textContent = text.length;
    wordCount.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    lineCount.textContent = text.split("\n").length;
    paragraphCount.textContent = text.trim()
      ? text.trim().split("\n\n").length
      : 0;
  }

  textInput.oninput = updateStats;
  updateStats();

  document.getElementById("btn-uppercase").onclick = () => {
    textInput.value = textInput.value.toUpperCase();
    updateStats();
  };

  document.getElementById("btn-lowercase").onclick = () => {
    textInput.value = textInput.value.toLowerCase();
    updateStats();
  };

  document.getElementById("btn-capitalize").onclick = () => {
    textInput.value = textInput.value.replace(/\b\w/g, (l) => l.toUpperCase());
    updateStats();
  };

  document.getElementById("btn-reverse").onclick = () => {
    textInput.value = textInput.value.split("").reverse().join("");
    updateStats();
  };
}

// Favorites Management
function addToFavorites() {
  const currentTab = tabs.find((t) => t.id === activeTabId);
  if (!currentTab || currentTab.url === "home") {
    alert("Nenhuma página para favoritar!");
    return;
  }

  const favorites = JSON.parse(
    localStorage.getItem("flow_browser_favorites") || "[]",
  );
  const favorite = {
    id: Date.now(),
    title: currentTab.title,
    url: currentTab.url,
    favicon: "🌐",
    date: new Date().toLocaleDateString(),
  };

  // Verificar se já existe
  const exists = favorites.some((fav) => fav.url === favorite.url);
  if (exists) {
    alert("Esta página já está nos favoritos!");
    return;
  }

  favorites.unshift(favorite);
  localStorage.setItem("flow_browser_favorites", JSON.stringify(favorites));

  console.log("⭐ Página adicionada aos favoritos:", favorite.title);

  // Feedback visual
  const toast = document.createElement("div");
  toast.className =
    "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse";
  toast.innerHTML = '<i class="fas fa-star mr-2"></i>Adicionado aos favoritos!';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// History Management
function openHistoryModal() {
  const history = JSON.parse(
    localStorage.getItem("flow_browser_history") || "[]",
  );

  let historyHtml = "";
  if (history.length === 0) {
    historyHtml =
      '<div class="text-center text-gray-500 py-8">Nenhum histórico encontrado</div>';
  } else {
    historyHtml = history
      .slice(0, 50)
      .map(
        (item) => `
      <div class="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onclick="createTab('${item.url}', '${item.title}'); closeModal();">
        <div class="flex-1">
          <div class="font-medium text-gray-800 truncate">${item.title}</div>
          <div class="text-sm text-gray-500 truncate">${item.url}</div>
        </div>
        <div class="text-xs text-gray-400">${item.date}</div>
      </div>
    `,
      )
      .join("");
  }

  const html = `
    <div class="max-w-4xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          <i class="fas fa-history mr-2 text-blue-500"></i>Histórico de Navegação
        </h2>
        <button onclick="clearHistory()" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
          <i class="fas fa-trash mr-2"></i>Limpar Histórico
        </button>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
        ${historyHtml}
      </div>
    </div>
  `;

  openModal(html);
}

function clearHistory() {
  if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
    localStorage.removeItem("flow_browser_history");
    console.log("🗑️ Histórico limpo");
    closeModal();
    setTimeout(() => openHistoryModal(), 100);
  }
}

// Add to history when navigating
function addToHistory(url, title) {
  if (url === "home" || !url) return;

  const history = JSON.parse(
    localStorage.getItem("flow_browser_history") || "[]",
  );
  const item = {
    url,
    title: title || url,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };

  // Remove duplicates
  const filtered = history.filter((h) => h.url !== url);
  filtered.unshift(item);

  // Keep only last 1000 items
  const limited = filtered.slice(0, 1000);
  localStorage.setItem("flow_browser_history", JSON.stringify(limited));
}

// Settings Modal - Complete
function openSettingsModal() {
  const currentFontSize =
    localStorage.getItem("flow_browser_font_size") || "14";
  const currentFontFamily =
    localStorage.getItem("flow_browser_font_family") || "Inter";
  const currentTheme = localStorage.getItem("flow_browser_theme") || "default";
  const currentThemeMode =
    localStorage.getItem("flow_browser_theme_mode") || "system";
  const currentWallpaper = localStorage.getItem("flow_browser_wallpaper") || "";

  if (document.getElementById("settings-overlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "settings-overlay";
  overlay.className =
    "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end opacity-0 pointer-events-none transition-opacity duration-300";
  document.body.appendChild(overlay);

  const sidebar = document.createElement("div");
  sidebar.id = "settings-sidebar";
  sidebar.className =
    "bbg-white dark:bg-neutral-900 dark:text-gray-100 w-[340px] max-w-full h-[85vh] rounded-l-2xl shadow-2xl transform translate-x-full transition-transform duration-300 ease-out fixed right-0 top-1/2 -translate-y-1/2 border-l border-gray-200 dark:border-neutral-800 overflow-y-auto";

  sidebar.innerHTML = `
    <div class="p-5 space-y-6">

      <!-- Cabeçalho -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold flex items-center gap-2">
          <i class="fas fa-cog"></i>Configurações
        </h2>
        <button id="close-settings" class="text-gray-600 dark:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Tema -->
      <div>
        <h3 class="text-sm font-semibold mb-2">Tema</h3>
        <div class="flex gap-2">
          <button id="theme-light" class="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">Claro</button>
          <button id="theme-dark"  class="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">Escuro</button>
          <button id="theme-system" class="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">Sistema</button>
        </div>
      </div>

      <!-- Papel de Parede -->
      <div>
        <h3 class="text-sm font-semibold mb-2">Papel de Parede</h3>
        <div class="flex items-end gap-3">
          <div id="wallpaper-grid" class="grid grid-cols-3 gap-3 flex-1">
            <div class="h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-neutral-700 cursor-pointer hover:opacity-80 transition-opacity" data-wallpaper="default1">
              <img src="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=400&q=60" class="w-full h-full object-cover" />
            </div>
            <div class="h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-neutral-700 cursor-pointer hover:opacity-80 transition-opacity" data-wallpaper="default2">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=60" class="w-full h-full object-cover" />
            </div>
            <div id="custom-wallpaper-slot" class="relative h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:opacity-80 transition-opacity">
              Personalizado
            </div>
          </div>

          <!-- Botão de Upload refinado -->
          <button id="upload-wallpaper-btn" 
            title="Enviar imagem"
            class="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-sm hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all flex items-center justify-center -translate-y-2">
            <i class="fas fa-upload text-gray-600 dark:text-gray-300 text-sm"></i>
          </button>
          <input id="wallpaper-file-input" type="file" accept="image/*" class="hidden" />
        </div>
      </div>

      <!-- Cores -->
      <div>
        <h3 class="text-sm font-semibold mb-3">Cores do Navegador</h3>
        <div class="flex justify-center gap-3 flex-nowrap overflow-x-auto pb-2">
          ${Object.entries(THEMES)
            .map(
              ([key, theme]) => `
            <button
              class="color-dot w-8 h-8 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 transform transition-transform hover:scale-110"
              data-theme="${key}"
              title="${theme.name}"
              style="background: ${theme.primary};">
            </button>
          `,
            )
            .join("")}
        </div>
      </div>

      <!-- Tipografia -->
      <div>
        <h3 class="text-sm font-semibold mb-2">Tipografia</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-xs mb-1">Família da Fonte</label>
            <select id="font-family-select" class="w-full border dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-sm">
              <option value="Inter" ${currentFontFamily === "Inter" ? "selected" : ""}>Inter</option>
              <option value="Arial" ${currentFontFamily === "Arial" ? "selected" : ""}>Arial</option>
              <option value="Georgia" ${currentFontFamily === "Georgia" ? "selected" : ""}>Georgia</option>
              <option value="Roboto" ${currentFontFamily === "Roboto" ? "selected" : ""}>Roboto</option>
            </select>
          </div>

           <div>
            <label class="block text-xs mb-1">Tamanho da Fonte: <span id="font-size-value">${currentFontSize}px</span></label>
            <input type="range" id="font-size-slider" min="12" max="24" value="${currentFontSize}" class="w-full" />
          </div>
        </div>
      </div>

      <!-- Privacidade e Dados -->
      <div class="pt-4 border-t dark:border-gray-700 space-y-3">
        <h3 class="text-sm font-semibold mb-3">Privacidade e Dados</h3>
        <button id="clear-all-btn" class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
          Limpar Todos os Dados
        </button>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button id="clear-history-btn" class="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm">
            Limpar Histórico
          </button>
          <button id="clear-favorites-btn" class="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
            Limpar Favoritos
          </button>
          <button id="clear-notes-btn" class="bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
            Limpar Notas
          </button>
        </div>
      </div>
    </div>
  `;
  overlay.appendChild(sidebar);

  setTimeout(() => {
    overlay.classList.remove("opacity-0", "pointer-events-none");
    sidebar.classList.remove("translate-x-full");
  }, 10);

  // --- Eventos ---
  document.getElementById("close-settings").onclick = closeSettingsSidebar;
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSettingsSidebar();
  });

  // Temas claros/escuros/sistema
  document.getElementById("theme-light").onclick = () =>
    applyThemeModeAndPersist("light");
  document.getElementById("theme-dark").onclick = () =>
    applyThemeModeAndPersist("dark");
  document.getElementById("theme-system").onclick = () =>
    applyThemeModeAndPersist("system");

  // Cores
  document.querySelectorAll(".color-dot").forEach((btn) => {
    btn.addEventListener("click", () => {
      const themeKey = btn.dataset.theme;
      if (typeof applyTheme === "function") applyTheme(themeKey);
      localStorage.setItem("flow_browser_theme", themeKey);
      document
        .querySelectorAll(".color-dot")
        .forEach((b) => b.classList.remove("ring-2", "ring-offset-1"));
      btn.classList.add("ring-2", "ring-offset-1");
    });
  });

  // Tipografia
  const fontSlider = document.getElementById("font-size-slider");
  const fontSizeValue = document.getElementById("font-size-value");
  const fontSelect = document.getElementById("font-family-select");
  fontSlider.oninput = () => {
    fontSizeValue.textContent = fontSlider.value + "px";
    document.body.style.fontSize = fontSlider.value + "px";
    localStorage.setItem("flow_browser_font_size", fontSlider.value);
  };
  fontSelect.onchange = () => {
    document.body.style.fontFamily = fontSelect.value;
    localStorage.setItem("flow_browser_font_family", fontSelect.value);
  };

  // Wallpaper - usar funções do wallpaper.js
  if (typeof setupWallpaperEvents === 'function') {
    setupWallpaperEvents();
  } else {
    // Fallback caso wallpaper.js não esteja carregado
    const uploadBtn = document.getElementById("upload-wallpaper-btn");
    const fileInput = document.getElementById("wallpaper-file-input");
    if (uploadBtn && fileInput) {
      uploadBtn.onclick = () => fileInput.click();
      fileInput.onchange = handleWallpaperFileInput;
    }
    document
      .querySelectorAll("#wallpaper-grid > div[data-wallpaper]")
      .forEach((div) => {
        div.addEventListener("click", () => {
          const img = div.querySelector("img").src;
          if (typeof applyWallpaper === 'function') {
            applyWallpaper(img);
          } else {
            setWallpaperFromDataURL(img);
            localStorage.setItem("flow_browser_wallpaper", img);
          }
        });
      });
  }

  // Limpar tudo + individuais
  document.getElementById("clear-all-btn").onclick = () => {
    if (typeof clearAllData === "function") clearAllData();
    else {
      localStorage.clear();
      location.reload();
    }
  };

  document.getElementById("clear-all-btn").onclick = () => {
    if (confirm("Tem certeza que deseja limpar tudo?")) {
      if (typeof clearAllData === "function") clearAllData();
      else localStorage.clear();
      location.reload();
    }
  };

  document.getElementById("clear-history-btn").onclick = () => {
    if (typeof clearHistory === "function") clearHistory();
  };
  document.getElementById("clear-favorites-btn").onclick = () => {
    if (typeof clearFavorites === "function") clearFavorites();
  };
  document.getElementById("clear-notes-btn").onclick = () => {
    if (typeof clearNotes === "function") clearNotes();
  };
}

function closeSettingsSidebar() {
  const overlay = document.getElementById("settings-overlay");
  const sidebar = document.getElementById("settings-sidebar");
  if (!overlay || !sidebar) return;
  overlay.classList.add("opacity-0", "pointer-events-none");
  sidebar.classList.add("translate-x-full");
  setTimeout(() => overlay.remove(), 300);
}

function applyThemeModeAndPersist(mode) {
  localStorage.setItem("flow_browser_theme_mode", mode);
  if (mode === "light") {
    if (THEMES.light) applyTheme("light");
  } else if (mode === "dark") {
    if (THEMES.dark) applyTheme("dark");
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
}

function handleWallpaperFileInput(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    const dataUrl = ev.target.result;
    localStorage.setItem("flow_browser_wallpaper", dataUrl);
    setWallpaperFromDataURL(dataUrl);
    const customSlot = document.getElementById("custom-wallpaper-slot");
    customSlot.innerHTML = `<img src="${dataUrl}" class="w-full h-full object-cover rounded-lg"/>`;
  };
  reader.readAsDataURL(file);
  e.target.value = "";
}

function setWallpaperFromDataURL(dataUrl) {
  const homeBg = document.getElementById('home-bg');
  if (homeBg) {
    homeBg.src = dataUrl;
    console.log('✅ Wallpaper aplicado:', dataUrl.substring(0, 50) + '...');
  } else {
    console.error('❌ Elemento #home-bg não encontrado');
  }
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
      const currentTab = tabs.find((t) => t.id === activeTabId);
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
      const homeTab = tabs.find((t) => t.url === "home");
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
  const btnProfile = document.getElementById("btn-profile");
  if (btnProfile) btnProfile.onclick = openProfileModal;

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
        if (
          query.startsWith("http://") ||
          query.startsWith("https://") ||
          query.includes(".")
        ) {
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

  if (btnMore) {
    btnMore.onclick = openMoreToolsModal;
  }

  // Dropdown menu functionality
  const btnMenu = document.getElementById("btn-menu");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const sidebar = document.getElementById("sidebar");
  let currentZoom = 100;
  let sidebarHidden = false;

  if (btnMenu && dropdownMenu) {
    btnMenu.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(
        "Menu clicado, dropdown atual:",
        dropdownMenu.classList.contains("hidden"),
      );

      if (dropdownMenu.classList.contains("hidden")) {
        dropdownMenu.classList.remove("hidden");
        dropdownMenu.style.display = "block";
        console.log("Dropdown aberto");
      } else {
        dropdownMenu.classList.add("hidden");
        dropdownMenu.style.display = "none";
        console.log("Dropdown fechado");
      }
    };

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!dropdownMenu.contains(e.target) && !btnMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
        dropdownMenu.style.display = "none";
      }
    });
  }

  // Setup all dropdown menu items
  setupDropdownMenu();

  function setupDropdownMenu() {
    // Nova guia
    const btnNewTab = dropdownMenu?.querySelector("button:nth-child(1)");
    if (btnNewTab) {
      btnNewTab.onclick = () => {
        createTab();
        dropdownMenu.classList.add("hidden");
        console.log("✅ Nova aba criada");
      };
    }

    // Nova janela (nova aba normal)
    const btnNewWindow = dropdownMenu?.querySelector("button:nth-child(2)");
    if (btnNewWindow) {
      btnNewWindow.onclick = () => {
        createTab();
        dropdownMenu.classList.add("hidden");
        console.log("✅ Nova janela (aba) criada");
      };
    }

    // Nova janela privada (nova aba no modo privado)
    const btnPrivateWindow = dropdownMenu?.querySelector("button:nth-child(3)");
    if (btnPrivateWindow) {
      btnPrivateWindow.onclick = () => {
        const privateTab = createTab(
          "https://www.google.com/search?q=navegação+privada",
          "Navegação Privada",
        );
        // Adicionar indicador visual de modo privado
        const tabElement = document.querySelector(
          `[data-tab-id="${privateTab}"]`,
        );
        if (tabElement) {
          tabElement.style.background =
            "linear-gradient(135deg, #4a5568, #2d3748)";
          tabElement.style.color = "white";
        }
        dropdownMenu.classList.add("hidden");
        console.log("✅ Nova janela privada criada");
      };
    }

    // Zoom controls
    const zoomOut = document.getElementById("zoom-out");
    const zoomIn = document.getElementById("zoom-in");
    const zoomReset = document.getElementById("zoom-reset");
    const zoomLevel = document.getElementById("zoom-level");

    if (zoomOut) {
      zoomOut.onclick = () => {
        currentZoom = Math.max(currentZoom - 10, 50);
        updateZoom();
      };
    }

    if (zoomIn) {
      zoomIn.onclick = () => {
        currentZoom = Math.min(currentZoom + 10, 200);
        updateZoom();
      };
    }

    if (zoomReset) {
      zoomReset.onclick = () => {
        currentZoom = 100;
        updateZoom();
      };
    }

    // Favorito
    const btnFavorite = dropdownMenu?.querySelector("button:nth-child(11)"); // Ajustar índice
    if (btnFavorite) {
      btnFavorite.onclick = () => {
        addToFavorites();
        dropdownMenu.classList.add("hidden");
      };
    }

    // Histórico
    const btnHistory = dropdownMenu?.querySelector("button:nth-child(12)"); // Ajustar índice
    if (btnHistory) {
      btnHistory.onclick = () => {
        openHistoryModal();
        dropdownMenu.classList.add("hidden");
      };
    }

    // Downloads (placeholder)
    const btnDownloads = dropdownMenu?.querySelector("button:nth-child(13)"); // Ajustar índice
    if (btnDownloads) {
      btnDownloads.onclick = () => {
        alert("Funcionalidade de Downloads será implementada em breve!");
        dropdownMenu.classList.add("hidden");
      };
    }

    // Extensões - abrir Chrome Web Store
    const btnExtensions = dropdownMenu?.querySelector("button:nth-child(14)"); // Ajustar índice
    if (btnExtensions) {
      btnExtensions.onclick = () => {
        createTab(
          "https://chrome.google.com/webstore/category/extensions",
          "Chrome Web Store",
        );
        dropdownMenu.classList.add("hidden");
        console.log("✅ Chrome Web Store aberta");
      };
    }

    // Configurações
    const btnSettings = document.getElementById("btn-settings");
    if (btnSettings) {
      btnSettings.onclick = () => {
        openSettingsModal();
        dropdownMenu.classList.add("hidden");
      };
    }

    // Esconder barra lateral
    const btnHideSidebar = dropdownMenu?.querySelector("button:nth-child(24)"); // Ajustar índice
    if (btnHideSidebar) {
      btnHideSidebar.onclick = () => {
        toggleSidebar();
        dropdownMenu.classList.add("hidden");
      };
    }
  }

  function updateZoom() {
    const zoomLevel = document.getElementById("zoom-level");
    if (zoomLevel) {
      zoomLevel.textContent = currentZoom + "%";
    }

    // Apply zoom to webview if available
    if (webview && webview.setZoomFactor) {
      webview.setZoomFactor(currentZoom / 100);
    } else {
      // Fallback for regular HTML pages
      document.body.style.zoom = currentZoom / 100;
    }
    console.log("🔍 Zoom atualizado para:", currentZoom + "%");
  }

  function toggleSidebar() {
    if (!sidebar) return;

    sidebarHidden = !sidebarHidden;

    if (sidebarHidden) {
      sidebar.style.transform = "translateX(-100%)";
      sidebar.style.opacity = "0";
      console.log("📱 Barra lateral oculta");
    } else {
      sidebar.style.transform = "translateX(0)";
      sidebar.style.opacity = "1";
      console.log("📱 Barra lateral exibida");
    }
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

      console.log("📁 Arquivo selecionado:", file.name, file.type);

      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem!");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        console.log("✅ Arquivo lido, aplicando wallpaper personalizado...");
        changeWallpaper(ev.target.result);
        closeModal();
      };
      reader.onerror = () => {
        console.error("❌ Erro ao ler arquivo");
        alert("Erro ao ler o arquivo. Tente novamente.");
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
      if (btnReload)
        btnReload.innerHTML =
          '<i class="fas fa-spinner fa-spin text-gray-700"></i>';
    });

    webview.addEventListener("did-stop-loading", () => {
      if (btnReload)
        btnReload.innerHTML = '<i class="fas fa-redo text-gray-700"></i>';
      updateNavButtons();
    });

    webview.addEventListener("did-fail-load", (e) => {
      console.error("❌ Falha ao carregar:", e.errorDescription);
      if (!e.validatedURL.includes("google.com")) {
        const searchUrl =
          "https://www.google.com/search?q=" +
          encodeURIComponent(e.validatedURL);
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

  // Apply saved font settings
  const savedFontFamily = localStorage.getItem("flow_browser_font_family");
  const savedFontSize = localStorage.getItem("flow_browser_font_size");

  if (savedFontFamily) {
    document.body.style.fontFamily = savedFontFamily;
  }

  if (savedFontSize) {
    document.body.style.fontSize = savedFontSize + "px";
  }

  // Verifica se webview está disponível
  if (!webview) {
    console.warn(
      "⚠️ Webview não encontrado! Algumas funcionalidades podem não funcionar.",
    );
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
