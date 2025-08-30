// Configurações do MongoDB
// Use variáveis de ambiente para dados sensíveis

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const mongoConfig = {
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  database: process.env.MONGODB_DATABASE || 'restaurant_feedback',
  collection: process.env.MONGODB_COLLECTION || 'feedback'
};

module.exports = mongoConfig;
