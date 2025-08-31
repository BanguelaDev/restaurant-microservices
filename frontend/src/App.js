/**
 * 🍔 APLICAÇÃO PRINCIPAL - RESTAURANTE MICROSSERVIÇOS
 * 
 * Este arquivo é o ponto de entrada principal da aplicação React que:
 * - Configura o roteamento da aplicação
 * - Gerencia autenticação e temas
 * - Define rotas protegidas e públicas
 * - Organiza a estrutura geral da aplicação
 * 
 * TECNOLOGIAS UTILIZADAS:
 * - React: Biblioteca para interfaces de usuário
 * - React Router: Roteamento e navegação entre páginas
 * - Context API: Gerenciamento de estado global (auth, tema)
 * - Tailwind CSS: Estilização e design responsivo
 * 
 * ARQUITETURA:
 * - Componente funcional com hooks
 * - Roteamento baseado em componentes
 * - Contextos para estado global
 * - Middleware de autenticação para rotas protegidas
 * - Design responsivo com tema escuro/claro
 * 
 * ESTRUTURA DE ROTAS:
 * - / (Home): Página pública com cardápio
 * - /login: Página de login
 * - /register: Página de registro
 * - /orders: Página de pedidos (protegida)
 * - /feedback: Página de feedback (protegida)
 */

// Importar dependências do React e roteamento
import React from 'react';                                                    // Biblioteca principal do React
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Sistema de roteamento

// Importar contextos para gerenciamento de estado global
import { AuthProvider, useAuth } from './contexts/AuthContext';               // Contexto de autenticação
import { ThemeProvider } from './contexts/ThemeContext';                      // Contexto de tema (claro/escuro)

// Importar componentes de navegação e layout
import Navbar from './components/Navbar';                                     // Barra de navegação superior

// Importar páginas da aplicação
import Home from './pages/Home';                                              // Página inicial com cardápio
import Login from './pages/Login';                                            // Página de login
import Register from './pages/Register';                                      // Página de registro
import Orders from './pages/Orders';                                          // Página de pedidos
import Feedback from './pages/Feedback';                                      // Página de feedback

// ============================================================================
// 🔐 COMPONENTE DE ROTAS PROTEGIDAS
// ============================================================================

/**
 * Componente que protege rotas que requerem autenticação
 * 
 * FUNCIONAMENTO:
 * 1. Usa o contexto de autenticação para verificar se o usuário está logado
 * 2. Mostra tela de carregamento enquanto verifica autenticação
 * 3. Redireciona para login se não estiver autenticado
 * 4. Renderiza o conteúdo protegido se estiver autenticado
 * 
 * PROPS:
 * - children: Componente filho a ser renderizado se autenticado
 * 
 * ESTADOS:
 * - loading: true enquanto verifica autenticação
 * - currentUser: usuário atual ou null se não autenticado
 * 
 * COMPORTAMENTO:
 * - Se loading: mostra tela de carregamento com emoji animado
 * - Se não autenticado: redireciona para /login
 * - Se autenticado: renderiza o componente filho
 * 
 * USO:
 * - Envolver componentes que precisam de autenticação
 * - Exemplo: <ProtectedRoute><Orders /></ProtectedRoute>
 * 
 * DESIGN:
 * - Tela de carregamento com emoji de hambúrguer animado
 * - Cores adaptáveis ao tema (claro/escuro)
 * - Layout centralizado e responsivo
 */
const ProtectedRoute = ({ children }) => {
  // Usar contexto de autenticação para obter estado do usuário
  const { currentUser, loading } = useAuth();
  
  // Se ainda está carregando, mostrar tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          {/* Emoji de hambúrguer animado durante carregamento */}
          <div className="text-4xl mb-4 animate-bounce">🍔</div>
          
          {/* Texto de carregamento com cores adaptáveis ao tema */}
          <div className="text-xl text-gray-600 dark:text-gray-300">Carregando...</div>
        </div>
      </div>
    );
  }
  
  // Se não está autenticado, redirecionar para login
  // Se está autenticado, renderizar o componente filho
  return currentUser ? children : <Navigate to="/login" />;
};

// ============================================================================
// 🎨 COMPONENTE PRINCIPAL DA APLICAÇÃO
// ============================================================================

/**
 * Componente que contém toda a estrutura da aplicação
 * 
 * FUNCIONAMENTO:
 * 1. Configura o roteador da aplicação
 * 2. Define todas as rotas disponíveis
 * 3. Aplica tema e autenticação globalmente
 * 4. Renderiza navbar e conteúdo principal
 * 
 * ESTRUTURA:
 * - Router: Configuração de roteamento
 * - Navbar: Barra de navegação sempre visível
 * - Routes: Definição de todas as rotas
 * - Main: Área principal de conteúdo
 * 
 * ROTAS DEFINIDAS:
 * - /: Página inicial (pública)
 * - /login: Login (pública)
 * - /register: Registro (pública)
 * - /orders: Pedidos (protegida)
 * - /feedback: Feedback (protegida)
 * - *: Redireciona para home (404)
 * 
 * DESIGN:
 * - Layout responsivo com altura mínima de tela
 * - Cores adaptáveis ao tema (claro/escuro)
 * - Transições suaves entre temas
 * - Navbar sempre visível no topo
 */
