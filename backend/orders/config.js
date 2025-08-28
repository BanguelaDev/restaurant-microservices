// Configurações do MySQL
// Substitua com suas próprias configurações

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '091278',
  database: 'restaurant_orders',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

module.exports = mysqlConfig;
