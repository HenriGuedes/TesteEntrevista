// Simulador de API externa (não alterar)
function buscarDetalhesGrao(idGrao) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: idGrao,
        classificacao: "Especial",
        notas: "Caramelo e Nozes",
      });
    }, 1500);
  });
}

async function processarLotes(listaIds) {
  console.log("Iniciando requisições para a API...");

  // O método map é utilizado para percorrer a lista de IDs
  // Como a função é async, cada iteração retorna uma Promise
  // Ou seja, ao final teremos um array de Promises, e não os dados ainda resolvidos
  const promessas = listaIds.map(async (id) => {
    // Para cada ID, é feita uma chamada à API externa
    // O await aqui resolve a Promise individualmente
    const detalhes = await buscarDetalhesGrao(id);
    return detalhes;
  });

  // Promise.all é responsável por aguardar todas as Promises do array serem resolvidas
  // Somente após todas as requisições finalizarem, teremos os dados completos
  const lotesProcessados = await Promise.all(promessas);

  // Esse log só será executado após todas as chamadas da API terminarem
  console.log("Processamento concluído!");

  // Retorna o array final contendo os dados já resolvidos
  return lotesProcessados;
}

// Execução do processamento
const idsDosLotes = [1045, 1046, 1047];

processarLotes(idsDosLotes).then((resultado) => {
  // Aqui já recebemos os dados completos, não mais Promises pendentes
  console.log("Resultado Final:", resultado);
});
