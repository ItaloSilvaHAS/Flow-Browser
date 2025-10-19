// ========== GERADOR DE SIMULADOS ==========

// Função para abrir o modal do Gerador de Simulados
async function openSimuladosModal() {
  // Mostrar interface de seleção de categoria
  if (typeof openModal === 'function') {
    openModal(getCategorySelectionHTML());
  }
}

// Interface minimalista de seleção de categoria
function getCategorySelectionHTML() {
  return `
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-3">
          <i class="fas fa-graduation-cap mr-3 text-blue-500"></i>
          Gerador de Simulados
        </h2>
        <p class="text-gray-600">Escolha o tipo de simulado que deseja fazer</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <!-- ENEM -->
        <button onclick="startSimulado('ENEM')" 
                class="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <i class="fas fa-book-open text-5xl mb-4 group-hover:scale-110 transition-transform"></i>
            <h3 class="text-2xl font-bold mb-2">ENEM</h3>
            <p class="text-blue-100 text-sm">Exame Nacional do Ensino Médio</p>
          </div>
        </button>
        
        <!-- ETEC -->
        <button onclick="startSimulado('ETEC')" 
                class="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <i class="fas fa-laptop-code text-5xl mb-4 group-hover:scale-110 transition-transform"></i>
            <h3 class="text-2xl font-bold mb-2">ETEC</h3>
            <p class="text-purple-100 text-sm">Escola Técnica Estadual</p>
          </div>
        </button>
        
        <!-- FATEC -->
        <button onclick="startSimulado('FATEC')" 
                class="group bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <i class="fas fa-university text-5xl mb-4 group-hover:scale-110 transition-transform"></i>
            <h3 class="text-2xl font-bold mb-2">FATEC</h3>
            <p class="text-green-100 text-sm">Faculdade de Tecnologia</p>
          </div>
        </button>
        
        <!-- Vestibulinho -->
        <button onclick="startSimulado('VESTIBULINHO')" 
                class="group bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <i class="fas fa-pen-fancy text-5xl mb-4 group-hover:scale-110 transition-transform"></i>
            <h3 class="text-2xl font-bold mb-2">Vestibulinho</h3>
            <p class="text-orange-100 text-sm">Vestibular de Ensino Médio</p>
          </div>
        </button>
        
        <!-- Todos -->
        <button onclick="startSimulado('TODOS')" 
                class="group md:col-span-2 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          <div class="text-center">
            <i class="fas fa-layer-group text-4xl mb-3 group-hover:scale-110 transition-transform"></i>
            <h3 class="text-xl font-bold mb-2">Simulado Completo</h3>
            <p class="text-gray-300 text-sm">Todas as questões disponíveis</p>
          </div>
        </button>
      </div>
    </div>
  `;
}

