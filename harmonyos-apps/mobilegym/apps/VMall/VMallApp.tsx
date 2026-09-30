import React, { useState } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VMallNavigationHandler } from './components/VMallNavigationHandler';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import DiscoverPage from './pages/DiscoverPage';
import MePage from './pages/MePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

export const VMallApp: React.FC = () => {
  const [cartCount, setCartCount] = useState<number>(1);

  return (
    <div className="h-full w-full bg-[#f4f4f4] select-none font-sans" data-vmall-root>
      <MemoryRouter initialEntries={['/']}>
        <VMallNavigationHandler />
        <div className="h-full w-full relative">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  cartCount={cartCount}
                  onAddToCart={() => setCartCount((c) => c + 1)}
                />
              }
            />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/me" element={<MePage />} />
            <Route
              path="/product/:id"
              element={
                <ProductDetailPage
                  cartCount={cartCount}
                  onAddToCart={() => setCartCount((c) => c + 1)}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cartCount={cartCount}
                  onClearCart={() => setCartCount(0)}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </MemoryRouter>
    </div>
  );
};

export default VMallApp;
