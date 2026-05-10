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

## Exemplos de uso

### Criar um modelo

```http
POST /api/modelos
Content-Type: application/json

{
  "nome": "Checklist de Abertura de Empresa",
  "descricao": "Processo administrativo padrão",
  "itens": [
    { "label": "Nome da empresa", "tipo": "TEXTO", "obrigatorio": true },
    { "label": "Data de abertura", "tipo": "DATA", "obrigatorio": true },
    { "label": "Tipo de empresa", "tipo": "SELECAO", "obrigatorio": true, "opcoes": ["MEI", "LTDA", "SA"] }
  ]
}
```

Resposta `201 Created`: modelo criado com `status: RASCUNHO` e `versao: 0`.

### Publicar um modelo

```http
POST /api/modelos/{id}/publicar
```

Resposta `200 OK`: status muda para `PUBLICADO` e versão incrementa para `1`.

### Erro de validação ao publicar

Retorna `422 Unprocessable Entity`:
```json
{
  "status": 422,
  "erro": "Validação falhou ao publicar modelo",
  "detalhes": [
    "Item #1 (tipo TEXTO): label não pode ser vazio",
    "Item #2 (tipo SELECAO): deve ter ao menos 2 opcoes distintas"
  ],
  "timestamp": "2025-04-15T14:30:00"
}
```

### Tentar editar modelo publicado

Retorna `409 Conflict` — só modelos em RASCUNHO podem ser editados ou deletados.

### Listar com filtro

```http
GET /api/modelos?status=PUBLICADO&page=0&size=20
```

### Clonar um modelo

```http
POST /api/modelos/{id}/clonar
```

Cria novo RASCUNHO com nome sufixado por `(cópia)` e versão `0`.

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
