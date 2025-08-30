const express = require('express');
const cors = require('cors');
const { executeQuery, checkConnection } = require('./database');

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de verificação de banco
const checkDatabase = async (req, res, next) => {
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(503).json({ 
      error: 'Serviço de pedidos indisponível',
      message: 'Banco de dados não está acessível. Tente novamente mais tarde.'
    });
  }
  next();
};

// Rotas
app.get('/health', async (req, res) => {
  const isConnected = await checkConnection();
  res.json({ 
    status: 'OK', 
    service: 'Orders Service',
    database: isConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// GET /orders - Listar todos os pedidos
app.get('/orders', checkDatabase, async (req, res) => {
  try {
    const { user_id, status } = req.query;
    let query = 'SELECT * FROM orders';
    let params = [];
    
    if (user_id) {
      query += ' WHERE user_id = ?';
      params.push(user_id);
      
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
    } else if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const orders = await executeQuery(query, params);
    
    res.json({
      success: true,
      orders,
      count: orders.length
    });
  } catch (error) {
    console.log('❌ Erro ao listar pedidos:', error.message);
    res.status(500).json({ 
      error: 'Erro ao listar pedidos',
      message: 'Tente novamente mais tarde'
    });
  }
});

// GET /orders/:id - Obter pedido específico
app.get('/orders/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;
    
    const orders = await executeQuery(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado',
        message: 'ID do pedido não existe'
      });
    }
    
    res.json({
      success: true,
      order: orders[0]
    });
  } catch (error) {
    console.log('❌ Erro ao obter pedido:', error.message);
    res.status(500).json({ 
      error: 'Erro ao obter pedido',
      message: 'Tente novamente mais tarde'
    });
  }
});

// POST /orders - Criar novo pedido
app.post('/orders', checkDatabase, async (req, res) => {
  try {
    const { user_id, items, total } = req.body;
    
    if (!user_id || !items || !total) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'user_id, items e total são obrigatórios'
      });
    }
    
    const result = await executeQuery(
      'INSERT INTO orders (user_id, items, total, status) VALUES (?, ?, ?, ?)',
      [user_id, JSON.stringify(items), total, 'pending']
    );
    
    const newOrder = await executeQuery(
      'SELECT * FROM orders WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      order: newOrder[0],
      message: 'Pedido criado com sucesso'
    });
  } catch (error) {
    console.log('❌ Erro ao criar pedido:', error.message);
    res.status(500).json({ 
      error: 'Erro ao criar pedido',
      message: 'Tente novamente mais tarde'
    });
  }
});

// PUT /orders/:id - Atualizar pedido
app.put('/orders/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, items, total } = req.body;
    
    if (!status && !items && !total) {
      return res.status(400).json({ 
        error: 'Dados insuficientes',
        message: 'Pelo menos um campo deve ser atualizado'
      });
    }
    
    let updateFields = [];
    let params = [];
    
    if (status) {
      updateFields.push('status = ?');
      params.push(status);
    }
    
    if (items) {
      updateFields.push('items = ?');
      params.push(JSON.stringify(items));
    }
    
    if (total) {
      updateFields.push('total = ?');
      params.push(total);
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const result = await executeQuery(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado',
        message: 'ID do pedido não existe'
      });
    }
    
    const updatedOrder = await executeQuery(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      order: updatedOrder[0],
      message: 'Pedido atualizado com sucesso'
    });
  } catch (error) {
    console.log('❌ Erro ao atualizar pedido:', error.message);
    res.status(500).json({ 
      error: 'Erro ao atualizar pedido',
      message: 'Tente novamente mais tarde'
    });
  }
});

// DELETE /orders/:id - Deletar pedido
app.delete('/orders/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeQuery(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado',
        message: 'ID do pedido não existe'
      });
    }
    
    res.json({
      success: true,
      message: 'Pedido deletado com sucesso'
    });
  } catch (error) {
    console.log('❌ Erro ao deletar pedido:', error.message);
    res.status(500).json({ 
      error: 'Erro ao deletar pedido',
      message: 'Tente novamente mais tarde'
    });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.log('❌ Erro não tratado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Serviço de Pedidos rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}`);
  console.log(`🗄️ MySQL: Verificando conexão...`);
});
