'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { getCart, getCartTotal, clearCart, CartItem } from '@/utils/cart';
import { getUser } from '@/utils/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orderSummary, setOrderSummary] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const cartItems = getCart();
    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(cartItems);
  }, [router]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Process each item in cart
      const orderItems = [];
      const errors = [];

      for (const item of cart) {
        try {
          const response = await api.post(`/sweets/${item.sweetId}/purchase`, {
            quantity: item.quantity,
          });
          orderItems.push({
            ...item,
            success: true,
            updatedSweet: response.data.sweet,
          });
        } catch (err: any) {
          errors.push({
            item: item.name,
            error: err.response?.data?.message || 'Purchase failed',
          });
        }
      }

      // If all items processed successfully
      if (errors.length === 0) {
        const total = getCartTotal();
        const orderId = `ORD-${Date.now()}`;
        
        // Save order to database
        try {
          await api.post('/orders', {
            orderId,
          items: cart.map(item => ({
            sweetId: item.sweetId,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
            total,
            status: 'completed',
          });
        } catch (err: any) {
          console.error('Failed to save order:', err);
          // Continue even if order save fails
        }

        setOrderSummary({
          orderId,
          items: orderItems,
          total,
          date: new Date().toISOString(),
        });
        clearCart();
        // Redirect to order confirmation after 2 seconds
        setTimeout(() => {
          router.push(`/order-confirmation?orderId=${orderId}`);
        }, 2000);
      } else {
        // Show errors for failed items
        alert(`Some items could not be purchased:\n${errors.map((e) => `- ${e.item}: ${e.error}`).join('\n')}`);
      }
    } catch (err: any) {
      alert('Order processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal();

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">🪔</div>
            <h1 className="text-4xl font-extrabold font-display gradient-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500">Chashni</h1>
          </div>
          <p className="text-gray-600 ml-12">Review your order before placing</p>
        </div>

        {orderSummary ? (
          <div className="glass bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center animate-slide-up">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse-slow">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold font-display text-gray-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-500 text-lg">Redirecting to order confirmation...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="glass bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-gray-100/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700 min-w-[60px]">Name:</span>
                    <span className="text-gray-900 font-medium">{user?.username}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="font-semibold text-gray-700 min-w-[60px]">Email:</span>
                    <span className="text-gray-900 font-medium">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="glass bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6 border border-gray-100/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Order Items
                </h2>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.sweetId} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.category} • {item.quantity} x ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-extrabold text-lg bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-6 sticky top-24 border border-gray-100/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-200">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-semibold text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mb-3"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <button
                  onClick={() => router.push('/cart')}
                  className="w-full px-6 py-2.5 text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                >
                  ← Back to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

