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
// ========================================
// NOVAS FERRAMENTAS AUTORAIS PARA ESTUDANTES
// ========================================

// ========== 1. CONJUGADOR DE VERBOS ==========
function openVerbConjugatorModal() {
  const html = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-language mr-3 text-pink-500"></i>Conjugador de Verbos
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
          <select id="verb-language" class="w-full border border-gray-300 rounded-lg px-4 py-3">
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Verbo</label>
          <input type="text" id="verb-input" placeholder="Ex: estudar, to study" 
                 class="w-full border border-gray-300 rounded-lg px-4 py-3" />
        </div>
      </div>
      
      <button id="btn-conjugate" class="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 mb-6">
        <i class="fas fa-magic mr-2"></i>Conjugar
      </button>
      
      <div id="conjugation-result" class="hidden">
        <div class="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Conjugações</h3>
          <div id="conjugation-content" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
        </div>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupVerbConjugator();
  }
}

function setupVerbConjugator() {
  const btnConjugate = document.getElementById('btn-conjugate');
  const verbInput = document.getElementById('verb-input');
  const language = document.getElementById('verb-language');
  const result = document.getElementById('conjugation-result');
  const content = document.getElementById('conjugation-content');
  
  btnConjugate.addEventListener('click', () => {
    const verb = verbInput.value.trim().toLowerCase();
    const lang = language.value;
    
    if (!verb) {
      alert('Digite um verbo!');
      return;
    }
    
    const conjugations = lang === 'pt' ? conjugatePT(verb) : conjugateEN(verb);
    
    content.innerHTML = conjugations.map(section => `
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h4 class="font-bold text-gray-700 mb-3">${section.title}</h4>
        <div class="space-y-2">
          ${section.forms.map(form => `
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">${form.person}</span>
              <span class="font-medium text-gray-800">${form.conjugation}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    
    result.classList.remove('hidden');
  });
}

function conjugatePT(verb) {
  const root = verb.replace(/ar$|er$|ir$/, '');
  const ending = verb.slice(-2);
  
  let presente, preterito, futuro;
  
  if (ending === 'ar') {
    presente = ['o', 'as', 'a', 'amos', 'am'];
    preterito = ['ei', 'ou', 'ou', 'amos', 'aram'];
    futuro = ['arei', 'ará', 'ará', 'aremos', 'arão'];
  } else if (ending === 'er') {
    presente = ['o', 'es', 'e', 'emos', 'em'];
    preterito = ['i', 'eu', 'eu', 'emos', 'eram'];
    futuro = ['erei', 'erá', 'erá', 'eremos', 'erão'];
  } else {
    presente = ['o', 'es', 'e', 'imos', 'em'];
    preterito = ['i', 'iu', 'iu', 'imos', 'iram'];
    futuro = ['irei', 'irá', 'irá', 'iremos', 'irão'];
  }
  
  const pessoas = ['Eu', 'Tu/Você', 'Ele/Ela', 'Nós', 'Eles/Elas'];
  
  return [
    {
      title: 'Presente',
      forms: pessoas.map((p, i) => ({ person: p, conjugation: root + presente[i] }))
    },
    {
      title: 'Pretérito',
      forms: pessoas.map((p, i) => ({ person: p, conjugation: root + preterito[i] }))
    },
    {
      title: 'Futuro',
      forms: pessoas.map((p, i) => ({ person: p, conjugation: verb.replace(/r$/, '') + futuro[i] }))
    }
  ];
}

function conjugateEN(verb) {
  const base = verb.replace(/^to /, '');
  const pessoas = ['I', 'You', 'He/She', 'We', 'They'];
  
  return [
    {
      title: 'Present Simple',
      forms: pessoas.map((p, i) => ({ 
        person: p, 
        conjugation: i === 2 ? base + 's' : base 
      }))
    },
    {
      title: 'Past Simple',
      forms: pessoas.map(p => ({ person: p, conjugation: base + 'ed' }))
    },
    {
      title: 'Future',
      forms: pessoas.map(p => ({ person: p, conjugation: 'will ' + base }))
    }
  ];
}

// ========== 2. CALCULADORA CIENTÍFICA ==========
function openScientificCalculatorModal() {
  const html = `
    <div class="max-w-2xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-calculator mr-3 text-blue-500"></i>Calculadora Científica
      </h2>
      
      <div class="bg-gray-900 rounded-xl p-6 shadow-2xl">
        <input type="text" id="calc-display" readonly 
               class="w-full bg-gray-800 text-white text-right text-3xl p-4 rounded-lg mb-4 font-mono" 
               value="0" />
        
        <div class="grid grid-cols-4 gap-2">
          ${[
            ['C', '←', '%', '/'],
            ['7', '8', '9', '*'],
            ['4', '5', '6', '-'],
            ['1', '2', '3', '+'],
            ['0', '.', '=', 'π'],
            ['sin', 'cos', 'tan', '√'],
            ['(', ')', '^', 'log']
          ].map(row => 
            row.map(btn => `
              <button class="calc-btn bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-lg font-bold text-lg transition-colors"
                      data-value="${btn}">${btn}</button>
            `).join('')
          ).join('')}
        </div>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupScientificCalculator();
  }
}

function setupScientificCalculator() {
  const display = document.getElementById('calc-display');
  let currentValue = '0';
  let lastResult = null;
  
  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.value;
      
      if (value === 'C') {
        currentValue = '0';
      } else if (value === '←') {
        currentValue = currentValue.slice(0, -1) || '0';
      } else if (value === '=') {
        try {
          let expr = currentValue
            .replace(/π/g, Math.PI)
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/\^/g, '**');
          currentValue = eval(expr).toString();
        } catch (e) {
          currentValue = 'Erro';
        }
      } else {
        if (currentValue === '0' && value !== '.') {
          currentValue = value;
        } else {
          currentValue += value;
        }
      }
      
      display.value = currentValue;
    });
  });
}

// ========== 3. FLASHCARDS INTELIGENTES ==========
function openFlashcardsModal() {
  const html = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-lightbulb mr-3 text-yellow-500"></i>Flashcards Inteligentes
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Matéria</label>
          <select id="flashcard-subject" class="w-full border border-gray-300 rounded-lg px-4 py-3">
            <option value="matematica">Matemática</option>
            <option value="portugues">Português</option>
            <option value="ingles">Inglês</option>
            <option value="historia">História</option>
            <option value="geografia">Geografia</option>
            <option value="biologia">Biologia</option>
            <option value="quimica">Química</option>
            <option value="fisica">Física</option>
          </select>
        </div>
        
        <div>
          <button id="btn-start-flashcards" class="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 h-full">
            <i class="fas fa-play mr-2"></i>Iniciar Estudo
          </button>
        </div>
      </div>
      
      <div id="flashcard-container" class="hidden">
        <div class="relative perspective-1000">
          <div id="flashcard" class="flashcard bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-8 min-h-[300px] flex items-center justify-center cursor-pointer transition-transform duration-500"
               onclick="flipFlashcard()">
            <div id="flashcard-content" class="text-center">
              <h3 id="card-question" class="text-2xl font-bold text-gray-800"></h3>
              <p id="card-answer" class="text-xl text-gray-600 mt-4 hidden"></p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between items-center mt-6">
          <button id="btn-prev-card" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
            <i class="fas fa-arrow-left mr-2"></i>Anterior
          </button>
          <div id="card-counter" class="text-gray-600 font-medium"></div>
          <button id="btn-next-card" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
            Próximo<i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupFlashcards();
  }
}

function setupFlashcards() {
  const flashcardSets = {
    matematica: [
      { q: 'Teorema de Pitágoras?', a: 'a² + b² = c²' },
      { q: 'Fórmula de Bhaskara?', a: 'x = (-b ± √(b²-4ac)) / 2a' },
      { q: 'Área do círculo?', a: 'A = πr²' },
      { q: 'Volume do cubo?', a: 'V = l³' }
    ],
    portugues: [
      { q: 'O que é uma oração subordinada?', a: 'Oração que depende sintaticamente de outra oração principal' },
      { q: 'Diferença entre Mas e Mais?', a: 'Mas = adversativa (porém). Mais = adição/quantidade' },
      { q: 'O que é um oxítona?', a: 'Palavra com acento tônico na última sílaba' }
    ],
    ingles: [
      { q: 'Present Perfect structure?', a: 'Have/Has + Past Participle' },
      { q: 'Diferença entre See e Watch?', a: 'See = ver (geral). Watch = assistir (com atenção)' },
      { q: 'When to use Since vs For?', a: 'Since = ponto específico no tempo. For = duração' }
    ],
    biologia: [
      { q: 'O que é Fotossíntese?', a: 'Processo de produção de glicose usando luz solar: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
      { q: 'Quantos cromossomos tem o ser humano?', a: '46 cromossomos (23 pares)' },
      { q: 'O que é Mitose?', a: 'Divisão celular que gera 2 células-filhas idênticas' }
    ]
  };
  
  let currentSet = [];
  let currentIndex = 0;
  let isFlipped = false;
  
  document.getElementById('btn-start-flashcards').addEventListener('click', () => {
    const subject = document.getElementById('flashcard-subject').value;
    currentSet = flashcardSets[subject] || flashcardSets.matematica;
    currentIndex = 0;
    
    document.getElementById('flashcard-container').classList.remove('hidden');
    loadCard();
  });
  
  window.flipFlashcard = function() {
    isFlipped = !isFlipped;
    document.getElementById('card-question').classList.toggle('hidden');
    document.getElementById('card-answer').classList.toggle('hidden');
  };
  
  document.getElementById('btn-prev-card').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      isFlipped = false;
      loadCard();
    }
  });
  
  document.getElementById('btn-next-card').addEventListener('click', () => {
    if (currentIndex < currentSet.length - 1) {
      currentIndex++;
      isFlipped = false;
      loadCard();
    }
  });
  
  function loadCard() {
    if (currentSet.length === 0) return;
    
    const card = currentSet[currentIndex];
    document.getElementById('card-question').textContent = card.q;
    document.getElementById('card-answer').textContent = card.a;
    document.getElementById('card-counter').textContent = `${currentIndex + 1} / ${currentSet.length}`;
    
    document.getElementById('card-question').classList.remove('hidden');
    document.getElementById('card-answer').classList.add('hidden');
  }
}

// ========== 4. TABELA PERIÓDICA INTERATIVA ==========
function openPeriodicTableModal() {
  const html = `
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-atom mr-3 text-green-500"></i>Tabela Periódica Interativa
      </h2>
      
      <div class="bg-gray-50 rounded-xl p-6">
        <div class="mb-4">
          <input type="text" id="element-search" placeholder="Buscar elemento (ex: Oxigênio, O, 8)" 
                 class="w-full border border-gray-300 rounded-lg px-4 py-3" />
        </div>
        
        <div id="periodic-grid" class="grid grid-cols-9 gap-1 mb-6">
          ${getPeriodicElements().map(el => `
            <div class="element-cell bg-white hover:bg-blue-50 p-2 rounded cursor-pointer border-2 border-gray-200 transition-all"
                 onclick="showElementInfo('${el.symbol}')"
                 style="background: ${el.color}20;">
              <div class="text-xs text-gray-600">${el.number}</div>
              <div class="text-2xl font-bold text-gray-800">${el.symbol}</div>
              <div class="text-xs text-gray-600 truncate">${el.name}</div>
            </div>
          `).join('')}
        </div>
        
        <div id="element-info" class="hidden bg-white rounded-lg p-6 shadow-lg"></div>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupPeriodicTable();
  }
}

