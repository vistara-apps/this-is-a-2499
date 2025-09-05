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
    <div className="min-h-screen bg-gradient-to-br from-bg via-blue-50 to-purple-50 w-full">
      {/* Disclaimer Banner */}
      <DisclaimerBanner />
      
      {/* Main Content */}
      <div className="w-full px-6 py-8 max-w-lg mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Shmoo Clicker
          </h1>
          <p className="text-base text-gray-600 max-w-sm mx-auto leading-relaxed">
            🎯 Click your way to verifiable digital points on the blockchain
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-10 flex justify-center">
          <div className="transform transition-all duration-200 hover:scale-105">
            <ConnectButton />
          </div>
        </div>

        {isConnected && address ? (
          <div className="space-y-8">
            
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
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-semibold text-gray-700">Latest Transaction</p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3 border">
                    <code className="text-xs text-gray-600 break-all font-mono">
                      {lastTxHash}
                    </code>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ✅ Successfully recorded on blockchain
                  </p>
                </div>
              </div>
            )}

            {/* Transaction History */}
            <TransactionHistory points={shmooPoints.slice(0, 5)} />
            
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-10 border border-gray-200 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6">
              <AlertTriangle className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
              🔗 Connect your Ethereum wallet to start generating Shmoo points and track your clicking progress on the blockchain.
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure & Non-custodial</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Works with MetaMask, Coinbase & more</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
