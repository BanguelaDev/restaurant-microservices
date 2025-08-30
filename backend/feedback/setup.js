// Script de configuração do MongoDB para o serviço de feedback
// Execute este script no MongoDB para criar o banco e as coleções

// Conectar ao MongoDB
use restaurant_feedback;

// Criar coleção de feedback
db.createCollection('feedback');

// Inserir dados de exemplo
db.feedback.insertMany([
  {
    user_id: "user123",
    rating: 5,
    comment: "Excelente atendimento! Os hambúrgueres estavam deliciosos.",
    order_id: "order123",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: "user456",
    rating: 4,
    comment: "Muito bom, só demorou um pouco para entregar.",
    order_id: "order456",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    user_id: "user789",
    rating: 5,
    comment: "Perfeito! Recomendo a todos.",
    order_id: "order789",
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Criar índices para melhor performance
db.feedback.createIndex({ "user_id": 1 });
db.feedback.createIndex({ "rating": 1 });
db.feedback.createIndex({ "created_at": -1 });

// Verificar dados inseridos
db.feedback.find().pretty();

// Verificar estatísticas
db.feedback.stats();
