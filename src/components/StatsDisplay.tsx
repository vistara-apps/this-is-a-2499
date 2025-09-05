import React from 'react';
import { TrendingUp, Calendar, Zap, Target } from 'lucide-react';

interface UserStats {
  totalClicks: number;
  streakCount: number;
  lastClickTimestamp: number;
  dailyClicks: number;
}

interface StatsDisplayProps {
  userStats: UserStats;
}

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

  const stats = [
    {
      icon: Target,
      label: 'Total Clicks',
      value: userStats.totalClicks.toLocaleString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: `${userStats.streakCount} day${userStats.streakCount !== 1 ? 's' : ''}`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Calendar,
      label: 'Today',
      value: userStats.dailyClicks.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Zap,
      label: 'Last Click',
      value: formatLastClick(userStats.lastClickTimestamp),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card rounded-lg p-4 ${stat.bgColor}`}>
          <div className="flex items-center justify-center mb-2">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
            <p className={`font-bold text-sm ${stat.color}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;