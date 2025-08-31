# 🍔 Sistema de Microsserviços - Restaurante

> **Projeto Didático para Estudo de Arquitetura de Microsserviços**

Este é um sistema completo de pedidos de restaurante implementado com **microsserviços independentes**, projetado especificamente para fins educacionais. O projeto demonstra conceitos fundamentais de arquitetura distribuída, comunicação entre serviços e resiliência a falhas.

## 🎯 Objetivos de Aprendizado

- ✅ **Arquitetura de Microsserviços**: Entender como dividir uma aplicação em serviços independentes
- ✅ **Comunicação entre Serviços**: Aprender sobre APIs REST e integração
- ✅ **Resiliência a Falhas**: Ver como um serviço pode continuar funcionando mesmo se outros falharem
- ✅ **Bancos de Dados Especializados**: Usar diferentes tipos de banco para diferentes necessidades
- ✅ **Autenticação Distribuída**: Implementar login/registro com Firebase
- ✅ **Frontend React**: Criar interface moderna e responsiva

## 🏗️ Arquitetura do Sistema

### Visão Geral
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Auth Service  │    │  Orders Service │
│   (React)       │◄──►│   (Firebase)    │    │   (MySQL)       │
│   Porta 3000    │    │   Porta 3001    │    │   Porta 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Feedback      │    │   Firebase      │    │     MySQL       │
│   Service       │    │   Auth DB       │    │   Orders DB     │
│   (MongoDB)     │    │   (Cloud)       │    │   (Local)       │
│   Porta 3003    │    └─────────────────┘    └─────────────────┘
└─────────────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│  Feedback DB    │
│    (Local)      │
└─────────────────┘
```

### Tecnologias Utilizadas

| Camada | Tecnologia | Propósito |
|--------|------------|-----------|
| **Frontend** | React.js + Tailwind CSS | Interface do usuário |
| **Autenticação** | Firebase Admin SDK | Login/registro de usuários |
| **Pedidos** | Node.js + Express + MySQL | Gerenciamento de pedidos |
| **Feedback** | Node.js + Express + MongoDB | Sistema de avaliações |
| **Estilização** | Tailwind CSS | Design responsivo e moderno |

## 📁 Estrutura Detalhada do Projeto

```
restaurant-microservices/
├── 📁 frontend/                    # Aplicação React (Interface do usuário)
│   ├── 📁 src/
│   │   ├── 📁 components/         # Componentes reutilizáveis
│   │   ├── 📁 contexts/           # Contextos React (Auth, Theme)
│   │   ├── 📁 pages/              # Páginas da aplicação
│   │   ├── 📁 services/           # Serviços de API
│   │   └── 📁 data/               # Dados estáticos (cardápio)
│   ├── package.json               # Dependências do frontend
│   └── tailwind.config.js         # Configuração do Tailwind CSS
├── 📁 backend/                     # Microsserviços
│   ├── 📁 auth/                   # Serviço de Autenticação
│   │   ├── server.js              # Servidor Express + Firebase
│   │   ├── config.js              # Configurações Firebase
│   │   └── package.json           # Dependências do serviço
│   ├── 📁 orders/                 # Serviço de Pedidos
│   │   ├── server.js              # Servidor Express + MySQL
│   │   ├── database.js            # Conexão e operações MySQL
│   │   ├── config.js              # Configurações MySQL
│   │   └── package.json           # Dependências do serviço
│   └── 📁 feedback/               # Serviço de Feedback
│       ├── server.js              # Servidor Express + MongoDB
│       ├── database.js            # Conexão e operações MongoDB
│       ├── config.js              # Configurações MongoDB
│       └── package.json           # Dependências do serviço
├── package.json                    # Scripts de desenvolvimento
├── start-dev.bat                  # Script Windows para iniciar todos os serviços
└── README.md                      # Este arquivo
```

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 16+** - [Download aqui](https://nodejs.org/)
- **MySQL 8.0+** - [Download aqui](https://dev.mysql.com/downloads/)
- **MongoDB 5.0+** - [Download aqui](https://www.mongodb.com/try/download/community)
- **Conta Firebase** - [Criar aqui](https://console.firebase.google.com/)

### 🔧 Passo a Passo da Configuração

#### 1. Configurar Bancos de Dados

##### MySQL (Serviço de Pedidos)
```sql
-- Conectar ao MySQL como root
mysql -u root -p

-- Criar banco de dados
CREATE DATABASE restaurant_orders;
USE restaurant_orders;

-- Criar tabela de pedidos
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,           -- ID do usuário do Firebase
    items JSON NOT NULL,                     -- Itens do pedido em formato JSON
    total DECIMAL(10,2) NOT NULL,            -- Valor total do pedido
    status ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Verificar se a tabela foi criada
DESCRIBE orders;
```

##### MongoDB (Serviço de Feedback)
```bash
# Abrir terminal MongoDB
mongosh

