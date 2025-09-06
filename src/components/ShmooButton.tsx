import React, { useState } from 'react';
import { Zap, Loader2, Sparkles } from 'lucide-react';
import ClickFeedback from './ClickFeedback';

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
  const [isClicked, setIsClicked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleClick = async () => {
    if (disabled || isGenerating) return;
    
    setIsClicked(true);
    setShowFeedback(true);
    setTimeout(() => setIsClicked(false), 200);
    
    await onGenerate();
  };

  const handleFeedbackComplete = () => {
    setShowFeedback(false);
  };

  return (
    <div className="text-center relative">
      {/* Click ripple effect container */}
      <div className="relative inline-block">
        <button
          onClick={handleClick}
          disabled={disabled || isGenerating}
          className={`
            shmoo-button-enhanced relative overflow-hidden
            text-white font-bold py-8 px-16 rounded-2xl text-3xl
            w-full max-w-sm mx-auto flex items-center justify-center gap-4
            disabled:opacity-60 disabled:cursor-not-allowed
            transform transition-all duration-200 ease-out
            ${isClicked ? 'scale-95' : 'scale-100 hover:scale-105'}
            ${!disabled && !isGenerating ? 'shadow-xl hover:shadow-2xl' : ''}
            bg-gradient-to-br from-primary via-blue-600 to-purple-600
            hover:from-blue-500 hover:via-purple-600 hover:to-pink-600
            active:from-purple-700 active:via-blue-700 active:to-primary
            min-h-[120px] touch-manipulation
          `}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
          
          {/* Button content */}
          <div className="relative z-10 flex items-center justify-center gap-4">
            {isGenerating ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-2xl">Generating...</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <Zap className={`h-8 w-8 transition-transform duration-200 ${isClicked ? 'scale-125' : 'scale-100'}`} />
                  {isClicked && (
                    <div className="absolute inset-0 animate-ping">
                      <Sparkles className="h-8 w-8 text-yellow-300" />
                    </div>
                  )}
                </div>
                <span className="text-2xl font-extrabold tracking-wide">SHMOO!</span>
              </>
            )}
          </div>

          {/* Click ripple effect */}
          {isClicked && (
            <div className="absolute inset-0 bg-white/30 rounded-2xl animate-ping"></div>
          )}
        </button>

        {/* Click feedback animation */}
        <ClickFeedback 
          isVisible={showFeedback}
          onComplete={handleFeedbackComplete}
          clickCount={1}
        />
      </div>
      
      <p className={`text-base mt-4 transition-colors duration-300 ${
        isGenerating 
          ? 'text-blue-600 font-semibold animate-pulse' 
          : 'text-gray-600 hover:text-gray-800'
      }`}>
        {isGenerating 
          ? '✨ Creating your Shmoo point on-chain...' 
          : '🎯 Tap to generate a verifiable Shmoo point'
        }
      </p>
    </div>
  );
};

export default ShmooButton;
