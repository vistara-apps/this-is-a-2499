import React, { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AlertTriangle, Zap, TrendingUp, Calendar } from 'lucide-react';
import DisclaimerBanner from './components/DisclaimerBanner';
import ShmooButton from './components/ShmooButton';
import StatsDisplay from './components/StatsDisplay';
import TransactionHistory from './components/TransactionHistory';

interface UserStats {
  totalClicks: number;
  streakCount: number;
  lastClickTimestamp: number;
  dailyClicks: number;
}

interface ShmooPoint {
  pointId: string;
  userAddress: string;
  timestamp: number;
  txHash?: string;
}

function App() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalClicks: 0,
    streakCount: 0,
    lastClickTimestamp: 0,
    dailyClicks: 0
  });
  
  const [shmooPoints, setShmooPoints] = useState<ShmooPoint[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string>('');

  // Load user data from localStorage
  useEffect(() => {
    if (address) {
      const savedStats = localStorage.getItem(`shmoo_stats_${address}`);
      const savedPoints = localStorage.getItem(`shmoo_points_${address}`);
      
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        setUserStats(stats);
      }
      
      if (savedPoints) {
        const points = JSON.parse(savedPoints);
        setShmooPoints(points);
      }
    }
  }, [address]);

  // Save user data to localStorage
  const saveUserData = (stats: UserStats, points: ShmooPoint[]) => {
    if (address) {
      localStorage.setItem(`shmoo_stats_${address}`, JSON.stringify(stats));
      localStorage.setItem(`shmoo_points_${address}`, JSON.stringify(points));
    }
  };

  // Calculate streak
  const calculateStreak = (lastClick: number): number => {
    if (lastClick === 0) return 0;
    
    const now = Date.now();
    const daysSinceLastClick = Math.floor((now - lastClick) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastClick <= 1) {
      return userStats.streakCount;
    } else {
      return 0; // Reset streak if more than 1 day
    }
  };

  // Calculate daily clicks
  const calculateDailyClicks = (timestamp: number): number => {
    const now = Date.now();
    const dayStart = new Date(now).setHours(0, 0, 0, 0);
    
    if (timestamp >= dayStart) {
      return userStats.dailyClicks + 1;
    } else {
      return 1; // Reset daily count
    }
  };

  // Generate Shmoo Point
  const generateShmooPoint = async () => {
    if (!address || !walletClient || isGenerating) return;

    setIsGenerating(true);
    
    try {
      // Simulate transaction creation
      const mockTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      const timestamp = Date.now();
      
      // Create new Shmoo point
      const newPoint: ShmooPoint = {
        pointId: `${mockTxHash}_0`,
        userAddress: address,
        timestamp,
        txHash: mockTxHash
      };

      // Update stats
      const newDailyClicks = calculateDailyClicks(userStats.lastClickTimestamp);
      const currentStreak = calculateStreak(userStats.lastClickTimestamp);
      const newStreak = userStats.lastClickTimestamp > 0 && 
        Math.floor((timestamp - userStats.lastClickTimestamp) / (1000 * 60 * 60 * 24)) <= 1 
        ? currentStreak + 1 
        : 1;

      const newStats: UserStats = {
        totalClicks: userStats.totalClicks + 1,
        streakCount: newStreak,
        lastClickTimestamp: timestamp,
        dailyClicks: newDailyClicks
      };

      const newPoints = [newPoint, ...shmooPoints];

      // Update state
      setUserStats(newStats);
      setShmooPoints(newPoints);
      setLastTxHash(mockTxHash);

      // Save to localStorage
      saveUserData(newStats, newPoints);

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error) {
      console.error('Error generating Shmoo point:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg w-full">
      {/* Disclaimer Banner */}
      <DisclaimerBanner />
      
      {/* Main Content */}
      <div className="w-full px-4 py-6 max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shmoo Clicker
          </h1>
          <p className="text-sm text-gray-600">
            Click your way to verifiable digital points
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8 flex justify-center">
          <ConnectButton />
        </div>

        {isConnected && address ? (
          <div className="space-y-6">
            
            {/* Stats Display */}
            <StatsDisplay userStats={userStats} />
            
            {/* Shmoo Button */}
            <ShmooButton 
              onGenerate={generateShmooPoint}
              isGenerating={isGenerating}
              disabled={!walletClient}
            />

            {/* Last Transaction */}
            {lastTxHash && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Latest Transaction:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                  {lastTxHash}
                </code>
              </div>
            )}

            {/* Transaction History */}
            <TransactionHistory points={shmooPoints.slice(0, 5)} />
            
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Connect your Ethereum wallet to start generating Shmoo points and track your clicking progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;