# Shmoo Clicker 🎯

**Click your way to verifiable digital points.**

A Base Mini App that allows users to generate non-transferable Shmoo points by clicking a button, with real on-chain verification on Ethereum mainnet.

⚠️ **WARNING: Shmoo points are non-transferable and have no monetary value.**

## 🌟 Features

### Core Features
- **🎯 Shmoo Point Generation**: Connect your Ethereum wallet and click to generate unique, on-chain, non-transferable Shmoo points
- **📊 Engagement Tracking**: Visual representation of click history, streaks, and daily activity
- **⛓️ On-Chain Verifiability**: Each point is recorded on Ethereum mainnet with unique identifiers
- **⚠️ Clear Value Disclaimer**: Prominent warning about the non-monetary nature of Shmoo points

### Technical Features
- **🔗 Multi-Chain Support**: Ethereum mainnet and Sepolia testnet
- **💳 Wallet Integration**: RainbowKit with support for MetaMask, Coinbase Wallet, WalletConnect, and more
- **🔄 Real-time Transaction Status**: Live updates on transaction pending/confirmed/failed states
- **📱 Responsive Design**: Mobile-first design optimized for all devices
- **💾 Local Storage**: Persistent user stats and transaction history

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Blockchain**: Viem + Wagmi + RainbowKit
- **Smart Contract**: Solidity ^0.8.19
- **API**: Alchemy for Ethereum interaction
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Ethereum wallet (MetaMask recommended)
- Alchemy API key (get from [dashboard.alchemy.com](https://dashboard.alchemy.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shmoo-clicker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
   VITE_NETWORK=sepolia
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 📋 Smart Contract

### ShmooPoints Contract

The `ShmooPoints.sol` contract handles:
- Non-transferable point generation
- User statistics tracking
- Event emission for off-chain indexing
- Gas-efficient storage patterns

### Contract Functions
- `generateShmooPoint()`: Creates a new Shmoo point for the caller
- `getUserPointCount(address)`: Returns total points for a user
- `getUserPoints(address)`: Returns all points for a user
- `getLatestUserPoint(address)`: Returns the most recent point

### Deployment

**Note**: The contract addresses in the code are currently placeholders. To deploy:

1. **Install Hardhat or Foundry**
2. **Deploy to testnet first**:
   ```bash
   # Example with Hardhat
   npx hardhat deploy --network sepolia
   ```
3. **Update contract addresses** in `src/contracts/ShmooPointsABI.ts`
4. **Deploy to mainnet** after thorough testing

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── DisclaimerBanner.tsx
│   ├── ShmooButton.tsx
│   ├── StatsDisplay.tsx
│   ├── TransactionHistory.tsx
│   └── TransactionStatus.tsx
├── contracts/           # Contract ABIs and addresses
│   └── ShmooPointsABI.ts
├── services/           # Business logic services
│   └── blockchainService.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

### Data Flow
1. User connects wallet via RainbowKit
2. Click triggers `generateShmooPoint()` in BlockchainService
3. Transaction is sent to Ethereum network
4. App waits for confirmation and updates UI
5. Local storage maintains user stats for quick access

## 🎨 Design System

### Colors
- **Primary**: `hsl(240 100% 50%)` - Blue
- **Accent**: `hsl(180 70% 50%)` - Cyan
- **Background**: `hsl(220 20% 98%)` - Light gray
- **Surface**: `hsl(255 100% 100%)` - White

### Typography
- **Display**: `text-3xl font-bold`
- **Body**: `text-base font-normal leading-6`
- **Caption**: `text-sm text-muted-foreground`

### Components
- Consistent border radius (4px, 8px, 12px)
- Subtle shadows and hover effects
- Responsive grid layouts
- Accessible color contrasts

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ALCHEMY_API_KEY` | Alchemy API key for Ethereum access | `demo` |
| `VITE_NETWORK` | Target network (mainnet/sepolia) | `sepolia` |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | Required |

### Network Configuration
The app supports multiple networks through the `blockchainService`:
- **Mainnet**: Production environment
- **Sepolia**: Testing environment

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Build first
npm run build

# Deploy dist/ folder to Netlify
```

### Environment Variables for Production
Set these in your deployment platform:
- `VITE_ALCHEMY_API_KEY`
- `VITE_NETWORK=mainnet`
- `VITE_WALLETCONNECT_PROJECT_ID`
- Contract addresses after deployment

## 🧪 Testing

### Manual Testing Checklist
- [ ] Wallet connection works across different wallets
- [ ] Shmoo point generation creates transactions
- [ ] Transaction status updates correctly
- [ ] Stats display updates after successful transactions
- [ ] Local storage persists data across sessions
- [ ] Responsive design works on mobile
- [ ] Error handling works for failed transactions

### Test Networks
Use Sepolia testnet for testing:
1. Get Sepolia ETH from faucets
2. Set `VITE_NETWORK=sepolia`
3. Deploy contract to Sepolia
4. Test all functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and experimental purposes. Shmoo points have no monetary value and are non-transferable.

## ⚠️ Disclaimers

- **No Monetary Value**: Shmoo points are explicitly non-transferable and have no inherent value
- **Experimental**: This is an experimental application for demonstration purposes
- **Gas Costs**: Users pay Ethereum gas fees for transactions
- **No Warranty**: Use at your own risk

## 🔗 Links

- [Alchemy Dashboard](https://dashboard.alchemy.com/)
- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [RainbowKit Documentation](https://rainbowkit.com/)
- [Viem Documentation](https://viem.sh/)

---

**Built with ❤️ for the Ethereum ecosystem**
