import React, { useState } from 'react';
import { Sparkles, Send, Mic, MicOff, Lightbulb, Zap, Rocket, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/sound';

interface FounderIdeaBroadcasterProps {
  onBroadcastIdea: (ideaText: string) => void;
  isBrainstorming: boolean;
}

const IDEA_PRESETS = [
  {
    label: 'Retro Donation Banner',
    idea: 'Create an eye-catching retro donation banner for ask-meridian.uk readers with PayPal.me/lk3mpe and MercadoPago alias lkempe',
    category: 'Donation Banner',
  },
  {
    label: 'Golden Otter VIP Pass',
    idea: 'Launch a Tango Otter VIP Supporter tier with pixel badge and automated thank-you commit to GitHub',
    category: 'VIP Tier',
  },
  {
    label: 'Meridian Consulting Widget',
    idea: 'Deploy an automated 1-on-1 AI architecture consulting call widget with instant upfront deposit via MercadoPago & PayPal',
    category: 'Consulting',
  },
  {
    label: 'Moon Plaza Micro-Sponsor Grid',
    idea: 'Add an interactive 8-bit sponsor grid where supporters can buy a custom pixel plaque in our virtual office',
    category: 'Sponsorship',
  },
  {
    label: 'Article Micro-Tip Capsule',
    idea: 'Add a non-intrusive floating tip capsule with quick presets ($5, $15, $35) for Ask-Meridian readers',
    category: 'Tip Capsule',
  },
];

export const FounderIdeaBroadcaster: React.FC<FounderIdeaBroadcasterProps> = ({
  onBroadcastIdea,
  isBrainstorming,
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Voice recognition support
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser environment. You can type your idea directly!');
      return;
    }

    try {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      if (!isListening) {
        setIsListening(true);
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIdeaText(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } catch {
      setIsListening(false);
    }
  };

  const handleBroadcast = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ideaText.trim() || isBrainstorming) return;

    sounds.playIdeaBroadcast();
    onBroadcastIdea(ideaText.trim());
    setIdeaText('');
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-xl p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Founder Directive & Idea Broadcaster
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Whole Company Listening
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Speak or type an idea — Maya, Leo, Zara, and Tango will auto-brainstorm, write code, and push a monetization experiment to GitHub!
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono-code">
          <span className="text-amber-400 font-semibold">PayPal:</span> lk3mpe
          <span>•</span>
          <span className="text-sky-400 font-semibold">MercadoPago:</span> lkempe
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleBroadcast} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="e.g., Create a floating donation banner for ask-meridian with paypal.me/lk3mpe and mercadopago:lkempe..."
            disabled={isBrainstorming}
            className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-100 placeholder-slate-500 text-sm rounded-lg pl-3.5 pr-10 py-2.5 transition outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={toggleVoice}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
            }`}
            title={isListening ? 'Listening...' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!ideaText.trim() || isBrainstorming}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap active:scale-95"
        >
          {isBrainstorming ? (
            <>
              <Zap className="w-4 h-4 animate-spin text-slate-950" />
              <span>Deploying...</span>
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              <span>Broadcast Idea</span>
            </>
          )}
        </button>
      </form>

      {/* Preset Idea Chips */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400 font-mono-code mr-1">Quick Ideas:</span>
        {IDEA_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIdeaText(preset.idea);
            }}
            disabled={isBrainstorming}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-amber-300 transition flex items-center gap-1 disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
