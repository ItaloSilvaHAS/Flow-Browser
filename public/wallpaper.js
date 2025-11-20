// Gerenciamento de Wallpaper/Papel de Parede

// Lista de wallpapers disponíveis na pasta Assets/Backgrounds
const WALLPAPER_LIST = [
  '../Assets/Backgrounds/Fundo1.jpg',
  '../Assets/Backgrounds/Fundo2.jpg',
  '../Assets/Backgrounds/Fundo3.jpg',
  '../Assets/Backgrounds/Fundo4.jpg'
];

function initWallpaperSystem() {
  console.log('🎨 Sistema de wallpaper inicializado');
  
  // Carregar wallpaper salvo ou aplicar um padrão
  const savedWallpaper = localStorage.getItem("flow_browser_wallpaper");
  const wallpaperImg = document.getElementById('wallpaper-img');
  const homeBg = document.getElementById('home-bg');
  
  if (savedWallpaper) {
    if (wallpaperImg) {
      wallpaperImg.src = savedWallpaper;
      console.log('✅ Wallpaper salvo carregado em #wallpaper-img');
    }
    if (homeBg) {
      homeBg.src = savedWallpaper;
      console.log('✅ Wallpaper salvo carregado em #home-bg');
    }
  }
  
  // Atualizar preview do wallpaper personalizado se existir
  updateCustomWallpaperPreview();
  
  // Carregar wallpapers da pasta Assets/Backgrounds
  loadBackgroundWallpapers();
}

function loadBackgroundWallpapers() {
  const wallpaperGrid = document.getElementById('wallpaper-grid');
  if (!wallpaperGrid) {
    console.warn('⚠️ Grid de wallpapers não encontrado');
    return;
  }
  
  // Limpa os wallpapers padrão (mantém apenas o slot personalizado)
  const customSlot = document.getElementById('custom-wallpaper-slot');
  wallpaperGrid.innerHTML = '';
  
  // Adiciona os wallpapers da pasta Assets/Backgrounds
  WALLPAPER_LIST.forEach((wallpaperPath, index) => {
    const wallpaperDiv = document.createElement('div');
    wallpaperDiv.className = 'h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-neutral-700 cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-400';
    wallpaperDiv.setAttribute('data-wallpaper', `background-${index + 1}`);
    
    const img = document.createElement('img');
    img.src = wallpaperPath;
    img.className = 'w-full h-full object-cover';
    img.alt = `Wallpaper ${index + 1}`;
    
    // Tratamento de erro caso a imagem não carregue
    img.onerror = () => {
      console.warn(`⚠️ Erro ao carregar wallpaper: ${wallpaperPath}`);
      wallpaperDiv.style.display = 'none';
    };
    
    wallpaperDiv.appendChild(img);
    wallpaperGrid.appendChild(wallpaperDiv);
  });
  
  // Re-adiciona o slot personalizado no final
  if (customSlot) {
    wallpaperGrid.appendChild(customSlot);
  } else {
    // Cria o slot personalizado se não existir
    createCustomWallpaperSlot(wallpaperGrid);
  }
  
  console.log(`✅ ${WALLPAPER_LIST.length} wallpapers carregados da pasta Assets/Backgrounds`);
}

function createCustomWallpaperSlot(grid) {
  const customSlot = document.createElement('div');
  customSlot.id = 'custom-wallpaper-slot';
  customSlot.className = 'relative h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex flex-col items-center justify-center text-xs text-white cursor-pointer hover:opacity-80 transition-opacity border-2 border-dashed border-white/50';
  customSlot.innerHTML = `
    <i class="fas fa-upload text-xl mb-1"></i>
    <span class="font-semibold">Personalizado</span>
  `;
  grid.appendChild(customSlot);
}

