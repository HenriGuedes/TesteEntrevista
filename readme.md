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
node desafio4.js
node desafio5.js
```

> O Desafio 3 é respondido apenas em texto neste README, pois trata de uma decisão de arquitetura e não de um código isolado executável.

---

## Desafio 1 - Aplicação de Multas

**Arquivo:** `desafio1.js`

### Problemas encontrados

**1. Operador de atribuição no lugar de comparação:**

```js
faturasProcessadas[i].status = "aberto";
```

O `=` faz atribuição, não comparação. O correto seria `===`. Por causa disso, todas as faturas recebiam a multa, independente do status.

**2. O array original estava sendo alterado:**

```js
var faturasProcessadas = listaFaturas;
```

Isso não cria uma cópia — as duas variáveis apontam para o mesmo lugar na memória. Então qualquer alteração feita dentro da função modificava os dados originais, quebrando o log de auditoria.

### Solução

- Usei `map` com spread (`{ ...fatura }`) para criar uma cópia de cada objeto
- Corrigi o operador para `===`
- A multa só é aplicada quando `status === 'aberto'` e `diasAtraso > 0`

---

## Desafio 2 - Relatório de Pedidos

**Arquivo:** `desafio2.js`

### Como resolvi

- Percorri os pedidos com `map`
- Somei o valor de cada item com `reduce`
- Verifiquei se existe item do tipo `Serviço` com `some`
- Apliquei o desconto só quando todas as condições foram atendidas

### Regras aplicadas

O desconto só é aplicado se:

- Região é `SP` ou `RJ`
- Valor total passa de R$ 2.000
- O pedido **não tem** nenhum item de categoria `Serviço`

---

## Desafio 3 - Atualização de Clientes com Checkpoint

### Como resolvi

A ideia é salvar no banco de dados qual foi o último cliente processado com sucesso. Quando o script reiniciar, ele lê esse valor e começa do próximo, sem repetir os que já foram feitos.

### Tabela de controle

```sql
CREATE TABLE job_checkpoint (
  data_execucao     DATE PRIMARY KEY,
  ultimo_cliente_id INT,
  status            VARCHAR(20) -- 'em_andamento' ou 'concluido'
);
```

### Lógica do script

```js
async function executar() {
  const hoje = new Date().toISOString().split("T")[0];

  const checkpoint = await db.query(
    "SELECT ultimo_cliente_id FROM job_checkpoint WHERE data_execucao = $1",
    [hoje],
  );

  const inicio =
    checkpoint.rows.length > 0 ? checkpoint.rows[0].ultimo_cliente_id + 1 : 1;

  for (let clienteId = inicio; clienteId <= 5000; clienteId++) {
    const dados = await apiExterna.buscar(clienteId);
    await db.atualizarCliente(clienteId, dados);

    await db.query(
      `INSERT INTO job_checkpoint (data_execucao, ultimo_cliente_id, status)
       VALUES ($1, $2, 'em_andamento')
       ON CONFLICT (data_execucao)
       DO UPDATE SET ultimo_cliente_id = $2`,
      [hoje, clienteId],
    );
  }

  await db.query(
    "UPDATE job_checkpoint SET status = 'concluido' WHERE data_execucao = $1",
    [hoje],
  );
}
```

O progresso só é salvo depois que o cliente foi atualizado com sucesso. Assim, se cair no cliente 2.500, ao reiniciar começa do 2.501.

---

## Desafio 4 - Clonagem de Pedido

**Arquivo:** `desafio4.js`

### Por que o bug acontecia

O spread (`{ ...objeto }`) faz uma cópia rasa: ele copia só o primeiro nível. Objetos dentro do objeto (como `parametrosTecnicos` e `filamento`) continuam sendo compartilhados entre o original e a cópia.

Por isso, alterar `copia.parametrosTecnicos.filamento.cor` acabava alterando o pedido original também.

### Solução

Copiei manualmente os objetos aninhados:

```js
parametrosTecnicos: {
  ...pedido.parametrosTecnicos,
  filamento: { ...pedido.parametrosTecnicos.filamento }
}
```

Assim cada nível tem sua própria referência e um não interfere no outro.

---

## Desafio 5 - Processamento Assíncrono

**Arquivo:** `desafio5.js`

### Por que o bug acontecia

O `map` com função `async` retorna um array de Promises, mas não espera nenhuma delas terminar. O código seguia em frente e imprimia `"Processamento concluído!"` antes de qualquer resposta chegar. O resultado era uma lista de `Promise { <pending> }`.

### Solução

```js
const promessas = listaIds.map((id) => buscarDetalhesGrao(id));
const lotesProcessados = await Promise.all(promessas);
```

O `Promise.all` espera todas as Promises resolverem antes de continuar, mantendo o paralelismo.

### Se a API permitisse só 1 requisição por vez

Usaria um loop sequencial com `await` dentro, forçando cada requisição esperar a anterior terminar antes de disparar a próxima.

---

## Perguntas Obrigatórias

### 1. Qual foi o maior desafio ou a parte mais confusa?

A regra do Desafio 2 sobre o item de `Serviço`. Precisei entender que ela não é só mais uma condição — ela **cancela** o desconto independente de qualquer outra regra. Então tive que verificar isso antes de tudo, senão a lógica ficaria errada.

### 2. Se a lista do Desafio 2 tivesse 50.000 itens, o código continuaria performático?

Para 50.000 itens ele ainda funcionaria, porque percorre cada pedido uma vez. Mas há pontos que poderiam ser melhorados:

- Dentro de cada pedido faço dois loops sobre `itens` (um para somar, outro para checar categoria). Daria para unir os dois em um único `reduce` e evitar percorrer o mesmo array duas vezes.
- Se os dados viessem de uma API ou banco, buscar 50.000 de uma vez pode ser pesado. O ideal seria paginar — buscar em blocos menores, processar e descartar antes de pegar o próximo.

### 3. Como limitaria a 10 requisições simultâneas no Desafio 5?

Dividiria a lista em grupos de 10 e rodaria um `Promise.all` por grupo. Assim nunca ultrapassamos o limite da API — cada rodada dispara 10 requisições ao mesmo tempo, espera todas terminarem, e só então começa o grupo seguinte.

### 4. Qual trecho poderia ser escrito de forma melhor?

No Desafio 2, o cálculo do total e a verificação de `Serviço` são dois loops separados no mesmo array. Poderia ter unido os dois em um único `reduce`. Preferi deixar separado por ser mais fácil de ler e entender.

---

## Autor

**Nome:** Henrique Guedes Silvestre  
**Email:** henriquegsilvestre@gmail.com  
**LinkedIn:** https://www.linkedin.com/in/henrique-guedes-silv/

---

_Projeto desenvolvido como parte de teste técnico para avaliação de lógica, boas práticas e organização de código em JavaScript._
