// Arquivo com as ferramentas extras que faltavam

// ========== CONVERSOR DE UNIDADES ==========
function openUnitConverterModal() {
  const html = `
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-exchange-alt mr-2 text-orange-500"></i>Conversor de Unidades e Moedas
      </h2>
      
      <div class="space-y-6">
        <!-- Tipo de conversão -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Conversão</label>
          <select id="conversion-type" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="length">Comprimento</option>
            <option value="weight">Peso</option>
            <option value="temperature">Temperatura</option>
            <option value="volume">Volume</option>
            <option value="area">Área</option>
            <option value="speed">Velocidade</option>
            <option value="time">Tempo</option>
          </select>
        </div>
        
        <!-- Conversão -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">De:</label>
            <input type="number" id="from-value" class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2" value="1" />
            <select id="from-unit" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Para:</label>
            <input type="text" id="to-value" readonly class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 bg-gray-50" />
            <select id="to-unit" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            </select>
          </div>
        </div>
        
        <button id="btn-convert" class="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors">
          <i class="fas fa-exchange-alt mr-2"></i>Converter
        </button>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupUnitConverter();
  }
}

function setupUnitConverter() {
  const conversionType = document.getElementById('conversion-type');
  const fromUnit = document.getElementById('from-unit');
  const toUnit = document.getElementById('to-unit');
  const fromValue = document.getElementById('from-value');
  const toValue = document.getElementById('to-value');
  const btnConvert = document.getElementById('btn-convert');
  
  const units = {
    length: {
      'metro': 1,
      'quilômetro': 1000,
      'centímetro': 0.01,
      'milímetro': 0.001,
      'milha': 1609.34,
      'jarda': 0.9144,
      'pé': 0.3048,
      'polegada': 0.0254
    },
    weight: {
      'quilograma': 1,
      'grama': 0.001,
      'miligrama': 0.000001,
      'tonelada': 1000,
      'libra': 0.453592,
      'onça': 0.0283495
    },
    temperature: {
      'celsius': 'C',
      'fahrenheit': 'F',
      'kelvin': 'K'
    },
    volume: {
      'litro': 1,
      'mililitro': 0.001,
      'metro cúbico': 1000,
      'galão': 3.78541,
      'xícara': 0.24
    },
    area: {
      'metro quadrado': 1,
      'quilômetro quadrado': 1000000,
      'hectare': 10000,
      'acre': 4046.86
    },
    speed: {
      'km/h': 1,
      'm/s': 3.6,
      'mph': 1.60934
    },
    time: {
      'segundo': 1,
      'minuto': 60,
      'hora': 3600,
      'dia': 86400,
      'semana': 604800
    }
  };
  
  function updateUnits() {
    const type = conversionType.value;
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    Object.keys(units[type]).forEach(unit => {
      fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
      toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
  }
  
  function convert() {
    const type = conversionType.value;
    const from = fromUnit.value;
    const to = toUnit.value;
    const value = parseFloat(fromValue.value) || 0;
    
    if (type === 'temperature') {
      let result;
      if (from === 'celsius' && to === 'fahrenheit') {
        result = (value * 9/5) + 32;
      } else if (from === 'celsius' && to === 'kelvin') {
        result = value + 273.15;
      } else if (from === 'fahrenheit' && to === 'celsius') {
        result = (value - 32) * 5/9;
      } else if (from === 'fahrenheit' && to === 'kelvin') {
        result = (value - 32) * 5/9 + 273.15;
      } else if (from === 'kelvin' && to === 'celsius') {
        result = value - 273.15;
      } else if (from === 'kelvin' && to === 'fahrenheit') {
        result = (value - 273.15) * 9/5 + 32;
      } else {
        result = value;
      }
      toValue.value = result.toFixed(2);
    } else {
      const baseValue = value * units[type][from];
      const result = baseValue / units[type][to];
      toValue.value = result.toFixed(4);
    }
  }
  
  conversionType.addEventListener('change', updateUnits);
  btnConvert.addEventListener('click', convert);
  fromValue.addEventListener('input', convert);
  fromUnit.addEventListener('change', convert);
  toUnit.addEventListener('change', convert);
  
  updateUnits();
  convert();
}

// ========== EDITOR MARKDOWN ==========
function openMarkdownEditorModal() {
  const html = `
    <div class="max-w-6xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fab fa-markdown mr-2 text-gray-700"></i>Editor Markdown
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Markdown</label>
          <textarea id="markdown-input" class="w-full h-96 border border-gray-300 rounded-lg p-3 font-mono text-sm" placeholder="# Título\n\n## Subtítulo\n\n**Negrito** e *itálico*\n\n- Item 1\n- Item 2\n\n[Link](https://exemplo.com)"></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Visualização</label>
          <div id="markdown-preview" class="w-full h-96 border border-gray-300 rounded-lg p-3 overflow-y-auto bg-white prose prose-sm max-w-none">
            <p class="text-gray-400">A visualização aparecerá aqui...</p>
          </div>
        </div>
      </div>
      
      <div class="mt-4 flex gap-2">
        <button id="btn-copy-markdown" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          <i class="fas fa-copy mr-2"></i>Copiar Markdown
        </button>
        <button id="btn-copy-html" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
          <i class="fas fa-code mr-2"></i>Copiar HTML
        </button>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupMarkdownEditor();
  }
}

