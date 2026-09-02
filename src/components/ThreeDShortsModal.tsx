import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Video, Sparkles, Play, Film, Camera, DollarSign, Share2, Layers, CheckCircle2, Clock } from 'lucide-react';
import { ThreeDShortScene, CompanyStats } from '../types';

interface ThreeDShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shorts: ThreeDShortScene[];
  companyStats: CompanyStats;
  onGenerateNewShort: (platform: string) => Promise<void>;
  isGenerating: boolean;
}

export const ThreeDShortsModal: React.FC<ThreeDShortsModalProps> = ({
  isOpen,
  onClose,
  shorts,
  companyStats,
  onGenerateNewShort,
  isGenerating,
}) => {
  const [selectedShort, setSelectedShort] = useState<ThreeDShortScene | null>(shorts[0] || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playhead, setPlayhead] = useState<number>(0);
  const [targetPlatform, setTargetPlatform] = useState<string>('YouTube Shorts');

  // Interactive timeline playhead simulation
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedShort) {
      interval = setInterval(() => {
        setPlayhead((prev) => {
          if (prev >= selectedShort.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedShort]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">3D Shorts Division: Gemini Omni Spatial Lab</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Omni Multimodal 2035
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Autonomous 3D spatial short-form video generation targeting viral micro-patronage & donations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Burn: ~${(companyStats.total3DShortsRendered * 0.00125).toFixed(4)} USD</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
            {/* Left: Shorts Selector & Generator */}
            <div className="lg:col-span-4 border-r border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-950/40">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <label className="text-xs font-semibold text-slate-300 mb-2 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Spawn Omni 3D Short
                </label>
                <div className="flex gap-2 mb-3">
                  {['YouTube Shorts', 'TikTok', 'Instagram Reels'].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setTargetPlatform(plat)}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium border transition-colors ${
                        targetPlatform === plat
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {plat.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <button
                  disabled={isGenerating}
                  onClick={() => onGenerateNewShort(targetPlatform)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Synthesizing Spatial Scene...
                    </>
                  ) : (
                    <>
                      <Film className="w-3.5 h-3.5" />
                      Generate 3D Spatial Short Scene
                    </>
                  )}
                </button>
              </div>

              {/* List of Shorts */}
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Production Catalog ({shorts.length})
                </span>
                {shorts.map((short) => (
                  <button
                    key={short.id}
                    onClick={() => {
                      setSelectedShort(short);
                      setIsPlaying(false);
                      setPlayhead(0);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                      selectedShort?.id === short.id
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-lg'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate max-w-[180px]">{short.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20">
                        {short.durationSeconds}s
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{short.concept}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{short.targetPlatform}</span>
                      <span className="text-emerald-400 font-mono">~{short.tokensBurned} tokens</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Interactive 3D Mockup & Telemetry */}
            <div className="lg:col-span-8 p-6 flex flex-col gap-6 overflow-y-auto bg-slate-900/30">
              {selectedShort ? (
                <>
                  {/* Spatial Viewport Mockup */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-inner">
                    {/* Isometric Grid Background in Canvas */}
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                    {/* Animated Spatial Scene Simulation */}
                    <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-lg">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-2xl border transition-all duration-500"
                        style={{
                          backgroundColor: `${selectedShort.previewColor || '#10B981'}25`,
                          borderColor: selectedShort.previewColor || '#10B981',
                          transform: isPlaying ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg)',
                        }}
                      >
                        <Camera className="w-10 h-10 text-emerald-400 animate-pulse" />
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">{selectedShort.title}</h3>
                      <p className="text-xs text-slate-300 italic mb-3">"{selectedShort.viralHook}"</p>

                      {/* Callout to payment channels */}
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs text-emerald-300 font-medium">
                        {selectedShort.monetizationCallToAction}
                      </div>
                    </div>

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedShort.targetPlatform}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-slate-700 text-xs text-emerald-400 font-mono">
                      {isPlaying ? `REC: ${playhead}s / ${selectedShort.durationSeconds}s` : `${selectedShort.durationSeconds}s Scene`}
                    </div>

                    {/* Play Control Bar */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center gap-3 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-slate-700">
                      <button
                        onClick={() => {
                          if (playhead >= selectedShort.durationSeconds) setPlayhead(0);
                          setIsPlaying(!isPlaying);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition"
                      >
                        <Play className={`w-4 h-4 ${isPlaying ? 'fill-white' : ''}`} />
                      </button>

                      <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${(playhead / selectedShort.durationSeconds) * 100}%` }}
                        />
                      </div>

                      <span className="text-[11px] font-mono text-slate-300">
                        00:{playhead < 10 ? `0${playhead}` : playhead} / 00:{selectedShort.durationSeconds}
                      </span>
                    </div>
                  </div>

                  {/* Scene Specs & Multimodal Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        Camera Movement Script
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        {selectedShort.cameraScript}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        Spatial 3D Voxel Prompt
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        {selectedShort.spatialPrompt}
                      </p>
                    </div>
                  </div>

                  {/* Required Habbo Assets & Token Accounting */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 mb-1.5">Habbo Pixel Assets In Scene</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedShort.habboAssetsRequired.map((asset, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-200"
                          >
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Compute Deduction</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        -${selectedShort.tokenCostUsd.toFixed(6)} USD ({selectedShort.tokensBurned.toLocaleString()} tokens)
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                  Select a 3D Short to inspect the spatial rendering script.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
