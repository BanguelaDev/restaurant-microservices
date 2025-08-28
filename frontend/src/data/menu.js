// Dados do cardápio do restaurante
export const menuItems = [
  {
    id: 1,
    name: 'X-Burger Clássico',
    description: 'Hambúrguer artesanal com queijo, alface, tomate e molho especial',
    price: 18.90,
    category: 'burgers',
    image: '🍔',
    available: true
  },
  {
    id: 2,
    name: 'X-Burger Bacon',
    description: 'Hambúrguer com bacon crocante, queijo, alface e molho barbecue',
    price: 22.90,
    category: 'burgers',
    image: '🥓',
    available: true
  },
  {
    id: 3,
    name: 'X-Burger Vegetariano',
    description: 'Hambúrguer de grão-de-bico com queijo vegano e vegetais frescos',
    price: 20.90,
    category: 'burgers',
    image: '🥬',
    available: true
  },
  {
    id: 4,
    name: 'Batata Frita',
    description: 'Porção de batatas fritas crocantes com sal e ervas',
    price: 12.90,
    category: 'sides',
    image: '🍟',
    available: true
  },
  {
    id: 5,
    name: 'Batata Frita com Cheddar',
    description: 'Batatas fritas com queijo cheddar derretido e bacon',
    price: 16.90,
    category: 'sides',
    image: '🧀',
    available: true
  },
  {
    id: 6,
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados e fritos até ficarem dourados',
    price: 14.90,
    category: 'sides',
    image: '🧅',
    available: true
  },
  {
    id: 7,
    name: 'Refrigerante',
    description: 'Refrigerante de 350ml (Coca-Cola, Pepsi, Sprite, Fanta)',
    price: 6.90,
    category: 'drinks',
    image: '🥤',
    available: true
  },
  {
    id: 8,
    name: 'Suco Natural',
    description: 'Suco natural de laranja, limão ou maracujá (300ml)',
    price: 8.90,
    category: 'drinks',
    image: '🍊',
    available: true
  },
  {
    id: 9,
    name: 'Água',
    description: 'Água mineral sem gás (500ml)',
    price: 4.90,
    category: 'drinks',
    image: '💧',
    available: true
  },
  {
    id: 10,
    name: 'Milk Shake',
    description: 'Milk shake de chocolate, morango ou baunilha (400ml)',
    price: 15.90,
    category: 'drinks',
    image: '🥛',
    available: true
  },
  {
    id: 11,
    name: 'Sorvete',
    description: 'Sorvete de creme, chocolate ou morango (2 bolas)',
    price: 9.90,
    category: 'desserts',
    image: '🍦',
    available: true
  },
  {
    id: 12,
    name: 'Brownie',
    description: 'Brownie de chocolate com nozes e sorvete de creme',
    price: 12.90,
    category: 'desserts',
    image: '🍫',
    available: true
  }
];

// Categorias do menu
export const categories = [
  { id: 'burgers', name: 'Hambúrgueres', icon: '🍔' },
  { id: 'sides', name: 'Acompanhamentos', icon: '🍟' },
  { id: 'drinks', name: 'Bebidas', icon: '🥤' },
  { id: 'desserts', name: 'Sobremesas', icon: '🍦' }
];

// Função para obter itens por categoria
export const getItemsByCategory = (category) => {
  return menuItems.filter(item => item.category === category);
};

// Função para buscar itens
export const searchItems = (query) => {
  const lowerQuery = query.toLowerCase();
  return menuItems.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery)
  );
};

// Função para obter item por ID
export const getItemById = (id) => {
  return menuItems.find(item => item.id === parseInt(id));
};
