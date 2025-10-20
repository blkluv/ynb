import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';

interface GovernancePanelProps {
  program: Program;
  connection: Connection;
}

interface EligibilityVote {
  market: PublicKey;
  vote: boolean;
  reason: string;
  reputationWeight: number;
  votedAt: number;
}

interface ContentReport {
  market: PublicKey;
  reportType: string;
  reason: string;
  status: string;
  createdAt: number;
}

export const GovernancePanel: React.FC<GovernancePanelProps> = ({ program, connection }) => {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<'eligibility' | 'moderation' | 'emergency'>('eligibility');
  const [markets, setMarkets] = useState<any[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (publicKey) {
      fetchMarkets();
      fetchReports();
    }
  }, [publicKey]);

  const fetchMarkets = async () => {
    try {
      // Fetch all markets from the program
      const marketAccounts = await program.account.predictionMarket.all();
      setMarkets(marketAccounts.map(account => ({
        ...account.account,
        publicKey: account.publicKey
      })));
    } catch (error) {
      console.error('Error fetching markets:', error);
    }
  };

  const fetchReports = async () => {
    try {
      // Fetch all content reports
      const reportAccounts = await program.account.contentReport.all();
      setReports(reportAccounts.map(account => ({
        market: account.account.market,
        reportType: account.account.reportType,
        reason: account.account.reason,
        status: account.account.status,
        createdAt: account.account.createdAt
      })));
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleEligibilityVote = async (marketPublicKey: PublicKey, vote: boolean, reason: string) => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const [eligibilityRegistryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('eligibility'), marketPublicKey.toBuffer()],
        program.programId
      );

      const [eligibilityVotePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('eligibility_vote'), marketPublicKey.toBuffer(), publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .voteOnEligibility(vote, reason)
        .accounts({
          market: marketPublicKey,
          eligibilityRegistry: eligibilityRegistryPda,
          eligibilityVote: eligibilityVotePda,
          userProfile: PublicKey.default(), // Derive user profile PDA
          voter: publicKey,
          systemProgram: PublicKey.default()
        })
        .rpc();

      alert(`Vote submitted: ${vote ? 'ELIGIBLE' : 'NOT ELIGIBLE'}`);
      fetchMarkets();
    } catch (error) {
      console.error('Error voting on eligibility:', error);
      alert('Failed to submit vote: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentReport = async (marketPublicKey: PublicKey, reportType: string, reason: string) => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const [contentReportPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('content_report'), marketPublicKey.toBuffer(), publicKey.toBuffer()],
        program.programId
      );

      const reportTypeEnum = {
        automatic: {},
        community: {},
        legal: {}
      }[reportType.toLowerCase()];

      await program.methods
        .reportContent(reportTypeEnum, reason)
        .accounts({
          marketAccount: marketPublicKey,
          contentReport: contentReportPda,
          userProfile: PublicKey.default(), // Derive user profile PDA
          reporter: publicKey,
          market: marketPublicKey,
          systemProgram: PublicKey.default()
        })
        .rpc();

      alert('Content report submitted successfully');
      fetchReports();
    } catch (error) {
      console.error('Error reporting content:', error);
      alert('Failed to submit report: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyPause = async (marketPublicKey: PublicKey, reason: string) => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const [multisigGovernancePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('multisig_governance')],
        program.programId
      );

      const [emergencyActionPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('emergency_action'), marketPublicKey.toBuffer(), publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .emergencyPauseMarket(reason)
        .accounts({
          market: marketPublicKey,
          multisigGovernance: multisigGovernancePda,
          emergencyAction: emergencyActionPda,
          signer: publicKey,
          systemProgram: PublicKey.default()
        })
        .rpc();

      alert('Emergency pause initiated');
      fetchMarkets();
    } catch (error) {
      console.error('Error initiating emergency pause:', error);
      alert('Failed to initiate emergency pause: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Governance Panel</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('eligibility')}
          className={`pb-2 px-1 ${
            activeTab === 'eligibility' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Market Eligibility
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-2 px-1 ${
            activeTab === 'moderation' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Content Moderation
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`pb-2 px-1 ${
            activeTab === 'emergency' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Emergency Actions
        </button>
      </div>

      {/* Eligibility Tab */}
      {activeTab === 'eligibility' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Market Eligibility Voting</h3>
          <div className="space-y-4">
            {markets.map((market, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{market.question}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    market.status === 'Active' ? 'bg-green-100 text-green-800' :
                    market.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {market.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{market.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEligibilityVote(market.publicKey, true, 'Market meets community standards')}
                    disabled={loading}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleEligibilityVote(market.publicKey, false, 'Market violates community standards')}
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Content Moderation</h3>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">Market Report</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{report.reason}</p>
                <p className="text-xs text-gray-500">Type: {report.reportType}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Tab */}
      {activeTab === 'emergency' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Emergency Actions (Multisig Required)</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-700">
              <strong>Warning:</strong> Emergency actions require 5/9 multisig approval from trusted entities (EFF, ACLU, etc.)
            </p>
          </div>
          <div className="space-y-4">
            {markets.filter(market => market.status === 'Active').map((market, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{market.question}</h4>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    {market.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{market.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEmergencyPause(market.publicKey, 'Suspected market manipulation or harmful content')}
                    disabled={loading}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
                  >
                    Emergency Pause
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
























