import React from 'react';

function ShmooButton({ onClick, isGenerating, disabled }) {
  return (
    <div className="text-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          shmoo-button
          w-full max-w-xs mx-auto
          bg-shmoo-green hover:bg-green-500 
          disabled:bg-gray-400 disabled:cursor-not-allowed
          text-white text-xl font-bold
          py-6 px-8 rounded-lg
          shadow-lg hover:shadow-xl
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-green-300
          ${isGenerating ? 'animate-pulse' : ''}
        `}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating...</span>
          </div>
        ) : (
          'Shmoo'
        )}
      </button>
      
      <p className="text-sm text-gray-600 mt-3">
        Click to generate a Shmoo point on Ethereum mainnet
      </p>
    </div>
  );
}

export default ShmooButton;