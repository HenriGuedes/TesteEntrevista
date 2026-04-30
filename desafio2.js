const pedidos = [
  {
    id: "P001",
    cliente: { nome: "Empresa Alpha", regiao: "SP" },
    itens: [
      { nome: "Licença Base", categoria: "Software", qtd: 2, preco: 1500 },
      { nome: "Suporte", categoria: "Serviço", qtd: 1, preco: 500 },
    ],
  },
  {
    id: "P002",
    cliente: { nome: "Tech Beta", regiao: "MG" },
    itens: [{ nome: "Módulo CRM", categoria: "Software", qtd: 1, preco: 3000 }],
  },
  {
    id: "P003",
    cliente: { nome: "Indústria Gama", regiao: "RJ" },
    itens: [
      { nome: "Hardware Auth", categoria: "Hardware", qtd: 5, preco: 600 },
    ],
  },
];

function calcularValor(pedidos) {
  // Array que irá armazenar o resultado final no formato solicitado
  const resultado = [];

  // Percorremos todos os pedidos recebidos
  for (let e = 0; e < pedidos.length; e++) {
    const pedido = pedidos[e];
    const itens = pedido.itens;
    const cliente = pedido.cliente;

    let totalGeral = 0;
    let possuiServico = false;

    // Percorremos os itens do pedido para calcular o valor total
    for (let i = 0; i < itens.length; i++) {
      const item = itens[i];

      // Soma do total do pedido (quantidade * preço)
      totalGeral += item.qtd * item.preco;

      // Verificamos se existe algum item da categoria "Serviço"
      // Se existir, o pedido não será elegível a desconto
      if (item.categoria === "Serviço") {
        possuiServico = true;
      }
    }

    let valorFinal = totalGeral;
    let teveDesconto = false;

    // Verificamos se o cliente pertence a uma região elegível
    const regiaoValida = cliente.regiao === "SP" || cliente.regiao === "RJ";

    // Aplicação das regras de desconto:
    // O desconto só será aplicado se:
    // - NÃO houver item de serviço
    // - A região for SP ou RJ
    // - O valor total for maior que 2000
    if (!possuiServico && regiaoValida && totalGeral > 2000) {
      const desconto = totalGeral * 0.1;
      valorFinal = totalGeral - desconto;
      teveDesconto = true;
    }

    // Montamos o objeto final contendo apenas os dados solicitados
    const resumo = {
      idPedido: pedido.id,
      nomeCliente: cliente.nome,
      valorTotalFinal: valorFinal,
      teveDesconto: teveDesconto,
    };

    // Adicionamos o resultado no array final
    resultado.push(resumo);
  }

  // Retornamos o relatório final
  return resultado;
}

const relatorio = calcularValor(pedidos);
console.log(relatorio);
