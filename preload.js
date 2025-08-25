// preload.js

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Placeholder para expor APIs seguras no futuro se precisar
});
// Por enquanto, não há APIs específicas para expor