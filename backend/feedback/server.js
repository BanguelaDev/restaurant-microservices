/**
 * ⭐ SERVIÇO DE FEEDBACK - RESTAURANTE MICROSSERVIÇOS
 * 
 * Este arquivo implementa o microsserviço de feedback que gerencia:
 * - Criação, leitura e exclusão de feedbacks de usuários
 * - Sistema de avaliação com ratings de 1 a 5 estrelas
 * - Comentários opcionais sobre experiências
 * - Estatísticas agregadas dos feedbacks
 * - Consultas por usuário e rating
 * 
 * TECNOLOGIAS UTILIZADAS:
 * - Express.js: Framework web para criar a API
 * - MongoDB: Banco de dados NoSQL para feedbacks flexíveis
 * - CORS: Para permitir requisições do frontend
 * - dotenv: Para gerenciar variáveis de ambiente
 * 
 * ARQUITETURA:
 * - Serviço independente que roda na porta 3003
 * - Usa MongoDB para persistir dados de feedback
 * - Middleware de verificação de banco antes de cada operação
 * - Resposta padronizada para todas as operações
 * 
 * ESTRUTURA DOS FEEDBACKS:
 * - _id: Identificador único do MongoDB (ObjectId)
 * - user_id: ID do usuário do Firebase
 * - rating: Avaliação de 1 a 5 estrelas
 * - comment: Comentário opcional do usuário
 * - order_id: ID do pedido relacionado (opcional)
 * - created_at: Data de criação
 * - updated_at: Data da última atualização
 */

// Importar dependências necessárias
const express = require('express');           // Framework web para criar APIs
const cors = require('cors');                 // Middleware para permitir requisições cross-origin
const { executeOperation, checkConnection } = require('./database');  // Funções de banco de dados

// Gerenciamento de variáveis de ambiente
const dotenv = require("dotenv");             // Carrega variáveis do arquivo .env
const path = require("path");                 // Utilitário para manipular caminhos de arquivo

// Carregar variáveis de ambiente do arquivo .env na pasta atual
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Criar instância do Express e definir porta
const app = express();
const PORT = process.env.PORT || 3003;       // Usa porta do ambiente ou padrão 3003

// ============================================================================
// 🔧 CONFIGURAÇÃO DE MIDDLEWARES
// ============================================================================

// Middleware CORS: Permite requisições do frontend (porta 3000)
app.use(cors());

// Middleware JSON: Converte corpo das requisições para objeto JavaScript
app.use(express.json());

// ============================================================================
// 🗄️ MIDDLEWARE DE VERIFICAÇÃO DE BANCO
// ============================================================================

/**
 * Middleware que verifica se o banco de dados MongoDB está disponível
 * 
 * FUNCIONAMENTO:
 * 1. Chama checkConnection() para verificar status do MongoDB
 * 2. Se não estiver conectado, retorna erro 503 (Serviço Indisponível)
 * 3. Se estiver conectado, continua para a rota
 * 
 * BENEFÍCIOS:
 * - Evita erros de banco em todas as rotas
 * - Resposta clara quando o serviço está indisponível
 * - Permite que o frontend saiba quando não pode enviar feedback
 * 
 * USO:
 * - Adicionar este middleware em todas as rotas que precisam do banco
 * - Exemplo: app.get('/feedback', checkDatabase, async (req, res) => { ... })
 */
const checkDatabase = async (req, res, next) => {
  const isConnected = await checkConnection();  // Verificar conexão com MongoDB
  
  if (!isConnected) {
    return res.status(503).json({ 
      error: 'Serviço de feedback indisponível',
      message: 'Banco de dados não está acessível. Tente novamente mais tarde.'
    });
  }
  
  next();  // Continuar para a próxima rota
};

// ============================================================================
// 🛣️ DEFINIÇÃO DAS ROTAS DA API
// ============================================================================

// Rota de health check - para monitoramento do serviço
app.get('/health', async (req, res) => {
  const isConnected = await checkConnection();  // Verificar status do banco
  
  res.json({ 
    status: 'OK', 
    service: 'Feedback Service',
    database: isConnected ? 'Connected' : 'Disconnected',  // Status do MongoDB
    timestamp: new Date().toISOString()                    // Timestamp atual
  });
});

// ============================================================================
// ⭐ ROTA PARA LISTAR FEEDBACKS
// ============================================================================

