/**
 * 🗄️ CONFIGURAÇÕES DO MONGODB - SERVIÇO DE FEEDBACK
 * 
 * Este arquivo contém todas as configurações necessárias para conectar
 * o serviço de feedback com o banco de dados MongoDB.
 * 
 * IMPORTANTE: Este arquivo NÃO deve ser commitado no Git com dados reais!
 * Use sempre variáveis de ambiente (.env) para dados sensíveis.
 * 
 * ESTRUTURA DO MONGODB:
 * - url: Endereço do servidor MongoDB
 * - database: Nome do banco de dados
 * - collection: Nome da coleção (similar a tabela no SQL)
 * 
 * SEGURANÇA:
 * - Nunca exponha credenciais em código
 * - Use sempre variáveis de ambiente
 * - Configure autenticação no MongoDB se necessário
 * - Monitore acesso ao banco
 * - Use redes privadas em produção
 * 
 * VANTAGENS DO MONGODB:
 * - Schema flexível (campos opcionais)
 * - Documentos JSON nativos
 * - Agregações poderosas para estatísticas
 * - Escalabilidade horizontal automática
 * - Índices para consultas rápidas
 */

// Importar dependências para gerenciar variáveis de ambiente
const dotenv = require("dotenv");             // Carrega variáveis do arquivo .env
const path = require("path");                 // Utilitário para manipular caminhos de arquivo

// Carregar variáveis de ambiente do arquivo .env na pasta atual
// Isso permite configurar credenciais sem modificar o código
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * Configuração do MongoDB para o serviço de feedback
 * 
 * Esta configuração é usada para:
 * 1. Conectar ao servidor MongoDB
 * 2. Selecionar banco de dados específico
 * 3. Acessar coleção específica
 * 4. Configurar operações do banco
 * 
 * ESTRUTURA:
 * - url: Endereço IP ou hostname do MongoDB
 * - database: Nome do banco de dados
 * - collection: Nome da coleção (similar a tabela)
 * 
 * CONFIGURAÇÕES PADRÃO:
 * - url: mongodb://localhost:27017 (desenvolvimento local)
 * - database: restaurant_feedback
 * - collection: feedback
 * 
 * NOTA:
 * - MongoDB não requer usuário/senha por padrão (desenvolvimento)
 * - Em produção, sempre configure autenticação
 * - Use variáveis de ambiente para diferentes ambientes
 */
const mongoConfig = {
  // URL de conexão com o servidor MongoDB
  // Formato: mongodb://[username:password@]host[:port]/[database]
  // Exemplos:
  // - mongodb://localhost:27017 (local sem autenticação)
  // - mongodb://user:pass@localhost:27017 (local com autenticação)
  // - mongodb://cluster.mongodb.net (MongoDB Atlas)
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  
  // Nome do banco de dados específico para feedback
  // MongoDB criará automaticamente se não existir
  database: process.env.MONGODB_DATABASE || 'restaurant_feedback',
  
  // Nome da coleção (similar a tabela no SQL)
  // MongoDB criará automaticamente se não existir
  collection: process.env.MONGODB_COLLECTION || 'feedback'
};

// Exportar a configuração para ser usada no database.js
module.exports = mongoConfig;

