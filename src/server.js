const express = require("express");
const orderRoutes = require("../routes/orderRoutes");

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON no body das requisições
app.use(express.json());

// Rotas de pedidos
app.use("/order", orderRoutes);

// Rota padrão para URLs não encontradas
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
