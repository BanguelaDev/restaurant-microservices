/**
 * 📋 SERVIÇO DE PEDIDOS - RESTAURANTE MICROSSERVIÇOS
 * 
 * Este arquivo implementa o microsserviço de pedidos que gerencia:
 * - Criação, leitura, atualização e exclusão de pedidos (CRUD)
 * - Consultas por usuário e status
 * - Validação de dados de entrada
 * - Tratamento de erros e resiliência
 * 
 * TECNOLOGIAS UTILIZADAS:
 * - Express.js: Framework web para criar a API
 * - MySQL: Banco de dados relacional para pedidos
 * - CORS: Para permitir requisições do frontend
 * - dotenv: Para gerenciar variáveis de ambiente
 * 
 * ARQUITETURA:
 * - Serviço independente que roda na porta 3002
 * - Usa MySQL para persistir dados de pedidos
 * - Middleware de verificação de banco antes de cada operação
 * - Resposta padronizada para todas as operações
 * 
 * ESTRUTURA DOS PEDIDOS:
 * - id: Identificador único (auto-incremento)
 * - user_id: ID do usuário do Firebase
 * - items: JSON com itens do pedido
 * - total: Valor total do pedido
 * - status: pending, preparing, ready, delivered
 * - created_at: Data de criação
 * - updated_at: Data da última atualização
 */

// Importar dependências necessárias
const express = require('express');           // Framework web para criar APIs
const cors = require('cors');                 // Middleware para permitir requisições cross-origin
const { executeQuery, checkConnection } = require('./database');  // Funções de banco de dados

// Gerenciamento de variáveis de ambiente
const dotenv = require("dotenv");             // Carrega variáveis do arquivo .env
const path = require("path");                 // Utilitário para manipular caminhos de arquivo

// Carregar variáveis de ambiente do arquivo .env na pasta atual
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Criar instância do Express e definir porta
const app = express();
const PORT = process.env.PORT || 3002;       // Usa porta do ambiente ou padrão 3002

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
 * Middleware que verifica se o banco de dados MySQL está disponível
 * 
 * FUNCIONAMENTO:
 * 1. Chama checkConnection() para verificar status do MySQL
 * 2. Se não estiver conectado, retorna erro 503 (Serviço Indisponível)
 * 3. Se estiver conectado, continua para a rota
 * 
 * BENEFÍCIOS:
 * - Evita erros de banco em todas as rotas
 * - Resposta clara quando o serviço está indisponível
 * - Permite que o frontend saiba quando não pode fazer pedidos
 * 
 * USO:
 * - Adicionar este middleware em todas as rotas que precisam do banco
 * - Exemplo: app.get('/orders', checkDatabase, async (req, res) => { ... })
 */
const checkDatabase = async (req, res, next) => {
  const isConnected = await checkConnection();  // Verificar conexão com MySQL
  
  if (!isConnected) {
    return res.status(503).json({ 
      error: 'Serviço de pedidos indisponível',
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
    service: 'Orders Service',
    database: isConnected ? 'Connected' : 'Disconnected',  // Status do MySQL
    timestamp: new Date().toISOString()                    // Timestamp atual
  });
});

// ============================================================================
// 📋 ROTA PARA LISTAR PEDIDOS
// ============================================================================

/**
 * GET /orders - Listar todos os pedidos com filtros opcionais
 * 
 * FUNCIONAMENTO:
 * 1. Aceita parâmetros de query para filtrar resultados
 * 2. Constrói query SQL dinamicamente baseada nos filtros
 * 3. Retorna lista de pedidos ordenada por data de criação
 * 
 * PARÂMETROS DE QUERY:
 * - user_id: Filtrar pedidos de um usuário específico
 * - status: Filtrar por status (pending, preparing, ready, delivered)
 * 
 * EXEMPLOS DE USO:
 * - GET /orders - Todos os pedidos
 * - GET /orders?user_id=123 - Pedidos de um usuário
 * - GET /orders?status=pending - Pedidos pendentes
 * - GET /orders?user_id=123&status=ready - Pedidos prontos de um usuário
 * 
 * RESPOSTA:
 * - success: true/false
 * - orders: Array com todos os pedidos
 * - count: Número total de pedidos retornados
 */
