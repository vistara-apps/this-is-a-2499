import React from 'react';

function StatsDisplay({ totalClicks, streakCount, lastClickTimestamp }) {
  const formatLastClick = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 1) {
      return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-primary">{totalClicks}</div>
        <div className="text-sm text-gray-600">Total Clicks</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-accent">{streakCount}</div>
        <div className="text-sm text-gray-600">Current Streak</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="text-lg font-semibold text-gray-700">
          {formatLastClick(lastClickTimestamp)}
        </div>
        <div className="text-sm text-gray-600">Last Click</div>
      </div>
    </div>
  );
}

export default StatsDisplay;