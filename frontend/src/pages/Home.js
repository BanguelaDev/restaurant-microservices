import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersService } from '../services/api';
import Menu from '../components/Menu';
import Cart from '../components/Cart';

const Home = () => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const orderData = {
        user_id: currentUser.uid,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };

      const response = await ordersService.createOrder(orderData);
      
      if (response.data.success) {
        alert('Pedido realizado com sucesso!');
        setCartItems([]);
        setShowCart(false);
      } else {
        alert('Erro ao realizar pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao realizar pedido. Verifique se o serviço de pedidos está funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botão do carrinho */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">🍔 Restaurante</h1>
            
            {/* Botão do carrinho */}
            <button
              onClick={toggleCart}
              className="relative bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              🛒 Carrinho
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cardápio */}
          <div className="lg:col-span-2">
            <Menu onAddToCart={addToCart} />
          </div>

          {/* Carrinho */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {showCart ? (
                <Cart
                  cartItems={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  onCheckout={handleCheckout}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Seu carrinho
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Adicione itens do cardápio para começar
                  </p>
                  <button
                    onClick={toggleCart}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Carrinho</h2>
                <button
                  onClick={toggleCart}
                  className="text-gray-500 hover:text-gray-700"
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
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
