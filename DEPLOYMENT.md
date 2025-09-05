# Deployment Guide 🚀

This guide covers deploying the Shmoo Clicker application to production.

## 📋 Pre-Deployment Checklist

### 1. Smart Contract Deployment
- [ ] Deploy `ShmooPoints.sol` to Sepolia testnet
- [ ] Test all contract functions thoroughly
- [ ] Deploy to Ethereum mainnet
- [ ] Update contract addresses in `src/contracts/ShmooPointsABI.ts`
- [ ] Verify contracts on Etherscan

### 2. Environment Configuration
- [ ] Obtain Alchemy API key for mainnet
- [ ] Get WalletConnect Project ID
- [ ] Set up environment variables
- [ ] Test with testnet first

### 3. Application Testing
- [ ] Test wallet connections
- [ ] Verify transaction flows
- [ ] Test on mobile devices
- [ ] Check error handling
- [ ] Validate responsive design

## 🔧 Environment Variables

### Required for Production
```env
VITE_ALCHEMY_API_KEY=your_mainnet_alchemy_key
VITE_NETWORK=mainnet
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_SHMOO_CONTRACT_MAINNET=0xYourDeployedContractAddress
```

### Optional
```env
VITE_APP_NAME=Shmoo Clicker
VITE_APP_DESCRIPTION=Click your way to verifiable digital points
```

## 🌐 Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and connect
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required variables
   - Set for Production environment

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Deploy via CLI**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli
   
   # Login and deploy
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Configure Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add all required variables

### GitHub Pages

1. **Build and Deploy**
   ```bash
   npm run build
   
   # Deploy to gh-pages branch
   npx gh-pages -d dist
   ```

2. **Configure Repository**
   - Go to Repository Settings → Pages
   - Set source to `gh-pages` branch
   - Configure custom domain if needed

## 🔐 Smart Contract Deployment

### Using Hardhat

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
   ```

2. **Create Hardhat Config**
   ```javascript
   // hardhat.config.js
   require("@nomiclabs/hardhat-ethers");
   
   module.exports = {
     solidity: "0.8.19",
     networks: {
       sepolia: {
         url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
         accounts: [process.env.PRIVATE_KEY]
       },
       mainnet: {
         url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
         accounts: [process.env.PRIVATE_KEY]
       }
     }
   };
   ```

3. **Deploy Script**
   ```javascript
   // scripts/deploy.js
   async function main() {
     const ShmooPoints = await ethers.getContractFactory("ShmooPoints");
     const shmooPoints = await ShmooPoints.deploy();
     await shmooPoints.deployed();
     
     console.log("ShmooPoints deployed to:", shmooPoints.address);
   }
   
   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

4. **Deploy to Networks**
   ```bash
   # Deploy to Sepolia testnet
   npx hardhat run scripts/deploy.js --network sepolia
   
   # Deploy to mainnet (after testing)
   npx hardhat run scripts/deploy.js --network mainnet
   ```

### Using Foundry

1. **Install Foundry**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Deploy**
   ```bash
   # Deploy to Sepolia
   forge create --rpc-url https://eth-sepolia.g.alchemy.com/v2/$ALCHEMY_API_KEY \
     --private-key $PRIVATE_KEY \
     contracts/ShmooPoints.sol:ShmooPoints
   
   # Deploy to mainnet
   forge create --rpc-url https://eth-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY \
     --private-key $PRIVATE_KEY \
     contracts/ShmooPoints.sol:ShmooPoints
   ```

## 📊 Post-Deployment

### 1. Update Contract Addresses
```typescript
// src/contracts/ShmooPointsABI.ts
export const CONTRACT_ADDRESSES = {
  mainnet: '0xYourMainnetContractAddress',
  sepolia: '0xYourSepoliaContractAddress',
} as const;
```

### 2. Verify Contracts
```bash
# Verify on Etherscan
npx hardhat verify --network mainnet 0xYourContractAddress
```

### 3. Test Production App
- [ ] Connect different wallets
- [ ] Generate Shmoo points
- [ ] Verify transactions on Etherscan
- [ ] Test error scenarios
- [ ] Check mobile responsiveness

### 4. Monitor Application
- Set up error tracking (Sentry, LogRocket)
- Monitor transaction success rates
- Track user engagement metrics
- Monitor gas usage patterns

## 🔍 Troubleshooting

### Common Issues

1. **Contract Address Not Set**
   - Error: "Contract address is 0x000..."
   - Solution: Update CONTRACT_ADDRESSES with deployed addresses

2. **Alchemy API Limits**
   - Error: Rate limiting or quota exceeded
   - Solution: Upgrade Alchemy plan or implement request caching

3. **Wallet Connection Issues**
   - Error: "Wallet not connected"
   - Solution: Check WalletConnect project ID and network configuration

4. **Transaction Failures**
   - Error: "Transaction failed"
   - Solution: Check gas limits, network congestion, and contract state

### Debug Mode
Enable debug logging:
```typescript
// Add to blockchainService.ts
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

if (DEBUG) {
  console.log('Transaction details:', { hash, receipt });
}
```

## 📈 Performance Optimization

### 1. Bundle Optimization
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wallet: ['@rainbow-me/rainbowkit', 'wagmi', 'viem']
        }
      }
    }
  }
});
```

### 2. Caching Strategy
- Enable CDN caching for static assets
- Implement service worker for offline functionality
- Cache contract read calls locally

### 3. Loading Performance
- Lazy load wallet connections
- Preload critical resources
- Optimize image assets

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use secure environment variable storage
- Rotate API keys regularly

### 2. Smart Contract Security
- Audit contract code
- Use established patterns
- Implement proper access controls
- Test edge cases thoroughly

### 3. Frontend Security
- Validate all user inputs
- Sanitize displayed data
- Use HTTPS everywhere
- Implement CSP headers

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section
2. Review environment variable configuration
3. Verify smart contract deployment
4. Test on testnet first
5. Check network status and gas prices

---

**Happy Deploying! 🎉**
