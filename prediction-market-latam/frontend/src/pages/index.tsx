import React, { useState, useEffect } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { MarketCreation } from '../components/MarketCreation';
import { GovernancePanel } from '../components/GovernancePanel';
import { HumanVerification } from '../components/HumanVerification';
import { MetaPredictionMarket } from '../components/MetaPredictionMarket';

// Import the generated IDL
import idl from '../idl/prediction_market.json';

require('@solana/wallet-adapter-react-ui/styles.css');

const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

// Configure wallets
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'markets' | 'governance' | 'verification' | 'meta'>('markets');
  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [connection, setConnection] = useState<any>(null);

  useEffect(() => {
    const initProgram = async () => {
      try {
        // Initialize connection
        const conn = new Connection(endpoint, 'confirmed');
        setConnection(conn);

        // Initialize program (this would be done after wallet connection)
        // For now, we'll set it to null and initialize when wallet connects
        setProgram(null);
      } catch (error) {
        console.error('Error initializing program:', error);
      }
    };

    initProgram();
  }, []);

  const renderActiveTab = () => {
    if (!program || !connection) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your Solana wallet to access the prediction market platform.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'markets':
        return <MarketCreation program={program} connection={connection} />;
      case 'governance':
        return <GovernancePanel program={program} connection={connection} />;
      case 'verification':
        return <HumanVerification program={program} />;
      case 'meta':
        return <MetaPredictionMarket program={program} connection={connection} parentMarket={PublicKey.default()} />;
      default:
        return <MarketCreation program={program} connection={connection} />;
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Prediction Market LATAM
                    </h1>
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      v0.1.0
                    </span>
                  </div>
                  
                  {/* Wallet Connection Button */}
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Cypherpunk Hackathon 2025
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8">
                  {[
                    { id: 'markets', label: 'Create Markets', icon: '📊' },
                    { id: 'governance', label: 'Governance', icon: '🗳️' },
                    { id: 'verification', label: 'Human Verification', icon: '👤' },
                    { id: 'meta', label: 'Meta-Predictions', icon: '🔮' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8">
              {renderActiveTab()}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
              <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Features</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Dynamic Blacklist DAO</li>
                      <li>• Evidence-Based Markets</li>
                      <li>• Proof of Humanity</li>
                      <li>• Meta-Predictions</li>
                      <li>• Three-Layer Moderation</li>
                      <li>• Emergency Multisig</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Technology</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Solana Blockchain</li>
                      <li>• Anchor Framework</li>
                      <li>• Chainlink Oracles</li>
                      <li>• Next.js Frontend</li>
                      <li>• TypeScript</li>
                      <li>• Rust Smart Contracts</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Governance</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Community Voting</li>
                      <li>• Reputation System</li>
                      <li>• Trusted Entities</li>
                      <li>• Transparent Decisions</li>
                      <li>• Emergency Controls</li>
                      <li>• Anti-Sybil Protection</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                  <p>
                    Built for social accountability in Latin America • 
                    Cypherpunk Hackathon 2025 • 
                    MIT License
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}




































