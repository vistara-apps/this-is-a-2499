import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import StatsDisplay from './components/StatsDisplay';
import ShmooButton from './components/ShmooButton';
import TransactionStatus from './components/TransactionStatus';

function App() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  // User state
  const [totalClicks, setTotalClicks] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [lastClickTimestamp, setLastClickTimestamp] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user data from localStorage on wallet connection
  useEffect(() => {
    if (address) {
      const userData = localStorage.getItem(`shmoo_user_${address}`);
      if (userData) {
        const parsed = JSON.parse(userData);
        setTotalClicks(parsed.totalClicks || 0);
        setStreakCount(parsed.streakCount || 0);
        setLastClickTimestamp(parsed.lastClickTimestamp || null);
      }
    }
  }, [address]);

  // Save user data to localStorage
  const saveUserData = (data) => {
    if (address) {
      localStorage.setItem(`shmoo_user_${address}`, JSON.stringify(data));
    }
  };

  // Calculate streak based on timing
  const calculateStreak = () => {
    if (!lastClickTimestamp) return 1;
    
    const now = Date.now();
    const lastClick = new Date(lastClickTimestamp).getTime();
    const timeDiff = now - lastClick;
    
    // If clicked within 24 hours, maintain/increase streak
    // If more than 24 hours, reset streak
    return timeDiff <= 24 * 60 * 60 * 1000 ? streakCount + 1 : 1;
  };

  // Simulate transaction to Ethereum mainnet
  const simulateTransaction = async () => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Generate mock transaction hash
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        resolve(mockTxHash);
      }, 1500 + Math.random() * 2000); // 1.5-3.5 second delay
    });
  };

  // Handle Shmoo point generation
  const handleGenerateShmoo = async () => {
    if (!isConnected || !walletClient) {
      alert('Please connect your wallet first!');
      return;
    }

    setIsGenerating(true);
    setTransactionHash(null);
    setShowSuccess(false);

    try {
      // Simulate sending transaction to Ethereum mainnet
      console.log('Initiating Shmoo point generation transaction...');
      
      const txHash = await simulateTransaction();
      
      // Update user stats
      const newTotalClicks = totalClicks + 1;
      const newStreakCount = calculateStreak();
      const newLastClickTimestamp = new Date().toISOString();
      
      setTotalClicks(newTotalClicks);
      setStreakCount(newStreakCount);
      setLastClickTimestamp(newLastClickTimestamp);
      setTransactionHash(txHash);
      setShowSuccess(true);

      // Save to localStorage
      saveUserData({
        totalClicks: newTotalClicks,
        streakCount: newStreakCount,
        lastClickTimestamp: newLastClickTimestamp
      });

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="w-full max-w-md mx-auto bg-surface shadow-card">
        <Header />
        <Disclaimer />
        
        <div className="px-4 py-6 space-y-6">
          {!isConnected ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Connect Your Wallet
              </h2>
              <p className="text-sm text-gray-600">
                Connect your Ethereum wallet to start generating Shmoo points
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          ) : (
            <>
              <StatsDisplay 
                totalClicks={totalClicks}
                streakCount={streakCount}
                lastClickTimestamp={lastClickTimestamp}
              />
              
              <ShmooButton 
                onClick={handleGenerateShmoo}
                isGenerating={isGenerating}
                disabled={isGenerating}
              />
              
              <TransactionStatus 
                isGenerating={isGenerating}
                transactionHash={transactionHash}
                showSuccess={showSuccess}
              />
              
              <div className="flex justify-center pt-4">
                <ConnectButton showBalance={false} chainStatus="icon" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;