import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;

  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  filteredProducts: Product[];
  filterProducts: (category?: string, minPrice?: number, maxPrice?: number) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Cart
  cart: [],
  addToCart: (product, quantity = 1, color, size) => {
    const existingItem = get().cart.find(
      item => item.id === product.id && 
      item.selectedColor === color && 
      item.selectedSize === size
    );

    if (existingItem) {
      set(state => ({
        cart: state.cart.map(item =>
          item.id === product.id && 
          item.selectedColor === color && 
          item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }));
    } else {
      set(state => ({
        cart: [...state.cart, { 
          ...product, 
          quantity, 
          selectedColor: color, 
          selectedSize: size 
        }]
      }));
    }
  },
  removeFromCart: (productId) => {
    set(state => ({
      cart: state.cart.filter(item => item.id !== productId)
    }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set(state => ({
      cart: state.cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    }));
  },
  clearCart: () => set({ cart: [] }),
  get cartTotal() {
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  get cartCount() {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },

  // User
  user: null,
  setUser: (user) => set({ user }),
  get isAuthenticated() {
    return get().user !== null;
  },

  // UI State
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Products
  products: [],
  setProducts: (products) => set({ products, filteredProducts: products }),
  filteredProducts: [],
  filterProducts: (category, minPrice, maxPrice) => {
    const { products, searchQuery } = get();
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    set({ filteredProducts: filtered });
  },
}));