# Criar banco de dados
use restaurant_feedback

# Criar coleção (opcional, MongoDB cria automaticamente)
db.createCollection('feedback')

# Verificar se está funcionando
db.feedback.find().limit(1)
```

#### 2. Configurar Firebase

1. **Criar Projeto**:
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Clique em "Adicionar projeto"
   - Digite um nome (ex: "restaurant-microservices")

2. **Ativar Authentication**:
   - No menu lateral, clique em "Authentication"
   - Clique em "Get started"
   - Em "Sign-in method", ative "Email/Password"

3. **Obter Credenciais**:
   - No menu lateral, clique em "Project settings" (ícone de engrenagem)
   - Role para baixo até "Service accounts"
   - Clique em "Generate new private key"
   - Baixe o arquivo JSON

4. **Configurar Variáveis de Ambiente**:
   - Crie um arquivo `.env` na pasta `backend/auth/`
   - Adicione as credenciais do Firebase:

```env
# backend/auth/.env
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY_ID=sua-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@seu-projeto.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=seu-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

#### 3. Configurar Variáveis de Ambiente dos Bancos

##### MySQL (backend/orders/.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua-senha-mysql
DB_NAME=restaurant_orders
DB_PORT=3306
```

##### MongoDB (backend/feedback/.env)
```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=restaurant_feedback
MONGODB_COLLECTION=feedback
```

### 🚀 Executando o Projeto

#### Opção 1: Script Automático (Recomendado para Windows)
```bash
# Na pasta raiz do projeto
start-dev.bat
```

#### Opção 2: Comandos Manuais
```bash
# Terminal 1 - Frontend
cd frontend
npm install
npm start

# Terminal 2 - Serviço de Autenticação
cd backend/auth
npm install
npm start

# Terminal 3 - Serviço de Pedidos
cd backend/orders
npm install
npm start

# Terminal 4 - Serviço de Feedback
cd backend/feedback
npm install
npm start
```

#### Opção 3: Todos os Serviços de Uma Vez
```bash
# Na pasta raiz do projeto
npm install
npm run dev
```

## 🌐 Portas e Endpoints dos Serviços

| Serviço | Porta | URL | Status |
|----------|-------|-----|---------|
| **Frontend** | 3000 | http://localhost:3000 | 🟢 Interface do usuário |
| **Auth Service** | 3001 | http://localhost:3001 | 🔒 Autenticação |
| **Orders Service** | 3002 | http://localhost:3002 | 📋 Pedidos |
| **Feedback Service** | 3003 | http://localhost:3003 | ⭐ Avaliações |

### 📡 Endpoints Disponíveis

#### Auth Service (Porta 3001)
- `GET /health` - Status do serviço
- `POST /login` - Fazer login
- `POST /register` - Criar conta
- `GET /profile` - Perfil do usuário (requer token)

#### Orders Service (Porta 3002)
- `GET /health` - Status do serviço
- `GET /orders` - Listar pedidos
- `GET /orders/:id` - Obter pedido específico
- `POST /orders` - Criar novo pedido
- `PUT /orders/:id` - Atualizar pedido
- `DELETE /orders/:id` - Deletar pedido

#### Feedback Service (Porta 3003)
- `GET /health` - Status do serviço
- `GET /feedback` - Listar feedbacks
- `GET /feedback/:id` - Obter feedback específico
- `POST /feedback` - Criar novo feedback
- `DELETE /feedback/:id` - Deletar feedback
- `GET /feedback/stats` - Estatísticas dos feedbacks

## 📋 Funcionalidades Implementadas

### 🎨 Frontend (React)
- ✅ **Sistema de Autenticação**: Login/registro com Firebase
- ✅ **Tema Escuro/Claro**: Alternância automática
- ✅ **Cardápio Interativo**: Visualização de produtos
- ✅ **Carrinho de Compras**: Adicionar/remover itens
- ✅ **Sistema de Pedidos**: Criar e acompanhar pedidos
- ✅ **Sistema de Feedback**: Avaliar experiências
- ✅ **Design Responsivo**: Funciona em mobile e desktop

### 🔒 Backend - Microsserviços
- ✅ **Auth Service**: Autenticação com Firebase Admin SDK
- ✅ **Orders Service**: CRUD completo de pedidos com MySQL
- ✅ **Feedback Service**: Sistema de avaliações com MongoDB
- ✅ **Tratamento de Erros**: Respostas padronizadas e logging
- ✅ **Validação de Dados**: Verificação de entrada em todas as rotas
- ✅ **Health Checks**: Endpoints para monitoramento

## 🔧 Configuração Avançada

### Variáveis de Ambiente
Cada serviço possui seu próprio arquivo de configuração que lê variáveis de ambiente:

- **`backend/auth/config.js`** - Configurações Firebase
- **`backend/orders/config.js`** - Configurações MySQL
- **`backend/feedback/config.js`** - Configurações MongoDB

### Logs e Monitoramento
Todos os serviços incluem:
- ✅ Logs coloridos no console
- ✅ Timestamps em todas as operações
- ✅ Endpoints de health check
- ✅ Tratamento de erros centralizado

## 🚨 Tratamento de Falhas e Resiliência

### Princípio de Independência
O sistema foi projetado para que **cada microsserviço funcione independentemente**:

- 🔴 **Se o MySQL falhar**: Usuários ainda podem fazer login e enviar feedback
- 🔴 **Se o MongoDB falhar**: Usuários ainda podem fazer pedidos
- 🔴 **Se o Firebase falhar**: Os outros serviços continuam funcionando
- 🔴 **Se o frontend falhar**: Os serviços backend continuam operacionais

### Estratégias de Resiliência
1. **Circuit Breaker**: Verificação de conexão antes de cada operação
2. **Graceful Degradation**: Serviços continuam funcionando com funcionalidades limitadas
3. **Health Checks**: Monitoramento contínuo do status dos serviços
4. **Logging Detalhado**: Rastreamento de todas as operações e erros

## 📚 Conceitos de Microsserviços Demonstrados

### 1. **Separação de Responsabilidades**
- Cada serviço tem uma função específica e bem definida
- Autenticação, pedidos e feedback são completamente independentes

### 2. **Bancos de Dados Especializados**
- **MySQL**: Para dados estruturados (pedidos com relacionamentos)
- **MongoDB**: Para dados flexíveis (feedback com estrutura variável)
- **Firebase**: Para autenticação e gerenciamento de usuários

### 3. **Comunicação via APIs REST**
- Serviços se comunicam através de HTTP/JSON
- Cada serviço expõe endpoints específicos
- Frontend consome múltiplos serviços independentemente

### 4. **Deploy Independente**
- Cada serviço pode ser atualizado sem afetar os outros
- Diferentes equipes podem trabalhar em serviços diferentes
- Escalabilidade horizontal por serviço

## 🧪 Testando o Sistema

### 1. **Verificar Status dos Serviços**
```bash
# Testar se todos os serviços estão rodando
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

