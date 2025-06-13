const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  // Bloqueador de anúncios simples (domínios comuns)
  const adBlockList = ["doubleclick.net", "googlesyndication.com", "adnxs.com", "popads.net"];
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const shouldBlock = adBlockList.some(domain => details.url.includes(domain));
    callback({ cancel: shouldBlock });
  });

  // ✅ Corrigido: aponta corretamente para index.html dentro da pasta "public"
  win.loadFile(path.join(__dirname, 'public/index.html'));

  console.log("🌐 Navegador Flow iniciado com sucesso.");
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