function setupMarkdownEditor() {
  const input = document.getElementById('markdown-input');
  const preview = document.getElementById('markdown-preview');
  const btnCopyMarkdown = document.getElementById('btn-copy-markdown');
  const btnCopyHtml = document.getElementById('btn-copy-html');
  
  function parseMarkdown(text) {
    return text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/\n$/gim, '<br />')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  }
  
  function updatePreview() {
    const markdown = input.value;
    const html = parseMarkdown(markdown);
    preview.innerHTML = html || '<p class="text-gray-400">A visualização aparecerá aqui...</p>';
  }
  
  input.addEventListener('input', updatePreview);
  
  btnCopyMarkdown.addEventListener('click', () => {
    navigator.clipboard.writeText(input.value);
    btnCopyMarkdown.innerHTML = '<i class="fas fa-check mr-2"></i>Copiado!';
    setTimeout(() => {
      btnCopyMarkdown.innerHTML = '<i class="fas fa-copy mr-2"></i>Copiar Markdown';
    }, 2000);
  });
  
  btnCopyHtml.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.innerHTML);
    btnCopyHtml.innerHTML = '<i class="fas fa-check mr-2"></i>Copiado!';
    setTimeout(() => {
      btnCopyHtml.innerHTML = '<i class="fas fa-code mr-2"></i>Copiar HTML';
    }, 2000);
  });
  
  updatePreview();
}

// ========== FORMATADOR JSON ==========
function openJSONFormatterModal() {
  const html = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-code mr-2 text-teal-500"></i>Formatador e Validador JSON
      </h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cole seu JSON aqui</label>
          <textarea id="json-input" class="w-full h-64 border border-gray-300 rounded-lg p-3 font-mono text-sm" placeholder='{"nome": "Exemplo", "valor": 123}'></textarea>
        </div>
        
        <div class="flex gap-2">
          <button id="btn-format-json" class="flex-1 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600">
            <i class="fas fa-magic mr-2"></i>Formatar
          </button>
          <button id="btn-minify-json" class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-compress mr-2"></i>Minificar
          </button>
          <button id="btn-validate-json" class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
            <i class="fas fa-check mr-2"></i>Validar
          </button>
          <button id="btn-copy-json" class="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600">
            <i class="fas fa-copy mr-2"></i>Copiar
          </button>
        </div>
        
        <div id="json-message" class="hidden p-3 rounded-lg"></div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
          <textarea id="json-output" readonly class="w-full h-64 border border-gray-300 rounded-lg p-3 font-mono text-sm bg-gray-50"></textarea>
        </div>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupJSONFormatter();
  }
}

function setupJSONFormatter() {
  const input = document.getElementById('json-input');
  const output = document.getElementById('json-output');
  const message = document.getElementById('json-message');
  const btnFormat = document.getElementById('btn-format-json');
  const btnMinify = document.getElementById('btn-minify-json');
  const btnValidate = document.getElementById('btn-validate-json');
  const btnCopy = document.getElementById('btn-copy-json');
  
  function showMessage(text, type = 'success') {
    message.className = `p-3 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
    message.textContent = text;
    message.classList.remove('hidden');
    setTimeout(() => message.classList.add('hidden'), 3000);
  }
  
  btnFormat.addEventListener('click', () => {
    try {
      const json = JSON.parse(input.value);
      output.value = JSON.stringify(json, null, 2);
      showMessage('✅ JSON formatado com sucesso!', 'success');
    } catch (e) {
      showMessage('❌ Erro: ' + e.message, 'error');
      output.value = '';
    }
  });
  
  btnMinify.addEventListener('click', () => {
    try {
      const json = JSON.parse(input.value);
      output.value = JSON.stringify(json);
      showMessage('✅ JSON minificado com sucesso!', 'success');
    } catch (e) {
      showMessage('❌ Erro: ' + e.message, 'error');
      output.value = '';
    }
  });
  
  btnValidate.addEventListener('click', () => {
    try {
      JSON.parse(input.value);
      showMessage('✅ JSON válido!', 'success');
    } catch (e) {
      showMessage('❌ JSON inválido: ' + e.message, 'error');
    }
  });
  
  btnCopy.addEventListener('click', () => {
    if (output.value) {
      navigator.clipboard.writeText(output.value);
      btnCopy.innerHTML = '<i class="fas fa-check mr-2"></i>Copiado!';
      setTimeout(() => {
        btnCopy.innerHTML = '<i class="fas fa-copy mr-2"></i>Copiar';
      }, 2000);
    }
  });
}

console.log('✅ Ferramentas extras carregadas: Conversor, Editor Markdown, Formatador JSON');
// ========== PAPEL DE PAREDE PERSONALIZADO ==========