const AppContent = () => {
  return (
    <Router>
      {/* Container principal com altura mínima de tela e tema adaptável */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        
        {/* Barra de navegação sempre visível */}
        <Navbar />
        
        {/* Área principal de conteúdo */}
        <main>
          {/* Sistema de roteamento da aplicação */}
          <Routes>
            {/* Rota pública - Página inicial com cardápio */}
            <Route path="/" element={<Home />} />
            
            {/* Rota pública - Página de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rota pública - Página de registro */}
            <Route path="/register" element={<Register />} />
            
            {/* Rota protegida - Página de pedidos (requer login) */}
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            
            {/* Rota protegida - Página de feedback (requer login) */}
            <Route path="/feedback" element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } />
            
            {/* Rota catch-all: redireciona para home se rota não existir */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// ============================================================================
// 🚀 COMPONENTE APP PRINCIPAL COM PROVIDERS
// ============================================================================

/**
 * Componente raiz da aplicação que configura todos os providers
 * 
 * FUNCIONAMENTO:
 * 1. Configura o provider de tema (claro/escuro)
 * 2. Configura o provider de autenticação
 * 3. Renderiza o conteúdo principal da aplicação
 * 
 * HIERARQUIA DE PROVIDERS:
 * - ThemeProvider: Gerencia tema (claro/escuro)
 *   - AuthProvider: Gerencia autenticação (login/logout)
 *     - AppContent: Conteúdo principal da aplicação
 * 
 * BENEFÍCIOS:
 * - Estado global acessível em toda a aplicação
 * - Gerenciamento centralizado de tema e autenticação
 * - Separação clara de responsabilidades
 * - Fácil manutenção e debugging
 * 
 * CONTEXTOS DISPONÍVEIS:
 * - ThemeContext: useTheme() para alternar tema
 * - AuthContext: useAuth() para autenticação
 * 
 * USO DOS CONTEXTOS:
 * - useTheme(): Para alternar entre tema claro/escuro
 * - useAuth(): Para verificar login, fazer logout, etc.
 * - currentUser: Para verificar se usuário está logado
 * - loading: Para mostrar estados de carregamento
 */
const App = () => {
  return (
    // Provider de tema (claro/escuro) - envolve toda a aplicação
    <ThemeProvider>
      {/* Provider de autenticação - gerencia login/logout */}
      <AuthProvider>
        {/* Conteúdo principal da aplicação */}
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

// Exportar o componente App como padrão
export default App;

/**
 * 📚 RESUMO DA APLICAÇÃO:
 * 
 * Esta aplicação React demonstra:
 * 
 * 1. **ROTEAMENTO AVANÇADO**: Rotas públicas e protegidas
 * 2. **AUTENTICAÇÃO**: Sistema de login/logout com Firebase
 * 3. **TEMA DINÂMICO**: Alternância entre tema claro/escuro
 * 4. **ESTRUTURA MODULAR**: Componentes organizados por responsabilidade
 * 5. **DESIGN RESPONSIVO**: Interface adaptável a diferentes dispositivos
 * 6. **ESTADO GLOBAL**: Contextos para tema e autenticação
 * 
 * CONCEITOS DE REACT APLICADOS:
 * - Functional Components com Hooks
 * - Context API para estado global
 * - React Router para navegação
 * - Component composition
 * - Conditional rendering
 * - Protected routes
 * 
 * ARQUITETURA DE ROTAS:
 * - Rotas públicas: Home, Login, Register
 * - Rotas protegidas: Orders, Feedback
 * - Middleware de autenticação
 * - Redirecionamento automático
 * - Tratamento de rotas inexistentes
 * 
 * ESTRUTURA DE COMPONENTES:
 * - App: Configuração de providers
 * - AppContent: Roteamento e layout
 * - ProtectedRoute: Middleware de autenticação
 * - Navbar: Navegação global
 * - Páginas: Home, Login, Register, Orders, Feedback
 * 
 * FLUXO DE AUTENTICAÇÃO:
 * 1. Usuário acessa rota protegida
 * 2. ProtectedRoute verifica autenticação
 * 3. Se não autenticado: redireciona para /login
 * 4. Se autenticado: renderiza componente protegido
 * 5. Navbar mostra estado de autenticação
 * 
 * SISTEMA DE TEMAS:
 * - Tema claro: fundo cinza claro, texto escuro
 * - Tema escuro: fundo cinza escuro, texto claro
 * - Transições suaves entre temas
 * - Persistência da preferência do usuário
 * - Aplicação global em toda a interface
 */
