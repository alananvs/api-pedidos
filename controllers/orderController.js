const db = require("../src/database");

/**
 * Faz o mapping do JSON recebido para o formato do banco de dados.
 * Entrada: { numeroPedido, valorTotal, dataCriacao, items }
 * Saída:   { orderId, value, creationDate, items: [{ productId, quantity, price }] }
 */
function mapearPedido(body) {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao).toISOString(),
    items: body.items.map((item) => ({
      productId: parseInt(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}

// POST /order — Criar novo pedido
function criarPedido(req, res) {
  const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

  if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
  }

  db.get(`SELECT orderId FROM "Order" WHERE orderId = ?`, [numeroPedido], (err, row) => {
    if (err) return res.status(500).json({ erro: "Erro ao verificar pedido.", detalhe: err.message });
    if (row) return res.status(409).json({ erro: "Pedido com esse número já existe." });

    const pedido = mapearPedido(req.body);

    db.run(
      `INSERT INTO "Order" (orderId, value, creationDate) VALUES (?, ?, ?)`,
      [pedido.orderId, pedido.value, pedido.creationDate],
      function (err) {
        if (err) return res.status(500).json({ erro: "Erro ao criar pedido.", detalhe: err.message });

        const stmt = db.prepare(`INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`);
        for (const item of pedido.items) {
          stmt.run([pedido.orderId, item.productId, item.quantity, item.price]);
        }
        stmt.finalize();

        return res.status(201).json({ mensagem: "Pedido criado com sucesso.", pedido });
      }
    );
  });
}

// GET /order/:numeroPedido — Obter pedido por número
function obterPedido(req, res) {
  const { numeroPedido } = req.params;

  db.get(`SELECT * FROM "Order" WHERE orderId = ?`, [numeroPedido], (err, pedido) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar pedido.", detalhe: err.message });
    if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado." });

    db.all(`SELECT productId, quantity, price FROM Items WHERE orderId = ?`, [numeroPedido], (err, items) => {
      if (err) return res.status(500).json({ erro: "Erro ao buscar itens.", detalhe: err.message });
      return res.status(200).json({ ...pedido, items });
    });
  });
}

// GET /order/list — Listar todos os pedidos
function listarPedidos(req, res) {
  db.all(`SELECT * FROM "Order"`, [], (err, pedidos) => {
    if (err) return res.status(500).json({ erro: "Erro ao listar pedidos.", detalhe: err.message });
    if (pedidos.length === 0) return res.status(200).json([]);

    const resultado = [];
    let concluidos = 0;

    pedidos.forEach((pedido) => {
      db.all(`SELECT productId, quantity, price FROM Items WHERE orderId = ?`, [pedido.orderId], (err, items) => {
        resultado.push({ ...pedido, items: items || [] });
        concluidos++;
        if (concluidos === pedidos.length) {
          return res.status(200).json(resultado);
        }
      });
    });
  });
}

// PUT /order/:numeroPedido — Atualizar pedido
function atualizarPedido(req, res) {
  const { numeroPedido } = req.params;

  db.get(`SELECT orderId FROM "Order" WHERE orderId = ?`, [numeroPedido], (err, row) => {
    if (err) return res.status(500).json({ erro: "Erro ao verificar pedido.", detalhe: err.message });
    if (!row) return res.status(404).json({ erro: "Pedido não encontrado." });

    const pedido = mapearPedido({ numeroPedido, ...req.body });

    db.run(
      `UPDATE "Order" SET value = ?, creationDate = ? WHERE orderId = ?`,
      [pedido.value, pedido.creationDate, pedido.orderId],
      function (err) {
        if (err) return res.status(500).json({ erro: "Erro ao atualizar pedido.", detalhe: err.message });

        db.run(`DELETE FROM Items WHERE orderId = ?`, [pedido.orderId], (err) => {
          if (err) return res.status(500).json({ erro: "Erro ao atualizar itens.", detalhe: err.message });

          const stmt = db.prepare(`INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`);
          for (const item of pedido.items) {
            stmt.run([pedido.orderId, item.productId, item.quantity, item.price]);
          }
          stmt.finalize();

          return res.status(200).json({ mensagem: "Pedido atualizado com sucesso.", pedido });
        });
      }
    );
  });
}

// DELETE /order/:numeroPedido — Deletar pedido
function deletarPedido(req, res) {
  const { numeroPedido } = req.params;

  db.get(`SELECT orderId FROM "Order" WHERE orderId = ?`, [numeroPedido], (err, row) => {
    if (err) return res.status(500).json({ erro: "Erro ao verificar pedido.", detalhe: err.message });
    if (!row) return res.status(404).json({ erro: "Pedido não encontrado." });

    db.run(`DELETE FROM "Order" WHERE orderId = ?`, [numeroPedido], (err) => {
      if (err) return res.status(500).json({ erro: "Erro ao deletar pedido.", detalhe: err.message });
      return res.status(200).json({ mensagem: "Pedido deletado com sucesso." });
    });
  });
}

module.exports = { criarPedido, obterPedido, listarPedidos, atualizarPedido, deletarPedido };
