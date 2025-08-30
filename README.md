# Sistema de Microsserviços - Restaurante

Sistema completo de pedidos de restaurante implementado com microsserviços independentes.

## 🏗️ Arquitetura

- **Frontend**: React.js + Tailwind CSS
- **Backend**: 3 microsserviços independentes em Node.js + Express
- **Bancos de dados**: MySQL (pedidos), MongoDB (feedback), Firebase (autenticação)

## 📁 Estrutura do Projeto

```
restaurant-microservices/
├── frontend/           # Aplicação React
├── backend/
│   ├── auth/          # Serviço de autenticação
│   ├── orders/        # Serviço de pedidos
│   └── feedback/      # Serviço de feedback
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- MySQL 8.0+
- MongoDB 5.0+
- Conta Firebase (para autenticação)

### 1. Configurar Bancos de Dados

#### MySQL (Serviço de Pedidos)
```sql
CREATE DATABASE restaurant_orders;
USE restaurant_orders;

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    items JSON NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### MongoDB (Serviço de Feedback)
```bash
# Criar banco e coleção
mongosh
use restaurant_feedback
db.createCollection('feedback')
```

### 2. Configurar Firebase
- Criar projeto no [Firebase Console](https://console.firebase.google.com/)
- Ativar Authentication
- Obter configurações do projeto

### 3. Instalar Dependências e Executar

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Serviço de Autenticação
```bash
cd backend/auth
npm install
npm start
```

#### Serviço de Pedidos
```bash
cd backend/orders
npm install
npm start
```

#### Serviço de Feedback
```bash
cd backend/feedback
npm install
npm start
```

## 🌐 Portas dos Serviços

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Orders Service**: http://localhost:3002
- **Feedback Service**: http://localhost:3003

## 📋 Funcionalidades

### Frontend
- ✅ Login/Registro de usuário
- ✅ Visualização do cardápio
- ✅ Fazer pedidos
- ✅ Acompanhar entregas
- ✅ Enviar feedback

### Backend
- ✅ Autenticação com Firebase
- ✅ CRUD de pedidos
- ✅ Sistema de feedback
- ✅ Tratamento de falhas independentes

## 🔧 Configuração

Cada serviço possui seu próprio arquivo de configuração:
- `backend/auth/config.js` - Configurações Firebase
- `backend/orders/config.js` - Configurações MySQL
- `backend/feedback/config.js` - Configurações MongoDB

## 🚨 Tratamento de Falhas

O sistema foi projetado para que cada microsserviço funcione independentemente:
- Se o banco de pedidos falhar, usuários ainda podem fazer login e enviar feedback
- Se o banco de feedback falhar, usuários ainda podem fazer pedidos
- Se a autenticação falhar, os outros serviços continuam funcionando

## 📝 Notas

- Este é um projeto didático para demonstrar conceitos de microsserviços
- Todos os bancos são locais para simplicidade
- O código é simples e direto, sem complexidades desnecessárias
