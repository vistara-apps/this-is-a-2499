import { 
  createPublicClient, 
  createWalletClient, 
  custom, 
  http, 
  parseAbiItem,
  type WalletClient,
  type PublicClient,
  type Hash,
  type Address
} from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { SHMOO_POINTS_ABI, CONTRACT_ADDRESSES, type ShmooPoint } from '../contracts/ShmooPointsABI';

// Environment configuration
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || 'demo';
const NETWORK = import.meta.env.VITE_NETWORK || 'sepolia';

// Chain configuration
const CHAIN_CONFIG = {
  mainnet: {
    chain: mainnet,
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    contractAddress: CONTRACT_ADDRESSES.mainnet
  },
  sepolia: {
    chain: sepolia,
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    contractAddress: CONTRACT_ADDRESSES.sepolia
  }
};

const currentConfig = CHAIN_CONFIG[NETWORK as keyof typeof CHAIN_CONFIG] || CHAIN_CONFIG.sepolia;

export class BlockchainService {
  private publicClient: PublicClient;
  private contractAddress: Address;

  constructor() {
    // Create public client for reading blockchain data
    this.publicClient = createPublicClient({
      chain: currentConfig.chain,
      transport: http(currentConfig.rpcUrl)
    });
    
    this.contractAddress = currentConfig.contractAddress as Address;
  }

  /**
   * Generate a Shmoo point on-chain
   */
  async generateShmooPoint(walletClient: WalletClient): Promise<Hash> {
    if (!walletClient.account) {
      throw new Error('Wallet not connected');
    }

    try {
      // For demo purposes, if contract address is not set, simulate transaction
      if (this.contractAddress === '0x0000000000000000000000000000000000000000') {
        return this.simulateTransaction();
      }

      const hash = await walletClient.writeContract({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        functionName: 'generateShmooPoint',
        account: walletClient.account
      });

      return hash;
    } catch (error) {
      console.error('Error generating Shmoo point:', error);
      throw new Error('Failed to generate Shmoo point. Please try again.');
    }
  }

  /**
   * Get user's total point count from contract
   */
  async getUserPointCount(userAddress: Address): Promise<number> {
    try {
      // For demo purposes, if contract address is not set, return mock data
      if (this.contractAddress === '0x0000000000000000000000000000000000000000') {
        return this.getMockUserPointCount(userAddress);
      }

      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        functionName: 'getUserPointCount',
        args: [userAddress]
      });

      return Number(result);
    } catch (error) {
      console.error('Error fetching user point count:', error);
      return 0;
    }
  }

  /**
   * Get user's points from contract
   */
  async getUserPoints(userAddress: Address): Promise<ShmooPoint[]> {
    try {
      // For demo purposes, if contract address is not set, return mock data
      if (this.contractAddress === '0x0000000000000000000000000000000000000000') {
        return this.getMockUserPoints(userAddress);
      }

      const result = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        functionName: 'getUserPoints',
        args: [userAddress]
      });

      return result as ShmooPoint[];
    } catch (error) {
      console.error('Error fetching user points:', error);
      return [];
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(hash: Hash): Promise<boolean> {
    try {
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
        timeout: 60_000 // 60 seconds timeout
      });

      return receipt.status === 'success';
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      return false;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(hash: Hash) {
    try {
      return await this.publicClient.getTransaction({ hash });
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  /**
   * Listen for ShmooPointGenerated events
   */
  async watchShmooPointEvents(
    userAddress: Address,
    onEvent: (event: any) => void
  ) {
    try {
      // For demo purposes, if contract address is not set, skip event watching
      if (this.contractAddress === '0x0000000000000000000000000000000000000000') {
        return () => {}; // Return empty unwatch function
      }

      const unwatch = this.publicClient.watchContractEvent({
        address: this.contractAddress,
        abi: SHMOO_POINTS_ABI,
        eventName: 'ShmooPointGenerated',
        args: { user: userAddress },
        onLogs: (logs) => {
          logs.forEach(onEvent);
        }
      });

      return unwatch;
    } catch (error) {
      console.error('Error watching events:', error);
      return () => {};
    }
  }

  /**
   * Get current network info
   */
  getNetworkInfo() {
    return {
      name: currentConfig.chain.name,
      id: currentConfig.chain.id,
      contractAddress: this.contractAddress,
      explorerUrl: currentConfig.chain.blockExplorers?.default?.url
    };
  }

  // Mock functions for demo purposes
  private async simulateTransaction(): Promise<Hash> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock transaction hash
    const mockHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
    return mockHash as Hash;
  }

  private getMockUserPointCount(userAddress: Address): number {
    // Return mock data based on localStorage for consistency
    const savedStats = localStorage.getItem(`shmoo_stats_${userAddress}`);
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      return stats.totalClicks || 0;
    }
    return 0;
  }

  private getMockUserPoints(userAddress: Address): ShmooPoint[] {
    // Return mock data based on localStorage for consistency
    const savedPoints = localStorage.getItem(`shmoo_points_${userAddress}`);
    if (savedPoints) {
      const points = JSON.parse(savedPoints);
      return points.map((point: any) => ({
        user: point.userAddress,
        timestamp: BigInt(point.timestamp),
        pointId: BigInt(point.pointId?.split('_')[0] || Date.now())
      }));
    }
    return [];
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
