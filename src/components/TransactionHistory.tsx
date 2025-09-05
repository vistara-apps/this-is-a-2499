import React, { useState } from 'react';
import { ExternalLink, Clock, ChevronDown, ChevronUp, Trophy, Zap } from 'lucide-react';

interface ShmooPoint {
  pointId: string;
  userAddress: string;
  timestamp: number;
  txHash?: string;
}

interface TransactionHistoryProps {
  points: ShmooPoint[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ points }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayPoints = isExpanded ? points : points.slice(0, 3);

  if (points.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ready to Start?
          </h3>
          <p className="text-gray-500 leading-relaxed">
            No Shmoo points generated yet.<br />
            🚀 Click the button above to create your first verifiable point!
          </p>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getMilestoneIcon = (index: number, total: number) => {
    const pointNumber = total - index;
    if (pointNumber === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (pointNumber % 10 === 0) return <Trophy className="h-4 w-4 text-blue-500" />;
    if (pointNumber % 5 === 0) return <Zap className="h-4 w-4 text-purple-500" />;
    return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          Recent Activity
        </h3>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {points.length} point{points.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="space-y-3">
        {displayPoints.map((point, index) => {
          const pointNumber = points.length - index;
          const isSpecial = pointNumber === 1 || pointNumber % 10 === 0 || pointNumber % 5 === 0;
          
          return (
            <div 
              key={point.pointId} 
              className={`
                flex items-center justify-between p-4 rounded-xl transition-all duration-200
                ${isSpecial 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-md' 
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }
                transform hover:scale-[1.02]
              `}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getMilestoneIcon(index, points.length)}
                  <span className={`font-semibold ${isSpecial ? 'text-orange-700' : 'text-gray-900'}`}>
                    Shmoo Point #{pointNumber}
                    {pointNumber === 1 && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">First! 🎉</span>}
                    {pointNumber % 10 === 0 && pointNumber > 1 && <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Milestone! 🏆</span>}
                  </span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span>{formatDate(point.timestamp)} at {formatTime(point.timestamp)}</span>
                  {isSpecial && <span className="text-orange-600">✨</span>}
                </div>
              </div>
              
              {point.txHash && (
                <button className="ml-3 p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {points.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show All ({points.length - 3} more)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
