/**
 * 🗄️ CONEXÃO COM BANCO DE DADOS MONGODB - SERVIÇO DE FEEDBACK
 * 
 * Este arquivo gerencia toda a comunicação com o banco de dados MongoDB:
 * - Criação e gerenciamento da conexão com MongoDB
 * - Execução de operações no banco
 * - Verificação de status da conexão
 * - Tratamento de erros de banco
 * - Encerramento gracioso da conexão
 * 
 * TECNOLOGIAS UTILIZADAS:
 * - mongodb: Driver oficial do MongoDB para Node.js
 * - MongoClient: Cliente para conectar ao servidor MongoDB
 * - Configuração via arquivo config.js
 * 
 * ARQUITETURA:
 * - Conexão única com MongoDB
 * - Reutilização da mesma conexão para todas as operações
 * - Verificação de saúde da conexão
 * - Tratamento de erros centralizado
 * - Encerramento automático ao finalizar o processo
 * 
 * VANTAGENS DO MONGODB:
 * - Schema flexível (campos opcionais)
 * - Documentos JSON nativos
 * - Agregações poderosas
 * - Escalabilidade horizontal
 * - Índices para performance
 */

// Importar dependências
const { MongoClient } = require('mongodb');   // Driver oficial do MongoDB
const config = require('./config');           // Configurações do banco (URL, database, collection)

// Variáveis globais para armazenar conexão e referências
let client = null;        // Cliente MongoDB
let db = null;            // Referência para o banco de dados
let collection = null;     // Referência para a coleção

// ============================================================================
// 🔌 CONEXÃO COM MONGODB
// ============================================================================

/**
 * Função para conectar ao servidor MongoDB
 * 
 * FUNCIONAMENTO:
 * 1. Cria novo cliente MongoDB usando configurações do config.js
 * 2. Estabelece conexão com o servidor
 * 3. Seleciona banco de dados específico
 * 4. Obtém referência para a coleção de feedback
 * 5. Loga sucesso ou erro da conexão
 * 
 * CONFIGURAÇÕES:
 * - url: Endereço do servidor MongoDB (ex: mongodb://localhost:27017)
 * - database: Nome do banco de dados (ex: restaurant_feedback)
 * - collection: Nome da coleção (ex: feedback)
 * 
 * RETORNO:
 * - true: Conexão estabelecida com sucesso
 * - false: Falha na conexão
 * 
 * BENEFÍCIOS:
 * - Conexão única reutilizada
 * - Referências persistentes para db e collection
 * - Tratamento de erros centralizado
 * - Logs informativos para debugging
 */
const connect = async () => {
  try {
    // Criar novo cliente MongoDB
    client = new MongoClient(config.url);
    
    // Estabelecer conexão com o servidor
    await client.connect();
    
    // Selecionar banco de dados específico
    db = client.db(config.database);
    
    // Obter referência para a coleção
    collection = db.collection(config.collection);
    
    console.log('✅ MongoDB conectado com sucesso');
    return true;
  } catch (error) {
    // Logar erro mas não parar o serviço
    console.log('❌ Erro ao conectar com MongoDB:', error.message);
    return false;
  }
};

// ============================================================================
// 🔍 VERIFICAÇÃO DE CONEXÃO
// ============================================================================

/**
 * Função para verificar se o banco de dados MongoDB está acessível
 * 
 * FUNCIONAMENTO:
 * 1. Verifica se o cliente foi criado
 * 2. Executa comando ping no banco admin
 * 3. Retorna true se conseguir executar o comando
 * 4. Retorna false se falhar na execução
 * 
 * USO:
 * - Health checks do serviço
 * - Middleware de verificação antes de rotas
 * - Monitoramento de status do banco
 * 
 * RETORNO:
 * - true: MongoDB está acessível
 * - false: MongoDB não está acessível
 * 
 * BENEFÍCIOS:
 * - Verificação rápida de saúde
 * - Comando leve (ping)
 * - Não consome recursos significativos
 * - Permite que o serviço saiba quando o banco está down
 * 
 * NOTA:
 * - Usa banco 'admin' para o comando ping
 * - Ping é um comando interno do MongoDB
 * - Resposta rápida e confiável
 */
const checkConnection = async () => {
  try {
    // Verificar se o cliente existe
    if (!client) return false;
    
    // Executar comando ping no banco admin
    // Se falhar, significa que o MongoDB está down
    await client.db('admin').command({ ping: 1 });
    
    return true;  // Se chegou até aqui, a conexão está funcionando
  } catch (error) {
    // Se falhar ao executar ping, o MongoDB está down
    return false;
  }
};

// ============================================================================
// 🚀 EXECUÇÃO DE OPERAÇÕES
// ============================================================================

/**
 * Função para executar operações no banco de dados MongoDB
 * 
 * FUNCIONAMENTO:
 * 1. Verifica se a coleção está disponível
 * 2. Executa a operação fornecida como callback
 * 3. Retorna o resultado da operação
 * 4. Trata erros e loga para debugging
 * 
 * PARÂMETROS:
 * - operation: Função callback que recebe a coleção e executa a operação
 * 
 * EXEMPLOS DE USO:
 * - executeOperation(async (collection) => collection.find().toArray())
 * - executeOperation(async (collection) => collection.insertOne(doc))
 * - executeOperation(async (collection) => collection.deleteOne(filter))
 * 
 * RETORNO:
 * - Resultado da operação executada
 * - Erro se falhar na execução
 * 
 * BENEFÍCIOS:
 * - Interface consistente para todas as operações
 * - Verificação automática de conexão
 * - Tratamento de erros centralizado
 * - Logging para debugging
 * 
 * SEGURANÇA:
 * - Verifica se a coleção está disponível
 * - Trata erros de conexão
 * - Não expõe detalhes internos do banco
 */