function getPeriodicElements() {
  return [
    { number: 1, symbol: 'H', name: 'Hidrogênio', color: '#FF6B6B', mass: '1.008', group: 'Não-metal' },
    { number: 2, symbol: 'He', name: 'Hélio', color: '#4ECDC4', mass: '4.003', group: 'Gás nobre' },
    { number: 3, symbol: 'Li', name: 'Lítio', color: '#FFE66D', mass: '6.941', group: 'Metal alcalino' },
    { number: 4, symbol: 'Be', name: 'Berílio', color: '#95E1D3', mass: '9.012', group: 'Metal alcalino-terroso' },
    { number: 5, symbol: 'B', name: 'Boro', color: '#F38181', mass: '10.81', group: 'Semimetal' },
    { number: 6, symbol: 'C', name: 'Carbono', color: '#AA96DA', mass: '12.01', group: 'Não-metal' },
    { number: 7, symbol: 'N', name: 'Nitrogênio', color: '#FCBAD3', mass: '14.01', group: 'Não-metal' },
    { number: 8, symbol: 'O', name: 'Oxigênio', color: '#A8D8EA', mass: '16.00', group: 'Não-metal' },
    { number: 9, symbol: 'F', name: 'Flúor', color: '#FFD3B6', mass: '19.00', group: 'Halogênio' }
  ];
}

