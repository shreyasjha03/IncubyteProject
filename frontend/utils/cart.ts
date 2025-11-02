import Cookies from 'js-cookie';

export interface CartItem {
  sweetId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  maxQuantity: number; // Available stock
  imageUrl?: string;
}

export const getCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const cartStr = Cookies.get('cart');
    return cartStr ? JSON.parse(cartStr) : [];
  }
  return [];
};

export const setCart = (cart: CartItem[]): void => {
  Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
};

export const addToCart = (item: CartItem): void => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex((i) => i.sweetId === item.sweetId);

  if (existingItemIndex >= 0) {
    // Update existing item quantity (but check max available)
    const existingItem = cart[existingItemIndex];
    const newQuantity = existingItem.quantity + item.quantity;
    cart[existingItemIndex].quantity = Math.min(newQuantity, item.maxQuantity);
  } else {
    // Add new item
    cart.push(item);
  }

  setCart(cart);
};

export const updateCartItem = (sweetId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find((i) => i.sweetId === sweetId);
  
  if (item) {
    if (quantity <= 0) {
      // Remove item
      const newCart = cart.filter((i) => i.sweetId !== sweetId);
      setCart(newCart);
    } else {
      // Update quantity (but check max available)
      item.quantity = Math.min(quantity, item.maxQuantity);
      setCart(cart);
    }
  }
};

export const removeFromCart = (sweetId: string): void => {
  const cart = getCart();
  const newCart = cart.filter((i) => i.sweetId !== sweetId);
  setCart(newCart);
};

export const clearCart = (): void => {
  Cookies.remove('cart');
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

