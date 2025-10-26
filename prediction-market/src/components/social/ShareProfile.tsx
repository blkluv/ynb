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
      'My PrismaFi Profile',
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
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
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
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <h3 className="font-bold text-white text-sm">Share Profile</h3>
            </div>

            <div className="p-2 space-y-1">
              {/* Twitter/X */}
              <button
                onClick={handleShareTwitter}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Twitter className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Share on X</div>
                  <div className="text-gray-400 text-xs">Post to timeline</div>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </div>
                  <div className="text-gray-400 text-xs">Copy profile URL</div>
                </div>
              </button>

              {/* Web Share API (mobile) */}
              {navigator.share && (
                <button
                  onClick={handleWebShare}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Share...</div>
                    <div className="text-gray-400 text-xs">More options</div>
                  </div>
                </button>
              )}
            </div>

            {/* Preview Text */}
            <div className="p-3 border-t border-gray-700 bg-gray-900/50">
              <div className="text-xs text-gray-400 mb-2">Preview:</div>
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

