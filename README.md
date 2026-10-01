# DiploChain - Blockchain Diploma Verification System

DiploChain is a decentralized application (dApp) for issuing, managing, and verifying academic diplomas using blockchain technology and IPFS.

## Features

- **Blockchain-based Verification**: Securely store diploma records on the Ethereum blockchain
- **IPFS Document Storage**: Store actual diploma documents on IPFS for decentralized access
- **University Management**: Authorize and manage universities that can issue diplomas
- **Diploma Management**: Issue, track, and revoke diplomas with complete audit trail
- **MongoDB Integration**: Store additional metadata and improve query performance
- **Responsive UI**: Modern, responsive interface built with React and Tailwind CSS

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, Solidity Smart Contracts
- **Storage**: IPFS for document storage
- **Database**: MongoDB for metadata and improved querying
- **Backend**: Express.js, Node.js

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB installed locally or a MongoDB Atlas account
- MetaMask browser extension
- Ethereum testnet account with test ETH (Sepolia or Goerli recommended)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/diploma-verification-dapp.git
   cd diploma-verification-dapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017/diplochaindb
     CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
     IPFS_PROJECT_ID=your_infura_ipfs_project_id
     IPFS_PROJECT_SECRET=your_infura_ipfs_project_secret
     ```

4. Deploy the smart contract:
   - Deploy the `DiplomaVerification.sol` contract to your preferred Ethereum testnet
   - Update the `CONTRACT_ADDRESS` in your `.env` file with the deployed contract address

### Running the Application

1. Start the MongoDB server (if running locally):
   ```
   mongod
   ```

2. Start the backend server:
   ```
   npm run server
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Admin Panel

- Authorize universities to issue diplomas
- Manage university accounts (activate/deactivate)
- View system statistics

### Issuing Diplomas

- Fill in student and diploma details
- Upload the diploma document (PDF)
- Issue the diploma on the blockchain
- View all issued diplomas

### Verifying Diplomas

- Enter the diploma hash
- View verification results and diploma details
- Access the original diploma document

### Managing Diplomas

- View all issued diplomas
- Revoke diplomas if necessary
- Search and filter diplomas

## Smart Contract

The `DiplomaVerification.sol` contract handles:

- University authorization
- Diploma issuance
- Diploma verification
- Diploma revocation

## License

This project is licensed under the MIT License - see the LICENSE file for details.