### 2. **Fluxo Completo de Usuário**
1. Acesse http://localhost:3000
2. Registre uma nova conta
3. Faça login
4. Adicione itens ao carrinho
5. Faça um pedido
6. Envie feedback sobre a experiência

### 3. **Testar Resiliência**
- Pare o serviço de pedidos e tente fazer login
- Pare o serviço de feedback e tente fazer um pedido
- Verifique se os outros serviços continuam funcionando

## 🐛 Solução de Problemas Comuns

### Erro de Conexão com MySQL
```bash
# Verificar se o MySQL está rodando
sudo systemctl status mysql

# Verificar se a porta 3306 está aberta
netstat -tlnp | grep 3306
```

### Erro de Conexão com MongoDB
```bash
# Verificar se o MongoDB está rodando
sudo systemctl status mongod

# Verificar se a porta 27017 está aberta
netstat -tlnp | grep 27017
```

### Erro de Configuração Firebase
- Verifique se o arquivo `.env` está na pasta correta
- Confirme se todas as variáveis estão preenchidas
- Verifique se o arquivo de credenciais está correto

### Porta Já em Uso
```bash
# Verificar qual processo está usando a porta
netstat -tlnp | grep 3001

# Matar o processo (substitua PID pelo número do processo)
kill -9 PID
```

## 📝 Notas Importantes para Estudantes

### 🎓 **Este é um Projeto Didático**
- Código simplificado para facilitar o aprendizado
- Não inclui todas as práticas de produção (como rate limiting, cache, etc.)
- Foco na demonstração de conceitos fundamentais

### 🔍 **O que Estudar**
1. **Estrutura de Microsserviços**: Como dividir uma aplicação
2. **Comunicação entre Serviços**: APIs REST e integração
3. **Bancos de Dados**: Quando usar cada tipo
4. **Tratamento de Erros**: Como lidar com falhas
5. **Configuração**: Variáveis de ambiente e configurações

### 🚀 **Próximos Passos**
- Implementar comunicação entre serviços (eventos)
- Adicionar cache (Redis)
- Implementar rate limiting
- Adicionar testes automatizados
- Configurar CI/CD
- Implementar monitoramento (Prometheus, Grafana)

## 🤝 Contribuindo

Este projeto é aberto para contribuições! Se você encontrar bugs ou quiser adicionar funcionalidades:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🙏 Agradecimentos

- **React.js** - Framework frontend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Firebase** - Autenticação e backend
- **MySQL** - Banco de dados relacional
- **MongoDB** - Banco de dados NoSQL
- **Tailwind CSS** - Framework CSS

---

**🎯 Boa sorte nos seus estudos de microsserviços!** 

Se você tiver dúvidas ou precisar de ajuda, sinta-se à vontade para abrir uma issue no repositório.
