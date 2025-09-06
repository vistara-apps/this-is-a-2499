import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-4 px-4 text-center sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
        <div className="flex-shrink-0 p-1 bg-white/20 rounded-full">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
        </div>
        <p className="text-sm font-semibold tracking-wide">
          <span className="bg-white/20 px-2 py-1 rounded-md mr-2">⚠️ IMPORTANT</span>
          Shmoo points are non-transferable and have no monetary value
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
