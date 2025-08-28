import React from 'react';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Seu carrinho está vazio
          </h3>
          <p className="text-gray-600">
            Adicione alguns itens deliciosos do nosso cardápio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          🛒 Carrinho ({getTotalItems()} itens)
        </h2>
      </div>

      {/* Lista de Itens */}
      <div className="p-6">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {/* Imagem */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                  {item.image}
                </div>
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">
                  R$ {item.price.toFixed(2)}
                </p>
              </div>

              {/* Controles de Quantidade */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="w-12 text-center text-sm font-medium text-gray-900">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Preço Total do Item */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Botão Remover */}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-600 hover:text-red-800 p-1"
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
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <span>Total ({getTotalItems()} itens)</span>
            <span>R$ {calculateTotal().toFixed(2)}</span>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
