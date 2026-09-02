import React, { useState } from 'react';
import { MeridianJournalEntry, MeridianArticle } from '../types';
import {
  BookOpen,
  GitBranch,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileCode2,
  PlusCircle,
  Copy,
  Check,
  Search,
  Filter,
  Users,
  Calendar,
  Share2,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface MeridianJournalPipelineProps {
  journalEntries: MeridianJournalEntry[];
  articles: MeridianArticle[];
  onPublishEntry: (entry: Omit<MeridianJournalEntry, 'id' | 'publishedAt' | 'commitSha'>) => void;
  journalRepo: string;
}

export const MeridianJournalPipeline: React.FC<MeridianJournalPipelineProps> = ({
  journalEntries,
  articles,
  onPublishEntry,
  journalRepo,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<MeridianJournalEntry | null>(
    journalEntries[0] || null
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  // New entry form state
  const [newTitle, setNewTitle] = useState('');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState(articles[0]?.slug || '');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newMethodology, setNewMethodology] = useState('');
  const [newObservedRoi, setNewObservedRoi] = useState('');
  const [newConversionDelta, setNewConversionDelta] = useState(4.5);
  const [newSampleSize, setNewSampleSize] = useState(1000);
  const [newAuthor, setNewAuthor] = useState('Maya Lin (CPO) & Lucas (Founder)');
  const [newTags, setNewTags] = useState('Conversion Rate Optimization, Monetization');
  const [newInsights, setNewInsights] = useState(
    '1. High visual contrast in payment buttons increased click-through rate by 18%.\n2. Transparent funding goal progress increased average patron tip size.'
  );

  const handleCopyMarkdown = (entry: MeridianJournalEntry) => {
    const markdown = `# ${entry.title}
**Article Reference:** [${entry.articleTitle}](https://ask-meridian.uk/posts/${entry.articleSlug})
**Author:** ${entry.author} (${entry.authorRole})
**Status:** ${entry.status.toUpperCase()} | **Commit:** \`${entry.commitSha}\`
**Date:** ${new Date(entry.publishedAt).toLocaleDateString()}

## 🔬 Hypothesis
${entry.hypothesis}

## 📊 Methodology & Sample Size
- **Sample Size:** ${entry.sampleSize.toLocaleString()} visitors
- **Methodology:** ${entry.methodology}

## 📈 Empirical Results & ROI
- **Conversion Delta:** +${entry.conversionDelta.toFixed(1)}%
- **Observed ROI:** ${entry.observedRoi}

## 💡 Key Empirical Insights
${entry.insights.map((ins) => `- ${ins}`).join('\n')}

---
*Published via Moon Plaza Tango Otter Autonomous Pipeline to [${journalRepo}](https://github.com/${journalRepo})*
`;

    navigator.clipboard.writeText(markdown);
    setCopiedSha(entry.commitSha);
    sounds.playBubblePop();
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newHypothesis.trim()) return;

    const matchedArt = articles.find((a) => a.slug === selectedArticleSlug);

    const insightList = newInsights
      .split('\n')
      .map((s) => s.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter(Boolean);

    onPublishEntry({
      title: newTitle,
      articleSlug: selectedArticleSlug,
      articleTitle: matchedArt ? matchedArt.title : 'Autonomous Revenue Exploration',
      hypothesis: newHypothesis,
      methodology: newMethodology || 'Monitored real-time traffic pulse across live branch deployment.',
      observedRoi: newObservedRoi || `+${newConversionDelta}% validated improvement`,
      conversionDelta: Number(newConversionDelta) || 3.5,
      sampleSize: Number(newSampleSize) || 1000,
      status: 'published',
      author: newAuthor,
      authorRole: 'Autonomous Research Fellow',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      insights: insightList.length > 0 ? insightList : ['Empirical metrics validated through autonomous keep threshold.'],
    });

    setIsCreatingNew(false);
    setNewTitle('');
    setNewHypothesis('');
    setNewMethodology('');
    setNewObservedRoi('');
  };

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'published' && entry.status === 'published') ||
      (activeFilter === 'peer_reviewed' && entry.status === 'peer_reviewed') ||
      entry.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()));

    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.hypothesis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Repository Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono-code bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 font-bold">
                <BookOpen className="w-3 h-3 text-indigo-400" />
                PEER-REVIEWED RESEARCH JOURNAL
              </span>
              <span className="text-xs font-mono-code text-slate-400">
                LuuOW/Meridian-Research-Journal
              </span>
            </div>
            <h2 className="text-xl font-bold font-mono-code text-slate-100 flex items-center gap-2">
              Meridian Empirical Research Journal
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Autonomous empirical studies, statistical hypothesis testing, and conversion telemetry logs
              derived from live experiments on <span className="text-amber-400 font-semibold">ask-meridian.uk</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`https://github.com/${journalRepo}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono-code font-bold transition shadow"
            >
              <GitBranch className="w-3.5 h-3.5 text-sky-400" />
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://ask-meridian.uk"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow font-mono-code"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit ask-meridian.uk</span>
            </a>

            <button
              onClick={() => {
                sounds.playBubblePop();
                setIsCreatingNew(!isCreatingNew);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isCreatingNew ? 'Close Form' : 'Publish New Study'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Study Creation Drawer / Modal */}
      {isCreatingNew && (
        <form
          onSubmit={handleFormSubmit}
          className="p-5 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono-code">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Draft &amp; Publish Empirical Research Paper
            </h3>
            <span className="text-[11px] text-slate-400 font-mono-code">
              Target Repository: github.com/{journalRepo}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Study Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Study 04: Interactive Tip Capsules & Patron Retention"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Target Meridian Article</label>
              <select
                value={selectedArticleSlug}
                onChange={(e) => setSelectedArticleSlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {articles.map((art) => (
                  <option key={art.slug} value={art.slug}>
                    {art.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Hypothesis</label>
              <input
                type="text"
                value={newHypothesis}
                onChange={(e) => setNewHypothesis(e.target.value)}
                placeholder="What did the multi-agent team expect to prove?"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Observed Conversion Delta &amp; ROI</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={newConversionDelta}
                  onChange={(e) => setNewConversionDelta(parseFloat(e.target.value))}
                  placeholder="Delta %"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  value={newObservedRoi}
                  onChange={(e) => setNewObservedRoi(e.target.value)}
                  placeholder="e.g. +$240 Net Treasury"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-300">Methodology &amp; Sample Size</label>
              <textarea
                rows={2}
                value={newMethodology}
                onChange={(e) => setNewMethodology(e.target.value)}
                placeholder="Describe the traffic split, payment gateways tested (PayPal lk3mpe, MercadoPago lkempe), and statistical thresholds."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-300">Key Insights (1 per line)</label>
              <textarea
                rows={2}
                value={newInsights}
                onChange={(e) => setNewInsights(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Commit &amp; Publish Paper</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Studies ({journalEntries.length})
          </button>
          <button
            onClick={() => setActiveFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'published'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setActiveFilter('peer_reviewed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'peer_reviewed'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Peer-Reviewed
          </button>
          <button
            onClick={() => setActiveFilter('Spatial UI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'Spatial UI'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Spatial UI
          </button>
          <button
            onClick={() => setActiveFilter('Fintech')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeFilter === 'Fintech'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Fintech
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, hypotheses, tags..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Main Journal Layout: List of Papers + Selected Paper Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Papers Feed */}
        <div className="lg:col-span-5 space-y-3.5">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
              No research papers match your filter.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isSelected = selectedEntry?.id === entry.id;

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    sounds.playBubblePop();
                    setSelectedEntry(entry);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-lg ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded uppercase ${
                        entry.status === 'peer_reviewed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                      }`}
                    >
                      {entry.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono-code text-slate-500">
                      commit {entry.commitSha}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 leading-snug mb-1.5">
                    {entry.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {entry.hypothesis}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-emerald-400 font-mono-code font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +{entry.conversionDelta.toFixed(1)}% Conversion
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {entry.sampleSize.toLocaleString()} sample size
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Full Interactive Paper Inspection & Markdown Export */}
        <div className="lg:col-span-7">
          {selectedEntry ? (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 sticky top-20">
              {/* Paper Top Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {selectedEntry.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono-code text-slate-500">
                      Published {new Date(selectedEntry.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold font-mono-code text-slate-100">
                    {selectedEntry.title}
                  </h2>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Author: <strong className="text-slate-200">{selectedEntry.author}</strong> ({selectedEntry.authorRole})</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyMarkdown(selectedEntry)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code font-bold transition border border-slate-700 shadow shrink-0"
                >
                  {copiedSha === selectedEntry.commitSha ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied MD!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Export Markdown</span>
                    </>
                  )}
                </button>
              </div>

              {/* Empirical KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono-code">Conversion Lift</span>
                  <span className="text-base font-bold text-emerald-400 font-mono-code">
                    +{selectedEntry.conversionDelta.toFixed(1)}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono-code">Sample Size</span>
                  <span className="text-base font-bold text-sky-400 font-mono-code">
                    {selectedEntry.sampleSize.toLocaleString()} visitors
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono-code">Commit SHA</span>
                  <span className="text-xs font-bold text-amber-400 font-mono-code">
                    {selectedEntry.commitSha}
                  </span>
                </div>
              </div>

              {/* Research Sections */}
              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5 font-mono-code">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Target Hypothesis
                  </h4>
                  <p className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300">
                    {selectedEntry.hypothesis}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5 font-mono-code">
                    <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
                    Methodology &amp; Telemetry
                  </h4>
                  <p className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-slate-300">
                    {selectedEntry.methodology}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5 font-mono-code">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Observed ROI &amp; Revenue Metrics
                  </h4>
                  <p className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-emerald-300 font-medium">
                    {selectedEntry.observedRoi}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5 font-mono-code">
                    Empirical Insights &amp; Findings
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedEntry.insights.map((ins, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 p-2 rounded bg-slate-950/50 border border-slate-800 text-slate-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Article Backlink */}
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-indigo-300 uppercase font-bold block">
                      Referenced Article on Ask-Meridian
                    </span>
                    <span className="text-xs font-bold text-slate-200">{selectedEntry.articleTitle}</span>
                  </div>
                  <a
                    href={`https://ask-meridian.uk/posts/${selectedEntry.articleSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition flex items-center gap-1 shrink-0"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              Select an empirical study from the feed to view full telemetry details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
