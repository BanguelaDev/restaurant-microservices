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
    <div className="space-y-8">
      {/* Título */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 font-display">
          🍔 Nosso Cardápio
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Deliciosos hambúrgueres artesanais e acompanhamentos frescos para satisfazer seu paladar
        </p>
      </div>

      {/* Busca */}
      <div className="max-w-md mx-auto">
        <div className="relative group">
          <input
            type="text"
            placeholder="Buscar no cardápio..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 group-hover:shadow-md"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🍽️ Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Imagem */}
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
              {item.image}
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-display">
                {item.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  R$ {item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onAddToCart(item)}
                  disabled={!item.available}
                  className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    item.available
                      ? 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
        <div className="text-center py-16 animate-fade-in">
          <div className="text-6xl mb-6 animate-bounce-slow">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 font-display">
            Nenhum item encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Tente ajustar sua busca ou selecionar outra categoria para descobrir nossas deliciosas opções
          </p>
        </div>
      )}
    </div>
  );
};

export default Menu;
