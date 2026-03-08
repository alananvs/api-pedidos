const express = require("express");
const router = express.Router();
const {
  criarPedido,
  obterPedido,
  listarPedidos,
  atualizarPedido,
  deletarPedido,
} = require("../controllers/orderController");

// Listar todos os pedidos — deve vir ANTES de /:numeroPedido para não conflitar
router.get("/list", listarPedidos);

// Criar novo pedido
router.post("/", criarPedido);

// Obter pedido por número
router.get("/:numeroPedido", obterPedido);

// Atualizar pedido por número
router.put("/:numeroPedido", atualizarPedido);

// Deletar pedido por número
router.delete("/:numeroPedido", deletarPedido);

module.exports = router;
