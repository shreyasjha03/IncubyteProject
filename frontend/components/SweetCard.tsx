'use client';

import { useState } from 'react';
import api from '@/utils/api';
import { addToCart, CartItem } from '@/utils/cart';

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, quantity: number) => void;
  isAdmin: boolean;
  onDelete: () => void;
  onUpdateCart?: () => void;
}

export default function SweetCard({ sweet, onPurchase, isAdmin, onDelete, onUpdateCart }: SweetCardProps) {
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [addedQuantity, setAddedQuantity] = useState(1);
  const [editFormData, setEditFormData] = useState({
    name: sweet.name,
    category: sweet.category,
    price: sweet.price.toString(),
    quantity: sweet.quantity.toString(),
    imageUrl: sweet.imageUrl || '',
  });

  const handleAddToCart = () => {
    if (sweet.quantity === 0) return;
    
    setPurchaseQuantity(1);
    setShowQuantityModal(true);
  };

  const handleAddToCartConfirm = () => {
    if (purchaseQuantity <= 0 || purchaseQuantity > sweet.quantity) {
      alert(`Please enter a valid quantity (1-${sweet.quantity})`);
      return;
    }
    
    const cartItem: CartItem = {
      sweetId: sweet._id,
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: purchaseQuantity,
      maxQuantity: sweet.quantity,
      imageUrl: sweet.imageUrl,
    };
    
    addToCart(cartItem);
    setShowQuantityModal(false);
    
    // Store quantity for notification before resetting
    setAddedQuantity(purchaseQuantity);
    setPurchaseQuantity(1);
    
    // Show notification
    setShowAddedToCart(true);
    setTimeout(() => {
      setShowAddedToCart(false);
    }, 3000);
    
    // Update cart count in parent component
    if (onUpdateCart) {
      onUpdateCart();
    }
  };

  const handleQuickBuy = () => {
    setPurchaseQuantity(1);
    setShowQuantityModal(true);
  };

  const handlePurchase = async () => {
    if (purchaseQuantity <= 0 || purchaseQuantity > sweet.quantity) {
      alert(`Please enter a valid quantity (1-${sweet.quantity})`);
      return;
    }

    setLoading(true);
    try {
      await onPurchase(sweet._id, purchaseQuantity);
      setShowQuantityModal(false);
      setPurchaseQuantity(1);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/sweets/${sweet._id}`, {
        name: editFormData.name,
        category: editFormData.category,
        price: parseFloat(editFormData.price),
        quantity: parseInt(editFormData.quantity),
        imageUrl: editFormData.imageUrl || undefined,
      });
      setShowEditForm(false);
      onDelete();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${sweet.name}?`)) return;

    setLoading(true);
    try {
      await api.delete(`/sweets/${sweet._id}`);
      onDelete();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    const quantity = prompt('Enter quantity to add:');
    if (!quantity || isNaN(parseInt(quantity))) return;

    setLoading(true);
    try {
      await api.post(`/sweets/${sweet._id}/restock`, { quantity: parseInt(quantity) });
      onDelete();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  // Get image URL or use default based on category
  const getImageUrl = () => {
    if (sweet.imageUrl) return sweet.imageUrl;
    
    // Default images for different categories of Indian sweets
    const defaultImages: Record<string, string> = {
      'Gulab Jamun': 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop',
      'Barfi': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'Ladoo': 'https://images.unsplash.com/photo-1601050690597-df0568f70946?w=400&h=300&fit=crop',
      'Rasgulla': 'https://images.unsplash.com/photo-1615367427256-e2d72f3bc3c2?w=400&h=300&fit=crop',
      'Jalebi': 'https://images.unsplash.com/photo-1633356122544-f134324a6ce0?w=400&h=300&fit=crop',
      'Kaju Katli': 'https://images.unsplash.com/photo-1615367427021-04d4d82e7d45?w=400&h=300&fit=crop',
      'Halwa': 'https://images.unsplash.com/photo-1606800053563-90c9a3e2a31d?w=400&h=300&fit=crop',
    };
    
    return defaultImages[sweet.name] || defaultImages[sweet.category] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop';
  };

  return (
    <>
      {/* Added to Cart Notification */}
      {showAddedToCart && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 border border-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-bold">Added to Cart!</p>
              <p className="text-sm opacity-90">{sweet.name} ({addedQuantity}x)</p>
            </div>
          </div>
        </div>
      )}

      <div className="group bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
          <img 
            src={getImageUrl()} 
            alt={sweet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop';
            }}
          />
          {sweet.quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold font-display text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">{sweet.name}</h3>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {sweet.category}
          </p>
          <p className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            ₹{sweet.price.toFixed(2)}
          </p>
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
              sweet.quantity > 0
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${sweet.quantity > 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
              {sweet.quantity > 0 ? `In Stock: ${sweet.quantity}` : 'Out of Stock'}
            </span>
          </div>

          {showEditForm ? (
            <form onSubmit={handleEdit} className="space-y-3">
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
                placeholder="Name"
                required
              />
              <input
                type="text"
                value={editFormData.category}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
                placeholder="Category"
                required
              />
              <input
                type="number"
                step="0.01"
                value={editFormData.price}
                onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
                placeholder="Price"
                required
              />
            <input
              type="number"
              value={editFormData.quantity}
              onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
              placeholder="Quantity"
              required
            />
            <input
              type="url"
              value={editFormData.imageUrl}
              onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white"
              placeholder="Image URL (optional)"
            />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-sm disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
            <button
              onClick={handleQuickBuy}
              disabled={loading || sweet.quantity === 0}
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
            >
              {loading ? 'Processing...' : 'Quick Buy'}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={sweet.quantity === 0}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
            >
              Add to Cart
            </button>
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleRestock}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Restock
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quantity Selection Modal */}
      {showQuantityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass bg-white/95 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20 animate-slide-up">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{sweet.name}</h3>
              <p className="text-sm text-gray-500">{sweet.category}</p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantity (Available: <span className="text-primary-600 font-bold">{sweet.quantity}</span>)
              </label>
              <input
                type="number"
                min="1"
                max={sweet.quantity}
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              />
            </div>
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600">Unit Price:</p>
                <p className="text-lg font-semibold text-gray-900">₹{sweet.price.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <p className="text-base font-bold text-gray-900">Total:</p>
                <p className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  ₹{(sweet.price * purchaseQuantity).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handlePurchase}
                disabled={loading || purchaseQuantity <= 0 || purchaseQuantity > sweet.quantity}
                className="w-full px-4 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-bold"
              >
                {loading ? 'Processing...' : 'Purchase Now'}
              </button>
              <button
                onClick={handleAddToCartConfirm}
                disabled={purchaseQuantity <= 0 || purchaseQuantity > sweet.quantity}
                className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  setShowQuantityModal(false);
                  setPurchaseQuantity(1);
                }}
                className="w-full px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
