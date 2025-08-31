@echo off
REM ========================================
REM   SISTEMA DE MICROSSERVIÇOS - RESTAURANTE
REM   SCRIPT DE INICIALIZAÇÃO AUTOMÁTICA
REM ========================================
REM
REM Este arquivo batch (.bat) automatiza o processo de inicialização
REM de todos os serviços do sistema de microsserviços do restaurante.
REM
REM FUNCIONAMENTO:
REM 1. Inicia cada serviço em uma janela separada do CMD
REM 2. Permite monitorar logs de cada serviço independentemente
REM 3. Facilita debugging e desenvolvimento
REM 4. Evita ter que abrir múltiplos terminais manualmente
REM
REM SERVIÇOS INICIADOS:
REM - Auth Service (Porta 3001): Autenticação com Firebase
REM - Orders Service (Porta 3002): Gerenciamento de pedidos (MySQL)
REM - Feedback Service (Porta 3003): Sistema de feedback (MongoDB)
REM - Frontend (Porta 3000): Interface React do usuário
REM
REM PRÉ-REQUISITOS:
REM - Node.js instalado e configurado
REM - Dependências instaladas (npm install executado)
REM - Bancos de dados configurados e rodando
REM - Firebase configurado para autenticação

echo ========================================
echo   Sistema de Microsservicos - Restaurante
echo ========================================
echo.
echo Iniciando todos os servicos...
echo.

REM ============================================================================
REM 🔐 INICIANDO SERVIÇO DE AUTENTICAÇÃO
REM ============================================================================
REM
REM Este serviço gerencia:
REM - Login e registro de usuários
REM - Verificação de tokens Firebase
REM - Middleware de autenticação
REM - Comunicação com Firebase Admin SDK
REM
REM CONFIGURAÇÃO:
REM - Porta: 3001
REM - Banco: Firebase (Cloud)
REM - Dependências: firebase-admin, express, cors

echo [1/4] Iniciando servico de autenticacao...
start "Auth Service" cmd /k "cd backend\auth && npm start"

REM ============================================================================
REM 📋 INICIANDO SERVIÇO DE PEDIDOS
REM ============================================================================
REM
REM Este serviço gerencia:
REM - CRUD completo de pedidos
REM - Consultas por usuário e status
REM - Validação de dados de entrada
REM - Comunicação com MySQL
REM
REM CONFIGURAÇÃO:
REM - Porta: 3002
REM - Banco: MySQL (Local)
REM - Dependências: mysql2, express, cors

echo [2/4] Iniciando servico de pedidos...
start "Orders Service" cmd /k "cd backend\orders && npm start"

REM ============================================================================
REM ⭐ INICIANDO SERVIÇO DE FEEDBACK
REM ============================================================================
REM
REM Este serviço gerencia:
REM - Sistema de avaliações (1-5 estrelas)
REM - Comentários opcionais
REM - Estatísticas agregadas
REM - Comunicação com MongoDB
REM
REM CONFIGURAÇÃO:
REM - Porta: 3003
REM - Banco: MongoDB (Local)
REM - Dependências: mongodb, express, cors

echo [3/4] Iniciando servico de feedback...
start "Feedback Service" cmd /k "cd backend\feedback && npm start"

REM ============================================================================
REM 🎨 INICIANDO FRONTEND REACT
REM ============================================================================
REM
REM Este serviço fornece:
REM - Interface do usuário
REM - Sistema de autenticação
REM - Gerenciamento de pedidos
REM - Sistema de feedback
REM
REM CONFIGURAÇÃO:
REM - Porta: 3000
REM - Framework: React + Tailwind CSS
REM - Dependências: react, react-router-dom, firebase

echo [4/4] Iniciando frontend...
start "Frontend" cmd /k "cd frontend && npm start"

REM ============================================================================
REM ✅ CONFIRMAÇÃO DE INICIALIZAÇÃO
REM ============================================================================
REM
REM Após executar este script:
REM - 4 janelas CMD serão abertas
REM - Cada serviço será iniciado automaticamente
REM - Logs de inicialização serão exibidos
REM - Serviços estarão disponíveis nas portas especificadas

echo.
echo Todos os servicos foram iniciados!
echo.

REM ============================================================================
REM 🌐 INFORMAÇÕES DE ACESSO
REM ============================================================================
REM
REM URLs dos serviços para acesso e teste:
REM - Frontend: Interface principal do usuário
REM - Auth Service: Endpoints de autenticação
REM - Orders Service: Endpoints de pedidos
REM - Feedback Service: Endpoints de feedback

echo Portas dos servicos:
echo - Frontend: http://localhost:3000
echo - Auth Service: http://localhost:3001
echo - Orders Service: http://localhost:3002
echo - Feedback Service: http://localhost:3003
echo.

REM ============================================================================
REM 🔍 VERIFICAÇÃO DE FUNCIONAMENTO
REM ============================================================================
REM
REM Para verificar se todos os serviços estão funcionando:
REM 1. Acesse http://localhost:3000 (frontend)
REM 2. Teste endpoints de health check:
REM    - http://localhost:3001/health
REM    - http://localhost:3002/health
REM    - http://localhost:3003/health
REM 3. Verifique logs em cada janela CMD
REM 4. Teste funcionalidades básicas

echo Para verificar se esta funcionando:
echo 1. Acesse http://localhost:3000
echo 2. Teste os endpoints de health check
echo 3. Verifique os logs em cada janela
echo.

REM ============================================================================
REM 🚨 SOLUÇÃO DE PROBLEMAS
REM ============================================================================
REM
REM Problemas comuns e soluções:
REM - Porta já em uso: Verifique se outro processo está usando a porta
REM - Erro de dependências: Execute npm install em cada pasta
REM - Erro de banco: Verifique se MySQL/MongoDB estão rodando
REM - Erro Firebase: Verifique configuração no .env

echo Se houver problemas:
echo - Verifique se as dependencias estao instaladas
echo - Confirme se os bancos de dados estao rodando
echo - Verifique as configuracoes nos arquivos .env
echo.

REM ============================================================================
REM ⏸️ PAUSA PARA LEITURA
REM ============================================================================
REM
REM Pausa para permitir leitura das informações
REM Pressione qualquer tecla para fechar esta janela
REM Os serviços continuarão rodando nas outras janelas

echo Pressione qualquer tecla para sair...
pause > nul

REM ============================================================================
REM 📚 RESUMO DO SCRIPT
REM ============================================================================
REM
REM Este script automatiza:
REM 1. Inicialização de todos os microsserviços
REM 2. Abertura de janelas separadas para cada serviço
REM 3. Facilita desenvolvimento e debugging
REM 4. Reduz tempo de setup do ambiente
REM
REM ARQUITETURA INICIADA:
REM - Frontend React (Porta 3000)
REM - Auth Service Firebase (Porta 3001)
REM - Orders Service MySQL (Porta 3002)
REM - Feedback Service MongoDB (Porta 3003)
REM
REM BENEFÍCIOS PARA DESENVOLVIMENTO:
REM - Setup rápido do ambiente
REM - Visualização independente dos logs
REM - Fácil identificação de problemas
REM - Desenvolvimento paralelo dos serviços
REM
REM NOTAS IMPORTANTES:
REM - Cada serviço roda independentemente
REM - Falha em um serviço não afeta os outros
REM - Logs são exibidos em tempo real
REM - Fácil parada individual de serviços
