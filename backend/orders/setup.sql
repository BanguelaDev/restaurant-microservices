-- Script de configuração do banco de dados para o serviço de pedidos
-- Execute este script no seu MySQL para criar o banco e as tabelas

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS restaurant_orders;
USE restaurant_orders;

-- Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    items JSON NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para melhor performance
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Inserir dados de exemplo (opcional)
INSERT INTO orders (user_id, items, total, status) VALUES
('user123', '[{"id": 1, "name": "X-Burger Clássico", "price": 18.90, "quantity": 2}]', 37.80, 'pending'),
('user456', '[{"id": 2, "name": "X-Burger Bacon", "price": 22.90, "quantity": 1}, {"id": 4, "name": "Batata Frita", "price": 12.90, "quantity": 1}]', 35.80, 'delivered'),
('user789', '[{"id": 3, "name": "X-Burger Vegetariano", "price": 20.90, "quantity": 1}, {"id": 7, "name": "Refrigerante", "price": 6.90, "quantity": 2}]', 34.70, 'ready');

-- Verificar estrutura da tabela
DESCRIBE orders;

-- Verificar dados inseridos
SELECT * FROM orders;