/**
 * 📁 EXEMPLO DE ARQUIVO .env
 * 
 * Crie um arquivo chamado .env na pasta backend/feedback/ com:
 * 
 * # Configurações do MongoDB
 * MONGODB_URL=mongodb://localhost:27017
 * MONGODB_DATABASE=restaurant_feedback
 * MONGODB_COLLECTION=feedback
 * 
 * ⚠️ IMPORTANTE:
 * - Não commite o arquivo .env no Git
 * - Adicione .env ao .gitignore
 * - Mantenha as credenciais seguras
 * - Use diferentes configurações para desenvolvimento e produção
 * 
 * 🔧 COMO CONFIGURAR:
 * 
 * 1. **Instalar MongoDB**:
 *    - Windows: MongoDB Community Server
 *    - macOS: brew install mongodb-community
 *    - Linux: sudo apt install mongodb
 * 
 * 2. **Iniciar MongoDB**:
 *    - Windows: Serviço automático
 *    - macOS: brew services start mongodb-community
 *    - Linux: sudo systemctl start mongod
 * 
 * 3. **Verificar Status**:
 *    - Windows: Services > MongoDB
 *    - macOS: brew services list
 *    - Linux: sudo systemctl status mongod
 * 
 * 4. **Conectar via Shell**:
 *    ```bash
 *    mongosh
 *    # ou
 *    mongo
 *    ```
 * 
 * 5. **Criar Banco e Coleção (Opcional)**:
 *    ```javascript
 *    use restaurant_feedback
 *    db.createCollection('feedback')
 *    ```
 * 
 * 6. **Configurar .env**:
 *    - Copie o exemplo acima
 *    - Substitua os valores pelos seus
 *    - Verifique se o MongoDB está rodando
 * 
 * 🚨 PROBLEMAS COMUNS:
 * 
 * **Erro: "Connection refused"**:
 * - Verifique se o MongoDB está rodando
 * - Windows: Services > MongoDB
 * - macOS: brew services start mongodb-community
 * - Linux: sudo systemctl start mongod
 * 
 * **Erro: "ECONNREFUSED"**:
 * - Verifique se a porta 27017 está aberta
 * - Teste: telnet localhost 27017
 * - Verifique firewall/antivírus
 * 
 * **Erro: "Authentication failed"**:
 * - Verifique usuário e senha no .env
 * - Confirme se o usuário tem permissões
 * - Tente conectar sem autenticação primeiro
 * 
 * **Erro: "Database not found"**:
 * - MongoDB cria bancos automaticamente
 * - Verifique se o nome está correto no .env
 * - Tente conectar via mongosh primeiro
 * 
 * 📊 MONITORAMENTO:
 * 
 * Para verificar se está funcionando:
 * ```bash
 * # Conectar ao MongoDB
 * mongosh
 * 
 * # Listar bancos
 * show dbs
 * 
 * # Usar banco específico
 * use restaurant_feedback
 * 
 * # Listar coleções
 * show collections
 * 
 * # Verificar documentos
 * db.feedback.find().limit(1)
 * 
 * # Verificar estatísticas
 * db.feedback.stats()
 * ```
 * 
 * 🔐 AUTENTICAÇÃO (OPCIONAL):
 * 
 * Para adicionar autenticação em desenvolvimento:
 * ```javascript
 * // Conectar como admin
 * use admin
 * 
 * // Criar usuário
 * db.createUser({
 *   user: "restaurant_user",
 *   pwd: "senha_segura",
 *   roles: [
 *     { role: "readWrite", db: "restaurant_feedback" }
 *   ]
 * })
 * 
 * // Configurar .env com autenticação
 * MONGODB_URL=mongodb://restaurant_user:senha_segura@localhost:27017
 * ```
 * 
 * 🌐 MONGODB ATLAS (CLOUD):
 * 
 * Para usar MongoDB na nuvem:
 * 1. Crie conta em mongodb.com/atlas
 * 2. Crie cluster gratuito
 * 3. Obtenha string de conexão
 * 4. Configure .env:
 *    ```
 *    MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net
 *    MONGODB_DATABASE=restaurant_feedback
 *    MONGODB_COLLECTION=feedback
 *    ```
 * 
 * 📈 PERFORMANCE:
 * 
 * Para melhorar performance:
 * ```javascript
 * // Criar índices
 * db.feedback.createIndex({ "user_id": 1 })
 * db.feedback.createIndex({ "rating": 1 })
 * db.feedback.createIndex({ "created_at": -1 })
 * 
 * // Verificar índices
 * db.feedback.getIndexes()
 * 
 * // Verificar performance das queries
 * db.feedback.find({ "rating": 5 }).explain("executionStats")
 * ```
 */
