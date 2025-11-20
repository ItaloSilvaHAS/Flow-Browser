// ========== GERADOR DE SIMULADOS ==========

// Função para abrir o modal do Gerador de Simulados
async function openSimuladosModal() {
  // Mostrar interface de seleção de categoria
  if (typeof openModal === 'function') {
    openModal(getCategorySelectionHTML());
  }
}

// Interface minimalista de seleção (lista simples)
function getCategorySelectionHTML() {
  return `
    <div class="max-w-xl mx-auto px-6 py-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">
          <i class="fas fa-graduation-cap mr-2 text-blue-500"></i>
          Gerador de Simulados
        </h2>
        <p class="text-gray-600">Escolha o tipo de simulado</p>
      </div>
      
      <div class="space-y-3">
        <!-- ENEM -->
        <button onclick="startSimulado('ENEM')" 
                class="w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition-all group">
          <div class="flex items-center">
            <i class="fas fa-book-open text-2xl mr-4"></i>
            <div class="text-left">
              <h3 class="font-bold text-lg">ENEM</h3>
              <p class="text-sm text-blue-100">Exame Nacional</p>
            </div>
          </div>
          <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
        
        <!-- FATEC -->
        <button onclick="startSimulado('FATEC')" 
                class="w-full flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition-all group">
          <div class="flex items-center">
            <i class="fas fa-university text-2xl mr-4"></i>
            <div class="text-left">
              <h3 class="font-bold text-lg">FATEC</h3>
              <p class="text-sm text-green-100">Faculdade de Tecnologia</p>
            </div>
          </div>
          <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
        
        <!-- FUVEST -->
        <button onclick="startSimulado('FUVEST')" 
                class="w-full flex items-center justify-between bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition-all group">
          <div class="flex items-center">
            <i class="fas fa-graduation-cap text-2xl mr-4"></i>
            <div class="text-left">
              <h3 class="font-bold text-lg">FUVEST</h3>
              <p class="text-sm text-red-100">USP</p>
            </div>
          </div>
          <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
        
        <!-- Vestibulinho -->
        <button onclick="startSimulado('VESTIBULINHO')" 
                class="w-full flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition-all group">
          <div class="flex items-center">
            <i class="fas fa-pen-fancy text-2xl mr-4"></i>
            <div class="text-left">
              <h3 class="font-bold text-lg">Vestibulinho</h3>
              <p class="text-sm text-orange-100">Ensino Médio</p>
            </div>
          </div>
          <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
        
        <!-- Todos -->
        <button onclick="startSimulado('TODOS')" 
                class="w-full flex items-center justify-between bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg px-6 py-4 shadow-md hover:shadow-lg transition-all group">
          <div class="flex items-center">
            <i class="fas fa-layer-group text-2xl mr-4"></i>
            <div class="text-left">
              <h3 class="font-bold text-lg">Todos</h3>
              <p class="text-sm text-gray-300">Mix Completo</p>
            </div>
          </div>
          <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
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
    <div class="max-w-6xl mx-auto h-full flex flex-col">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl px-8 py-6 flex justify-between items-center mb-6 shadow-lg">
        <div>
          <h2 class="text-3xl font-bold text-white flex items-center">
            <i class="fas fa-graduation-cap mr-3"></i>${categoria}
          </h2>
          <p class="text-blue-100 text-sm mt-1">${questoes.length} questões • Boa sorte!</p>
        </div>
        <div class="flex items-center gap-4">
          <div id="timer-display" class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div class="text-white text-lg font-bold">
              <i class="fas fa-clock mr-2"></i><span id="timer-text">30:00</span>
            </div>
          </div>
          <button id="btn-finalizar-simulado" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <i class="fas fa-check-circle mr-2"></i>Finalizar Prova
          </button>
        </div>
      </div>
      
      <div id="simulado-content" class="flex-1 overflow-y-auto px-2" style="scrollbar-width: thin; scrollbar-color: #3b82f6 #e5e7eb;">
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


// Função para normalizar gabarito do Supabase
function normalizarGabarito(gabaritoBruto) {
  if (!gabaritoBruto) return null;

  const g = gabaritoBruto.toString().trim().toUpperCase();

  // Formato R1-R5 → converte para letra
  const rMatch = g.match(/^R([1-5])$/);
  if (rMatch) return String.fromCharCode(64 + parseInt(rMatch[1], 10)); // R1->A, R2->B ...

  // Já é letra A-E
  if (["A","B","C","D","E"].includes(g)) return g;

  // Caso inválido
  return null;
}

// Converte letra A-E em índice 0-4
function gabaritoParaIndice(g) {
  if (!g) return null;
  return g.charCodeAt(0) - 65;
}

// Função principal para obter questões do Supabase
async function obterQuestoesDoSupabase(categoria = 'TODOS') {
  try {
    if (!supabaseClient) {
      console.error('❌ Supabase não inicializado');
      alert('Erro: Supabase não inicializado. Verifique a conexão.');
      return [];
    }

    console.log(`🔍 Buscando questões de ${categoria}...`);

    let query = supabaseClient.from('Simulados').select('*');
    if (categoria !== 'TODOS') query = query.ilike('Banca', `%${categoria}%`);

    let { data, error } = await query;

    if (error) {
      console.log('⚠️ Tentando tabela "simulados" (minúsculo)...');
      query = supabaseClient.from('simulados').select('*');
      if (categoria !== 'TODOS') query = query.ilike('Banca', `%${categoria}%`);
      const result = await query;
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('❌ Erro ao buscar questões:', error);
      alert(`Erro: ${error.message}\nVerifique se a tabela existe no Supabase.`);
      return [];
    }

    if (!data || data.length === 0) {
      console.log(`⚠️ Nenhuma questão encontrada para ${categoria}`);
      return [];
    }

    // Processar questões
    const questoes = data.map(q => {
      const alternativas = [q.R1, q.R2, q.R3, q.R4, q.R5].filter(a => a && a.trim() !== "");

      const gabaritoLetra = normalizarGabarito(q.Gabarito);
      const respostaCorreta = gabaritoParaIndice(gabaritoLetra);

      console.log(`🔍 Q${q.id}: DB="${q.Gabarito}" → Letra=${gabaritoLetra} → Índice=${respostaCorreta}`);

      return {
        id: q.id,
        enunciado: q.Enunciado || 'Questão sem enunciado',
        alternativas,
        respostaCorreta,
        gabarito: gabaritoLetra,
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
    <div class="bg-white rounded-2xl shadow-lg p-8 mb-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
      <div class="flex justify-between items-start mb-5">
        <div class="flex-1">
          <div class="flex items-center mb-3">
            <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3">
              ${index + 1}
            </span>
            <h3 class="text-lg font-bold text-gray-900">Questão ${index + 1}</h3>
          </div>
          <p class="text-gray-800 leading-relaxed text-base">
            ${questao.enunciado}
          </p>
        </div>
        ${questao.ano || questao.banca ? `
          <div class="flex flex-col items-end text-xs bg-gray-100 rounded-lg px-3 py-2 ml-4">
            ${questao.banca ? `<span class="font-semibold text-gray-700"><i class="fas fa-building mr-1"></i>${questao.banca}</span>` : ''}
            ${questao.ano ? `<span class="text-gray-600 mt-1"><i class="fas fa-calendar mr-1"></i>${questao.ano}</span>` : ''}
          </div>
        ` : ''}
      </div>
      <div class="space-y-3 mt-6">
        ${questao.alternativas.map((alt, altIndex) => `
          <label class="flex items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
            <input type="radio" name="questao-${questao.id}" value="${altIndex}" class="mt-1 mr-4 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500">
            <span class="text-gray-800 leading-relaxed flex-1 group-hover:text-blue-900">
              <strong class="font-bold mr-2">${String.fromCharCode(65 + altIndex)})</strong>${alt}
            </span>
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
      const questoes = window.currentSimuladoQuestoes || [];
      finalizarSimulado(questoes);
    }
  }, 1000);
  
  window.simuladoTimer = interval;
}