const executeOperation = async (operation) => {
  try {
    // Verificar se a coleção está disponível
    if (!collection) {
      throw new Error('Banco de dados não conectado');
    }
    
    // Executar operação fornecida
    // A operação recebe a coleção como parâmetro
    return await operation(collection);
  } catch (error) {
    // Logar erro para debugging
    console.log('❌ Erro na operação:', error.message);
    throw error;  // Re-throw para ser tratado na rota
  }
};

// ============================================================================
// 🔌 FECHAMENTO DE CONEXÃO
// ============================================================================

/**
 * Função para fechar a conexão com MongoDB de forma graciosa
 * 
 * FUNCIONAMENTO:
 * 1. Verifica se o cliente existe
 * 2. Fecha a conexão com o servidor
 * 3. Loga sucesso ou erro do fechamento
 * 
 * USO:
 * - Encerramento gracioso do serviço
 * - Limpeza de recursos
 * - Evita conexões órfãs
 * 
 * BENEFÍCIOS:
 * - Fechamento limpo da conexão
 * - Liberação de recursos do sistema
 * - Logs informativos para debugging
 * - Tratamento de erros no fechamento
 * 
 * NOTA:
 * - Deve ser chamada quando o serviço for encerrado
 * - Evita vazamentos de memória
 * - Boa prática para aplicações Node.js
 */
const closeConnection = async () => {
  try {
    // Verificar se o cliente existe
    if (client) {
      // Fechar conexão com o servidor
      await client.close();
      console.log('🔌 Conexão MongoDB fechada');
    }
  } catch (error) {
    // Logar erro mas não falhar no fechamento
    console.log('❌ Erro ao fechar conexão:', error.message);
  }
};

// ============================================================================
// 🚀 INICIALIZAÇÃO AUTOMÁTICA
// ============================================================================

// Conectar ao MongoDB assim que o módulo for carregado
connect();

// ============================================================================
// 🛑 TRATAMENTO DE ENCERRAMENTO GRACIOSO
// ============================================================================

/**
 * Event listeners para encerramento gracioso do processo
 * 
 * FUNCIONAMENTO:
 * - Captura sinais de encerramento do sistema
 * - Chama closeConnection() para fechar conexão limpa
 * - Evita conexões órfãs e vazamentos de memória
 * 
 * SINAIS CAPTURADOS:
 * - SIGINT: Interrupção do terminal (Ctrl+C)
 * - SIGTERM: Terminação do processo
 * 
 * BENEFÍCIOS:
 * - Encerramento limpo do serviço
 * - Liberação automática de recursos
 * - Boas práticas para aplicações Node.js
 * - Evita problemas em ambientes de produção
 * 
 * NOTA:
 * - SIGINT é comum em desenvolvimento (Ctrl+C)
 * - SIGTERM é comum em produção (docker stop, systemctl stop)
 * - Ambos os sinais são tratados da mesma forma
 */
process.on('SIGINT', closeConnection);   // Capturar Ctrl+C
process.on('SIGTERM', closeConnection);  // Capturar sinal de terminação

// ============================================================================
// 📤 EXPORTAÇÃO DAS FUNÇÕES
// ============================================================================

/**
 * Módulo exporta as seguintes funções:
 * 
 * 1. executeOperation(operation): Executa operações no MongoDB
 * 2. checkConnection(): Verifica status da conexão
 * 3. connect(): Reconecta ao MongoDB se necessário
 * 4. closeConnection(): Fecha conexão graciosamente
 * 
 * USO NO SERVIDOR:
 * - const { executeOperation, checkConnection } = require('./database');
 * - executeOperation(async (collection) => collection.find().toArray()) - Para buscar dados
 * - checkConnection() - Para verificar se o banco está up
 * - closeConnection() - Para fechar conexão ao encerrar
 */
module.exports = {
  executeOperation,    // Função principal para executar operações
  checkConnection,     // Função para verificar status da conexão
  connect,             // Função para reconectar se necessário
  closeConnection      // Função para fechar conexão graciosamente
};

/**
 * 📚 RESUMO DO MÓDULO:
 * 
 * Este módulo de banco de dados demonstra:
 * 
 * 1. **CONEXÃO ÚNICA**: Uma conexão reutilizada para todas as operações
 * 2. **OPERATIONS HELPER**: Interface consistente para operações MongoDB
 * 3. **HEALTH CHECKS**: Verificação de saúde da conexão
 * 4. **GRACEFUL SHUTDOWN**: Encerramento limpo da conexão
 * 5. **ERROR HANDLING**: Tratamento centralizado de erros
 * 
 * CONCEITOS APLICADOS:
 * - Connection pooling (conceito similar)
 * - Async/await para operações assíncronas
 * - Event-driven programming (process.on)
 * - Error handling centralizado
 * - Health monitoring
 * 
 * ESTRUTURA DA CONEXÃO:
 * - Cliente único para todo o serviço
 * - Referências persistentes para db e collection
 * - Verificação automática de saúde
 * - Encerramento automático ao finalizar
 * 
 * VANTAGENS DO MONGODB:
 * - Schema flexível para feedbacks
 * - Agregações nativas para estatísticas
 * - Documentos JSON para fácil manipulação
 * - Escalabilidade horizontal automática
 * - Índices para consultas rápidas
 */
