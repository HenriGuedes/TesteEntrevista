const pedidoOriginal = {
  id: "IMP-001",
  cliente: "João",
  data: "2026-04-20",
  parametrosTecnicos: {
    tecnologia: "FDM",
    filamento: { tipo: "PLA", cor: "Branco" },
    tempoHoras: 12,
  },
  status: "concluido",
};

function clonarPedido(pedido, novoCliente, novoId) {
  return {
    // O spread operator copia apenas o primeiro nível do objeto
    // Isso significa que propriedades primitivas são copiadas por valor
    // mas objetos internos continuam compartilhando a mesma referência
    ...pedido,

    // Aqui são sobrescritos os campos que devem ser diferentes no novo pedido
    id: novoId,
    cliente: novoCliente,
    status: "pendente",
    data: "2026-04-27",

    // Para evitar compartilhamento de referência em objetos aninhados,
    // é necessário criar uma nova cópia também do nível interno
    parametrosTecnicos: {
      // Copia os dados do nível intermediário
      ...pedido.parametrosTecnicos,

      // Clonagem explícita do objeto mais interno (filamento)
      // garantindo que alterações no clone não afetem o pedido original
      filamento: {
        ...pedido.parametrosTecnicos.filamento,
      },
    },
  };
}

// --- Validação do comportamento ---

const copia = clonarPedido(pedidoOriginal, "Maria", "IMP-002");

// Alteração aplicada apenas no clone
// Isso não deve impactar o objeto original
copia.parametrosTecnicos.filamento.cor = "Preto";

// Verificação do comportamento esperado
console.log(
  "Cor no pedido original:",
  pedidoOriginal.parametrosTecnicos.filamento.cor,
);

// Resultado esperado: "Branco"
