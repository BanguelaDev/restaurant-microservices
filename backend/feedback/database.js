const { MongoClient } = require('mongodb');
const config = require('./config');

let client = null;
let db = null;
let collection = null;

// Função para conectar ao MongoDB
const connect = async () => {
  try {
    client = new MongoClient(config.url);
    await client.connect();
    
    db = client.db(config.database);
    collection = db.collection(config.collection);
    
    console.log('✅ MongoDB conectado com sucesso');
    return true;
  } catch (error) {
    console.log('❌ Erro ao conectar com MongoDB:', error.message);
    return false;
  }
};

// Função para verificar conexão
const checkConnection = async () => {
  try {
    if (!client) return false;
    
    await client.db('admin').command({ ping: 1 });
    return true;
  } catch (error) {
    return false;
  }
};

// Função para executar operações no banco
const executeOperation = async (operation) => {
  try {
    if (!collection) {
      throw new Error('Banco de dados não conectado');
    }
    
    return await operation(collection);
  } catch (error) {
    console.log('❌ Erro na operação:', error.message);
    throw error;
  }
};

// Função para fechar conexão
const closeConnection = async () => {
  try {
    if (client) {
      await client.close();
      console.log('🔌 Conexão MongoDB fechada');
    }
  } catch (error) {
    console.log('❌ Erro ao fechar conexão:', error.message);
  }
};

// Inicializar conexão
connect();

// Tratamento de encerramento gracioso
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

module.exports = {
  executeOperation,
  checkConnection,
  connect,
  closeConnection
};
