const taxaMulta = 0.02;

const faturas = [
  { id: 1, valor: 1000, diasAtraso: 5, status: "aberto" },
  { id: 2, valor: 500, diasAtraso: 0, status: "pago" },
  { id: 3, valor: 1200, diasAtraso: 10, status: "aberto" },
];

function aplicarMultas(listaFaturas) {
  // Criamos uma NOVA lista para não alterar os dados originais
  const faturasProcessadas = listaFaturas.map((fatura) => ({
    ...fatura,
  }));

  // Percorremos cada fatura para aplicar a regra de negócio
  for (let i = 0; i < faturasProcessadas.length; i++) {
    const fatura = faturasProcessadas[i];

    // Aplicamos multa APENAS se:
    // - status for "aberto"
    // - E houver dias de atraso
    if (fatura.status === "aberto" && fatura.diasAtraso > 0) {
      // Calcula o novo valor com multa de 2%
      fatura.valor += fatura.valor * taxaMulta;

      // Marca que a multa foi aplicada
      fatura.multaAplicada = true;
    } else {
      // Garantimos consistência nos dados
      fatura.multaAplicada = false;
    }
  }

  return faturasProcessadas;
}

const resultado = aplicarMultas(faturas);
console.log(resultado);