// Configurar eventos do simulado
function setupSimulado(questoes) {
  // Salvar questões globalmente para acesso no timer
  window.currentSimuladoQuestoes = questoes;
  
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
  const resultadosDetalhados = [];
  
  questoes.forEach((questao, index) => {
    const resposta = document.querySelector(`input[name="questao-${questao.id}"]:checked`);
    
    if (resposta) {
      respondidas++;
      const respostaUsuario = parseInt(resposta.value);
      const respostaCorreta = Number(questao.respostaCorreta);
      const acertou = respostaUsuario === respostaCorreta;
      
      console.log(`🔎 Q${questao.id}:
        📝 Usuário: ${respostaUsuario} (${String.fromCharCode(65 + respostaUsuario)})
        ✅ Correta: ${respostaCorreta} (${questao.gabarito})
        📊 Tipos: user=${typeof respostaUsuario} correta=${typeof respostaCorreta}
        ${acertou ? '✅ ACERTOU!' : '❌ ERROU!'}`);
      
      if (acertou) {
        acertos++;
      }
      
      resultadosDetalhados.push({
        numero: index + 1,
        acertou: acertou
      });
    } else {
      resultadosDetalhados.push({
        numero: index + 1,
        acertou: null
      });
    }
  });
  
  const totalQuestoes = questoes.length;
  const percentual = totalQuestoes > 0 ? ((acertos / totalQuestoes) * 100).toFixed(1) : 0;
  const erros = respondidas - acertos;
  
  // Gerar mini gabarito visual
  const miniGabarito = resultadosDetalhados.map(r => {
    if (r.acertou === null) {
      return `<div class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-400" title="Questão ${r.numero} - Não respondida">${r.numero}</div>`;
    } else if (r.acertou) {
      return `<div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-xs font-bold text-white" title="Questão ${r.numero} - Correta"><i class="fas fa-check"></i></div>`;
    } else {
      return `<div class="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-xs font-bold text-white" title="Questão ${r.numero} - Incorreta"><i class="fas fa-times"></i></div>`;
    }
  }).join('');
  
  const resultado = `
    <div class="text-center max-w-3xl mx-auto">
      <div class="mb-8">
        <i class="fas fa-trophy text-8xl ${percentual >= 70 ? 'text-yellow-400' : percentual >= 50 ? 'text-gray-400' : 'text-orange-400'} mb-4 animate-bounce"></i>
      </div>
      
      <h2 class="text-4xl font-bold text-gray-900 mb-3">Prova Finalizada!</h2>
      <p class="text-gray-600 mb-8">Confira seu desempenho abaixo</p>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-md">
          <div class="text-4xl font-bold text-blue-600 mb-2">${totalQuestoes}</div>
          <div class="text-sm font-medium text-blue-800">Total</div>
        </div>
        
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-md">
          <div class="text-4xl font-bold text-green-600 mb-2">${acertos}</div>
          <div class="text-sm font-medium text-green-800">Acertos</div>
        </div>
        
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-md">
          <div class="text-4xl font-bold text-red-600 mb-2">${erros}</div>
          <div class="text-sm font-medium text-red-800">Erros</div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-md">
          <div class="text-4xl font-bold text-purple-600 mb-2">${percentual}%</div>
          <div class="text-sm font-medium text-purple-800">Nota</div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r ${percentual >= 70 ? 'from-green-500 to-green-600' : percentual >= 50 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white rounded-2xl p-6 mb-8 shadow-lg">
        <div class="text-2xl font-bold mb-2">
          ${percentual >= 70 ? '🎉 Parabéns! Excelente desempenho!' : 
            percentual >= 50 ? '👍 Bom trabalho! Continue estudando!' : 
            '💪 Continue se esforçando! A prática leva à perfeição!'}
        </div>
        <p class="text-sm opacity-90">
          ${percentual >= 70 ? 'Você está no caminho certo para a aprovação!' : 
            percentual >= 50 ? 'Com mais dedicação, você chegará lá!' : 
            'Cada questão é um aprendizado. Não desista!'}
        </p>
      </div>
      
      <!-- Mini Gabarito Visual -->
      <div class="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center">
          <i class="fas fa-list-check mr-2 text-blue-500"></i>
          Mapa de Acertos
        </h3>
        <div class="grid grid-cols-10 gap-2 justify-items-center">
          ${miniGabarito}
        </div>
        <div class="flex justify-center items-center gap-6 mt-6 text-sm">
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span class="text-gray-600">Acertou</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span class="text-gray-600">Errou</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <span class="text-gray-600">Em branco</span>
          </div>
        </div>
      </div>
      
      <button onclick="openSimuladosModal()" class="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
        <i class="fas fa-redo mr-3"></i>Fazer Outro Simulado
      </button>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(resultado);
  }
}

// Expor funções globalmente
window.startSimulado = startSimulado;
