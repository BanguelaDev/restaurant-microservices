/**
 * 🗄️ CONFIGURAÇÕES DO MYSQL - SERVIÇO DE PEDIDOS
 * 
 * Este arquivo contém todas as configurações necessárias para conectar
 * o serviço de pedidos com o banco de dados MySQL.
 * 
 * IMPORTANTE: Este arquivo NÃO deve ser commitado no Git com dados reais!
 * Use sempre variáveis de ambiente (.env) para dados sensíveis.
 * 
 * ESTRUTURA DO MYSQL:
 * - host: Endereço do servidor MySQL
 * - user: Nome do usuário do banco
 * - password: Senha do usuário (muito sensível!)
 * - database: Nome do banco de dados
 * - port: Porta do MySQL (padrão 3306)
 * - waitForConnections: Se deve aguardar conexões disponíveis
 * - connectionLimit: Número máximo de conexões simultâneas
 * - queueLimit: Limite da fila de espera por conexões
 * 
 * SEGURANÇA:
 * - Nunca exponha password em código
 * - Use sempre variáveis de ambiente
 * - Crie usuário específico para o serviço
 * - Limite permissões do usuário
 * - Monitore acesso ao banco
 */

// Importar dependências para gerenciar variáveis de ambiente
const dotenv = require("dotenv");             // Carrega variáveis do arquivo .env
const path = require("path");                 // Utilitário para manipular caminhos de arquivo

// Carregar variáveis de ambiente do arquivo .env na pasta atual
// Isso permite configurar credenciais sem modificar o código
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * Configuração do MySQL para o serviço de pedidos
 * 
 * Esta configuração é usada para:
 * 1. Conectar ao servidor MySQL
 * 2. Autenticar com usuário e senha
 * 3. Selecionar banco de dados específico
 * 4. Configurar pool de conexões
 * 
 * ESTRUTURA:
 * - host: Endereço IP ou hostname do MySQL
 * - user: Nome do usuário do banco
 * - password: Senha do usuário
 * - database: Nome do banco de dados
 * - port: Porta do MySQL (padrão 3306)
 * - waitForConnections: Aguardar conexões disponíveis
 * - connectionLimit: Máximo de conexões simultâneas
 * - queueLimit: Limite da fila de espera
 * 
 * CONFIGURAÇÕES DO POOL:
 * - waitForConnections: true - Aguarda conexões ficarem disponíveis
 * - connectionLimit: 10 - Máximo de 10 conexões simultâneas
 * - queueLimit: 0 - Sem limite na fila de espera
 */
const mysqlConfig = {
  // Endereço do servidor MySQL (localhost para desenvolvimento local)
  host: process.env.DB_HOST,
  
  // Nome do usuário do banco de dados
  user: process.env.DB_USER,
  
  // Senha do usuário (obrigatório e sensível!)
  password: process.env.DB_PASSWORD,
  
  // Nome do banco de dados específico para pedidos
  database: process.env.DB_NAME,
  
  // Porta do MySQL (3306 é a porta padrão)
  port: process.env.DB_PORT,
  
  // Configurações do pool de conexões
  waitForConnections: true,      // Aguardar conexões disponíveis
  connectionLimit: 10,           // Máximo de 10 conexões simultâneas
  queueLimit: 0                  // Sem limite na fila de espera
};

// Exportar a configuração para ser usada no database.js
module.exports = mysqlConfig;

/**
 * 📁 EXEMPLO DE ARQUIVO .env
 * 
 * Crie um arquivo chamado .env na pasta backend/orders/ com:
 * 
 * # Configurações do MySQL
 * DB_HOST=localhost
 * DB_USER=root
 * DB_PASSWORD=sua_senha_mysql
 * DB_NAME=restaurant_orders
 * DB_PORT=3306
 * 
 * ⚠️ IMPORTANTE:
 * - Não commite o arquivo .env no Git
 * - Adicione .env ao .gitignore
 * - Mantenha as credenciais seguras
 * - Use diferentes credenciais para desenvolvimento e produção
 * 
 * 🔧 COMO CONFIGURAR:
 * 
 * 1. **Instalar MySQL**:
 *    - Windows: MySQL Installer
 *    - macOS: brew install mysql
 *    - Linux: sudo apt install mysql-server
 * 
 * 2. **Criar Banco de Dados**:
 *    ```sql
 *    CREATE DATABASE restaurant_orders;
 *    USE restaurant_orders;
 *    ```
 * 
 * 3. **Criar Tabela**:
 *    ```sql
 *    CREATE TABLE orders (
 *        id INT AUTO_INCREMENT PRIMARY KEY,
 *        user_id VARCHAR(255) NOT NULL,
 *        items JSON NOT NULL,
 *        total DECIMAL(10,2) NOT NULL,
 *        status ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
 *        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *    );
 *    ```
 * 
 * 4. **Criar Usuário (Opcional, mas recomendado)**:
 *    ```sql
 *    CREATE USER 'restaurant_user'@'localhost' IDENTIFIED BY 'senha_segura';
 *    GRANT ALL PRIVILEGES ON restaurant_orders.* TO 'restaurant_user'@'localhost';
 *    FLUSH PRIVILEGES;
 *    ```
 * 
 * 5. **Configurar .env**:
 *    - Copie o exemplo acima
 *    - Substitua os valores pelos seus
 *    - Use o usuário criado em vez de root (mais seguro)
 * 
 * 🚨 PROBLEMAS COMUNS:
 * 
 * **Erro: "Access denied for user"**:
 * - Verifique usuário e senha no .env
 * - Confirme se o usuário tem permissões no banco
 * - Tente conectar manualmente: mysql -u usuario -p
 * 
 * **Erro: "Unknown database"**:
 * - Verifique se o banco restaurant_orders existe
 * - Execute: CREATE DATABASE restaurant_orders;
 * 
 * **Erro: "Connection refused"**:
 * - Verifique se o MySQL está rodando
 * - Windows: Services > MySQL
 * - macOS/Linux: sudo systemctl status mysql
 * 
 * **Erro: "Table doesn't exist"**:
 * - Execute o script de criação da tabela
 * - Verifique se está no banco correto: USE restaurant_orders;
 * 
 * 📊 MONITORAMENTO:
 * 
 * Para verificar se está funcionando:
 * ```sql
 * -- Verificar conexões ativas
 * SHOW PROCESSLIST;
 * 
 * -- Verificar status do banco
 * SHOW STATUS LIKE 'Connections';
 * 
 * -- Verificar tabelas
 * SHOW TABLES;
 * 
 * -- Verificar estrutura da tabela
 * DESCRIBE orders;
 * ```
 */
