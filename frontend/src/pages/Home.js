import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersService } from '../services/api';
import Menu from '../components/Menu';
import Cart from '../components/Cart';

const Home = () => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    // Mostrar carrinho automaticamente
    setShowCart(true);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      alert('Você precisa estar logado para fazer um pedido');
      return;
    }

    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user ID from current user (try multiple possible fields)
      const userId = currentUser.uid || currentUser.email || currentUser.id;
      
      if (!userId) {
        alert('Erro: Não foi possível identificar o usuário');
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        user_id: userId,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };

      console.log('Creating order with data:', orderData);

      const response = await ordersService.createOrder(orderData);
      
      if (response.data.success) {
        alert('Pedido realizado com sucesso!');
        setCartItems([]);
        setShowCart(false);
        
        // Optionally redirect to orders page or refresh
        // window.location.href = '/orders';
      } else {
        alert('Erro ao realizar pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      
      if (error.response?.status === 503) {
        alert('Serviço de pedidos indisponível. Tente novamente mais tarde.');
      } else if (error.response?.data?.message) {
        alert(`Erro: ${error.response.data.message}`);
      } else {
        alert('Erro ao realizar pedido. Verifique se o serviço de pedidos está funcionando.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header com botão do carrinho */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="text-4xl animate-bounce-slow">🍔</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
                  Restaurante
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Sabor e qualidade em cada prato
                </p>
              </div>
            </div>
            
            {/* Botão do carrinho */}
            <button
              onClick={toggleCart}
              className="relative bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span className="text-lg">🛒</span>
              <span>Carrinho</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cardápio */}
          <div className="xl:col-span-2">
            <div className="animate-fade-in">
              <Menu onAddToCart={addToCart} />
            </div>
          </div>

          {/* Carrinho */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              {showCart ? (
                <div className="animate-slide-up">
                  <Cart
                    cartItems={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    onCheckout={handleCheckout}
                    isLoading={isSubmitting}
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 p-8 text-center transition-all duration-300 hover:shadow-lg">
                  <div className="text-6xl mb-6 animate-pulse-slow">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 font-display">
                    Seu carrinho
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    Adicione itens deliciosos do nosso cardápio para começar sua experiência gastronômica
                  </p>
                  <button
                    onClick={toggleCart}
                    className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                  >
                    Ver carrinho
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para mobile */}
      {showCart && (
        <div className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in">
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-2xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Carrinho</h2>
                <button
                  onClick={toggleCart}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
