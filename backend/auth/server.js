/**
 * 🚀 SERVIÇO DE AUTENTICAÇÃO - RESTAURANTE MICROSSERVIÇOS
 * 
 * Este arquivo implementa o microsserviço de autenticação que gerencia:
 * - Login e registro de usuários
 * - Verificação de tokens JWT do Firebase
 * - Perfis de usuário
 * - Middleware de autenticação para outros serviços
 * 
 * TECNOLOGIAS UTILIZADAS:
 * - Express.js: Framework web para criar a API
 * - Firebase Admin SDK: Para autenticação e verificação de usuários
 * - CORS: Para permitir requisições do frontend
 * - dotenv: Para gerenciar variáveis de ambiente
 * 
 * ARQUITETURA:
 * - Serviço independente que roda na porta 3001
 * - Comunica com Firebase para autenticação
 * - Fornece middleware para outros serviços verificarem tokens
 * - Resposta padronizada para todas as operações
 */

// Importar dependências necessárias
const express = require('express');           // Framework web para criar APIs
const cors = require('cors');                 // Middleware para permitir requisições cross-origin
const admin = require('firebase-admin');      // SDK do Firebase para autenticação
const firebaseConfig = require('./config');   // Configurações do Firebase

// Gerenciamento de variáveis de ambiente
const dotenv = require("dotenv");             // Carrega variáveis do arquivo .env
const path = require("path");                 // Utilitário para manipular caminhos de arquivo

// Carregar variáveis de ambiente do arquivo .env na pasta atual
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Criar instância do Express e definir porta
const app = express();
const PORT = process.env.PORT || 3001;       // Usa porta do ambiente ou padrão 3001

// ============================================================================
// 🔧 CONFIGURAÇÃO DE MIDDLEWARES
// ============================================================================

// Middleware CORS: Permite requisições do frontend (porta 3000)
app.use(cors());

// Middleware JSON: Converte corpo das requisições para objeto JavaScript
app.use(express.json());

// ============================================================================
// 🔥 INICIALIZAÇÃO DO FIREBASE ADMIN
// ============================================================================

// Tentar inicializar o Firebase Admin SDK com as credenciais
try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)  // Usar credenciais do arquivo de configuração
  });
  console.log('✅ Firebase Admin inicializado com sucesso');
} catch (error) {
  // Se falhar, logar o erro mas continuar funcionando
  console.log('⚠️ Firebase Admin não pôde ser inicializado:', error.message);
  console.log('⚠️ O serviço continuará funcionando, mas sem autenticação Firebase');
}

// ============================================================================
// 🔐 MIDDLEWARE DE VERIFICAÇÃO DE TOKEN
// ============================================================================

/**
 * Middleware que verifica se o usuário está autenticado
 * 
 * FUNCIONAMENTO:
 * 1. Extrai o token do header Authorization
 * 2. Verifica se o Firebase Admin está disponível
 * 3. Valida o token com o Firebase
 * 4. Adiciona informações do usuário ao objeto req.user
 * 
 * USO:
 * - Adicionar este middleware nas rotas que precisam de autenticação
 * - Exemplo: app.get('/profile', verifyToken, (req, res) => { ... })
 */
const verifyToken = async (req, res, next) => {
  try {
    // Extrair token do header Authorization (formato: "Bearer TOKEN_AQUI")
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    // Verificar se o token foi fornecido
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verificar se o Firebase Admin está disponível
    if (!admin.apps.length) {
      return res.status(503).json({ error: 'Serviço de autenticação indisponível' });
    }

    // Verificar o token com o Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Adicionar informações do usuário ao objeto da requisição
    req.user = decodedToken;
    
    // Continuar para o próximo middleware/rota
    next();
  } catch (error) {
    console.log('❌ Erro na verificação do token:', error.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// ============================================================================
// 🛣️ DEFINIÇÃO DAS ROTAS DA API
// ============================================================================

// Rota de health check - para monitoramento do serviço
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Auth Service',
    firebase: admin.apps.length > 0 ? 'Connected' : 'Disconnected',  // Status do Firebase
    timestamp: new Date().toISOString()                              // Timestamp atual
  });
});

// ============================================================================
// 🔑 ROTA DE LOGIN
// ============================================================================

/**
 * POST /login - Verificar credenciais do usuário
 * 
 * FUNCIONAMENTO:
 * 1. Recebe um token ID do Firebase (gerado no frontend)
 * 2. Verifica se o token é válido
 * 3. Retorna informações do usuário se autenticado
 * 
 * DADOS DE ENTRADA:
 * - idToken: Token JWT do Firebase (obrigatório)
 * 
 * RESPOSTA:
 * - success: true/false
 * - user: Objeto com informações do usuário
 * - message: Mensagem de sucesso/erro
 */
app.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;  // Extrair token do corpo da requisição
    
    // Validar se o token foi fornecido
    if (!idToken) {
      return res.status(400).json({ error: 'Token ID não fornecido' });
    }

    // Verificar se o Firebase Admin está disponível
    if (!admin.apps.length) {
      return res.status(503).json({ 
        error: 'Serviço de autenticação indisponível',
        message: 'Tente novamente mais tarde'
      });
    }

    // Verificar o token com o Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Retornar sucesso com informações do usuário
    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,           // ID único do usuário
        email: decodedToken.email,       // Email do usuário
        name: decodedToken.name || 'Usuário'  // Nome ou padrão
      },
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.log('❌ Erro no login:', error.message);
    res.status(401).json({ 
      error: 'Falha na autenticação',
      message: 'Verifique suas credenciais'
    });
  }
});

