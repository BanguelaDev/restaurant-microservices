#!/bin/bash

echo "========================================"
echo "  Sistema de Microsserviços - Restaurante"
echo "========================================"
echo ""
echo "Iniciando todos os serviços..."
echo ""

# Função para iniciar um serviço em background
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo "[$service_name] Iniciando na porta $port..."
    cd "$service_path" && npm start &
    sleep 2
}

# Iniciar serviços
start_service "Auth Service" "backend/auth" "3001"
start_service "Orders Service" "backend/orders" "3002"
start_service "Feedback Service" "backend/feedback" "3003"
start_service "Frontend" "frontend" "3000"

echo ""
echo "Todos os serviços foram iniciados!"
echo ""
echo "Portas dos serviços:"
echo "- Frontend: http://localhost:3000"
echo "- Auth Service: http://localhost:3001"
echo "- Orders Service: http://localhost:3002"
echo "- Feedback Service: http://localhost:3003"
echo ""
echo "Para parar todos os serviços, pressione Ctrl+C"
echo ""

# Aguardar interrupção
trap 'echo ""; echo "Parando todos os serviços..."; pkill -f "npm start"; exit' INT
wait
