import React, { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Zap, Target, Award, Fire } from 'lucide-react';

interface UserStats {
  totalClicks: number;
  streakCount: number;
  lastClickTimestamp: number;
  dailyClicks: number;
}

interface StatsDisplayProps {
  userStats: UserStats;
}

const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ 
  value, 
  duration = 1000 
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const ProgressBar: React.FC<{ 
  current: number; 
  max: number; 
  color: string;
  showPercentage?: boolean;
}> = ({ current, max, color, showPercentage = false }) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  return (
    <div className="w-full mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

const StatsDisplay: React.FC<StatsDisplayProps> = ({ userStats }) => {
  const formatLastClick = (timestamp: number): string => {
    if (timestamp === 0) return 'Never';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Calculate next milestone
  const getNextMilestone = (current: number): number => {
    const milestones = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
    return milestones.find(m => m > current) || current + 1000;
  };

  const nextMilestone = getNextMilestone(userStats.totalClicks);
  const dailyGoal = 10; // Daily goal of 10 clicks

  const stats = [
    {
      icon: Target,
      label: 'Total Clicks',
      value: <AnimatedCounter value={userStats.totalClicks} />,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      progress: (
        <ProgressBar 
          current={userStats.totalClicks} 
          max={nextMilestone} 
          color="bg-blue-500"
          showPercentage={false}
        />
      ),
      subtitle: `${nextMilestone - userStats.totalClicks} to next milestone`
    },
    {
      icon: userStats.streakCount >= 7 ? Fire : TrendingUp,
      label: 'Current Streak',
      value: (
        <div className="flex items-center justify-center gap-1">
          <AnimatedCounter value={userStats.streakCount} />
          <span className="text-xs">day{userStats.streakCount !== 1 ? 's' : ''}</span>
          {userStats.streakCount >= 7 && <Fire className="h-3 w-3 text-orange-500" />}
        </div>
      ),
      color: userStats.streakCount >= 7 ? 'text-orange-600' : 'text-green-600',
      bgColor: userStats.streakCount >= 7 
        ? 'bg-gradient-to-br from-orange-50 to-red-100' 
        : 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: userStats.streakCount >= 7 ? 'border-orange-200' : 'border-green-200',
      subtitle: userStats.streakCount >= 7 ? 'On fire! 🔥' : 'Keep it up!'
    },
    {
      icon: Calendar,
      label: 'Today\'s Progress',
      value: (
        <div className="flex items-center justify-center gap-1">
          <AnimatedCounter value={userStats.dailyClicks} />
          <span className="text-xs">/ {dailyGoal}</span>
        </div>
      ),
      color: userStats.dailyClicks >= dailyGoal ? 'text-purple-600' : 'text-purple-500',
      bgColor: userStats.dailyClicks >= dailyGoal 
        ? 'bg-gradient-to-br from-purple-50 to-purple-100' 
        : 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      progress: (
        <ProgressBar 
          current={userStats.dailyClicks} 
          max={dailyGoal} 
          color="bg-purple-500"
          showPercentage={false}
        />
      ),
      subtitle: userStats.dailyClicks >= dailyGoal ? 'Goal achieved! 🎉' : `${dailyGoal - userStats.dailyClicks} more to go`
    },
    {
      icon: Zap,
      label: 'Last Click',
      value: formatLastClick(userStats.lastClickTimestamp),
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-yellow-100',
      borderColor: 'border-orange-200',
      subtitle: userStats.lastClickTimestamp === 0 ? 'Start clicking!' : 'Keep the momentum!'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`
            stat-card rounded-xl p-4 border-2 ${stat.bgColor} ${stat.borderColor}
            transform transition-all duration-200 hover:scale-105
            shadow-sm hover:shadow-md
          `}
        >
          <div className="flex items-center justify-center mb-3">
            <div className={`p-2 rounded-full bg-white/50 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
            <div className={`font-bold text-lg ${stat.color} mb-1`}>
              {stat.value}
            </div>
            
            {stat.progress && (
              <div className="mb-2">
                {stat.progress}
              </div>
            )}
            
            <p className="text-xs text-gray-500 leading-tight">
              {stat.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;