/**
 * GET /feedback - Listar todos os feedbacks com filtros opcionais
 * 
 * FUNCIONAMENTO:
 * 1. Aceita parâmetros de query para filtrar resultados
 * 2. Constrói filtro MongoDB dinamicamente baseado nos parâmetros
 * 3. Retorna lista de feedbacks ordenada por data de criação
 * 
 * PARÂMETROS DE QUERY:
 * - user_id: Filtrar feedbacks de um usuário específico
 * - rating: Filtrar por rating específico (1, 2, 3, 4, 5)
 * 
 * EXEMPLOS DE USO:
 * - GET /feedback - Todos os feedbacks
 * - GET /feedback?user_id=123 - Feedbacks de um usuário
 * - GET /feedback?rating=5 - Feedbacks com 5 estrelas
 * - GET /feedback?user_id=123&rating=4 - Feedbacks de 4 estrelas de um usuário
 * 
 * RESPOSTA:
 * - success: true/false
 * - feedbacks: Array com todos os feedbacks
 * - count: Número total de feedbacks retornados
 * 
 * ORDENAÇÃO:
 * - Sempre ordenado por data de criação (mais recentes primeiro)
 * - Usa campo created_at em ordem decrescente
 */
app.get('/feedback', checkDatabase, async (req, res) => {
  try {
    const { user_id, rating } = req.query;  // Extrair parâmetros da query
    
    // Construir filtro MongoDB baseado nos parâmetros fornecidos
    let filter = {};
    
    // Se user_id foi fornecido, adicionar ao filtro
    if (user_id) {
      filter.user_id = user_id;
    }
    
    // Se rating foi fornecido, converter para número e adicionar ao filtro
    if (rating) {
      filter.rating = parseInt(rating);
    }
    
    // Executar operação no MongoDB usando função helper
    const feedbacks = await executeOperation(async (collection) => {
      // Buscar feedbacks com filtro e ordenar por data de criação
      return await collection.find(filter).sort({ created_at: -1 }).toArray();
    });
    
    // Retornar sucesso com lista de feedbacks
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

// ============================================================================
// 🔍 ROTA PARA OBTER FEEDBACK ESPECÍFICO
// ============================================================================

/**
 * GET /feedback/:id - Obter um feedback específico por ID
 * 
 * FUNCIONAMENTO:
 * 1. Extrai o ID do feedback dos parâmetros da URL
 * 2. Busca o feedback no MongoDB usando ObjectId
 * 3. Retorna erro 404 se o feedback não existir
 * 4. Retorna o feedback se encontrado
 * 
 * PARÂMETROS DE URL:
 * - id: ID do feedback no formato ObjectId do MongoDB (obrigatório)
 * 
 * EXEMPLOS DE USO:
 * - GET /feedback/507f1f77bcf86cd799439011 - Obter feedback específico
 * - GET /feedback/64a1b2c3d4e5f6789012345 - Obter outro feedback
 * 
 * RESPOSTA:
 * - success: true/false
 * - feedback: Objeto com dados do feedback
 * - Erro 404 se feedback não existir
 * 
 * NOTA:
 * - MongoDB usa ObjectId como identificador único
 * - ObjectId é uma string de 24 caracteres hexadecimais
 * - Exemplo: 507f1f77bcf86cd799439011
 */
app.get('/feedback/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;  // Extrair ID dos parâmetros da URL
    
    // Buscar feedback específico no MongoDB
    const feedback = await executeOperation(async (collection) => {
      return await collection.findOne({ _id: id });
    });
    
    // Verificar se o feedback foi encontrado
    if (!feedback) {
      return res.status(404).json({ 
        error: 'Feedback não encontrado',
        message: 'ID do feedback não existe'
      });
    }
    
    // Retornar sucesso com o feedback encontrado
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

// ============================================================================
// ➕ ROTA PARA CRIAR NOVO FEEDBACK
// ============================================================================

/**
 * POST /feedback - Criar um novo feedback
 * 
 * FUNCIONAMENTO:
 * 1. Valida dados obrigatórios (user_id, rating)
 * 2. Valida se rating está entre 1 e 5
 * 3. Cria novo documento no MongoDB
 * 4. Retorna feedback criado com dados completos
 * 
 * DADOS DE ENTRADA (JSON):
 * - user_id: ID do usuário do Firebase (obrigatório)
 * - rating: Avaliação de 1 a 5 estrelas (obrigatório)
 * - comment: Comentário opcional do usuário
 * - order_id: ID do pedido relacionado (opcional)
 * 
 * EXEMPLO DE DADOS:
 * {
 *   "user_id": "firebase_user_123",
 *   "rating": 5,
 *   "comment": "Excelente atendimento! Comida deliciosa.",
 *   "order_id": "order_456"
 * }
 * 
 * VALIDAÇÕES:
 * - user_id: Deve ser fornecido
 * - rating: Deve ser número entre 1 e 5
 * - comment: Opcional, string vazia se não fornecido
 * - order_id: Opcional, null se não fornecido
 * 
 * RESPOSTA:
 * - success: true
 * - feedback: Objeto com dados do feedback criado
 * - message: Mensagem de sucesso
 * - Status 201 (Created)
 */
app.post('/feedback', checkDatabase, async (req, res) => {
  try {
    const { user_id, rating, comment, order_id } = req.body;  // Extrair dados do corpo
    
    // Validar campos obrigatórios
    if (!user_id || !rating) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'user_id e rating são obrigatórios'
      });
    }
    
    // Validar se rating está no intervalo válido (1 a 5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: 'Rating inválido',
        message: 'Rating deve ser entre 1 e 5'
      });
    }
    
    // Criar objeto do feedback com dados fornecidos e timestamps
    const newFeedback = {
      user_id,
      rating: parseInt(rating),           // Converter para número inteiro
      comment: comment || '',             // Usar comentário fornecido ou string vazia
      order_id: order_id || null,         // Usar order_id fornecido ou null
      created_at: new Date(),             // Timestamp de criação
      updated_at: new Date()              // Timestamp de atualização
    };
    
    // Inserir novo feedback no MongoDB
    const result = await executeOperation(async (collection) => {
      return await collection.insertOne(newFeedback);
    });
    
    // Buscar feedback criado para retornar dados completos (incluindo _id)
    const createdFeedback = await executeOperation(async (collection) => {
      return await collection.findOne({ _id: result.insertedId });
    });
    
    // Retornar sucesso com dados do feedback criado
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

// ============================================================================
// 🗑️ ROTA PARA DELETAR FEEDBACK
// ============================================================================

/**
 * DELETE /feedback/:id - Deletar um feedback existente
 * 
 * FUNCIONAMENTO:
 * 1. Extrai ID do feedback dos parâmetros da URL
 * 2. Executa DELETE no MongoDB
 * 3. Verifica se o feedback foi encontrado e deletado
 * 4. Retorna sucesso ou erro 404 se não encontrado
 * 
 * PARÂMETROS DE URL:
 * - id: ID do feedback no formato ObjectId do MongoDB (obrigatório)
 * 
 * EXEMPLOS DE USO:
 * - DELETE /feedback/507f1f77bcf86cd799439011 - Deletar feedback específico
 * - DELETE /feedback/64a1b2c3d4e5f6789012345 - Deletar outro feedback
 * 
 * RESPOSTA:
 * - success: true
 * - message: Mensagem de sucesso
 * - Erro 404 se feedback não existir
 * 
 * ⚠️ ATENÇÃO:
 * - Esta operação é irreversível
 * - Todos os dados do feedback são perdidos
 * - Considere usar soft delete (marcar como deletado) em produção
 * 
 * NOTA:
 * - MongoDB retorna deletedCount indicando quantos documentos foram deletados
 * - Se deletedCount === 0, significa que o feedback não foi encontrado
 */
app.delete('/feedback/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;  // Extrair ID dos parâmetros da URL
    
    // Executar DELETE no MongoDB
    const result = await executeOperation(async (collection) => {
      return await collection.deleteOne({ _id: id });
    });
    
    // Verificar se o feedback foi encontrado e deletado
    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Feedback não encontrado',
        message: 'ID do feedback não existe'
      });
    }
    
    // Retornar sucesso
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

