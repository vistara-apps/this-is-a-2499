import React from 'react';

function TransactionStatus({ isGenerating, transactionHash, showSuccess }) {
  if (isGenerating) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Sending transaction to Ethereum mainnet...
            </p>
            <p className="text-xs text-blue-600">
              Please confirm the transaction in your wallet
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess && transactionHash) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              Shmoo point generated successfully!
            </p>
            <p className="text-xs text-green-600 break-all">
              TX: {transactionHash.substring(0, 20)}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default TransactionStatus;