// Iniciar simulado com categoria selecionada
async function startSimulado(categoria) {
  console.log(`📚 Iniciando simulado: ${categoria}`);
  
  if (typeof openModal === 'function') {
    openModal(`
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p class="text-gray-600">Carregando questões de ${categoria}...</p>
        </div>
      </div>
    `);
  }
  
  const questoes = await obterQuestoesDoSupabase(categoria);
  
  if (questoes.length === 0) {
    if (typeof openModal === 'function') {
      openModal(`
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Nenhuma questão encontrada</h2>
          <p class="text-gray-600 mb-6">Não há questões de ${categoria} cadastradas no banco de dados.</p>
          <button onclick="openSimuladosModal()" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            <i class="fas fa-arrow-left mr-2"></i>Voltar
          </button>
        </div>
      `);
    }
    return;
  }

  const html = `
    <div class="max-w-5xl mx-auto h-full flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          <i class="fas fa-graduation-cap mr-2 text-blue-500"></i>${categoria}
          <span class="text-sm text-gray-500 ml-2">(${questoes.length} questões)</span>
        </h2>
        <div class="flex items-center gap-4">
          <div id="timer-display" class="text-xl font-bold text-red-600">
            <i class="fas fa-clock mr-2"></i><span id="timer-text">30:00</span>
          </div>
          <button id="btn-finalizar-simulado" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <i class="fas fa-check mr-2"></i>Finalizar
          </button>
        </div>
      </div>
      
      <div id="simulado-content" class="flex-1 overflow-y-auto">
        ${gerarQuestoesHTML(questoes)}
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
    iniciarTimer(30 * 60);
    setupSimulado(questoes);
  }
}

// Função para obter questões do Supabase com filtro por categoria
async function obterQuestoesDoSupabase(categoria = 'TODOS') {
  try {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) {
      console.error('❌ Supabase não inicializado');
      alert('Erro: Supabase não inicializado. Verifique a conexão.');
      return [];
    }

    console.log(`🔍 Buscando questões de ${categoria}...`);
    
    let query = supabaseClient.from('Simulados').select('*');
    
    // Filtrar por banca se não for TODOS
    if (categoria !== 'TODOS') {
      query = query.ilike('Banca', `%${categoria}%`);
    }
    
    let { data, error } = await query;

    // Tentar com tabela minúscula se der erro
    if (error) {
      console.log('⚠️ Tentando tabela "simulados" (minúsculo)...');
      query = supabaseClient.from('simulados').select('*');
      if (categoria !== 'TODOS') {
        query = query.ilike('Banca', `%${categoria}%`);
      }
      const result = await query;
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('❌ Erro ao buscar questões:', error);
      alert(`Erro: ${error.message}\n\nVerifique se a tabela existe no Supabase.`);
      return [];
    }

    console.log('📊 Dados retornados:', data);

    if (!data || data.length === 0) {
      console.log(`⚠️ Nenhuma questão encontrada para ${categoria}`);
      return [];
    }

    // Converter dados do Supabase para o formato esperado
    const questoes = data.map(q => {
      const alternativas = [];
      if (q.R1) alternativas.push(q.R1);
      if (q.R2) alternativas.push(q.R2);
      if (q.R3) alternativas.push(q.R3);
      if (q.R4) alternativas.push(q.R4);
      if (q.R5) alternativas.push(q.R5);

      const gabarito = q.Gabarito ? q.Gabarito.toUpperCase() : 'A';
      const respostaCorreta = gabarito.charCodeAt(0) - 65;

      return {
        id: q.id,
        enunciado: q.Enunciado || 'Questão sem enunciado',
        alternativas: alternativas,
        respostaCorreta: respostaCorreta,
        ano: q.Ano,
        banca: q.Banca
      };
    });

    console.log(`✅ ${questoes.length} questões carregadas`);
    return questoes;

  } catch (error) {
    console.error('❌ Erro ao obter questões:', error);
    return [];
  }
}

// Função para gerar o HTML das questões
function gerarQuestoesHTML(questoes) {
  return questoes.map((questao, index) => `
    <div class="bg-white rounded-lg shadow-md p-6 mb-4">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-lg font-semibold text-gray-800">
          ${index + 1}. ${questao.enunciado}
        </h3>
        ${questao.ano || questao.banca ? `
          <div class="flex flex-col items-end text-xs text-gray-500 ml-4">
            ${questao.banca ? `<span><i class="fas fa-building mr-1"></i>${questao.banca}</span>` : ''}
            ${questao.ano ? `<span><i class="fas fa-calendar mr-1"></i>${questao.ano}</span>` : ''}
          </div>
        ` : ''}
      </div>
      <div class="space-y-2">
        ${questao.alternativas.map((alt, altIndex) => `
          <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
            <input type="radio" name="questao-${questao.id}" value="${altIndex}" class="mr-3 w-4 h-4">
            <span class="text-gray-700">${String.fromCharCode(65 + altIndex)}) ${alt}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Função para iniciar o timer
function iniciarTimer(segundos) {
  let tempoRestante = segundos;
  const timerText = document.getElementById('timer-text');
  
  if (!timerText) return;
  
  const interval = setInterval(() => {
    tempoRestante--;
    
    const minutos = Math.floor(tempoRestante / 60);
    const segundosRestantes = tempoRestante % 60;
    
    timerText.textContent = `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
    
    if (tempoRestante <= 300) {
      timerText.classList.add('animate-pulse');
    }
    
    if (tempoRestante <= 0) {
      clearInterval(interval);
      alert('⏰ Tempo esgotado!');
      finalizarSimulado();
    }
  }, 1000);
  
  window.simuladoTimer = interval;
}

// Configurar eventos do simulado
function setupSimulado(questoes) {
  const btnFinalizar = document.getElementById('btn-finalizar-simulado');
  
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => finalizarSimulado(questoes));
  }
}

// Finalizar simulado e mostrar resultado
function finalizarSimulado(questoes) {
  if (window.simuladoTimer) {
    clearInterval(window.simuladoTimer);
  }
  
  if (!questoes || questoes.length === 0) {
    alert('Simulado finalizado!');
    return;
  }
  
  let acertos = 0;
  let respondidas = 0;
  
  questoes.forEach(questao => {
    const resposta = document.querySelector(`input[name="questao-${questao.id}"]:checked`);
    
    if (resposta) {
      respondidas++;
      if (parseInt(resposta.value) === questao.respostaCorreta) {
        acertos++;
      }
    }
  });
  
  const percentual = respondidas > 0 ? ((acertos / respondidas) * 100).toFixed(1) : 0;
  
  const resultado = `
    <div class="text-center max-w-2xl mx-auto">
      <div class="mb-6">
        <i class="fas fa-trophy text-7xl ${percentual >= 70 ? 'text-yellow-500' : percentual >= 50 ? 'text-gray-400' : 'text-orange-500'} mb-4"></i>
      </div>
      
      <h2 class="text-3xl font-bold text-gray-800 mb-6">Resultado do Simulado</h2>
      
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-3xl font-bold text-blue-600">${respondidas}</div>
          <div class="text-sm text-gray-600">Respondidas</div>
        </div>
        
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-3xl font-bold text-green-600">${acertos}</div>
          <div class="text-sm text-gray-600">Acertos</div>
        </div>
        
        <div class="bg-purple-50 rounded-lg p-4">
          <div class="text-3xl font-bold text-purple-600">${percentual}%</div>
          <div class="text-sm text-gray-600">Aproveitamento</div>
        </div>
      </div>
      
      <div class="text-gray-600 mb-6">
        ${percentual >= 70 ? '🎉 Parabéns! Excelente desempenho!' : 
          percentual >= 50 ? '👍 Bom trabalho! Continue estudando!' : 
          '💪 Continue se esforçando! A prática leva à perfeição!'}
      </div>
      
      <button onclick="openSimuladosModal()" class="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg">
        <i class="fas fa-redo mr-2"></i>Fazer Outro Simulado
      </button>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(resultado);
  }
}

// Expor funções globalmente
window.startSimulado = startSimulado;
