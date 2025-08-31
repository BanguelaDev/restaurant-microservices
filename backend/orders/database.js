/**
 * 🗄️ CONEXÃO COM BANCO DE DADOS MYSQL - SERVIÇO DE PEDIDOS
 * 
 * Este arquivo gerencia toda a comunicação com o banco de dados MySQL:
 * - Criação e gerenciamento do pool de conexões
 * - Execução de queries SQL
 * - Verificação de status da conexão
 * - Tratamento de erros de banco
 * 
 * TECNOLOGIAS UTILIZADAS:
 * - mysql2/promise: Driver MySQL com suporte a Promises/async-await
 * - Pool de conexões: Para gerenciar múltiplas conexões simultâneas
 * - Configuração via arquivo config.js
 * 
 * ARQUITETURA:
 * - Pool de conexões para melhor performance
 * - Conexões automáticas com retry
 * - Verificação de saúde da conexão
 * - Tratamento de erros centralizado
 * 
 * BENEFÍCIOS DO POOL:
 * - Reutilização de conexões
 * - Melhor performance
 * - Controle de concorrência
 * - Gerenciamento automático de conexões
 */

// Importar dependências
const mysql = require('mysql2/promise');      // Driver MySQL com suporte a Promises
const config = require('./config');           // Configurações do banco (host, user, password, etc.)

// Variável global para armazenar o pool de conexões
let pool = null;

// ============================================================================
// 🔌 CRIAÇÃO DO POOL DE CONEXÕES
// ============================================================================

/**
 * Função para criar e configurar o pool de conexões MySQL
 * 
 * FUNCIONAMENTO:
 * 1. Cria pool usando configurações do arquivo config.js
 * 2. Testa a conexão para verificar se está funcionando
 * 3. Loga sucesso ou erro da conexão
 * 4. Retorna o pool criado ou null em caso de erro
 * 
 * CONFIGURAÇÕES DO POOL:
 * - waitForConnections: true (aguarda conexões disponíveis)
 * - connectionLimit: 10 (máximo de conexões simultâneas)
 * - queueLimit: 0 (sem limite na fila de espera)
 * 
 * RETORNO:
 * - Pool de conexões se sucesso
 * - null se falhar na conexão
 */
const createPool = async () => {
  try {
    // Criar pool usando configurações do config.js
    pool = mysql.createPool(config);
    
    // Testar conexão obtendo uma conexão do pool
    const connection = await pool.getConnection();
    console.log('✅ MySQL conectado com sucesso');
    
    // Liberar conexão de teste de volta para o pool
    connection.release();
    
    return pool;
  } catch (error) {
    // Logar erro mas não parar o serviço
    console.log('❌ Erro ao conectar com MySQL:', error.message);
    return null;
  }
};

// ============================================================================
// 🚀 EXECUÇÃO DE QUERIES
// ============================================================================

/**
 * Função para executar queries SQL no banco de dados
 * 
 * FUNCIONAMENTO:
 * 1. Verifica se o pool de conexões está disponível
 * 2. Executa a query usando mysql2/promise
 * 3. Retorna apenas as linhas (rows) do resultado
 * 4. Trata erros e loga para debugging
 * 
 * PARÂMETROS:
 * - query: String SQL a ser executada
 * - params: Array de parâmetros para a query (opcional)
 * 
 * EXEMPLOS DE USO:
 * - executeQuery('SELECT * FROM orders') - Sem parâmetros
 * - executeQuery('SELECT * FROM orders WHERE id = ?', [1]) - Com parâmetro
 * - executeQuery('INSERT INTO orders (user_id, total) VALUES (?, ?)', ['user123', 25.90])
 * 
 * RETORNO:
 * - Array com resultados da query
 * - Erro se falhar na execução
 * 
 * SEGURANÇA:
 * - Usa prepared statements para evitar SQL injection
 * - Parâmetros são escapados automaticamente
 */
const executeQuery = async (query, params = []) => {
  try {
    // Verificar se o pool está disponível
    if (!pool) {
      throw new Error('Banco de dados não conectado');
    }
    
    // Executar query usando prepared statement
    // mysql2/promise retorna [rows, fields], mas só precisamos das rows
    const [rows] = await pool.execute(query, params);
    
    return rows;
  } catch (error) {
    // Logar erro para debugging
    console.log('❌ Erro na query:', error.message);
    throw error;  // Re-throw para ser tratado na rota
  }
};

// ============================================================================
// 🔍 VERIFICAÇÃO DE STATUS DA CONEXÃO
// ============================================================================

/**
 * Função para verificar se o banco de dados está acessível
 * 
 * FUNCIONAMENTO:
 * 1. Verifica se o pool foi criado
 * 2. Tenta obter uma conexão do pool
 * 3. Libera a conexão imediatamente
 * 4. Retorna true se conseguir conectar, false caso contrário
 * 
 * USO:
 * - Health checks do serviço
 * - Middleware de verificação antes de rotas
 * - Monitoramento de status do banco
 * 
 * RETORNO:
 * - true: Banco está acessível
 * - false: Banco não está acessível
 * 
 * BENEFÍCIOS:
 * - Verificação rápida de saúde
 * - Não mantém conexões abertas desnecessariamente
 * - Permite que o serviço saiba quando o banco está down
 */
const checkConnection = async () => {
  try {
    // Verificar se o pool existe
    if (!pool) return false;
    
    // Tentar obter uma conexão do pool
    const connection = await pool.getConnection();
    
    // Liberar conexão imediatamente (não vamos usá-la)
    connection.release();
    
    return true;  // Se chegou até aqui, a conexão está funcionando
  } catch (error) {
    // Se falhar ao obter conexão, o banco está down
    return false;
  }
};

// ============================================================================
// 🚀 INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

// Criar pool de conexões assim que o módulo for carregado
createPool();

// ============================================================================
// 📤 EXPORTAÇÃO DAS FUNÇÕES
// ============================================================================

/**
 * Módulo exporta as seguintes funções:
 * 
 * 1. executeQuery(query, params): Executa queries SQL
 * 2. checkConnection(): Verifica status da conexão
 * 3. createPool(): Recria o pool se necessário
 * 
 * USO NO SERVIDOR:
 * - const { executeQuery, checkConnection } = require('./database');
 * - executeQuery('SELECT * FROM orders') - Para buscar dados
 * - checkConnection() - Para verificar se o banco está up
 */
module.exports = {
  executeQuery,      // Função principal para executar queries
  checkConnection,   // Função para verificar status da conexão
  createPool         // Função para recriar pool se necessário
};

/**
 * 📚 RESUMO DO MÓDULO:
 * 
 * Este módulo de banco de dados demonstra:
 * 
 * 1. **POOL DE CONEXÕES**: Gerenciamento eficiente de conexões MySQL
 * 2. **PREPARED STATEMENTS**: Segurança contra SQL injection
 * 3. **TRATAMENTO DE ERROS**: Logging e tratamento centralizado
 * 4. **VERIFICAÇÃO DE SAÚDE**: Health checks para monitoramento
 * 5. **INICIALIZAÇÃO AUTOMÁTICA**: Pool criado automaticamente
 * 
 * CONCEITOS APLICADOS:
 * - Connection pooling para performance
 * - Prepared statements para segurança
 * - Async/await para operações assíncronas
 * - Error handling centralizado
 * - Health monitoring
 * 
 * ESTRUTURA DO POOL:
 * - Máximo 10 conexões simultâneas
 * - Fila ilimitada de espera
 * - Conexões reutilizadas automaticamente
 * - Timeout automático para conexões ociosas
 */
