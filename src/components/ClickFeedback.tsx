import React, { useEffect, useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';

interface ClickFeedbackProps {
  isVisible: boolean;
  onComplete: () => void;
  clickCount?: number;
  position?: { x: number; y: number };
}

const ClickFeedback: React.FC<ClickFeedbackProps> = ({ 
  isVisible, 
  onComplete, 
  clickCount = 1,
  position 
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate random particles
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50, // -50 to 50
        y: Math.random() * 100 - 50, // -50 to 50
        delay: Math.random() * 200, // 0 to 200ms delay
      }));
      setParticles(newParticles);

      // Clean up after animation
      const timer = setTimeout(() => {
        onComplete();
        setParticles([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating +1 number */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-float-up text-2xl font-bold text-green-500 flex items-center gap-1">
          <Plus className="h-6 w-6" />
          <span>{clickCount}</span>
        </div>
      </div>

      {/* Particle effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            animationDelay: `${particle.delay}ms`,
          }}
        >
          <div
            className="animate-float-up"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
            }}
          >
            <Sparkles className="h-4 w-4 text-yellow-400" />
          </div>
        </div>
      ))}

      {/* Ripple effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 border-4 border-blue-400 rounded-full animate-ping opacity-30"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-24 h-24 border-2 border-purple-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '100ms' }}></div>
      </div>
    </div>
  );
};

export default ClickFeedback;
