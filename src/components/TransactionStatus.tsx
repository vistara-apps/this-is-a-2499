import React from 'react';
import { CheckCircle, Clock, XCircle, ExternalLink, AlertCircle } from 'lucide-react';

export type TransactionState = 'pending' | 'confirmed' | 'failed' | 'idle';

interface TransactionStatusProps {
  state: TransactionState;
  txHash?: string;
  error?: string;
  explorerUrl?: string;
  onRetry?: () => void;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  state,
  txHash,
  error,
  explorerUrl,
  onRetry
}) => {
  if (state === 'idle') return null;

  const getStatusConfig = () => {
    switch (state) {
      case 'pending':
        return {
          icon: Clock,
          title: 'Transaction Pending',
          message: 'Your Shmoo point is being generated on-chain...',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-500'
        };
      case 'confirmed':
        return {
          icon: CheckCircle,
          title: 'Transaction Confirmed',
          message: 'Your Shmoo point has been successfully generated!',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          iconColor: 'text-green-500'
        };
      case 'failed':
        return {
          icon: XCircle,
          title: 'Transaction Failed',
          message: error || 'Failed to generate Shmoo point. Please try again.',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          iconColor: 'text-red-500'
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Unknown Status',
          message: 'Transaction status unknown',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border border-gray-200 rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {state === 'pending' ? (
            <Clock className={`h-5 w-5 ${config.iconColor} animate-spin`} />
          ) : (
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${config.textColor} mb-1`}>
            {config.title}
          </h4>
          <p className={`text-sm ${config.textColor} opacity-90 mb-2`}>
            {config.message}
          </p>
          
          {txHash && (
            <div className="flex items-center gap-2 mb-2">
              <code className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded font-mono break-all">
                {txHash}
              </code>
              {explorerUrl && (
                <a
                  href={`${explorerUrl}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-xs ${config.textColor} hover:underline`}
                >
                  <ExternalLink className="h-3 w-3" />
                  View
                </a>
              )}
            </div>
          )}
          
          {state === 'failed' && onRetry && (
            <button
              onClick={onRetry}
              className="text-sm bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
