// Gerenciamento de Wallpaper/Papel de Parede

function initWallpaperSystem() {
  console.log('🎨 Sistema de wallpaper inicializado');
  
  // Carregar wallpaper salvo ou aplicar um padrão
  const savedWallpaper = localStorage.getItem("flow_browser_wallpaper");
  const homeBg = document.getElementById('home-bg');
  
  if (savedWallpaper && homeBg) {
    homeBg.src = savedWallpaper;
    console.log('✅ Wallpaper salvo carregado');
  }
  
  // Atualizar preview do wallpaper personalizado se existir
  updateCustomWallpaperPreview();
}

function applyWallpaper(imageUrl) {
  const homeBg = document.getElementById('home-bg');
  if (!homeBg) {
    console.error('❌ Elemento #home-bg não encontrado');
    return false;
  }
  
  homeBg.style.opacity = '0';
  
  setTimeout(() => {
    homeBg.src = imageUrl;
    homeBg.onload = () => {
      homeBg.style.opacity = '1';
      localStorage.setItem("flow_browser_wallpaper", imageUrl);
      console.log('✅ Wallpaper aplicado com sucesso');
      updateCustomWallpaperPreview();
    };
    homeBg.onerror = () => {
      console.error('❌ Erro ao carregar wallpaper');
      homeBg.style.opacity = '1';
    };
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
  
  // Wallpapers predefinidos
  const wallpaperOptions = document.querySelectorAll('#wallpaper-grid > div[data-wallpaper]');
  wallpaperOptions.forEach((option) => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = option.querySelector('img');
      if (img && img.src) {
        console.log('🖼️ Wallpaper predefinido selecionado');
        applyWallpaper(img.src);
        showWallpaperFeedback(option);
      }
    });
  });
  
  // Slot personalizado
  const customSlot = document.getElementById('custom-wallpaper-slot');
  if (customSlot) {
    customSlot.addEventListener('click', (e) => {
      e.stopPropagation();
      const savedWallpaper = localStorage.getItem("flow_browser_wallpaper");
      if (savedWallpaper && savedWallpaper.startsWith('data:image')) {
        applyWallpaper(savedWallpaper);
        showWallpaperFeedback(customSlot);
      } else {
        fileInput.click();
      }
    });
  }
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
