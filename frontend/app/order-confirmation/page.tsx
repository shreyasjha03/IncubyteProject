'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/utils/auth';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-2xl mx-auto w-full relative z-10 animate-slide-up">
        <div className="glass bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 text-center border border-white/20">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse-slow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="text-4xl">🪔</div>
              <h1 className="text-4xl font-extrabold font-display gradient-text bg-gradient-to-r from-green-600 via-amber-600 to-orange-500">Order Confirmed!</h1>
            </div>
            <p className="text-lg text-gray-600 mb-2">Thank you for your purchase, <span className="font-semibold text-gray-900">{user?.username}</span>!</p>
            {orderId && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mt-3">
                <span className="text-xs font-medium text-gray-500">Order ID:</span>
                <span className="text-sm font-bold text-gray-900">{orderId}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <p className="text-gray-700 mb-2 font-medium">
              Your order has been successfully placed and will be processed shortly.
            </p>
            <p className="text-sm text-gray-500">
              You will receive a confirmation email shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              View Orders
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

