import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GraduationCap, Shield, Search, FileCheck, ClipboardList } from 'lucide-react';
import { initializeBlockchain, getWalletAddress } from './utils/blockchain';
import Home from './pages/Home';
import IssueDiploma from './pages/IssueDiploma';
import VerifyDiploma from './pages/VerifyDiploma';
import AdminPanel from './pages/AdminPanel';
import DiplomaManagement from './pages/DiplomaManagement';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const connected = await initializeBlockchain();
        setWalletConnected(connected);
        
        if (connected) {
          const address = await getWalletAddress();
          setWalletAddress(address);
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    connectWallet();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
        <nav className="bg-indigo-800 text-white shadow-lg">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap size={28} />
              <span className="text-xl font-bold">DiploChain</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link>
              <Link to="/issue" className="hover:text-indigo-200 transition-colors">Issue Diploma</Link>
              <Link to="/verify" className="hover:text-indigo-200 transition-colors">Verify Diploma</Link>
              <Link to="/manage" className="hover:text-indigo-200 transition-colors">Manage Diplomas</Link>
              <Link to="/admin" className="hover:text-indigo-200 transition-colors">Admin</Link>
              {walletConnected ? (
                <div className="bg-indigo-700 px-4 py-2 rounded-full flex items-center">
                  <Shield size={16} className="mr-2" />
                  <span className="text-sm truncate w-24">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                </div>
              ) : (
                <button 
                  onClick={initializeBlockchain}
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : !walletConnected ? (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
              <Shield size={48} className="mx-auto text-indigo-600 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Wallet Connection Required</h2>
              <p className="mb-6 text-gray-600">
                Please connect your Ethereum wallet (like MetaMask) to use this application.
              </p>
              <button 
                onClick={initializeBlockchain}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/issue" element={<IssueDiploma />} />
              <Route path="/verify" element={<VerifyDiploma />} />
              <Route path="/manage" element={<DiplomaManagement />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          )}
        </div>

        <footer className="bg-indigo-900 text-white py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <GraduationCap size={24} />
                  <span className="text-lg font-bold">DiploChain</span>
                </div>
                <p className="text-indigo-200 mt-2">Secure Diploma Verification on Blockchain</p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">About</a>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div className="mt-8 text-center text-indigo-300 text-sm">
              &copy; {new Date().getFullYear()} DiploChain. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;