function applyWallpaper(imageUrl) {
  // Aplicar no wallpaper-img (fundo principal visível)
  const wallpaperImg = document.getElementById('wallpaper-img');
  const homeBg = document.getElementById('home-bg');
  
  if (!wallpaperImg && !homeBg) {
    console.error('❌ Nenhum elemento de wallpaper encontrado');
    return false;
  }
  
  console.log('🎨 Aplicando wallpaper:', imageUrl);
  
  // Fade out
  if (wallpaperImg) wallpaperImg.style.opacity = '0';
  if (homeBg) homeBg.style.opacity = '0';
  
  setTimeout(() => {
    // Aplicar nova imagem em AMBOS os elementos
    if (wallpaperImg) {
      wallpaperImg.src = imageUrl;
      wallpaperImg.onload = () => {
        wallpaperImg.style.opacity = '1';
        console.log('✅ Wallpaper aplicado em #wallpaper-img');
      };
      wallpaperImg.onerror = () => {
        console.error('❌ Erro ao carregar em #wallpaper-img');
        wallpaperImg.style.opacity = '1';
      };
    }
    
    if (homeBg) {
      homeBg.src = imageUrl;
      homeBg.onload = () => {
        homeBg.style.opacity = '1';
        console.log('✅ Wallpaper aplicado em #home-bg');
      };
      homeBg.onerror = () => {
        console.error('❌ Erro ao carregar em #home-bg');
        homeBg.style.opacity = '1';
      };
    }
    
    // Salvar preferência
    localStorage.setItem("flow_browser_wallpaper", imageUrl);
    console.log('✅ Wallpaper salvo no localStorage');
    
    // Atualizar preview
    updateCustomWallpaperPreview();
  }, 200);
  
  return true;
}

function updateCustomWallpaperPreview() {
  const customSlot = document.getElementById('custom-wallpaper-slot');
  const savedWallpaper = localStorage.getItem("flow_browser_wallpaper");
  
  if (customSlot && savedWallpaper && savedWallpaper.startsWith('data:image')) {
    customSlot.innerHTML = `<img src="${savedWallpaper}" class="w-full h-full object-cover" />`;
  }
}

function setupWallpaperEvents() {
  // Botão de upload
  const uploadBtn = document.getElementById('upload-wallpaper-btn');
  const fileInput = document.getElementById('wallpaper-file-input');
  
  if (uploadBtn && fileInput) {
    uploadBtn.onclick = (e) => {
      e.stopPropagation();
      console.log('📤 Abrindo seletor de arquivo...');
      fileInput.click();
    };
    
    fileInput.onchange = handleWallpaperUpload;
  }
  
  // Wallpapers predefinidos (usar setTimeout para garantir que os elementos foram criados)
  setTimeout(() => {
    const wallpaperOptions = document.querySelectorAll('#wallpaper-grid > div[data-wallpaper]');
    wallpaperOptions.forEach((option) => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove seleção anterior
        document.querySelectorAll('#wallpaper-grid > div').forEach(div => {
          div.classList.remove('ring-4', 'ring-blue-500');
        });
        
        // Adiciona indicador visual de selecionado
        option.classList.add('ring-4', 'ring-blue-500');
        
        const img = option.querySelector('img');
        if (img && img.src) {
          console.log('🖼️ Wallpaper selecionado:', img.src);
          applyWallpaper(img.src);
          showWallpaperFeedback(option);
        }
      });
    });
    
    console.log(`✅ ${wallpaperOptions.length} wallpapers configurados com eventos`);
  }, 100);
  
  // Slot personalizado
  setTimeout(() => {
    const customSlot = document.getElementById('custom-wallpaper-slot');
    if (customSlot) {
      customSlot.addEventListener('click', (e) => {
        e.stopPropagation();
        const savedWallpaper = localStorage.getItem("flow_browser_wallpaper");
        
        // Se já existe um wallpaper personalizado salvo, aplica ele
        if (savedWallpaper && savedWallpaper.startsWith('data:image')) {
          applyWallpaper(savedWallpaper);
          showWallpaperFeedback(customSlot);
        } else {
          // Senão, abre o seletor de arquivo
          if (fileInput) {
            fileInput.click();
          }
        }
      });
      console.log('✅ Slot personalizado configurado');
    }
  }, 100);
}

function handleWallpaperUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  
  console.log('📁 Arquivo selecionado:', file.name);
  
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione apenas arquivos de imagem!');
    e.target.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    console.log('✅ Imagem carregada, aplicando wallpaper...');
    applyWallpaper(dataUrl);
  };
  reader.onerror = () => {
    console.error('❌ Erro ao ler arquivo');
    alert('Erro ao ler o arquivo. Tente novamente.');
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

function showWallpaperFeedback(element) {
  const feedback = document.createElement('div');
  feedback.className = 'absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center text-white font-bold rounded-lg z-10 text-xs';
  feedback.innerHTML = '<i class="fas fa-check mr-1"></i>Aplicado!';
  
  element.style.position = 'relative';
  element.appendChild(feedback);
  
  setTimeout(() => {
    feedback.remove();
  }, 1000);
}

// Chamar setupWallpaperEvents quando o settings modal for aberto
if (typeof window !== 'undefined') {
  window.setupWallpaperEvents = setupWallpaperEvents;
  window.applyWallpaper = applyWallpaper;
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWallpaperSystem);
} else {
  initWallpaperSystem();
}
