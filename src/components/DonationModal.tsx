import React, { useState } from 'react';
import { Heart, DollarSign, ExternalLink, Copy, Check, Sparkles, X, QrCode } from 'lucide-react';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationSuccess: (amount: number, note: string) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onDonationSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(15);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorNote, setDonorNote] = useState('');

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleCopyAlias = () => {
    navigator.clipboard.writeText('lkempe');
    setCopiedAlias(true);
    sounds.playBubblePop();
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleCompleteDonation = () => {
    sounds.playCoin();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899'],
    });
    onDonationSuccess(currentAmount || 15, donorNote || 'Patron of Moon Plaza');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Heart className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Support Lucas &amp; Moon Plaza
              </h3>
              <p className="text-xs text-slate-400">
                Direct tips via PayPal (lk3mpe) &amp; MercadoPago (lkempe)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Amount Tiers */}
          <div>
            <label className="text-xs font-bold text-slate-300 font-mono-code mb-2 block">
              Choose Contribution Amount:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 15, 35, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                    sounds.playStep();
                  }}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg ring-2 ring-amber-400/20'
                      : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-extrabold">${amt}</span>
                  <span className="text-[9px] opacity-80 font-normal">
                    {amt === 5 ? 'Coffee' : amt === 15 ? 'Supporter' : amt === 35 ? 'Patron' : 'VIP'}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom amount input */}
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono-code">Custom ($):</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 text-xs rounded-lg px-3 py-1.5 outline-none font-mono-code"
              />
            </div>
          </div>

          {/* Payment Gateways Options */}
          <div className="space-y-3">
            {/* PayPal Direct Button */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0079C1]/20 border border-[#0079C1]/30 flex items-center justify-center text-[#0079C1] font-bold text-xs">
                  PP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">PayPal Direct Link</h4>
                  <p className="text-[11px] text-slate-400 font-mono-code">paypal.me/lk3mpe</p>
                </div>
              </div>

              <a
                href={`https://paypal.me/lk3mpe/${currentAmount || 15}`}
                target="_blank"
                rel="noreferrer"
                onClick={handleCompleteDonation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0079C1] hover:bg-[#00457C] text-white text-xs font-bold shadow transition active:scale-95"
              >
                <span>Pay with PayPal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* MercadoPago Alias Card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#009EE3]/20 border border-[#009EE3]/30 flex items-center justify-center text-[#009EE3] font-bold text-xs">
                  MP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">MercadoPago (Argentina / LatAm)</h4>
                  <p className="text-[11px] text-slate-400 font-mono-code">Alias: <strong className="text-white">lkempe</strong></p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAlias}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#009EE3]/20 hover:bg-[#009EE3]/30 border border-[#009EE3]/40 text-sky-300 text-xs font-bold transition active:scale-95"
              >
                {copiedAlias ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAlias ? 'Alias Copied!' : 'Copy Alias'}</span>
              </button>
            </div>
          </div>

          {/* Optional Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 font-mono-code">
              Leave a note for the Company Git Log:
            </label>
            <input
              type="text"
              placeholder="e.g., Keep building Moon Plaza & Ask Meridian!"
              value={donorNote}
              onChange={(e) => setDonorNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 text-xs rounded-lg px-3 py-2 outline-none"
            />
          </div>

          {/* Confirm donation button for simulator & git commit */}
          <button
            type="button"
            onClick={handleCompleteDonation}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm &amp; Register ${currentAmount || 15} Contribution</span>
          </button>
        </div>
      </div>
    </div>
  );
};
