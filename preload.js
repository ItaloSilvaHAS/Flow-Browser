// preload.js

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Placeholder para expor APIs seguras no futuro se precisar
});
