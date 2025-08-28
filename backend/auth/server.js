const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const firebaseConfig = require('./config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });
  console.log('✅ Firebase Admin inicializado com sucesso');
} catch (error) {
  console.log('⚠️ Firebase Admin não pôde ser inicializado:', error.message);
  console.log('⚠️ O serviço continuará funcionando, mas sem autenticação Firebase');
}

// Middleware de verificação de token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    if (!admin.apps.length) {
      return res.status(503).json({ error: 'Serviço de autenticação indisponível' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log('❌ Erro na verificação do token:', error.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Rotas
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Auth Service',
    firebase: admin.apps.length > 0 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// POST /login - Verificar credenciais
app.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'Token ID não fornecido' });
    }

    if (!admin.apps.length) {
      return res.status(503).json({ 
        error: 'Serviço de autenticação indisponível',
        message: 'Tente novamente mais tarde'
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || 'Usuário'
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

// POST /register - Criar novo usuário
app.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (!admin.apps.length) {
      return res.status(503).json({ 
        error: 'Serviço de autenticação indisponível',
        message: 'Tente novamente mais tarde'
      });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || 'Usuário'
    });

    res.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName
      },
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    console.log('❌ Erro no registro:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ 
        error: 'Email já cadastrado',
        message: 'Use outro email ou faça login'
      });
    }
    
    res.status(500).json({ 
      error: 'Erro ao criar usuário',
      message: 'Tente novamente mais tarde'
    });
  }
});

// GET /profile - Obter perfil do usuário
app.get('/profile', verifyToken, (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name || req.user.display_name || 'Usuário'
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

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.log('❌ Erro não tratado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Serviço de Autenticação rodando na porta ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}`);
  console.log(`🔒 Firebase: ${admin.apps.length > 0 ? 'Conectado' : 'Desconectado'}`);
});
