# 🚀 Guia de Instalação - Sistema de Microsserviços

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 16+** - [Download aqui](https://nodejs.org/)
- **MySQL 8.0+** - [Download aqui](https://dev.mysql.com/downloads/)
- **MongoDB 5.0+** - [Download aqui](https://www.mongodb.com/try/download/community)
- **Conta Firebase** - [Criar aqui](https://console.firebase.google.com/)

## 🔧 Passo a Passo da Instalação

### 1. Configurar Bancos de Dados

#### MySQL (Serviço de Pedidos)
```bash
# Conectar ao MySQL
mysql -u root -p

# Executar o script de configuração
source backend/orders/setup.sql
```

#### MongoDB (Serviço de Feedback)
```bash
# Conectar ao MongoDB
mongosh

# Executar o script de configuração
load("backend/feedback/setup.js")
```

### 2. Configurar Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative a autenticação por email/senha
4. Vá em "Configurações do Projeto" > "Contas de serviço"
5. Clique em "Gerar nova chave privada"
6. Baixe o arquivo JSON

### 3. Configurar Variáveis de Ambiente

#### Serviço de Autenticação
```bash
cd backend/auth
cp env.example .env
# Edite o arquivo .env com suas configurações do Firebase
```

#### Serviço de Pedidos
```bash
cd backend/orders
cp env.example .env
# Edite o arquivo .env com suas configurações do MySQL
```

#### Serviço de Feedback
```bash
cd backend/feedback
cp env.example .env
# Edite o arquivo .env com suas configurações do MongoDB
```

#### Frontend
```bash
cd frontend
cp env.example .env
# Edite o arquivo .env com suas configurações do Firebase
```

### 4. Instalar Dependências

#### Backend - Serviço de Autenticação
```bash
cd backend/auth
npm install
```

#### Backend - Serviço de Pedidos
```bash
cd backend/orders
npm install
```

#### Backend - Serviço de Feedback
```bash
cd backend/feedback
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## 🚀 Como Executar

### Opção 1: Scripts Automáticos

#### Windows
```bash
# Execute o arquivo batch
start-dev.bat
```

#### Linux/Mac
```bash
# Torne o script executável
chmod +x start-dev.sh

# Execute o script
./start-dev.sh
```

### Opção 2: Manual

#### 1. Serviço de Autenticação
```bash
cd backend/auth
npm start
```

#### 2. Serviço de Pedidos
```bash
cd backend/orders
npm start
```

#### 3. Serviço de Feedback
```bash
cd backend/feedback
npm start
```

#### 4. Frontend
```bash
cd frontend
npm start
```

## 🌐 URLs dos Serviços

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Orders Service**: http://localhost:3002
- **Feedback Service**: http://localhost:3003

## ✅ Verificar Funcionamento

### 1. Verificar Saúde dos Serviços
```bash
# Auth Service
curl http://localhost:3001/health

# Orders Service
curl http://localhost:3002/health

# Feedback Service
curl http://localhost:3003/health
```

### 2. Testar Frontend
1. Acesse http://localhost:3000
2. Crie uma conta ou faça login
3. Navegue pelo cardápio
4. Adicione itens ao carrinho
5. Faça um pedido

## 🐛 Solução de Problemas

### Erro de Conexão com MySQL
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `mysql -u root -p`

### Erro de Conexão com MongoDB
- Verifique se o MongoDB está rodando
- Confirme a URL no arquivo `.env`
- Teste a conexão: `mongosh`

### Erro de Firebase
- Verifique as configurações no arquivo `.env`
- Confirme se a autenticação está ativada no Firebase Console
- Verifique se as chaves estão corretas

### Erro de Porta em Uso
- Verifique se não há outros serviços usando as portas
- Use `netstat -an | findstr :3001` (Windows) ou `lsof -i :3001` (Linux/Mac)

## 📁 Estrutura do Projeto

```
restaurant-microservices/
├── README.md                 # Documentação principal
├── INSTALACAO.md            # Este guia
├── start-dev.bat            # Script Windows
├── start-dev.sh             # Script Linux/Mac
├── backend/
│   ├── auth/                # Serviço de autenticação
│   ├── orders/              # Serviço de pedidos
│   └── feedback/            # Serviço de feedback
└── frontend/                # Aplicação React
```

## 🔒 Segurança

- **NUNCA** commite arquivos `.env` no Git
- Mantenha suas chaves do Firebase seguras
- Use senhas fortes para os bancos de dados
- Em produção, configure HTTPS e autenticação adequada

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs dos serviços
2. Confirme se todos os pré-requisitos estão instalados
3. Verifique as configurações dos bancos de dados
4. Teste a conectividade de cada serviço individualmente

## 🎯 Próximos Passos

Após a instalação bem-sucedida:

1. Explore a interface do usuário
2. Teste todas as funcionalidades
3. Personalize o cardápio
4. Configure notificações
5. Implemente testes automatizados
6. Prepare para produção
