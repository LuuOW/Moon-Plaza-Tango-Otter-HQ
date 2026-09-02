import React from 'react';
import { MeridianArticle } from '../types';
import { BookOpen, ExternalLink, Sparkles, Rocket, X, Tag } from 'lucide-react';
import { sounds } from '../utils/sound';

interface MeridianArticlesModalProps {
  articles: MeridianArticle[];
  isOpen: boolean;
  onClose: () => void;
  onDeployFromArticle: (article: MeridianArticle) => void;
}

export const MeridianArticlesModal: React.FC<MeridianArticlesModalProps> = ({
  articles,
  isOpen,
  onClose,
  onDeployFromArticle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Ask-Meridian Architecture &amp; Articles
                <a
                  href="https://ask-meridian.uk"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono-code font-normal hover:underline"
                >
                  <span>ask-meridian.uk</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </h3>
              <p className="text-xs text-slate-400">
                Foundational research papers powering Moon Plaza &amp; Tango Otter automated monetization systems.
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {articles.map((art) => (
            <div
              key={art.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{art.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <span className="text-[11px] font-mono-code text-slate-500 whitespace-nowrap">
                  {art.readTime}
                </span>
              </div>

              {/* Tags & Suggested Monetization */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {art.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-[11px] text-amber-400/90 font-mono-code">
                    Monetization: {art.suggestedMonetization}
                  </span>
                  <button
                    onClick={() => {
                      sounds.playIdeaBroadcast();
                      onDeployFromArticle(art);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition active:scale-95 whitespace-nowrap"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Auto-Deploy Experiment</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
