import React from 'react';
import { Zap, Loader2 } from 'lucide-react';

interface ShmooButtonProps {
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  disabled?: boolean;
}

const ShmooButton: React.FC<ShmooButtonProps> = ({ 
  onGenerate, 
  isGenerating, 
  disabled = false 
}) => {
  return (
    <div className="text-center">
      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className="shmoo-button text-white font-bold py-6 px-12 rounded-lg text-2xl w-full max-w-xs mx-auto flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap className="h-6 w-6" />
            Shmoo
          </>
        )}
      </button>
      
      <p className="text-sm text-gray-600 mt-3">
        {isGenerating 
          ? 'Creating your Shmoo point on-chain...' 
          : 'Click to generate a verifiable Shmoo point'
        }
      </p>
    </div>
  );
};

export default ShmooButton;