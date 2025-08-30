const express = require('express');
const cors = require('cors');
const { executeOperation, checkConnection } = require('./database');

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de verificação de banco
const checkDatabase = async (req, res, next) => {
  const isConnected = await checkConnection();
  if (!isConnected) {
    return res.status(503).json({ 
      error: 'Serviço de feedback indisponível',
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
    service: 'Feedback Service',
    database: isConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// GET /feedback - Listar todos os feedbacks
app.get('/feedback', checkDatabase, async (req, res) => {
  try {
    const { user_id, rating } = req.query;
    let filter = {};
    
    if (user_id) {
      filter.user_id = user_id;
    }
    
    if (rating) {
      filter.rating = parseInt(rating);
    }
    
    const feedbacks = await executeOperation(async (collection) => {
      return await collection.find(filter).sort({ created_at: -1 }).toArray();
    });
    
    res.json({
      success: true,
      feedbacks,
      count: feedbacks.length
    });
  } catch (error) {
    console.log('❌ Erro ao listar feedbacks:', error.message);
    res.status(500).json({ 
      error: 'Erro ao listar feedbacks',
      message: 'Tente novamente mais tarde'
    });
  }
});

// GET /feedback/:id - Obter feedback específico
app.get('/feedback/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await executeOperation(async (collection) => {
      return await collection.findOne({ _id: id });
    });
    
    if (!feedback) {
      return res.status(404).json({ 
        error: 'Feedback não encontrado',
        message: 'ID do feedback não existe'
      });
    }
    
    res.json({
      success: true,
      feedback
    });
  } catch (error) {
    console.log('❌ Erro ao obter feedback:', error.message);
    res.status(500).json({ 
      error: 'Erro ao obter feedback',
      message: 'Tente novamente mais tarde'
    });
  }
});

// POST /feedback - Criar novo feedback
app.post('/feedback', checkDatabase, async (req, res) => {
  try {
    const { user_id, rating, comment, order_id } = req.body;
    
    if (!user_id || !rating) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'user_id e rating são obrigatórios'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: 'Rating inválido',
        message: 'Rating deve ser entre 1 e 5'
      });
    }
    
    const newFeedback = {
      user_id,
      rating: parseInt(rating),
      comment: comment || '',
      order_id: order_id || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await executeOperation(async (collection) => {
      return await collection.insertOne(newFeedback);
    });
    
    const createdFeedback = await executeOperation(async (collection) => {
      return await collection.findOne({ _id: result.insertedId });
    });
    
    res.status(201).json({
      success: true,
      feedback: createdFeedback,
      message: 'Feedback enviado com sucesso'
    });
  } catch (error) {
    console.log('❌ Erro ao criar feedback:', error.message);
    res.status(500).json({ 
      error: 'Erro ao criar feedback',
      message: 'Tente novamente mais tarde'
    });
  }
});

// DELETE /feedback/:id - Deletar feedback
app.delete('/feedback/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await executeOperation(async (collection) => {
      return await collection.deleteOne({ _id: id });
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Feedback não encontrado',
        message: 'ID do feedback não existe'
      });
    }
    
    res.json({
      success: true,
      message: 'Feedback deletado com sucesso'
    });
  } catch (error) {
    console.log('❌ Erro ao deletar feedback:', error.message);
    res.status(500).json({ 
      error: 'Erro ao deletar feedback',
      message: 'Tente novamente mais tarde'
    });
  }
});

// GET /feedback/stats - Estatísticas dos feedbacks
app.get('/feedback/stats', checkDatabase, async (req, res) => {
  try {
    const stats = await executeOperation(async (collection) => {
      const total = await collection.countDocuments();
      const avgRating = await collection.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]).toArray();
      
      const ratingDistribution = await collection.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]).toArray();
      
      return {
        total,
        averageRating: avgRating.length > 0 ? Math.round(avgRating[0].avgRating * 100) / 100 : 0,
        ratingDistribution
      };
    });
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.log('❌ Erro ao obter estatísticas:', error.message);
    res.status(500).json({ 
      error: 'Erro ao obter estatísticas',
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
  console.log(`🚀 Serviço de Feedback rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}`);
  console.log(`🗄️ MongoDB: Verificando conexão...`);
});
