# Teste Técnico - Biofast

## Como rodar os códigos

Todos os códigos foram escritos em Javascript puro.

### Pré-requisitos

- Node.js instalado

### Execução

No terminal, dentro da pasta do projeto:

```bash
node desafio1.js
node desafio2.js
node desafio3.js
node desafio4.js
node desafio5.js
 Desafio 1 - Aplicação de Multas

 Arquivo: desafio1.js

 Problemas encontrados
Uso incorreto do operador:
status = 'aberto'

Isso faz atribuição e não comparação, fazendo todas as faturas entrarem na condição.

Alteração do array original:
var faturasProcessadas = listaFaturas;

Isso mantém a mesma referência, alterando os dados originais.

 Solução:
Uso de map + spread para criar cópia
Uso de === para comparação correta
Aplicação da multa apenas quando necessário

 Desafio 2 - Relatório de Pedidos

 Arquivo: desafio2.js

 Como resolvi
Percorri todos os pedidos
Somei os valores dos itens
Verifiquei se existe item do tipo Serviço
Apliquei desconto apenas quando permitido pelas regras
 Regras aplicadas
Desconto somente se:
Região = SP ou RJ
Valor > 2000
NÃO possuir serviço

 Desafio 3 - Atualização de Clientes

 Como resolvi

Para evitar reprocessamento em caso de falha, utilizei um checkpoint no banco de dados.

A ideia é salvar o último cliente processado com sucesso e continuar dali quando o script for reiniciado.

🗄️ Tabela de controle
-- Tabela responsável por armazenar o progresso da execução do script:

CREATE TABLE job_checkpoint (
  data_execucao DATE PRIMARY KEY, -- identifica o dia da execução
  ultimo_cliente_id INT,          -- último cliente processado com sucesso
  status VARCHAR(20)              -- status da execução (em_andamento ou concluido)
);

 Código (resumo da lógica):

async function executar() {
  const hoje = new Date().toISOString().split("T")[0];

  const checkpoint = await db.query(
    "SELECT ultimo_cliente_id FROM job_checkpoint WHERE data_execucao = $1",
    [hoje]
  );

  let inicio = 1;

  if (checkpoint.rows.length > 0) {
    inicio = checkpoint.rows[0].ultimo_cliente_id + 1;
  }

  for (let clienteId = inicio; clienteId <= 5000; clienteId++) {
    const dados = await apiExterna.buscar(clienteId);

    await db.atualizarCliente(clienteId, dados);

    await db.query(
      `INSERT INTO job_checkpoint (data_execucao, ultimo_cliente_id, status)
       VALUES ($1, $2, 'em_andamento')
       ON CONFLICT (data_execucao)
       DO UPDATE SET ultimo_cliente_id = $2`,
      [hoje, clienteId]
    );
  }

  await db.query(
    "UPDATE job_checkpoint SET status = 'concluido' WHERE data_execucao = $1",
    [hoje]
  );
}

 Pontos importantes:
O progresso é salvo apenas após sucesso
Evita inconsistência de dados
Permite retomada do processo
Evita duplicidade

 Desafio 4 - Clonagem de Pedido

 Arquivo: desafio4.js

Problema:

O spread (...) faz cópia rasa (shallow copy).

Isso faz com que objetos internos continuem sendo compartilhados.

 Consequência

Alterar:

copia.parametrosTecnicos.filamento.cor

também altera o objeto original.

 Solução:

Foi feita cópia dos objetos aninhados:

parametrosTecnicos
filamento

Assim cada objeto passa a ter sua própria referência.

 Desafio 5 - Processamento Assíncrono

 Arquivo: desafio5.js

 Problema
map com async retorna Promises
Não havia espera (await)
O código finalizava antes das respostas
 Solução:

Uso de:

await Promise.all(promessas)

Isso garante que todas as requisições sejam concluídas antes de continuar.

 Caso API permita apenas 1 requisição por vez
Utilizar for com await
Executar requisições de forma sequencial

 Perguntas Obrigatórias
1. Maior desafio

Entender corretamente as regras do Desafio 2, principalmente que a presença de um item do tipo Serviço invalida o desconto, mesmo se as outras condições forem verdadeiras.

2. Performance com 50.000 itens
Funcionaria, mas poderia melhorar.
Melhorias:
Uso de reduce
Processamento em lote
Evitar diversos loops

3. Limitar 10 requisições simultâneas
Dividir em grupos de 10
Executar Promise.all por lote
Aguardar finalizar antes de continuar

4. O que poderia melhorar
Alguns trechos poderiam ser mais elegantes usando:
map, reduce, filter
Funções menores
Optei por priorizar clareza e funcionamento correto primeiro.

 Conclusão

A solução foi construída com foco em:

Clareza
Correção das regras de negócio
Boas práticas
Facilidade de manutenção
```
