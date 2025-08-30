import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersService } from '../services/api';

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user ID from current user (try multiple possible fields)
      const userId = currentUser?.uid || currentUser?.email || currentUser?.id;
      
      if (!userId) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      console.log('Current user object:', currentUser);
      console.log('Using user ID:', userId);
      console.log('Fetching orders for user:', userId);

      const response = await ordersService.getOrders({ user_id: userId });
      
      console.log('API response:', response);
      
      if (response.data.success) {
        console.log('Orders received:', response.data.orders);
        setOrders(response.data.orders);
      } else {
        setError('Erro ao carregar pedidos');
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 503) {
        setError('Serviço de pedidos indisponível. Tente novamente mais tarde.');
      } else if (error.response?.status === 404) {
        setError('Nenhum pedido encontrado para este usuário.');
      } else if (error.response?.data?.message) {
        setError(`Erro: ${error.response.data.message}`);
      } else {
        setError('Erro ao carregar pedidos. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatItems = (items) => {
    if (!items) return ['Itens não disponíveis'];
    
    try {
      let parsedItems;
      
      // If items is a JSON string, parse it
      if (typeof items === 'string') {
        parsedItems = JSON.parse(items);
      } else {
        parsedItems = items;
      }
      
      // If items is an array, extract the names
      if (Array.isArray(parsedItems)) {
        return parsedItems.map(item => {
          // Handle both object format and simple string format
          if (typeof item === 'object' && item.name) {
            return `${item.name} (${item.quantity || 1}x)`;
          } else if (typeof item === 'string') {
            return item;
          } else {
            return 'Item desconhecido';
          }
        });
      }
      
      // If it's a single item
      if (typeof parsedItems === 'object' && parsedItems.name) {
        return [`${parsedItems.name} (${parsedItems.quantity || 1}x)`];
      }
      
      return ['Item desconhecido'];
    } catch (error) {
      console.error('Erro ao formatar itens:', error);
      return ['Erro ao carregar itens'];
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'entregue':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400 border-success-200 dark:border-success-800';
      case 'preparing':
      case 'em preparo':
        return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400 border-warning-200 dark:border-warning-800';
      case 'pending':
      case 'pendente':
        return 'bg-accent-100 dark:bg-accent-900/20 text-accent-800 dark:text-accent-400 border-accent-200 dark:border-accent-800';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'entregue':
        return 'Entregue';
      case 'preparing':
      case 'em preparo':
        return 'Em preparo';
      case 'pending':
      case 'pendente':
        return 'Pendente';
      case 'cancelled':
      case 'cancelado':
        return 'Cancelado';
      default:
        return status || 'Status desconhecido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce-slow">🍔</div>
          <div className="text-xl text-gray-600 dark:text-gray-400">Carregando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-display">
              Meus Pedidos
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Acompanhe o status dos seus pedidos em tempo real
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Atualizar</span>
          </button>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl animate-fade-in">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-6 animate-bounce-slow">🍽️</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 font-display">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Faça seu primeiro pedido no cardápio e acompanhe o status aqui!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div 
                key={order.id} 
                className="bg-white dark:bg-gray-800 shadow-soft border border-gray-200 dark:border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-display">
                      Pedido #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(order.created_at || order.createdAt)}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Itens do pedido:
                  </h4>
                  <ul className="space-y-2">
                    {formatItems(order.items).map((itemText, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        {itemText}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    Total: R$ {parseFloat(order.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
