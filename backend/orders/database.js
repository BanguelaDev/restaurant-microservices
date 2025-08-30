const mysql = require('mysql2/promise');
const config = require('./config');

let pool = null;

// Função para criar pool de conexões
const createPool = async () => {
  try {
    pool = mysql.createPool(config);
    
    // Testar conexão
    const connection = await pool.getConnection();
    console.log('✅ MySQL conectado com sucesso');
    connection.release();
    
    return pool;
  } catch (error) {
    console.log('❌ Erro ao conectar com MySQL:', error.message);
    return null;
  }
};

// Função para executar queries
const executeQuery = async (query, params = []) => {
  try {
    if (!pool) {
      throw new Error('Banco de dados não conectado');
    }
    
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.log('❌ Erro na query:', error.message);
    throw error;
  }
};

// Função para verificar status da conexão
const checkConnection = async () => {
  try {
    if (!pool) return false;
    
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    return false;
  }
};

// Inicializar conexão
createPool();

module.exports = {
  executeQuery,
  checkConnection,
  createPool
};