window.showElementInfo = function(symbol) {
  const elements = getPeriodicElements();
  const element = elements.find(el => el.symbol === symbol);
  
  if (!element) return;
  
  const infoDiv = document.getElementById('element-info');
  infoDiv.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-3xl font-bold text-gray-800 mb-2">${element.name}</h3>
        <div class="text-6xl font-bold text-gray-300 mb-4">${element.symbol}</div>
        <div class="space-y-2">
          <p><strong>Número Atômico:</strong> ${element.number}</p>
          <p><strong>Massa Atômica:</strong> ${element.mass} u</p>
          <p><strong>Grupo:</strong> ${element.group}</p>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <div class="w-48 h-48 rounded-full flex items-center justify-center text-8xl font-bold" 
             style="background: ${element.color}40; color: ${element.color};">
          ${element.symbol}
        </div>
      </div>
    </div>
  `;
  infoDiv.classList.remove('hidden');
};

function setupPeriodicTable() {
  const search = document.getElementById('element-search');
  search.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.element-cell').forEach(cell => {
      const text = cell.textContent.toLowerCase();
      cell.style.opacity = text.includes(query) ? '1' : '0.3';
    });
  });
}

// ========== 5. MAPA MENTAL ==========
function openMindMapModal() {
  const html = `
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-project-diagram mr-3 text-purple-500"></i>Mapa Mental
      </h2>
      
      <div class="mb-4 flex gap-4">
        <input type="text" id="mindmap-topic" placeholder="Tópico principal" 
               class="flex-1 border border-gray-300 rounded-lg px-4 py-3" />
        <button id="btn-add-node" class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600">
          <i class="fas fa-plus mr-2"></i>Adicionar Ramo
        </button>
      </div>
      
      <div id="mindmap-canvas" class="bg-white rounded-xl border-2 border-gray-200 p-8 min-h-[500px] relative overflow-auto">
        <div id="central-node" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="bg-purple-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-xl">
            Tema Central
          </div>
        </div>
        <div id="branches-container"></div>
      </div>
      
      <div class="mt-4 flex gap-4">
        <button id="btn-save-mindmap" class="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
          <i class="fas fa-save mr-2"></i>Salvar
        </button>
        <button id="btn-clear-mindmap" class="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
          <i class="fas fa-trash mr-2"></i>Limpar
        </button>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupMindMap();
  }
}

