'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { getUser, logout } from '@/utils/auth';
import { getCartItemCount } from '@/utils/cart';
import SweetCard from '@/components/SweetCard';
import SearchBar from '@/components/SearchBar';
import AdminPanel from '@/components/AdminPanel';
import CartPanel from '@/components/CartPanel';
import OrdersPanel from '@/components/OrdersPanel';

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [showOrdersPanel, setShowOrdersPanel] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchSweets();
    updateCartCount();
    
    // Update cart count when cart changes
    const interval = setInterval(() => {
      updateCartCount();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [router]);

  const updateCartCount = () => {
    setCartCount(getCartItemCount());
  };

  const fetchSweets = async () => {
    try {
      const response = await api.get('/sweets');
      setSweets(response.data);
      setFilteredSweets(response.data);
    } catch (err: any) {
      setError('Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.name) params.append('name', searchQuery.name);
      if (searchQuery.category) params.append('category', searchQuery.category);
      if (searchQuery.minPrice) params.append('minPrice', searchQuery.minPrice);
      if (searchQuery.maxPrice) params.append('maxPrice', searchQuery.maxPrice);

      const response = await params.toString()
        ? await api.get(`/sweets/search?${params.toString()}`)
        : await api.get('/sweets');

      setFilteredSweets(response.data);
    } catch (err: any) {
      setError('Search failed');
    }
  };

  const handlePurchase = async (id: string, quantity: number) => {
    try {
      await api.post(`/sweets/${id}/purchase`, { quantity });
      
      // Get sweet details to save order
      const sweet = sweets.find(s => s._id === id) || filteredSweets.find(s => s._id === id);
      if (sweet) {
        // Save order to database
        try {
          const orderId = `ORD-${Date.now()}`;
          await api.post('/orders', {
            orderId,
            items: [{
              sweetId: id,
              name: sweet.name,
              category: sweet.category,
              price: sweet.price,
              quantity: quantity,
              imageUrl: sweet.imageUrl,
            }],
            total: sweet.price * quantity,
            status: 'completed',
          });
        } catch (err: any) {
          console.error('Failed to save order:', err);
          // Continue even if order save fails
        }
      }
      
      await fetchSweets();
      handleSearch(); // Refresh filtered results
      updateCartCount();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <nav className="glass backdrop-blur-lg bg-white/80 border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="text-4xl">🪔</div>
              <h1 className="text-3xl font-extrabold font-display gradient-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500">
                Chashni
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600 hidden sm:inline">
                Welcome, <span className="text-gray-900 font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={() => setShowOrdersPanel(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Orders</span>
              </button>
              <button
                onClick={() => setShowCartPanel(true)}
                className="relative px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse-slow">
                    {cartCount}
                  </span>
                )}
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                >
                  {showAdminPanel ? 'Hide' : 'Show'} Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAdminPanel && isAdmin && (
          <AdminPanel onSweetAdded={fetchSweets} onSweetUpdated={fetchSweets} sweets={sweets} />
        )}

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />

        {error && (
          <div className="mb-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm animate-slide-up">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary-400 opacity-20"></div>
            </div>
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-400 text-xl font-medium">No sweets found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredSweets.map((sweet, index) => (
              <div key={sweet._id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <SweetCard
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  isAdmin={isAdmin}
                  onDelete={fetchSweets}
                  onUpdateCart={updateCartCount}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sliding Panels */}
      <CartPanel
        isOpen={showCartPanel}
        onClose={() => setShowCartPanel(false)}
        onCheckout={() => router.push('/checkout')}
        onUpdateCart={updateCartCount}
      />
      <OrdersPanel
        isOpen={showOrdersPanel}
        onClose={() => setShowOrdersPanel(false)}
      />
    </div>
  );
}

