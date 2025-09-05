import React from 'react';

function Header() {
  return (
    <header className="bg-surface border-b border-gray-200 p-4">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Shmoo Clicker
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Click your way to verifiable digital points
        </p>
      </div>
    </header>
  );
}

export default Header;