function setupMindMap() {
  let branches = [];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  
  document.getElementById('btn-add-node').addEventListener('click', () => {
    const topic = document.getElementById('mindmap-topic').value.trim();
    if (!topic) return;
    
    const angle = (branches.length * 60) % 360;
    const radius = 200;
    const x = Math.cos(angle * Math.PI / 180) * radius;
    const y = Math.sin(angle * Math.PI / 180) * radius;
    const color = colors[branches.length % colors.length];
    
    const branch = document.createElement('div');
    branch.className = 'absolute';
    branch.style.left = `calc(50% + ${x}px)`;
    branch.style.top = `calc(50% + ${y}px)`;
    branch.innerHTML = `
      <div class="px-6 py-3 rounded-full text-white font-medium shadow-lg transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
           style="background: ${color};">
        ${topic}
      </div>
    `;
    
    document.getElementById('branches-container').appendChild(branch);
    branches.push({ topic, x, y, color });
    document.getElementById('mindmap-topic').value = '';
  });
  
  document.getElementById('btn-clear-mindmap').addEventListener('click', () => {
    document.getElementById('branches-container').innerHTML = '';
    branches = [];
  });
  
  document.getElementById('btn-save-mindmap').addEventListener('click', () => {
    alert('💾 Mapa Mental salvo! (Funcionalidade de exportação em desenvolvimento)');
  });
}

console.log('✨ 5 Novas Ferramentas Autorais Carregadas!');

// ========== NOVAS FERRAMENTAS DE ESTUDO ==========

