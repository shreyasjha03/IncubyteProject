'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCart, updateCartItem, removeFromCart, clearCart, getCartTotal, CartItem } from '@/utils/cart';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cartItems = getCart();
    setCart(cartItems);
  }, []);

  const handleQuantityChange = (sweetId: string, newQuantity: number) => {
    updateCartItem(sweetId, newQuantity);
    const updatedCart = getCart();
    setCart(updatedCart);
  };

  const handleRemove = (sweetId: string) => {
    removeFromCart(sweetId);
    const updatedCart = getCart();
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-amber-600 hover:text-amber-700 font-medium mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold font-display text-gray-900">Shopping Cart</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.sweetId} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">Category: {item.category}</p>
                    <p className="text-lg font-semibold text-amber-600">₹{item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => handleRemove(item.sweetId)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.sweetId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.maxQuantity}
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.sweetId, qty);
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center text-gray-900 bg-white"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.sweetId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Subtotal: <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <Link
                href="/dashboard"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-amber-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

