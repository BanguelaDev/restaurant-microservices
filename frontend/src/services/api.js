import axios from 'axios';

// Configurações base das APIs
const AUTH_API = 'http://localhost:3001';
const ORDERS_API = 'http://localhost:3002';
const FEEDBACK_API = 'http://localhost:3003';

// Instâncias do Axios para cada serviço
const authApi = axios.create({ baseURL: AUTH_API });
const ordersApi = axios.create({ baseURL: ORDERS_API });
const feedbackApi = axios.create({ baseURL: FEEDBACK_API });

// Interceptor para adicionar token de autenticação
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ordersApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

feedbackApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviço de Autenticação
export const authService = {
  // Verificar saúde do serviço
  health: () => authApi.get('/health'),
  
  // Login
  login: (idToken) => authApi.post('/login', { idToken }),
  
  // Registro
  register: (userData) => authApi.post('/register', userData),
  
  // Perfil do usuário
  getProfile: () => authApi.get('/profile')
};

// Serviço de Pedidos
export const ordersService = {
  // Verificar saúde do serviço
  health: () => ordersApi.get('/health'),
  
  // Listar pedidos
  getOrders: (params = {}) => ordersApi.get('/orders', { params }),
  
  // Obter pedido específico
  getOrder: (id) => ordersApi.get(`/orders/${id}`),
  
  // Criar pedido
  createOrder: (orderData) => ordersApi.post('/orders', orderData),
  
  // Atualizar pedido
  updateOrder: (id, updateData) => ordersApi.put(`/orders/${id}`, updateData),
  
  // Deletar pedido
  deleteOrder: (id) => ordersApi.delete(`/orders/${id}`)
};

// Serviço de Feedback
export const feedbackService = {
  // Verificar saúde do serviço
  health: () => feedbackApi.get('/health'),
  
  // Listar feedbacks
  getFeedbacks: (params = {}) => feedbackApi.get('/feedback', { params }),
  
  // Obter feedback específico
  getFeedback: (id) => feedbackApi.get(`/feedback/${id}`),
  
  // Criar feedback
  createFeedback: (feedbackData) => feedbackApi.post('/feedback', feedbackData),
  
  // Deletar feedback
  deleteFeedback: (id) => feedbackApi.delete(`/feedback/${id}`),
  
  // Estatísticas
  getStats: () => feedbackApi.get('/feedback/stats')
};

// Função para verificar status de todos os serviços
export const checkAllServices = async () => {
  try {
    const [authHealth, ordersHealth, feedbackHealth] = await Promise.allSettled([
      authService.health(),
      ordersService.health(),
      feedbackService.health()
    ]);

    return {
      auth: authHealth.status === 'fulfilled' ? authHealth.value.data : { status: 'ERROR' },
      orders: ordersHealth.status === 'fulfilled' ? ordersHealth.value.data : { status: 'ERROR' },
      feedback: feedbackHealth.status === 'fulfilled' ? feedbackHealth.value.data : { status: 'ERROR' }
    };
  } catch (error) {
    console.error('Erro ao verificar serviços:', error);
    return {
      auth: { status: 'ERROR' },
      orders: { status: 'ERROR' },
      feedback: { status: 'ERROR' }
    };
  }
};

const apiServices = {
  authService,
  ordersService,
  feedbackService,
  checkAllServices
};

export default apiServices;