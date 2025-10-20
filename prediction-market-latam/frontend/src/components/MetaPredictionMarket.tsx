import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';

interface MetaPredictionMarketProps {
  program: Program;
  connection: Connection;
  parentMarket: PublicKey;
}

interface MediaAnalysisData {
  sentimentScore: number;
  biasDetection: string[];
  sourceCredibility: number;
  factCheckResults: FactCheckResult[];
  analysisTimestamp: number;
}

interface FactCheckResult {
  claim: string;
  verdict: 'True' | 'False' | 'Misleading' | 'Unverified';
  confidence: number;
  sources: string[];
}

export const MetaPredictionMarket: React.FC<MetaPredictionMarketProps> = ({ 
  program, 
  connection, 
  parentMarket 
}) => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [mediaAnalysis, setMediaAnalysis] = useState<MediaAnalysisData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [metaMarketData, setMetaMarketData] = useState({
    question: '',
    description: '',
    predictionType: 'MediaAccuracy' as 'MediaAccuracy' | 'PublicReaction' | 'MarketInfluence' | 'ExpertOpinion'
  });

  const analyzeMediaContent = async (content: string) => {
    setAnalyzing(true);
    try {
      // Simulate media analysis API call
      // In production, this would call a real media analysis service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: MediaAnalysisData = {
        sentimentScore: Math.floor(Math.random() * 21) - 10, // -10 to +10
        biasDetection: ['Political Bias', 'Confirmation Bias'],
        sourceCredibility: Math.floor(Math.random() * 41) + 60, // 60-100
        factCheckResults: [
          {
            claim: "Sample claim from content",
            verdict: 'True',
            confidence: 85,
            sources: ['reuters.com', 'ap.org']
          }
        ],
        analysisTimestamp: Math.floor(Date.now() / 1000)
      };
      
      setMediaAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Error analyzing media:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateMetaMarket = async () => {
    if (!publicKey || !metaMarketData.question) {
      alert('Please provide all required information');
      return;
    }

    setLoading(true);
    try {
      const metaData = {
        question: metaMarketData.question,
        description: metaMarketData.description,
        predictionType: metaMarketData.predictionType,
        mediaAnalysis: mediaAnalysis
      };

      // Generate meta market PDA
      const [metaMarketPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('meta_market'), 
          parentMarket.toBuffer(), 
          Buffer.from(metaMarketData.question)
        ],
        program.programId
      );

      await program.methods
        .createMetaPrediction(parentMarket, metaData)
        .accounts({
          parentMarketAccount: parentMarket,
          metaMarket: metaMarketPda,
          userProfile: PublicKey.default(), // Derive user profile PDA
          creator: publicKey,
          systemProgram: PublicKey.default()
        })
        .rpc();

      alert('Meta-prediction market created successfully!');
      
      // Reset form
      setMetaMarketData({
        question: '',
        description: '',
        predictionType: 'MediaAccuracy'
      });
      setMediaAnalysis(null);
      
    } catch (error) {
      console.error('Error creating meta market:', error);
      alert('Failed to create meta-prediction market: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const getPredictionTypeDescription = (type: string) => {
    switch (type) {
      case 'MediaAccuracy':
        return 'Predict whether media will report accurately on the parent market outcome';
      case 'PublicReaction':
        return 'Predict how the public will react to the parent market outcome';
      case 'MarketInfluence':
        return 'Predict how this meta-prediction will influence the parent market';
      case 'ExpertOpinion':
        return 'Predict what experts think about the parent market topic';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Meta-Prediction Market</h2>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">What are Meta-Predictions?</h3>
        <p className="text-blue-800 text-sm">
          Meta-predictions allow you to bet on how other aspects (media, public reaction, expert opinion) 
          will behave regarding the parent market. This creates a layered prediction ecosystem.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prediction Type
          </label>
          <select
            value={metaMarketData.predictionType}
            onChange={(e) => setMetaMarketData({
              ...metaMarketData, 
              predictionType: e.target.value as any
            })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="MediaAccuracy">Media Accuracy</option>
            <option value="PublicReaction">Public Reaction</option>
            <option value="MarketInfluence">Market Influence</option>
            <option value="ExpertOpinion">Expert Opinion</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">
            {getPredictionTypeDescription(metaMarketData.predictionType)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta-Prediction Question *
          </label>
          <input
            type="text"
            value={metaMarketData.question}
            onChange={(e) => setMetaMarketData({...metaMarketData, question: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder={
              metaMarketData.predictionType === 'MediaAccuracy' 
                ? "Will major news outlets accurately report on this market's outcome?"
                : metaMarketData.predictionType === 'PublicReaction'
                ? "How will social media react to this market's resolution?"
                : metaMarketData.predictionType === 'MarketInfluence'
                ? "Will this meta-prediction influence the parent market's outcome?"
                : "What do experts think about this market's topic?"
            }
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={metaMarketData.description}
            onChange={(e) => setMetaMarketData({...metaMarketData, description: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed description of what this meta-prediction is about..."
            rows={3}
            maxLength={500}
          />
        </div>

        {metaMarketData.predictionType === 'MediaAccuracy' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Content to Analyze
            </label>
            <textarea
              placeholder="Paste news articles, social media posts, or other media content to analyze..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={4}
              onChange={(e) => {
                if (e.target.value.length > 100) {
                  analyzeMediaContent(e.target.value);
                }
              }}
            />
            
            {analyzing && (
              <div className="mt-2 text-sm text-blue-600">
                Analyzing media content...
              </div>
            )}
            
            {mediaAnalysis && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Media Analysis Results</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Sentiment:</strong> {mediaAnalysis.sentimentScore > 0 ? '+' : ''}{mediaAnalysis.sentimentScore}/10
                  </div>
                  <div>
                    <strong>Credibility:</strong> {mediaAnalysis.sourceCredibility}%
                  </div>
                  <div className="col-span-2">
                    <strong>Bias Detected:</strong> {mediaAnalysis.biasDetection.join(', ')}
                  </div>
                  <div className="col-span-2">
                    <strong>Fact Check:</strong> {mediaAnalysis.factCheckResults[0]?.verdict} 
                    (Confidence: {mediaAnalysis.factCheckResults[0]?.confidence}%)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleCreateMetaMarket}
        disabled={loading || !metaMarketData.question}
        className="w-full mt-6 bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Meta-Market...' : 'Create Meta-Prediction Market'}
      </button>

      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">Meta-Prediction Benefits</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Create layered prediction markets for complex topics</li>
          <li>• Analyze media bias and public sentiment</li>
          <li>• Predict market influence and expert opinions</li>
          <li>• Build reputation through accurate meta-predictions</li>
          <li>• Contribute to media literacy and fact-checking</li>
        </ul>
      </div>
    </div>
  );
};
