// ============================================================================
// 📝 ROTA DE REGISTRO
// ============================================================================

/**
 * POST /register - Criar nova conta de usuário
 * 
 * FUNCIONAMENTO:
 * 1. Recebe email, senha e nome do usuário
 * 2. Cria nova conta no Firebase
 * 3. Retorna informações da conta criada
 * 
 * DADOS DE ENTRADA:
 * - email: Email do usuário (obrigatório)
 * - password: Senha do usuário (obrigatório)
 * - displayName: Nome de exibição (opcional)
 * 
 * RESPOSTA:
 * - success: true/false
 * - user: Objeto com informações do usuário criado
 * - message: Mensagem de sucesso/erro
 */
app.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;  // Extrair dados do corpo
    
    // Validar campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Verificar se o Firebase Admin está disponível
    if (!admin.apps.length) {
      return res.status(503).json({ 
        error: 'Serviço de autenticação indisponível',
        message: 'Tente novamente mais tarde'
      });
    }

    // Criar novo usuário no Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || 'Usuário'  // Usar nome fornecido ou padrão
    });

    // Retornar sucesso com informações do usuário criado
    res.json({
      success: true,
      user: {
        uid: userRecord.uid,           // ID único do usuário
        email: userRecord.email,       // Email do usuário
        name: userRecord.displayName   // Nome de exibição
      },
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    console.log('❌ Erro no registro:', error.message);
    
    // Tratar erro específico de email já existente
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ 
        error: 'Email já cadastrado',
        message: 'Use outro email ou faça login'
      });
    }
    
    // Erro genérico
    res.status(500).json({ 
      error: 'Erro ao criar usuário',
      message: 'Tente novamente mais tarde'
    });
  }
});

// ============================================================================
// 👤 ROTA DE PERFIL
// ============================================================================

/**
 * GET /profile - Obter perfil do usuário autenticado
 * 
 * FUNCIONAMENTO:
 * 1. Usa o middleware verifyToken para autenticar
 * 2. Extrai informações do usuário do token
 * 3. Retorna perfil do usuário
 * 
 * AUTENTICAÇÃO:
 * - Requer token válido no header Authorization
 * - Usa middleware verifyToken
 * 
 * RESPOSTA:
 * - success: true/false
 * - user: Objeto com informações do usuário
 */
app.get('/profile', verifyToken, (req, res) => {
  try {
    // req.user é preenchido pelo middleware verifyToken
    res.json({
      success: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name || req.user.display_name || 'Usuário'  // Fallback para diferentes campos
      }
    });
  } catch (error) {
    console.log('❌ Erro ao obter perfil:', error.message);
    res.status(500).json({ 
      error: 'Erro ao obter perfil',
      message: 'Tente novamente mais tarde'
    });
  }
});

// ============================================================================
// 🚨 TRATAMENTO DE ERROS GLOBAL
// ============================================================================

/**
 * Middleware de tratamento de erros não capturados
 * 
 * FUNCIONAMENTO:
 * - Captura erros que não foram tratados nas rotas
 * - Loga o erro para debugging
 * - Retorna resposta padronizada de erro
 */
app.use((error, req, res, next) => {
  console.log('❌ Erro não tratado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: 'Algo deu errado'
  });
});

// ============================================================================
// ❌ ROTA 404 - PÁGINA NÃO ENCONTRADA
// ============================================================================

/**
 * Middleware para rotas não encontradas
 * 
 * FUNCIONAMENTO:
 * - Captura todas as requisições que não correspondem a rotas definidas
 * - Retorna erro 404 padronizado
 */
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ============================================================================
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

// Iniciar o servidor na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Serviço de Autenticação rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}`);
  console.log(`🔒 Firebase: ${admin.apps.length > 0 ? 'Conectado' : 'Desconectado'}`);
});

/**
 * 📚 RESUMO DO SERVIÇO:
 * 
 * Este microsserviço de autenticação demonstra:
 * 
 * 1. **INDEPENDÊNCIA**: Funciona mesmo se outros serviços falharem
 * 2. **RESILIÊNCIA**: Continua funcionando mesmo se o Firebase falhar
 * 3. **MIDDLEWARE REUTILIZÁVEL**: verifyToken pode ser usado por outros serviços
 * 4. **TRATAMENTO DE ERROS**: Respostas padronizadas e logging detalhado
 * 5. **VALIDAÇÃO**: Verifica dados de entrada em todas as rotas
 * 6. **MONITORAMENTO**: Endpoint de health check para verificar status
 * 
 * CONCEITOS DE MICROSSERVIÇOS APLICADOS:
 * - Separação de responsabilidades (só autenticação)
 * - Comunicação via APIs REST
 * - Banco de dados especializado (Firebase para auth)
 * - Deploy independente
 * - Escalabilidade horizontal
 */
