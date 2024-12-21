require('dotenv').config();
const express = require('express');
const app = express();
const db = require('../db/db');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const clienteRoutes = require('../lib/config/routes/clientes');
const produtoRoutes = require('../lib/config/routes/produto');

app.use('/clientes', clienteRoutes);
app.use('/produto', produtoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Servidor rodando em http://localhost:${PORT}");
});