// 1. RESUMO AUTOMÁTICO DE TEXTO
function openTextSummarizerModal() {
  const html = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-file-alt mr-3 text-indigo-500"></i>Resumidor de Textos
      </h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cole o texto para resumir</label>
          <textarea id="text-to-summarize" 
                    class="w-full h-64 border border-gray-300 rounded-lg p-4 text-sm"
                    placeholder="Cole aqui o texto que você quer resumir..."></textarea>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nível de Resumo</label>
            <select id="summary-level" class="w-full border border-gray-300 rounded-lg px-4 py-3">
              <option value="short">Curto (30%)</option>
              <option value="medium" selected>Médio (50%)</option>
              <option value="detailed">Detalhado (70%)</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Formato</label>
            <select id="summary-format" class="w-full border border-gray-300 rounded-lg px-4 py-3">
              <option value="bullets">Tópicos</option>
              <option value="paragraph">Parágrafo</option>
            </select>
          </div>
        </div>
        
        <button id="btn-summarize" class="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600">
          <i class="fas fa-compress-alt mr-2"></i>Gerar Resumo
        </button>
        
        <div id="summary-result" class="hidden">
          <label class="block text-sm font-medium text-gray-700 mb-2">Resumo Gerado</label>
          <div id="summary-content" class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm"></div>
          <button id="btn-copy-summary" class="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
            <i class="fas fa-copy mr-2"></i>Copiar Resumo
          </button>
        </div>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupTextSummarizer();
  }
}

function setupTextSummarizer() {
  const btnSummarize = document.getElementById('btn-summarize');
  const textInput = document.getElementById('text-to-summarize');
  const level = document.getElementById('summary-level');
  const format = document.getElementById('summary-format');
  const result = document.getElementById('summary-result');
  const content = document.getElementById('summary-content');
  const btnCopy = document.getElementById('btn-copy-summary');
  
  btnSummarize.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
      alert('Cole um texto para resumir!');
      return;
    }
    
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const percentage = level.value === 'short' ? 0.3 : level.value === 'medium' ? 0.5 : 0.7;
    const numSentences = Math.max(1, Math.floor(sentences.length * percentage));
    
    const summary = sentences.slice(0, numSentences);
    
    if (format.value === 'bullets') {
      content.innerHTML = '<ul class="space-y-2">' + 
        summary.map(s => `<li class="flex items-start"><i class="fas fa-check text-indigo-500 mr-2 mt-1"></i><span>${s.trim()}</span></li>`).join('') + 
        '</ul>';
    } else {
      content.innerHTML = `<p class="leading-relaxed">${summary.join(' ')}</p>`;
    }
    
    result.classList.remove('hidden');
  });
  
  btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(content.textContent);
    btnCopy.innerHTML = '<i class="fas fa-check mr-2"></i>Copiado!';
    setTimeout(() => {
      btnCopy.innerHTML = '<i class="fas fa-copy mr-2"></i>Copiar Resumo';
    }, 2000);
  });
}

