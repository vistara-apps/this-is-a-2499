import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner: React.FC = () => {
  return (
    <div className="warning-banner text-white py-3 px-4 text-center sticky top-0 z-50">
      <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <p className="text-sm font-medium">
          <strong>WARNING:</strong> Shmoo points are non-transferable and have no value.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;