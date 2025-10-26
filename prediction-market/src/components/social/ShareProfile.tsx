'use client';

import { useState } from 'react';
import { Share2, Twitter, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { UserStats } from '@/lib/program/direct-read';
import {
  generateProfileShareText,
  getProfileUrl,
  getTwitterShareUrl,
  copyToClipboard,
  shareViaWebApi,
} from '@/lib/utils/shareUtils';

interface ShareProfileProps {
  walletAddress: string;
  stats: UserStats;
}

const ShareProfile = ({ walletAddress, stats }: ShareProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = getProfileUrl(walletAddress);
  const shareText = generateProfileShareText(walletAddress, stats);

  const handleShareTwitter = () => {
    const twitterUrl = getTwitterShareUrl(shareText, profileUrl);
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(profileUrl);
    if (success) {
      setCopied(true);
      toast.success('Profile link copied!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleWebShare = async () => {
    const success = await shareViaWebApi(
      'My YE/NO BET Profile',
      shareText,
      profileUrl
    );
    if (success) {
      setIsOpen(false);
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        <Share2 className="w-4 h-4" />
        Share Profile
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Share Menu */}
          <div className="absolute right-0 z-50 w-64 mt-2 overflow-hidden bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-bold text-white">Share Profile</h3>
            </div>

            <div className="p-2 space-y-1">
              {/* Twitter/X */}
              <button
                onClick={handleShareTwitter}
                className="flex items-center w-full gap-3 px-3 py-2 text-left transition-colors rounded-lg hover:bg-gray-700"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                  <Twitter className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Share on X</div>
                  <div className="text-xs text-gray-400">Post to timeline</div>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center w-full gap-3 px-3 py-2 text-left transition-colors rounded-lg hover:bg-gray-700"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </div>
                  <div className="text-xs text-gray-400">Copy profile URL</div>
                </div>
              </button>

              {/* Web Share API (mobile) */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  onClick={handleWebShare}
                  className="flex items-center w-full gap-3 px-3 py-2 text-left transition-colors rounded-lg hover:bg-gray-700"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Share...</div>
                    <div className="text-xs text-gray-400">More options</div>
                  </div>
                </button>
              )}
            </div>

            {/* Preview Text */}
            <div className="p-3 border-t border-gray-700 bg-gray-900/50">
              <div className="mb-2 text-xs text-gray-400">Preview:</div>
              <div className="text-xs text-gray-300 whitespace-pre-line line-clamp-4">
                {shareText}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareProfile;