// 2. CRONÔMETRO DE CONCENTRAÇÃO (Técnica 52-17)
function openFocusTimerModal() {
  const html = `
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-brain mr-3 text-purple-500"></i>Cronômetro de Concentração
      </h2>
      
      <div class="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-8 text-center">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Técnica 52-17</h3>
          <p class="text-sm text-gray-600">52 min de foco intenso + 17 min de pausa</p>
        </div>
        
        <div class="mb-8">
          <div id="focus-timer-display" class="text-7xl font-bold text-purple-600 mb-4">52:00</div>
          <div id="focus-timer-status" class="text-xl font-medium text-gray-700">Pronto para começar</div>
        </div>
        
        <div class="flex gap-4 justify-center mb-6">
          <button id="btn-start-focus" class="bg-purple-500 text-white px-8 py-3 rounded-lg hover:bg-purple-600 font-semibold">
            <i class="fas fa-play mr-2"></i>Iniciar
          </button>
          <button id="btn-pause-focus" class="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 font-semibold" disabled>
            <i class="fas fa-pause mr-2"></i>Pausar
          </button>
          <button id="btn-reset-focus" class="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 font-semibold">
            <i class="fas fa-redo mr-2"></i>Reiniciar
          </button>
        </div>
        
        <div class="bg-white rounded-lg p-4">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Sessões completadas hoje:</span>
            <span id="sessions-count" class="font-bold text-purple-600">0</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupFocusTimer();
  }
}

function setupFocusTimer() {
  let timer = null;
  let timeLeft = 52 * 60; // 52 minutos em segundos
  let isWorking = true;
  let isPaused = false;
  let sessionsToday = parseInt(localStorage.getItem('focus_sessions_today') || '0');
  
  const display = document.getElementById('focus-timer-display');
  const status = document.getElementById('focus-timer-status');
  const btnStart = document.getElementById('btn-start-focus');
  const btnPause = document.getElementById('btn-pause-focus');
  const btnReset = document.getElementById('btn-reset-focus');
  const sessionsCount = document.getElementById('sessions-count');
  
  sessionsCount.textContent = sessionsToday;
  
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  function startTimer() {
    if (timer) clearInterval(timer);
    isPaused = false;
    
    btnStart.disabled = true;
    btnPause.disabled = false;
    status.textContent = isWorking ? '🎯 Modo Foco Ativo' : '☕ Tempo de Pausa';
    
    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        
        if (isWorking) {
          sessionsToday++;
          localStorage.setItem('focus_sessions_today', sessionsToday);
          sessionsCount.textContent = sessionsToday;
          alert('🎉 Parabéns! Sessão de foco completa! Hora de uma pausa de 17 minutos.');
          timeLeft = 17 * 60;
          isWorking = false;
        } else {
          alert('✅ Pausa finalizada! Pronto para outra sessão de foco?');
          timeLeft = 52 * 60;
          isWorking = true;
        }
        
        btnStart.disabled = false;
        btnPause.disabled = true;
        status.textContent = 'Sessão finalizada';
      }
    }, 1000);
  }
  
  btnStart.addEventListener('click', startTimer);
  
  btnPause.addEventListener('click', () => {
    if (timer) {
      clearInterval(timer);
      btnStart.disabled = false;
      btnPause.disabled = true;
      status.textContent = '⏸️ Pausado';
    }
  });
  
  btnReset.addEventListener('click', () => {
    if (timer) clearInterval(timer);
    timeLeft = 52 * 60;
    isWorking = true;
    isPaused = false;
    btnStart.disabled = false;
    btnPause.disabled = true;
    status.textContent = 'Reiniciado';
    updateDisplay();
  });
}

// 3. GERADOR DE FÓRMULAS MATEMÁTICAS
function openFormulaGeneratorModal() {
  const html = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-square-root-alt mr-3 text-red-500"></i>Biblioteca de Fórmulas
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button onclick="showFormulas('matematica')" class="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600">
          <i class="fas fa-calculator mr-2"></i>Matemática
        </button>
        <button onclick="showFormulas('fisica')" class="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
          <i class="fas fa-atom mr-2"></i>Física
        </button>
        <button onclick="showFormulas('quimica')" class="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
          <i class="fas fa-flask mr-2"></i>Química
        </button>
      </div>
      
      <div id="formulas-container" class="bg-gray-50 rounded-xl p-6 min-h-[400px]">
        <p class="text-center text-gray-500">Selecione uma matéria acima para ver as fórmulas</p>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupFormulaGenerator();
  }
}

function setupFormulaGenerator() {
  window.showFormulas = function(subject) {
    const container = document.getElementById('formulas-container');
    
    const formulas = {
      matematica: [
        { name: 'Bhaskara', formula: 'x = (-b ± √(b² - 4ac)) / 2a', desc: 'Resolução de equações do 2º grau' },
        { name: 'Área do Círculo', formula: 'A = πr²', desc: 'Área de um círculo com raio r' },
        { name: 'Teorema de Pitágoras', formula: 'a² + b² = c²', desc: 'Relação nos triângulos retângulos' },
        { name: 'Distância entre pontos', formula: 'd = √((x₂-x₁)² + (y₂-y₁)²)', desc: 'Distância no plano cartesiano' },
        { name: 'Progressão Aritmética', formula: 'aₙ = a₁ + (n-1)·r', desc: 'Termo geral da PA' },
        { name: 'Progressão Geométrica', formula: 'aₙ = a₁ · qⁿ⁻¹', desc: 'Termo geral da PG' }
      ],
      fisica: [
        { name: 'Velocidade Média', formula: 'v = Δs / Δt', desc: 'Variação de espaço sobre tempo' },
        { name: 'Energia Cinética', formula: 'Ec = mv² / 2', desc: 'Energia de movimento' },
        { name: 'Lei de Newton', formula: 'F = m · a', desc: 'Força igual a massa vezes aceleração' },
        { name: 'Energia Potencial', formula: 'Ep = m · g · h', desc: 'Energia gravitacional' },
        { name: 'Trabalho', formula: 'τ = F · d · cos(θ)', desc: 'Trabalho de uma força' },
        { name: 'Lei de Ohm', formula: 'V = R · I', desc: 'Tensão, resistência e corrente' }
      ],
      quimica: [
        { name: 'Mol', formula: 'n = m / MM', desc: 'Quantidade de matéria' },
        { name: 'Concentração Molar', formula: 'M = n / V', desc: 'Mols por litro' },
        { name: 'pH', formula: 'pH = -log[H⁺]', desc: 'Potencial hidrogeniônico' },
        { name: 'Gases Ideais', formula: 'PV = nRT', desc: 'Equação de Clapeyron' },
        { name: 'Diluição', formula: 'C₁V₁ = C₂V₂', desc: 'Diluição de soluções' },
        { name: 'Lei de Hess', formula: 'ΔH = ΣH(produtos) - ΣH(reagentes)', desc: 'Entalpia de reação' }
      ]
    };
    
    const selectedFormulas = formulas[subject] || [];
    
    container.innerHTML = `
      <h3 class="text-xl font-bold text-gray-800 mb-4 capitalize">
        <i class="fas fa-book mr-2"></i>${subject}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${selectedFormulas.map(f => `
          <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 class="font-semibold text-gray-800 mb-2">${f.name}</h4>
            <div class="bg-gray-100 rounded p-3 mb-2 font-mono text-lg text-center">${f.formula}</div>
            <p class="text-sm text-gray-600">${f.desc}</p>
          </div>
        `).join('')}
      </div>
    `;
  };
}

// 4. ORGANIZADOR DE TAREFAS DE ESTUDO
function openStudyTasksModal() {
  const html = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-tasks mr-3 text-teal-500"></i>Organizador de Estudos
      </h2>
      
      <div class="mb-6">
        <div class="flex gap-2">
          <input type="text" id="task-input" placeholder="Nova tarefa de estudo..." 
                 class="flex-1 border border-gray-300 rounded-lg px-4 py-3"/>
          <select id="task-priority" class="border border-gray-300 rounded-lg px-4 py-3">
            <option value="high">🔴 Alta</option>
            <option value="medium">🟡 Média</option>
            <option value="low">🟢 Baixa</option>
          </select>
          <button id="btn-add-task" class="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
      
      <div class="space-y-4">
        <div>
          <h3 class="font-semibold text-gray-700 mb-2">📋 Pendentes</h3>
          <div id="pending-tasks" class="space-y-2"></div>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-700 mb-2">✅ Concluídas</h3>
          <div id="completed-tasks" class="space-y-2"></div>
        </div>
      </div>
      
      <div class="mt-6 flex gap-2">
        <button id="btn-clear-completed" class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
          <i class="fas fa-trash mr-2"></i>Limpar Concluídas
        </button>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupStudyTasks();
  }
}

function setupStudyTasks() {
  let tasks = JSON.parse(localStorage.getItem('study_tasks') || '[]');
  
  const input = document.getElementById('task-input');
  const priority = document.getElementById('task-priority');
  const btnAdd = document.getElementById('btn-add-task');
  const pendingContainer = document.getElementById('pending-tasks');
  const completedContainer = document.getElementById('completed-tasks');
  const btnClearCompleted = document.getElementById('btn-clear-completed');
  
  function saveTasks() {
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
  }
  
  function renderTasks() {
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);
    
    pendingContainer.innerHTML = pending.length ? pending.map((task, idx) => {
      const priorityColors = {
        high: 'border-red-300 bg-red-50',
        medium: 'border-yellow-300 bg-yellow-50',
        low: 'border-green-300 bg-green-50'
      };
      
      return `
        <div class="flex items-center gap-2 p-3 border rounded-lg ${priorityColors[task.priority]}">
          <button onclick="toggleTask(${tasks.indexOf(task)})" 
                  class="w-6 h-6 border-2 border-gray-400 rounded hover:bg-teal-500 hover:border-teal-500 transition"></button>
          <span class="flex-1">${task.text}</span>
          <button onclick="deleteTask(${tasks.indexOf(task)})" 
                  class="text-red-500 hover:text-red-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
    }).join('') : '<p class="text-gray-400 text-center py-4">Nenhuma tarefa pendente</p>';
    
    completedContainer.innerHTML = completed.length ? completed.map((task, idx) => `
      <div class="flex items-center gap-2 p-3 border border-gray-200 bg-gray-50 rounded-lg opacity-60">
        <button onclick="toggleTask(${tasks.indexOf(task)})" 
                class="w-6 h-6 bg-teal-500 border-2 border-teal-500 rounded flex items-center justify-center">
          <i class="fas fa-check text-white text-xs"></i>
        </button>
        <span class="flex-1 line-through">${task.text}</span>
        <button onclick="deleteTask(${tasks.indexOf(task)})" 
                class="text-red-500 hover:text-red-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('') : '<p class="text-gray-400 text-center py-4">Nenhuma tarefa concluída</p>';
  }
  
  window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };
  
  window.deleteTask = function(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };
  
  btnAdd.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    
    tasks.push({
      text: text,
      priority: priority.value,
      completed: false,
      createdAt: Date.now()
    });
    
    input.value = '';
    saveTasks();
    renderTasks();
  });
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnAdd.click();
  });
  
  btnClearCompleted.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  });
  
  renderTasks();
}

// 5. DICIONÁRIO RÁPIDO (OFFLINE)
function openDictionaryModal() {
  const html = `
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        <i class="fas fa-book-open mr-3 text-amber-500"></i>Dicionário Rápido
      </h2>
      
      <div class="mb-6">
        <div class="flex gap-2">
          <input type="text" id="word-search" placeholder="Digite uma palavra..." 
                 class="flex-1 border border-gray-300 rounded-lg px-4 py-3"/>
          <button id="btn-search-word" class="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>
      
      <div id="word-result" class="bg-amber-50 border border-amber-200 rounded-xl p-6 min-h-[300px]">
        <p class="text-center text-gray-500 py-12">Digite uma palavra e pressione buscar</p>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    setupDictionary();
  }
}

