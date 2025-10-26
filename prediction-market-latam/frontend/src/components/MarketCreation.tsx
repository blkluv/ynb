import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';

interface MarketCreationProps {
  program: Program;
  connection: Connection;
}

interface EvidenceRequirements {
  minEvidenceCount: number;
  requiredTypes: string[];
  oracleRequired: boolean;
  scientificPeerReview: boolean;
  governmentSourceRequired: boolean;
}

export const MarketCreation: React.FC<MarketCreationProps> = ({ program, connection }) => {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const [marketData, setMarketData] = useState({
    question: '',
    description: '',
    category: '',
    resolutionDate: '',
    initialLiquidity: 0
  });

  const [evidenceRequirements, setEvidenceRequirements] = useState<EvidenceRequirements>({
    minEvidenceCount: 1,
    requiredTypes: ['Scientific'],
    oracleRequired: false,
    scientificPeerReview: false,
    governmentSourceRequired: false
  });

  const handleCreateMarket = async () => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet');
      return;
    }

    setLoading(true);

    try {
      // Convert form data to program format
      const marketDataProgram = {
        question: marketData.question,
        description: marketData.description,
        category: marketData.category,
        resolutionDate: Math.floor(new Date(marketData.resolutionDate).getTime() / 1000),
        initialLiquidity: marketData.initialLiquidity * 1_000_000 // Convert to lamports
      };

      const evidenceRequirementsProgram = {
        minEvidenceCount: evidenceRequirements.minEvidenceCount,
        requiredTypes: evidenceRequirements.requiredTypes.map(type => {
          switch(type) {
            case 'Scientific': return { scientific: {} };
            case 'Governmental': return { governmental: {} };
            case 'Media': return { media: {} };
            case 'Community': return { community: {} };
            case 'ChainlinkOracle': return { chainlinkOracle: {} };
            default: return { community: {} };
          }
        }),
        oracleRequired: evidenceRequirements.oracleRequired,
        scientificPeerReview: evidenceRequirements.scientificPeerReview,
        governmentSourceRequired: evidenceRequirements.governmentSourceRequired
      };

      // Generate market PDA
      const [marketPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('market'), Buffer.from(marketData.question)],
        program.programId
      );

      // Create the market
      const tx = await program.methods
        .createMarket(marketDataProgram, evidenceRequirementsProgram)
        .accounts({
          market: marketPda,
          userProfile: PublicKey.default(), // You'll need to derive this
          creator: publicKey,
          systemProgram: PublicKey.default()
        })
        .rpc();

      console.log('Market created:', tx);
      alert('Market created successfully!');

    } catch (error) {
      console.error('Error creating market:', error);
      alert('Failed to create market: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">Create Prediction Market</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Question *
          </label>
          <input
            type="text"
            value={marketData.question}
            onChange={(e) => setMarketData({...marketData, question: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Will the new infrastructure bill pass in 2024?"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={marketData.description}
            onChange={(e) => setMarketData({...marketData, description: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description of what this market is predicting..."
            rows={4}
            maxLength={500}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={marketData.category}
            onChange={(e) => setMarketData({...marketData, category: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Social">Social</option>
            <option value="Economics">Economics</option>
            <option value="Technology">Technology</option>
            <option value="Environment">Environment</option>
            <option value="Health">Health</option>
            <option value="Sports">Sports</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Resolution Date *
          </label>
          <input
            type="datetime-local"
            value={marketData.resolutionDate}
            onChange={(e) => setMarketData({...marketData, resolutionDate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Initial Liquidity (SOL)
          </label>
          <input
            type="number"
            value={marketData.initialLiquidity}
            onChange={(e) => setMarketData({...marketData, initialLiquidity: parseFloat(e.target.value) || 0})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="0.1"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Evidence Requirements</h3>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Minimum Evidence Count
            </label>
            <input
              type="number"
              value={evidenceRequirements.minEvidenceCount}
              onChange={(e) => setEvidenceRequirements({
                ...evidenceRequirements,
                minEvidenceCount: parseInt(e.target.value) || 1
              })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              min="1"
              max="10"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Required Evidence Types
            </label>
            <div className="space-y-2">
              {['Scientific', 'Governmental', 'Media', 'Community', 'ChainlinkOracle'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={evidenceRequirements.requiredTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEvidenceRequirements({
                          ...evidenceRequirements,
                          requiredTypes: [...evidenceRequirements.requiredTypes, type]
                        });
                      } else {
                        setEvidenceRequirements({
                          ...evidenceRequirements,
                          requiredTypes: evidenceRequirements.requiredTypes.filter(t => t !== type)
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={evidenceRequirements.oracleRequired}
                onChange={(e) => setEvidenceRequirements({
                  ...evidenceRequirements,
                  oracleRequired: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm">Oracle Required</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={evidenceRequirements.scientificPeerReview}
                onChange={(e) => setEvidenceRequirements({
                  ...evidenceRequirements,
                  scientificPeerReview: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm">Scientific Peer Review Required</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={evidenceRequirements.governmentSourceRequired}
                onChange={(e) => setEvidenceRequirements({
                  ...evidenceRequirements,
                  governmentSourceRequired: e.target.checked
                })}
                className="mr-2"
              />
              <span className="text-sm">Government Source Required</span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleCreateMarket}
        disabled={loading || !marketData.question || !marketData.resolutionDate}
        className="w-full px-4 py-3 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Market...' : 'Create Market'}
      </button>
    </div>
  );
};







