app.get('/orders', checkDatabase, async (req, res) => {
  try {
    const { user_id, status } = req.query;  // Extrair parâmetros da query
    
    // Construir query SQL baseada nos filtros fornecidos
    let query = 'SELECT * FROM orders';
    let params = [];
    
    // Se user_id foi fornecido, adicionar filtro WHERE
    if (user_id) {
      query += ' WHERE user_id = ?';
      params.push(user_id);
      
      // Se também status foi fornecido, adicionar filtro AND
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
    } else if (status) {
      // Se só status foi fornecido, adicionar filtro WHERE
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    // Sempre ordenar por data de criação (mais recentes primeiro)
    query += ' ORDER BY created_at DESC';
    
    // Executar query no banco de dados
    const orders = await executeQuery(query, params);
    
    // Retornar sucesso com lista de pedidos
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

// ============================================================================
// 🔍 ROTA PARA OBTER PEDIDO ESPECÍFICO
// ============================================================================

/**
 * GET /orders/:id - Obter um pedido específico por ID
 * 
 * FUNCIONAMENTO:
 * 1. Extrai o ID do pedido dos parâmetros da URL
 * 2. Busca o pedido no banco de dados
 * 3. Retorna erro 404 se o pedido não existir
 * 4. Retorna o pedido se encontrado
 * 
 * PARÂMETROS DE URL:
 * - id: ID numérico do pedido (obrigatório)
 * 
 * EXEMPLOS DE USO:
 * - GET /orders/1 - Obter pedido com ID 1
 * - GET /orders/123 - Obter pedido com ID 123
 * 
 * RESPOSTA:
 * - success: true/false
 * - order: Objeto com dados do pedido
 * - Erro 404 se pedido não existir
 */
app.get('/orders/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;  // Extrair ID dos parâmetros da URL
    
    // Buscar pedido específico no banco
    const orders = await executeQuery(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    
    // Verificar se o pedido foi encontrado
    if (orders.length === 0) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado',
        message: 'ID do pedido não existe'
      });
    }
    
    // Retornar sucesso com o pedido encontrado
    res.json({
      success: true,
      order: orders[0]  // Primeiro (e único) resultado
    });
  } catch (error) {
    console.log('❌ Erro ao obter pedido:', error.message);
    res.status(500).json({ 
      error: 'Erro ao obter pedido',
      message: 'Tente novamente mais tarde'
    });
  }
});

// ============================================================================
// ➕ ROTA PARA CRIAR NOVO PEDIDO
// ============================================================================

/**
 * POST /orders - Criar um novo pedido
 * 
 * FUNCIONAMENTO:
 * 1. Valida dados obrigatórios (user_id, items, total)
 * 2. Insere novo pedido no banco com status 'pending'
 * 3. Busca o pedido criado para retornar dados completos
 * 4. Retorna sucesso com dados do pedido criado
 * 
 * DADOS DE ENTRADA (JSON):
 * - user_id: ID do usuário do Firebase (obrigatório)
 * - items: Array de itens do pedido em formato JSON (obrigatório)
 * - total: Valor total do pedido (obrigatório)
 * 
 * EXEMPLO DE DADOS:
 * {
 *   "user_id": "firebase_user_123",
 *   "items": [
 *     {"name": "Hambúrguer", "price": 25.90, "quantity": 2},
 *     {"name": "Batata Frita", "price": 12.50, "quantity": 1}
 *   ],
 *   "total": 64.30
 * }
 * 
 * RESPOSTA:
 * - success: true
 * - order: Objeto com dados do pedido criado
 * - message: Mensagem de sucesso
 * - Status 201 (Created)
 */
