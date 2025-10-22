import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';

interface HumanVerificationProps {
  program: Program;
}

interface HumanProofData {
  proofType: 'proofOfHumanity' | 'brightId' | 'gitcoinPassport';
  proofId: string;
  verifiedAt: number;
  verifier: PublicKey;
  expiresAt?: number;
}

export const HumanVerification: React.FC<HumanVerificationProps> = ({ program }) => {
  const { publicKey } = useWallet();
  const [selectedProofType, setSelectedProofType] = useState<'proofOfHumanity' | 'brightId' | 'gitcoinPassport'>('proofOfHumanity');
  const [proofId, setProofId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  const handleVerifyIdentity = async () => {
    if (!publicKey || !proofId.trim()) {
      alert('Please connect wallet and provide proof ID');
      return;
    }

    setLoading(true);
    try {
      const proofData: HumanProofData = {
        proofType: selectedProofType,
        proofId: proofId.trim(),
        verifiedAt: Math.floor(Date.now() / 1000),
        verifier: publicKey, // In production, this would be a verified verifier
        expiresAt: selectedProofType === 'brightId' ? Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) : undefined // 1 year for BrightID
      };

      await program.methods
        .verifyHumanIdentity(proofData)
        .accounts({
          userProfile: PublicKey.default(), // Derive user profile PDA
          verifier: publicKey,
          user: publicKey,
        })
        .rpc();

      setVerificationStatus('Verification successful! Your reputation has been boosted.');
      setProofId('');
    } catch (error) {
      console.error('Error verifying identity:', error);
      setVerificationStatus('Verification failed: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const getProofTypeInstructions = (type: string) => {
    switch (type) {
      case 'proofOfHumanity':
        return {
          title: 'Proof of Humanity',
          description: 'Verify your identity using the Proof of Humanity registry',
          instructions: [
            '1. Visit proofofhumanity.id',
            '2. Submit your profile and video',
            '3. Get vouched for by existing users',
            '4. Once registered, copy your Ethereum address',
            '5. Paste the address below'
          ],
          placeholder: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          reputationBoost: '+100 reputation points'
        };
      case 'brightId':
        return {
          title: 'BrightID',
          description: 'Verify your unique human identity through social connections',
          instructions: [
            '1. Download the BrightID app',
            '2. Create your BrightID profile',
            '3. Connect with other verified users',
            '4. Get verified through social connections',
            '5. Copy your BrightID identifier'
          ],
          placeholder: 'brightid_identifier_here',
          reputationBoost: '+75 reputation points'
        };
      case 'gitcoinPassport':
        return {
          title: 'Gitcoin Passport',
          description: 'Verify your identity using Gitcoin Passport credentials',
          instructions: [
            '1. Visit passport.gitcoin.co',
            '2. Connect your wallet',
            '3. Complete verification stamps',
            '4. Build your passport score',
            '5. Copy your passport ID'
          ],
          placeholder: '123456789',
          reputationBoost: '+50 reputation points'
        };
      default:
        return {
          title: '',
          description: '',
          instructions: [],
          placeholder: '',
          reputationBoost: ''
        };
    }
  };

  const proofTypeInfo = getProofTypeInstructions(selectedProofType);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Human Identity Verification</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Verify your human identity to prevent capital concentration and gain reputation bonuses. 
          Choose your preferred verification method:
        </p>
        
        <div className="space-y-3">
          {[
            { value: 'proofOfHumanity', label: 'Proof of Humanity', icon: '👤' },
            { value: 'brightId', label: 'BrightID', icon: '🔗' },
            { value: 'gitcoinPassport', label: 'Gitcoin Passport', icon: '📜' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value={option.value}
                checked={selectedProofType === option.value}
                onChange={(e) => setSelectedProofType(e.target.value as any)}
                className="mr-3"
              />
              <span className="text-2xl mr-3">{option.icon}</span>
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500">
                  {getProofTypeInstructions(option.value).reputationBoost}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">{proofTypeInfo.title}</h3>
        <p className="text-blue-800 text-sm mb-3">{proofTypeInfo.description}</p>
        <div className="text-sm text-blue-700">
          <strong>Instructions:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {proofTypeInfo.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {selectedProofType === 'proofOfHumanity' ? 'Ethereum Address' : 
             selectedProofType === 'brightId' ? 'BrightID Identifier' : 
             'Passport ID'}
          </label>
          <input
            type="text"
            value={proofId}
            onChange={(e) => setProofId(e.target.value)}
            placeholder={proofTypeInfo.placeholder}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {verificationStatus && (
          <div className={`p-3 rounded-md ${
            verificationStatus.includes('successful') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {verificationStatus}
          </div>
        )}

        <button
          onClick={handleVerifyIdentity}
          disabled={loading || !proofId.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify Identity'}
        </button>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Why Verify Your Identity?</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Prevent capital concentration in few wallets</li>
          <li>• Gain reputation bonuses for predictions</li>
          <li>• Access to higher-stakes markets</li>
          <li>• Participate in governance with more weight</li>
          <li>• Build trust in the prediction market ecosystem</li>
        </ul>
      </div>
    </div>
  );
};







































