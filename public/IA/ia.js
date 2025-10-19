// Sistema de IA local baseado em banco de texto

let bancoDados = [];

// Carregar banco de dados
async function carregarBanco() {
  try {
    const response = await fetch('IA/banco.txt');
    const texto = await response.text();

    const blocos = texto.trim().split('\n\n');
    bancoDados = blocos.map(bloco => {
      const linhas = bloco.split('\n');
      const perguntas = linhas[0].replace('P: ', '').split('|').map(p => p.trim().toLowerCase());
      const resposta = linhas[1].replace('R: ', '').trim();
      return { perguntas, resposta };
    });

    console.log('✅ Banco de conhecimento carregado:', bancoDados.length, 'entradas');
  } catch (erro) {
    console.error('❌ Erro ao carregar banco:', erro);
  }
}

// Buscar resposta no banco
function buscarResposta(perguntaUsuario) {
  const perguntaLower = perguntaUsuario.toLowerCase().trim();

  for (const entrada of bancoDados) {
    for (const pergunta of entrada.perguntas) {
      // Correspondência exata ou parcial
      if (
        perguntaLower === pergunta ||                         // Igual
        perguntaLower.includes(pergunta) ||                  // A pergunta do usuário contém a cadastrada
        pergunta.includes(perguntaLower)                     // A pergunta cadastrada contém a do usuário
      ) {
        return entrada.resposta;
      }
    }
  }

  // Resposta padrão
  const padraoEntry = bancoDados.find(e => e.perguntas.includes('default'));
  return padraoEntry ? padraoEntry.resposta : 'Desculpe, não sei responder isso.';
}

// Inicializar ao carregar
carregarBanco();

console.log('✅ IA local carregada com sucesso!');