// ============================================================================
// 📊 ROTA PARA ESTATÍSTICAS DOS FEEDBACKS
// ============================================================================

/**
 * GET /feedback/stats - Obter estatísticas agregadas dos feedbacks
 * 
 * FUNCIONAMENTO:
 * 1. Executa agregações MongoDB para calcular estatísticas
 * 2. Calcula total de feedbacks, rating médio e distribuição
 * 3. Retorna dados estatísticos para análise
 * 
 * ESTATÍSTICAS CALCULADAS:
 * - total: Número total de feedbacks
 * - averageRating: Rating médio (arredondado para 2 casas decimais)
 * - ratingDistribution: Contagem de cada rating (1 a 5 estrelas)
 * 
 * EXEMPLO DE RESPOSTA:
 * {
 *   "success": true,
 *   "stats": {
 *     "total": 25,
 *     "averageRating": 4.2,
 *     "ratingDistribution": [
 *       {"_id": 1, "count": 2},
 *       {"_id": 2, "count": 1},
 *       {"_id": 3, "count": 3},
 *       {"_id": 4, "count": 8},
 *       {"_id": 5, "count": 11}
 *     ]
 *   }
 * }
 * 
 * USO:
 * - Dashboard de administração
 * - Relatórios de satisfação
 * - Análise de qualidade do serviço
 * - Identificação de áreas para melhoria
 * 
 * AGRREGAÇÕES MONGODB:
 * - $group: Agrupa documentos por rating
 * - $avg: Calcula média dos ratings
 * - $sum: Soma contadores para distribuição
 * - $sort: Ordena distribuição por rating
 */
