// ========== GERADOR DE SIMULADOS ==========

// Função para abrir o modal do Gerador de Simulados
async function openSimuladosModal() {
  // Mostrar loading
  if (typeof openModal === 'function') {
    openModal(`
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p class="text-gray-600">Carregando questões do simulado...</p>
        </div>
      </div>
    `);
  }
  
  const questoes = await obterQuestoesDoSupabase();
  
  if (questoes.length === 0) {
    if (typeof openModal === 'function') {
      openModal(`
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Nenhuma questão encontrada</h2>
          <p class="text-gray-600">Não há questões cadastradas no banco de dados.</p>
        </div>
      `);
    }
    return;
  }

  const html = `
    <div class="max-w-5xl mx-auto h-full flex flex-col">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          <i class="fas fa-graduation-cap mr-2 text-blue-500"></i>Gerador de Simulados
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
    iniciarTimer(30 * 60); // 30 minutos em segundos
    setupSimulado(questoes);
  }
}

// Função para obter questões do Supabase
async function obterQuestoesDoSupabase() {
  try {
    // Verificar se o supabaseClient está disponível (do auth.js)
    if (typeof supabaseClient === 'undefined' || !supabaseClient) {
      console.error('❌ Supabase não inicializado');
      alert('Erro: Supabase não inicializado. Verifique a conexão.');
      return [];
    }

    console.log('🔍 Buscando questões da tabela Simulados...');
    
    // Tentar buscar da tabela Simulados (com S maiúsculo)
    let { data, error } = await supabaseClient
      .from('Simulados')
      .select('*');

    // Se der erro, tentar com s minúsculo
    if (error) {
      console.log('⚠️ Tentando tabela "simulados" (minúsculo)...');
      const result = await supabaseClient.from('simulados').select('*');
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
      console.log('⚠️ A tabela existe mas está vazia');
      return [];
    }

    // Converter dados do Supabase para o formato esperado
    const questoes = data.map(q => {
      // Montar array de alternativas (R1, R2, R3, R4, R5)
      const alternativas = [];
      if (q.R1) alternativas.push(q.R1);
      if (q.R2) alternativas.push(q.R2);
      if (q.R3) alternativas.push(q.R3);
      if (q.R4) alternativas.push(q.R4);
      if (q.R5) alternativas.push(q.R5);

      // Converter gabarito (A, B, C, D, E) para índice (0, 1, 2, 3, 4)
      const gabarito = q.Gabarito ? q.Gabarito.toUpperCase() : 'A';
      const respostaCorreta = gabarito.charCodeAt(0) - 65; // 'A' = 65, então 'A' = 0, 'B' = 1, etc.

      return {
        id: q.id,
        enunciado: q.Enunciado || 'Questão sem enunciado',
        alternativas: alternativas,
        respostaCorreta: respostaCorreta,
        ano: q.Ano,
        banca: q.Banca
      };
    });

    console.log(`✅ ${questoes.length} questões carregadas do Supabase`);
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
  
  const intervalo = setInterval(() => {
    tempoRestante--;
    
    const minutos = Math.floor(tempoRestante / 60);
    const segs = tempoRestante % 60;
    
    timerText.textContent = `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    
    // Mudar cor quando faltar menos de 5 minutos
    if (tempoRestante < 300) {
      timerText.parentElement.className = 'text-xl font-bold text-red-600 animate-pulse';
    }
    
    // Tempo esgotado
    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      finalizarSimulado(true, window.questoesAtivas);
    }
  }, 1000);
  
  // Salvar o intervalo para poder limpar depois
  window.simuladoInterval = intervalo;
}

// Função para configurar o simulado
function setupSimulado(questoes) {
  const btnFinalizar = document.getElementById('btn-finalizar-simulado');
  
  if (btnFinalizar) {
    btnFinalizar.onclick = () => finalizarSimulado(false, questoes);
  }
  
  // Salvar referência das questões para uso no timer
  window.questoesAtivas = questoes;
}

// Função para finalizar o simulado
function finalizarSimulado(tempoEsgotado, questoes) {
  // Limpar o timer
  if (window.simuladoInterval) {
    clearInterval(window.simuladoInterval);
  }
  
  // Se questões não foram passadas, usar as salvas
  if (!questoes) {
    questoes = window.questoesAtivas || [];
  }
  
  let acertos = 0;
  const respostas = [];
  
  questoes.forEach(questao => {
    const respostaSelecionada = document.querySelector(`input[name="questao-${questao.id}"]:checked`);
    const resposta = respostaSelecionada ? parseInt(respostaSelecionada.value) : -1;
    
    respostas.push({
      questao: questao.enunciado,
      respostaUsuario: resposta,
      respostaCorreta: questao.respostaCorreta,
      correto: resposta === questao.respostaCorreta
    });
    
    if (resposta === questao.respostaCorreta) {
      acertos++;
    }
  });
  
  const percentual = ((acertos / questoes.length) * 100).toFixed(1);
  
  mostrarResultado(acertos, questoes.length, percentual, respostas, tempoEsgotado);
}

// Função para mostrar o resultado
function mostrarResultado(acertos, total, percentual, respostas, tempoEsgotado) {
  const status = percentual >= 70 ? 'Aprovado' : 'Reprovado';
  const statusColor = percentual >= 70 ? 'text-green-600' : 'text-red-600';
  const statusIcon = percentual >= 70 ? 'fa-check-circle' : 'fa-times-circle';
  
  const html = `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-6">
        <i class="fas ${statusIcon} mr-2 ${statusColor}"></i>
        <span class="${statusColor}">${status}!</span>
      </h2>
      
      ${tempoEsgotado ? '<p class="text-center text-red-600 font-semibold mb-4"><i class="fas fa-exclamation-triangle mr-2"></i>Tempo esgotado!</p>' : ''}
      
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-3xl font-bold text-blue-600">${acertos}/${total}</p>
            <p class="text-gray-600">Acertos</p>
          </div>
          <div>
            <p class="text-3xl font-bold ${statusColor}">${percentual}%</p>
            <p class="text-gray-600">Percentual</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-gray-600">${total - acertos}</p>
            <p class="text-gray-600">Erros</p>
          </div>
        </div>
      </div>
      
      <h3 class="text-xl font-bold mb-4">Gabarito:</h3>
      <div class="space-y-3 max-h-96 overflow-y-auto">
        ${respostas.map((r, i) => `
          <div class="bg-white rounded-lg p-4 ${r.correto ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}">
            <p class="font-semibold mb-2">${i + 1}. ${r.questao}</p>
            <div class="text-sm">
              ${r.respostaUsuario === -1 ? 
                '<p class="text-gray-500">Não respondida</p>' : 
                `<p class="${r.correto ? 'text-green-600' : 'text-red-600'}">Sua resposta: ${String.fromCharCode(65 + r.respostaUsuario)}</p>`
              }
              ${!r.correto ? `<p class="text-green-600">Resposta correta: ${String.fromCharCode(65 + r.respostaCorreta)}</p>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="mt-6 flex gap-3">
        <button onclick="closeModal()" class="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
          <i class="fas fa-home mr-2"></i>Voltar
        </button>
        <button onclick="closeModal(); setTimeout(openSimuladosModal, 100);" class="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600">
          <i class="fas fa-redo mr-2"></i>Novo Simulado
        </button>
      </div>
    </div>
  `;
  
  if (typeof openModal === 'function') {
    openModal(html);
  }
}

console.log('✅ Gerador de Simulados carregado com sucesso!');
