import React, { useState } from 'react';
import { menuItems, categories, getItemsByCategory } from '../data/menu';

const Menu = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('burgers');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar itens baseado na categoria e busca
  const filteredItems = selectedCategory === 'all' 
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : getItemsByCategory(selectedCategory).filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🍔 Nosso Cardápio</h1>
        <p className="text-lg text-gray-600">Deliciosos hambúrgueres e acompanhamentos</p>
      </div>

      {/* Busca */}
      <div className="mb-8">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar no cardápio..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🍽️ Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Imagem */}
            <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl">
              {item.image}
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">
                  R$ {item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.available}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    item.available
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {item.available ? 'Adicionar' : 'Indisponível'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem quando não há itens */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum item encontrado
          </h3>
          <p className="text-gray-600">
            Tente ajustar sua busca ou selecionar outra categoria
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
