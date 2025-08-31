/**
 * 🔥 CONFIGURAÇÕES DO FIREBASE - SERVIÇO DE AUTENTICAÇÃO
 * 
 * Este arquivo contém todas as configurações necessárias para conectar
 * o serviço de autenticação com o Firebase.
 * 
 * IMPORTANTE: Este arquivo NÃO deve ser commitado no Git com dados reais!
 * Use sempre variáveis de ambiente (.env) para dados sensíveis.
 * 
 * ESTRUTURA DO FIREBASE:
 * - project_id: ID único do projeto no Firebase
 * - private_key: Chave privada para autenticação (muito sensível!)
 * - client_email: Email da conta de serviço
 * - client_id: ID do cliente OAuth2
 * - auth_uri: URL para autenticação OAuth2
 * - token_uri: URL para obter tokens
 * - client_x509_cert_url: URL do certificado X.509
 * 
 * SEGURANÇA:
 * - Nunca exponha private_key em código
 * - Use sempre variáveis de ambiente
 * - Rotacione chaves regularmente
 * - Monitore uso das credenciais
 */

// Importar dependências para gerenciar variáveis de ambiente
const dotenv = require("dotenv");             // Carrega variáveis do arquivo .env
const path = require("path");                 // Utilitário para manipular caminhos de arquivo

// Carregar variáveis de ambiente do arquivo .env na pasta atual
// Isso permite configurar credenciais sem modificar o código
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * Configuração do Firebase Admin SDK
 * 
 * Esta configuração é usada para:
 * 1. Conectar ao projeto Firebase
 * 2. Autenticar requisições
 * 3. Gerenciar usuários
 * 4. Verificar tokens JWT
 * 
 * ESTRUTURA:
 * - type: Tipo da conta de serviço (sempre "service_account")
 * - project_id: ID do projeto Firebase
 * - private_key: Chave privada RSA (muito sensível!)
 * - client_email: Email da conta de serviço
 * - client_id: ID do cliente OAuth2
 * - auth_uri: URL para autenticação OAuth2
 * - token_uri: URL para obter tokens de acesso
 * - auth_provider_x509_cert_url: URL dos certificados do Google
 * - client_x509_cert_url: URL do certificado específico do cliente
 */
const firebaseConfig = {
  // Tipo da conta (sempre "service_account" para contas de serviço)
  type: "service_account",
  
  // ID do projeto Firebase (pode ser definido no .env ou usar padrão)
  project_id: process.env.FIREBASE_PROJECT_ID || "restaurant-microservices",
  
  // ID da chave privada (obrigatório)
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  
  // Chave privada RSA (obrigatório e muito sensível!)
  // Substitui \n por quebras de linha reais para formato correto
  private_key: process.env.FIREBASE_PRIVATE_KEY ? 
    process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  
  // Email da conta de serviço (obrigatório)
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  
  // ID do cliente OAuth2 (obrigatório)
  client_id: process.env.FIREBASE_CLIENT_ID,
  
  // URL para autenticação OAuth2 (fixo para Google)
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  
  // URL para obter tokens de acesso (fixo para Google)
  token_uri: "https://oauth2.googleapis.com/token",
  
  // URL dos certificados de autenticação do Google (fixo)
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  
  // URL do certificado X.509 específico do cliente (obrigatório)
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

/**
 * VALIDAÇÃO DE CONFIGURAÇÃO
 * 
 * Verifica se as variáveis de ambiente essenciais estão configuradas
 * antes de tentar conectar ao Firebase.
 * 
 * VARIÁVEIS OBRIGATÓRIAS:
 * - FIREBASE_PRIVATE_KEY: Chave privada RSA
 * - FIREBASE_CLIENT_EMAIL: Email da conta de serviço
 * 
 * VARIÁVEIS OPCIONAIS:
 * - FIREBASE_PROJECT_ID: ID do projeto (usa padrão se não definido)
 * - FIREBASE_PRIVATE_KEY_ID: ID da chave (para identificação)
 * - FIREBASE_CLIENT_ID: ID do cliente OAuth2
 * - FIREBASE_CLIENT_X509_CERT_URL: URL do certificado
 */
if (!firebaseConfig.private_key || !firebaseConfig.client_email) {
  console.error('❌ Configuração do Firebase incompleta!');
  console.error('⚠️ Verifique suas variáveis de ambiente (.env)');
  console.error('📋 Variáveis obrigatórias:');
  console.error('   - FIREBASE_PRIVATE_KEY');
  console.error('   - FIREBASE_CLIENT_EMAIL');
  console.error('🔗 Como configurar:');
  console.error('   1. Acesse Firebase Console > Project Settings');
  console.error('   2. Service Accounts > Generate New Private Key');
  console.error('   3. Baixe o arquivo JSON');
  console.error('   4. Copie os valores para o arquivo .env');
}

/**
 * 📁 EXEMPLO DE ARQUIVO .env
 * 
 * Crie um arquivo chamado .env na pasta backend/auth/ com:
 * 
 * FIREBASE_PROJECT_ID=seu-projeto-id
 * FIREBASE_PRIVATE_KEY_ID=abc123def456
 * FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
 * FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@seu-projeto.iam.gserviceaccount.com
 * FIREBASE_CLIENT_ID=123456789012345678901
 * FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-abc123%40seu-projeto.iam.gserviceaccount.com
 * 
 * ⚠️ IMPORTANTE:
 * - Não commite o arquivo .env no Git
 * - Adicione .env ao .gitignore
 * - Mantenha as credenciais seguras
 * - Use diferentes credenciais para desenvolvimento e produção
 */

// Exportar a configuração para ser usada no server.js
module.exports = firebaseConfig;
