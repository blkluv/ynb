import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { MarketCreation } from '../components/MarketCreation';
import { GovernancePanel } from '../components/GovernancePanel';
import { HumanVerification } from '../components/HumanVerification';
import { MetaPredictionMarket } from '../components/MetaPredictionMarket';

import idl from '../idl/prediction_market.json';

require('@solana/wallet-adapter-react-ui/styles.css');

const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

// Helper component to initialise the program once the wallet is connected
function AppContent() {
  const { connected, publicKey, wallet } = useWallet();
  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [activeTab, setActiveTab] = useState<'markets' | 'governance' | 'verification' | 'meta'>('markets');

  // Create a persistent connection
  useEffect(() => {
    const conn = new Connection(endpoint, 'confirmed');
    setConnection(conn);
  }, []);

  // When wallet connects, initialise the Anchor program
  useEffect(() => {
    if (!connected || !publicKey || !connection || !wallet) {
      setProgram(null);
      return;
    }

    const initProgram = async () => {
      try {
        // @ts-expect-error - wallet adapter type mismatch
        const provider = new AnchorProvider(connection, wallet, {
          preflightCommitment: 'confirmed',
        });
        const programInstance = new Program(idl as Idl, provider);
        setProgram(programInstance);
      } catch (error) {
        console.error('Failed to initialise program:', error);
        setProgram(null);
      }
    };

    initProgram();
  }, [connected, publicKey, connection, wallet]);

  const renderActiveTab = () => {
    if (!program || !connection) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Connect Your Account</h2>
          <p className="text-gray-600">
            Click the button above to get started – it’s free and takes a second.
          </p>
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
        return (
          <MetaPredictionMarket
            program={program}
            connection={connection}
            parentMarket={PublicKey.default()} // replace with actual logic
          />
        );
      default:
        return <MarketCreation program={program} connection={connection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Prediction Market TikTok
              </h1>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                v0.1.0
              </span>
            </div>
            {/* Wallet connection button is injected by the modal */}
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
      <main className="max-w-7xl mx-auto py-8">{renderActiveTab()}</main>

      {/* Footer – simplified, no blockchain jargon */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Community‑driven moderation</li>
                <li>• Evidence‑based markets</li>
                <li>• Real‑person verification</li>
                <li>• Smart market rankings</li>
                <li>• Three‑layer safety checks</li>
                <li>• Emergency pause</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Built for Everyone</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• No crypto knowledge required</li>
                <li>• Simple, visual interface</li>
                <li>• Transparent and fair</li>
                <li>• Mobile‑friendly</li>
                <li>• Instant setup</li>
                <li>• Free to start</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Community Governance</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Vote on market rules</li>
                <li>• Reputation system</li>
                <li>• Trusted advisors</li>
                <li>• Open decision‑making</li>
                <li>• Emergency controls</li>
                <li>• Anti‑bot protection</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              Built for social accountability • PredicTok.fun 2025 • MIT License
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
