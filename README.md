# API de Pedidos — Node.js + SQLite

API REST para gerenciamento de pedidos com criação, leitura, atualização e exclusão.

---

## Instalação

```bash
npm install
npm start
```

---

## Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/order` | Criar novo pedido |
| GET | `/order/:numeroPedido` | Obter pedido por número |
| GET | `/order/list` | Listar todos os pedidos |
| PUT | `/order/:numeroPedido` | Atualizar pedido |
| DELETE | `/order/:numeroPedido` | Deletar pedido |

---

## Exemplo de uso

### Criar pedido
```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'
```

### Obter pedido
```bash
curl http://localhost:3000/order/v10089015vdb-01
```

### Listar todos
```bash
curl http://localhost:3000/order/list
```

### Atualizar pedido
```bash
curl -X PUT 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Content-Type: application/json' \
--data '{
  "valorTotal": 5000,
  "dataCriacao": "2024-01-01T00:00:00.000Z",
  "items": [{ "idItem": "99", "quantidadeItem": 2, "valorItem": 2500 }]
}'
```

### Deletar pedido
```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01
```

---
## Estrutura do projeto

```
api-pedidos/
├── controllers/
│   └── orderController.js   # Lógica de cada endpoint + mapping dos dados
├── routes/
│   └── orderRoutes.js       # Definição das rotas
├── src/
│   ├── database.js          # Conexão e criação das tabelas SQLite
│   └── server.js            # Inicialização do servidor Express
├── .gitignore
├── package.json
└── README.md
```

---

## Mapping dos campos

| Recebido (input) | Salvo no banco |
|---|---|
| `numeroPedido` | `orderId` |
| `valorTotal` | `value` |
| `dataCriacao` | `creationDate` |
| `idItem` | `productId` |
| `quantidadeItem` | `quantity` |
| `valorItem` | `price` |