app.get('/feedback/stats', checkDatabase, async (req, res) => {
  try {
    // Executar operações de agregação no MongoDB
    const stats = await executeOperation(async (collection) => {
      // Contar total de feedbacks
      const total = await collection.countDocuments();
      
      // Calcular rating médio usando agregação
      const avgRating = await collection.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]).toArray();
      
      // Calcular distribuição de ratings (quantos de cada rating)
      const ratingDistribution = await collection.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },  // Agrupar por rating e contar
        { $sort: { _id: 1 } }                                 // Ordenar por rating (1, 2, 3, 4, 5)
      ]).toArray();
      
      // Retornar objeto com todas as estatísticas
      return {
        total,
        averageRating: avgRating.length > 0 ? Math.round(avgRating[0].avgRating * 100) / 100 : 0,
        ratingDistribution
      };
    });
    
    // Retornar sucesso com estatísticas calculadas
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

// ============================================================================
// 🚨 TRATAMENTO DE ERROS GLOBAL
// ============================================================================

/**
 * Middleware de tratamento de erros não capturados
 * 
 * FUNCIONAMENTO:
 * - Captura erros que não foram tratados nas rotas
 * - Loga o erro para debugging
 * - Retorna resposta padronizada de erro
 */
app.use((error, req, res, next) => {
  console.log('❌ Erro não tratado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: 'Algo deu errado'
  });
});

// ============================================================================
// ❌ ROTA 404 - PÁGINA NÃO ENCONTRADA
// ============================================================================

/**
 * Middleware para rotas não encontradas
 * 
 * FUNCIONAMENTO:
 * - Captura todas as requisições que não correspondem a rotas definidas
 * - Retorna erro 404 padronizado
 */
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ============================================================================
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

// Iniciar o servidor na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Serviço de Feedback rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}`);
  console.log(`🗄️ MongoDB: Verificando conexão...`);
});

/**
 * 📚 RESUMO DO SERVIÇO:
 * 
 * Este microsserviço de feedback demonstra:
 * 
 * 1. **CRUD BÁSICO**: Create, Read, Delete de feedbacks
 * 2. **FILTROS DINÂMICOS**: Consultas flexíveis por usuário e rating
 * 3. **VALIDAÇÃO DE DADOS**: Verificação de campos obrigatórios e ranges
 * 4. **ESTATÍSTICAS**: Agregações MongoDB para análise de dados
 * 5. **RESILIÊNCIA**: Middleware de verificação de banco
 * 6. **TRATAMENTO DE ERROS**: Respostas padronizadas e logging
 * 7. **MONITORAMENTO**: Endpoint de health check
 * 
 * CONCEITOS DE MICROSSERVIÇOS APLICADOS:
 * - Separação de responsabilidades (só feedback)
 * - Banco de dados especializado (MongoDB para dados flexíveis)
 * - APIs REST para comunicação
 * - Deploy independente
 * - Escalabilidade horizontal
 * 
 * VANTAGENS DO MONGODB:
 * - Schema flexível (campos opcionais)
 * - Agregações poderosas para estatísticas
 * - Documentos JSON nativos
 * - Escalabilidade horizontal
 * - Índices para performance
 * 
 * ESTRUTURA DOS DADOS:
 * - Coleção 'feedback' com documentos flexíveis
 * - Campos obrigatórios: user_id, rating
 * - Campos opcionais: comment, order_id
 * - Timestamps automáticos para auditoria
 * - ObjectId como identificador único
 */
