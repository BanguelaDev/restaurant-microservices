@echo off
echo ========================================
echo   Sistema de Microsservicos - Restaurante
echo ========================================
echo.
echo Iniciando todos os servicos...
echo.

echo [1/4] Iniciando servico de autenticacao...
start "Auth Service" cmd /k "cd backend\auth && npm start"

echo [2/4] Iniciando servico de pedidos...
start "Orders Service" cmd /k "cd backend\orders && npm start"

echo [3/4] Iniciando servico de feedback...
start "Orders Service" cmd /k "cd backend\feedback && npm start"

echo [4/4] Iniciando frontend...
start "Frontend" cmd /k "cd frontend && npm start"

echo.
echo Todos os servicos foram iniciados!
echo.
echo Portas dos servicos:
echo - Frontend: http://localhost:3000
echo - Auth Service: http://localhost:3001
echo - Orders Service: http://localhost:3002
echo - Feedback Service: http://localhost:3003
echo.
echo Pressione qualquer tecla para sair...
pause > nul
