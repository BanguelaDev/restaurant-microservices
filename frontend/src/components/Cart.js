import React from 'react';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout, isLoading = false }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center py-8">
          <div className="text-6xl mb-6 animate-bounce-slow">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-display">
            Seu carrinho está vazio
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Adicione alguns itens deliciosos do nosso cardápio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white font-display">
          🛒 Carrinho ({getTotalItems()} itens)
        </h2>
      </div>

      {/* Lista de Itens */}
      <div className="p-6">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200">
              {/* Imagem */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                  {item.image}
                </div>
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate font-display">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  R$ {item.price.toFixed(2)}
                </p>
              </div>

              {/* Controles de Quantidade */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || isLoading}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="w-12 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Preço Total do Item */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Botão Remover */}
              <button
                onClick={() => onRemoveItem(item.id)}
                disabled={isLoading}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title="Remover item"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white mb-6">
            <span>Total ({getTotalItems()} itens)</span>
            <span className="text-primary-600 dark:text-primary-400">R$ {calculateTotal().toFixed(2)}</span>
          </div>
          
          <button
            onClick={onCheckout}
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-4 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5 font-display text-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processando...</span>
              </div>
            ) : (
              'Finalizar Pedido'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
