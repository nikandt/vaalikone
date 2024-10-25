'use client';

import { useState } from 'react';
import Home from './components/home';
import Vaalikone from './components/vaalikone';

export default function Page() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'vaalikone':
        return <Vaalikone />;
      default:
        return <Home />;
    }
  };

  return (
    <div>
      <nav>
        <button type="button" onClick={() => setCurrentPage('home')}>
          Home
        </button>
        <button type="button" onClick={() => setCurrentPage('vaalikone')}>
          Vaalikone
        </button>
      </nav>
      <div>
        {renderPage()}
      </div>
    </div>
  );
}