function setupDictionary() {
  const input = document.getElementById('word-search');
  const btnSearch = document.getElementById('btn-search-word');
  const result = document.getElementById('word-result');
  
  const dictionary = {
    'estudar': {
      def: 'Dedicar-se ao aprendizado; aplicar a inteligência para aprender.',
      ex: 'Preciso estudar para a prova de matemática.',
      sin: ['aprender', 'pesquisar', 'investigar']
    },
    'conhecimento': {
      def: 'Ato ou efeito de conhecer; saber, instrução, ciência.',
      ex: 'O conhecimento é a chave para o sucesso.',
      sin: ['saber', 'ciência', 'erudição']
    },
    'aprender': {
      def: 'Tomar conhecimento de; ficar sabendo; instruir-se.',
      ex: 'É importante aprender com os erros.',
      sin: ['estudar', 'assimilar', 'compreender']
    },
    'dedicação': {
      def: 'Ato de dedicar-se; empenho, aplicação.',
      ex: 'A dedicação aos estudos traz resultados positivos.',
      sin: ['empenho', 'aplicação', 'comprometimento']
    },
    'perseverança': {
      def: 'Qualidade de quem persevera; persistência, constância.',
      ex: 'A perseverança é fundamental para alcançar objetivos.',
      sin: ['persistência', 'tenacidade', 'firmeza']
    }
  };
  
  function searchWord() {
    const word = input.value.trim().toLowerCase();
    
    if (!word) {
      result.innerHTML = '<p class="text-center text-gray-500 py-12">Digite uma palavra e pressione buscar</p>';
      return;
    }
    
    const wordData = dictionary[word];
    
    if (wordData) {
      result.innerHTML = `
        <div class="space-y-4">
          <div>
            <h3 class="text-2xl font-bold text-amber-700 mb-2 capitalize">${word}</h3>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">📖 Definição:</h4>
            <p class="text-gray-600">${wordData.def}</p>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">💬 Exemplo:</h4>
            <p class="text-gray-600 italic">"${wordData.ex}"</p>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">🔄 Sinônimos:</h4>
            <div class="flex flex-wrap gap-2">
              ${wordData.sin.map(s => `<span class="bg-amber-200 px-3 py-1 rounded-full text-sm">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    } else {
      result.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-exclamation-circle text-4xl text-amber-500 mb-4"></i>
          <p class="text-gray-600">Palavra não encontrada no dicionário offline.</p>
          <p class="text-sm text-gray-500 mt-2">Tente: estudar, conhecimento, aprender, dedicação, perseverança</p>
        </div>
      `;
    }
  }
  
  btnSearch.addEventListener('click', searchWord);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWord();
  });
}