app.post('/orders', checkDatabase, async (req, res) => {
  try {
    const { user_id, items, total } = req.body;  // Extrair dados do corpo da requisição
    
    // Validar campos obrigatórios
    if (!user_id || !items || !total) {
      return res.status(400).json({ 
        error: 'Dados incompletos',
        message: 'user_id, items e total são obrigatórios'
      });
    }
    
    // Inserir novo pedido no banco
    // items é convertido para JSON string para armazenar no MySQL
    const result = await executeQuery(
      'INSERT INTO orders (user_id, items, total, status) VALUES (?, ?, ?, ?)',
      [user_id, JSON.stringify(items), total, 'pending']
    );
    
    // Buscar o pedido criado para retornar dados completos
    const newOrder = await executeQuery(
      'SELECT * FROM orders WHERE id = ?',
      [result.insertId]  // ID gerado automaticamente pelo MySQL
    );
    
    // Retornar sucesso com dados do pedido criado
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

// ============================================================================
// ✏️ ROTA PARA ATUALIZAR PEDIDO
// ============================================================================

/**
 * PUT /orders/:id - Atualizar um pedido existente
 * 
 * FUNCIONAMENTO:
 * 1. Extrai ID do pedido dos parâmetros da URL
 * 2. Valida se pelo menos um campo foi fornecido para atualização
 * 3. Constrói query UPDATE dinamicamente baseada nos campos fornecidos
 * 4. Atualiza timestamp de modificação automaticamente
 * 5. Retorna dados atualizados do pedido
 * 
 * PARÂMETROS DE URL:
 * - id: ID numérico do pedido (obrigatório)
 * 
 * DADOS DE ENTRADA (JSON):
 * - status: Novo status do pedido (opcional)
 * - items: Novos itens do pedido (opcional)
 * - total: Novo valor total (opcional)
 * 
 * EXEMPLOS DE USO:
 * - PUT /orders/1 {"status": "ready"} - Marcar pedido como pronto
 * - PUT /orders/1 {"status": "delivered"} - Marcar pedido como entregue
 * - PUT /orders/1 {"total": 75.90} - Atualizar valor total
 * 
 * RESPOSTA:
 * - success: true/false
 * - order: Objeto com dados atualizados do pedido
 * - message: Mensagem de sucesso
 * - Erro 404 se pedido não existir
 */
app.put('/orders/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;  // Extrair ID dos parâmetros da URL
    const { status, items, total } = req.body;  // Extrair campos para atualização
    
    // Validar se pelo menos um campo foi fornecido
    if (!status && !items && !total) {
      return res.status(400).json({ 
        error: 'Dados insuficientes',
        message: 'Pelo menos um campo deve ser atualizado'
      });
    }
    
    // Construir query UPDATE dinamicamente
    let updateFields = [];
    let params = [];
    
    // Adicionar campos fornecidos à query
    if (status) {
      updateFields.push('status = ?');
      params.push(status);
    }
    
    if (items) {
      updateFields.push('items = ?');
      params.push(JSON.stringify(items));  // Converter para JSON string
    }
    
    if (total) {
      updateFields.push('total = ?');
      params.push(total);
    }
    
    // Sempre atualizar timestamp de modificação
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Adicionar ID do pedido ao final dos parâmetros
    params.push(id);
    
    // Executar query de atualização
    const result = await executeQuery(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );
    
    // Verificar se o pedido foi encontrado e atualizado
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado',
        message: 'ID do pedido não existe'
      });
    }
    
    // Buscar pedido atualizado para retornar dados completos
    const updatedOrder = await executeQuery(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    
    // Retornar sucesso com dados atualizados
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

// ============================================================================
// 🗑️ ROTA PARA DELETAR PEDIDO
// ============================================================================

/**
 * DELETE /orders/:id - Deletar um pedido existente
 * 
 * FUNCIONAMENTO:
 * 1. Extrai ID do pedido dos parâmetros da URL
 * 2. Executa DELETE no banco de dados
 * 3. Verifica se o pedido foi encontrado e deletado
 * 4. Retorna sucesso ou erro 404 se não encontrado
 * 
 * PARÂMETROS DE URL:
 * - id: ID numérico do pedido (obrigatório)
 * 
 * EXEMPLOS DE USO:
 * - DELETE /orders/1 - Deletar pedido com ID 1
 * - DELETE /orders/123 - Deletar pedido com ID 123
 * 
 * RESPOSTA:
 * - success: true
 * - message: Mensagem de sucesso
 * - Erro 404 se pedido não existir
 * 
 * ⚠️ ATENÇÃO:
 * - Esta operação é irreversível
 * - Todos os dados do pedido são perdidos
 * - Considere usar soft delete (marcar como deletado) em produção
 */
app.delete('/orders/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;  // Extrair ID dos parâmetros da URL
    
    // Executar DELETE no banco de dados
    const result = await executeQuery(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );
    
    // Verificar se o pedido foi encontrado e deletado
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Pedido não encontrado',
        message: 'ID do pedido não existe'
      });
    }
    
    // Retornar sucesso
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
  console.log(`🚀 Serviço de Pedidos rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}`);
  console.log(`🗄️ MySQL: Verificando conexão...`);
});

/**
 * 📚 RESUMO DO SERVIÇO:
 * 
 * Este microsserviço de pedidos demonstra:
 * 
 * 1. **CRUD COMPLETO**: Create, Read, Update, Delete de pedidos
 * 2. **FILTROS DINÂMICOS**: Consultas flexíveis por usuário e status
 * 3. **VALIDAÇÃO DE DADOS**: Verificação de campos obrigatórios
 * 4. **RESILIÊNCIA**: Middleware de verificação de banco
 * 5. **TRATAMENTO DE ERROS**: Respostas padronizadas e logging
 * 6. **MONITORAMENTO**: Endpoint de health check
 * 
 * CONCEITOS DE MICROSSERVIÇOS APLICADOS:
 * - Separação de responsabilidades (só pedidos)
 * - Banco de dados especializado (MySQL para dados estruturados)
 * - APIs REST para comunicação
 * - Deploy independente
 * - Escalabilidade horizontal
 * 
 * ESTRUTURA DO BANCO:
 * - Tabela 'orders' com campos: id, user_id, items, total, status, created_at, updated_at
 * - Campo 'items' armazenado como JSON para flexibilidade
 * - Campo 'status' com valores predefinidos para controle de fluxo
 * - Timestamps automáticos para auditoria
 */
