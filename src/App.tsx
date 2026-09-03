import React, { useState, useEffect, useRef } from 'react';
import {
  Character,
  FurnitureItem,
  Experiment,
  GitCommit,
  ChatMessage,
  MeridianArticle,
  MeridianJournalEntry,
  CompanyStats,
  ThreeDShortScene,
} from './types';
import {
  INITIAL_CHARACTERS,
  INITIAL_FURNITURE,
  INITIAL_EXPERIMENTS,
  INITIAL_GIT_COMMITS,
  MERIDIAN_ARTICLES,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_COMPANY_STATS,
  INITIAL_3D_SHORTS,
  AUTONOMOUS_BANTER_LIST,
} from './data/initialData';
import { HeaderNav } from './components/HeaderNav';
import { IsometricRoomCanvas } from './components/IsometricRoomCanvas';
import { FounderIdeaBroadcaster } from './components/FounderIdeaBroadcaster';
import { LiveExperimentsBoard } from './components/LiveExperimentsBoard';
import { GitHubDeploymentPipeline } from './components/GitHubDeploymentPipeline';
import { CompanyChatBox } from './components/CompanyChatBox';
import { MeridianArticlesModal } from './components/MeridianArticlesModal';
import { DonationModal } from './components/DonationModal';
import { MeridianJournalPipeline } from './components/MeridianJournalPipeline';
import { ThreeDShortsModal } from './components/ThreeDShortsModal';
import { UnitTestModal } from './components/UnitTestModal';
import { sounds } from './utils/sound';
import { getDirection } from './utils/isometric';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  GitBranch,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Coins,
  DollarSign,
  BookOpen,
  Activity,
  Zap,
  Coffee,
  Play,
  Pause,
  PlusCircle,
  Film,
  ShieldCheck,
  Cpu,
  Flame,
} from 'lucide-react';

export default function App() {
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [furniture, setFurniture] = useState<FurnitureItem[]>(INITIAL_FURNITURE);
  const [experiments, setExperiments] = useState<Experiment[]>(INITIAL_EXPERIMENTS);
  const [gitCommits, setGitCommits] = useState<GitCommit[]>(INITIAL_GIT_COMMITS);
  const [journalEntries, setJournalEntries] = useState<MeridianJournalEntry[]>(
    INITIAL_JOURNAL_ENTRIES
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      senderId: 'maya',
      senderName: 'Maya Lin',
      senderRole: 'Chief Product Officer',
      text: 'Welcome to Moon Plaza HQ! Autonomous micro-team is armed to build & monetize ask-meridian.uk concepts.',
      timestamp: Date.now() - 3600000,
      type: 'system',
    },
    {
      id: 'msg-init-2',
      senderId: 'leo',
      senderName: 'Leo Chen',
      senderRole: 'Lead Fullstack Dev',
      text: 'CI/CD runner connected to LuuOW/moon-plaza-tango-otter & LuuOW/Meridian-Research-Journal.',
      timestamp: Date.now() - 3500000,
      type: 'system',
    },
    {
      id: 'msg-init-3',
      senderId: 'tango',
      senderName: 'Tango The Otter',
      senderRole: 'Company Mascot & CFO',
      text: 'PayPal (paypal.me/lk3mpe) and MercadoPago (alias: lkempe) treasury routes verified!',
      timestamp: Date.now() - 3400000,
      type: 'system',
    },
  ]);

  const [companyStats, setCompanyStats] = useState<CompanyStats>(INITIAL_COMPANY_STATS);
  const [threeDShorts, setThreeDShorts] = useState<ThreeDShortScene[]>(INITIAL_3D_SHORTS);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [isArticlesOpen, setIsArticlesOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [is3DShortsOpen, setIs3DShortsOpen] = useState(false);
  const [isUnitTestOpen, setIsUnitTestOpen] = useState(false);
  const [isGeneratingShort, setIsGeneratingShort] = useState(false);
  const [isInteractingPeers, setIsInteractingPeers] = useState(false);
  const [peerInteractionCount, setPeerInteractionCount] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'office' | 'experiments' | 'github' | 'journal' | 'chat'
  >('office');

  // Simulation toggles
  const [isAutonomousSimulation, setIsAutonomousSimulation] = useState(true);
  const [isAutonomousTraffic, setIsAutonomousTraffic] = useState(true);

  const banterIndexRef = useRef(0);

  // 1. Bubble Expiration Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCharacters((prev) =>
        prev.map((char) => {
          if (char.currentBubble && now >= (char.currentBubble.expiresAt || 0)) {
            return {
              ...char,
              currentBubble: undefined,
              action: char.assignedDesk ? 'type' : 'idle',
            };
          }
          return char;
        })
      );
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // 2. Autonomous Agent Banter & Locomotion Loop
  useEffect(() => {
    if (!isAutonomousSimulation) return;

    const interval = setInterval(() => {
      if (isBrainstorming) return;

      const banter = AUTONOMOUS_BANTER_LIST[banterIndexRef.current % AUTONOMOUS_BANTER_LIST.length];
      banterIndexRef.current += 1;

      const targetChar = characters.find((c) => c.id === banter.characterId);
      if (!targetChar) return;

      sounds.playBubblePop();

      // Show speech bubble in isometric canvas
      setCharacters((prev) =>
        prev.map((c) => {
          if (c.id === banter.characterId) {
            return {
              ...c,
              action: (banter.targetAction as any) || 'talk',
              currentBubble: {
                id: `bubble-auto-${Date.now()}`,
                text: banter.text,
                role: c.role,
                timestamp: Date.now(),
                expiresAt: Date.now() + 6500,
              },
            };
          }
          return c;
        })
      );

      // Append to All-Hands Chat Feed
      setMessages((prev) => [
        ...prev.slice(-30),
        {
          id: `msg-auto-${Date.now()}`,
          senderId: banter.characterId,
          senderName: targetChar.name,
          senderRole: targetChar.role,
          text: banter.text,
          timestamp: Date.now(),
          type: 'discussion',
        },
      ]);
    }, 7500);

    return () => clearInterval(interval);
  }, [isAutonomousSimulation, isBrainstorming, characters]);

  // 3. Autonomous Real-Time Traffic & Telemetry Stream Loop
  useEffect(() => {
    if (!isAutonomousTraffic) return;

    const trafficInterval = setInterval(() => {
      const liveExps = experiments.filter((e) => e.status === 'live');
      if (liveExps.length === 0) return;

      const targetExp = liveExps[Math.floor(Math.random() * liveExps.length)];
      const incomingVisitors = Math.floor(Math.random() * 25) + 15;
      const willConvert = Math.random() > 0.45;
      const conversionCount = willConvert ? Math.floor(Math.random() * 3) + 1 : 0;
      const earnedAmount = conversionCount * 15;

      setExperiments((prev) =>
        prev.map((exp) => {
          if (exp.id !== targetExp.id) return exp;

          const nextImp = exp.impressions + incomingVisitors;
          const nextClicks = exp.clicks + Math.round(incomingVisitors * 0.32);
          const nextConv = exp.conversions + conversionCount;
          const nextRate = nextImp > 0 ? (nextConv / nextImp) * 100 : 0;
          const nextRev = exp.revenueEarned + earnedAmount;

          return {
            ...exp,
            impressions: nextImp,
            clicks: nextClicks,
            conversions: nextConv,
            currentConversionRate: nextRate,
            revenueEarned: nextRev,
          };
        })
      );

      if (earnedAmount > 0) {
        setCompanyStats((prev) => ({
          ...prev,
          totalRevenue: prev.totalRevenue + earnedAmount,
          totalDonationsCount: prev.totalDonationsCount + conversionCount,
        }));
      }
    }, 3800);

    return () => clearInterval(trafficInterval);
  }, [isAutonomousTraffic, experiments]);

  // 4. Move Player (Lucas)
  const handlePlayerMove = (targetX: number, targetY: number) => {
    setCharacters((prev) =>
      prev.map((char) => {
        if (!char.isPlayer) return char;
        const dir = getDirection(char.x, char.y, targetX, targetY);
        return {
          ...char,
          x: targetX,
          y: targetY,
          direction: dir,
          action: 'walk',
        };
      })
    );

    setTimeout(() => {
      setCharacters((prev) =>
        prev.map((char) => (char.isPlayer ? { ...char, action: 'idle' } : char))
      );
    }, 400);
  };

  // 5. Broadcast Founder Idea
  const handleBroadcastIdea = async (ideaText: string) => {
    setIsBrainstorming(true);

    const founderBubble = {
      id: `bubble-${Date.now()}`,
      text: ideaText,
      isIdea: true,
      role: 'Founder',
      timestamp: Date.now(),
      expiresAt: Date.now() + 8000,
    };

    setCharacters((prev) =>
      prev.map((char) =>
        char.isPlayer ? { ...char, currentBubble: founderBubble, action: 'talk' } : char
      )
    );

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        senderId: 'lucas',
        senderName: 'Lucas (Founder)',
        senderRole: 'Founder',
        text: ideaText,
        timestamp: Date.now(),
        type: 'idea',
      },
    ]);

    try {
      const res = await fetch('/api/company/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: ideaText,
          authorName: 'Lucas',
          previousExperiments: experiments.map((e) => e.title),
        }),
      });

      const data = await res.json();

      if (data.dialogues && Array.isArray(data.dialogues)) {
        data.dialogues.forEach((dlg: any, idx: number) => {
          setTimeout(() => {
            sounds.playBubblePop();

            setCharacters((prev) =>
              prev.map((char) => {
                if (char.id === dlg.characterId) {
                  return {
                    ...char,
                    action: dlg.characterId === 'tango' ? 'cheer' : 'talk',
                    currentBubble: {
                      id: `bubble-${Date.now()}-${idx}`,
                      text: dlg.text,
                      role: dlg.role,
                      timestamp: Date.now(),
                      expiresAt: Date.now() + 6500,
                    },
                  };
                }
                return char;
              })
            );

            setMessages((prev) => [
              ...prev,
              {
                id: `msg-${Date.now()}-${idx}`,
                senderId: dlg.characterId,
                senderName: dlg.characterName,
                senderRole: dlg.role,
                text: dlg.text,
                timestamp: Date.now(),
                type: 'discussion',
              },
            ]);
          }, (idx + 1) * 1200);
        });
      }

      if (data.experiment) {
        const expData = data.experiment;
        const newExpId = `exp-${Date.now()}`;
        const newSha = Math.random().toString(16).substring(2, 9);

        const newExperiment: Experiment = {
          id: newExpId,
          title: expData.title,
          description: expData.description,
          category: expData.category || 'donation_banner',
          hypothesis: expData.hypothesis,
          targetConversionRate: expData.targetConversionRate || 4.2,
          currentConversionRate: 0.0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenueEarned: 0,
          branch: expData.branch || `experiment/auto-${Date.now()}`,
          commitSha: newSha,
          commitMessage: expData.commitMessage || `feat(experiment): auto-deploy ${expData.title}`,
          codeDiffPreview: expData.codeDiffPreview || `+ // Tango Otter Experiment`,
          status: 'deploying',
          createdAt: Date.now(),
          bannerHeadline: expData.bannerHeadline || 'Support Moon Plaza Development',
          bannerSubtext:
            expData.bannerSubtext ||
            'Direct donations power open research at Ask-Meridian & Moon Plaza.',
          suggestedAmounts: expData.suggestedAmounts || [5, 15, 35, 100],
          paymentConfig: {
            paypalUrl: 'https://paypal.me/lk3mpe',
            mercadopagoAlias: 'lkempe',
          },
        };

        setExperiments((prev) => [newExperiment, ...prev]);

        const newCommit: GitCommit = {
          sha: newSha,
          author: 'Leo Chen (Lead Dev)',
          authorRole: 'Engineering',
          message: `${newExperiment.commitMessage} [ci-telemetry:armed]`,
          branch: newExperiment.branch,
          timestamp: Date.now(),
          type: 'deploy',
          experimentId: newExpId,
          diffSummary: '+ 95 lines, telemetry hooks, paypal/mercadopago integration',
        };
        setGitCommits((prev) => [newCommit, ...prev]);

        setTimeout(() => {
          sounds.playDeployChime();
          setExperiments((prev) =>
            prev.map((e) =>
              e.id === newExpId ? { ...e, status: 'live', deployedAt: Date.now() } : e
            )
          );
          setCompanyStats((prev) => ({
            ...prev,
            activeExperimentsCount: prev.activeExperimentsCount + 1,
            gitCommitsCount: prev.gitCommitsCount + 1,
            totalCompanyBrainstorms: prev.totalCompanyBrainstorms + 1,
          }));
        }, 2800);
      }
    } catch (err) {
      console.error('Brainstorm error:', err);
    } finally {
      setIsBrainstorming(false);
    }
  };

  // 6. Direct Message / Whisper
  const handleSendMessage = async (text: string, targetCharacterId?: string) => {
    sounds.playBubblePop();

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        senderId: 'lucas',
        senderName: 'Lucas (Founder)',
        senderRole: 'Founder',
        text,
        timestamp: Date.now(),
        type: 'discussion',
      },
    ]);

    if (targetCharacterId) {
      try {
        const res = await fetch('/api/company/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId: targetCharacterId, message: text }),
        });
        const data = await res.json();
        const reply = data.reply || 'Understood! Updating roadmap.';

        setCharacters((prev) =>
          prev.map((c) =>
            c.id === targetCharacterId
              ? {
                  ...c,
                  action: 'talk',
                  currentBubble: {
                    id: `bubble-${Date.now()}`,
                    text: reply,
                    role: c.role,
                    timestamp: Date.now(),
                    expiresAt: Date.now() + 6000,
                  },
                }
              : c
          )
        );

        const targetChar = characters.find((c) => c.id === targetCharacterId);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-reply-${Date.now()}`,
            senderId: targetCharacterId,
            senderName: targetChar?.name || 'Teammate',
            senderRole: targetChar?.role || 'Staff',
            text: reply,
            timestamp: Date.now(),
            type: 'discussion',
          },
        ]);
      } catch {}
    }
  };

  // 7. Manual Traffic Injection
  const handleSimulateTraffic = (
    experimentId: string,
    visitors: number = 50,
    conversionLikelihood: number = 0.08
  ) => {
    sounds.playStep();
    setExperiments((prev) =>
      prev.map((exp) => {
        if (exp.id !== experimentId) return exp;
        const newImpressions = exp.impressions + visitors;
        const newClicks = exp.clicks + Math.round(visitors * 0.28);
        const newConversions =
          exp.conversions + Math.round(visitors * conversionLikelihood * (Math.random() * 0.8 + 0.6));
        const newRate =
          newImpressions > 0 ? (newConversions / newImpressions) * 100 : 0;
        const addedRevenue = newConversions * 15;

        return {
          ...exp,
          impressions: newImpressions,
          clicks: newClicks,
          conversions: newConversions,
          currentConversionRate: newRate,
          revenueEarned: exp.revenueEarned + addedRevenue,
        };
      })
    );
  };

  // 8. Experiment Decision Engine (KEEP vs ROLLBACK) + Auto-Publish to Meridian Journal
  const handleEvaluateExperiment = (experimentId: string) => {
    const exp = experiments.find((e) => e.id === experimentId);
    if (!exp) return;

    const isSuccess = exp.currentConversionRate >= exp.targetConversionRate;
    const evaluatedSha = Math.random().toString(16).substring(2, 9);

    if (isSuccess) {
      // KEEP -> Merge to main
      sounds.playDeployChime();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#8B5CF6'],
      });

      setExperiments((prev) =>
        prev.map((e) =>
          e.id === experimentId
            ? {
                ...e,
                status: 'kept',
                evaluatedAt: Date.now(),
                decisionReason: `Validated! Conversion hit ${e.currentConversionRate.toFixed(
                  1
                )}% (Threshold was ${e.targetConversionRate}%). Automatically merged into main!`,
              }
            : e
        )
      );

      const mergeCommit: GitCommit = {
        sha: evaluatedSha,
        author: 'Leo Chen & Autonomous CI',
        authorRole: 'Engineering',
        message: `merge(experiment): merge ${exp.branch} into main [ROI: +${(
          exp.currentConversionRate - exp.targetConversionRate
        ).toFixed(1)}% kept]`,
        branch: 'main',
        timestamp: Date.now(),
        type: 'merge_kept',
        experimentId: exp.id,
        diffSummary: '+ Promoted to production bundle',
      };
      setGitCommits((prev) => [mergeCommit, ...prev]);

      setCompanyStats((prev) => ({
        ...prev,
        keptExperimentsCount: prev.keptExperimentsCount + 1,
        activeExperimentsCount: Math.max(0, prev.activeExperimentsCount - 1),
        gitCommitsCount: prev.gitCommitsCount + 1,
      }));

      // Automatically publish empirical study to Meridian Research Journal!
      const newJournalStudy: MeridianJournalEntry = {
        id: `journal-auto-${Date.now()}`,
        title: `Study: Empirical Validation of ${exp.title}`,
        articleSlug: 'ask-meridian-monetization-flywheel',
        articleTitle: 'From Articles to Autonomous Cashflow: The Ask-Meridian Flywheel',
        hypothesis: exp.hypothesis,
        methodology: `Evaluated across ${exp.impressions.toLocaleString()} live impressions with dual-gateway telemetry.`,
        observedRoi: `+${exp.currentConversionRate.toFixed(1)}% conversion rate ($${exp.revenueEarned} generated)`,
        conversionDelta: Number(exp.currentConversionRate.toFixed(1)),
        sampleSize: exp.impressions || 500,
        status: 'published',
        author: 'Maya Lin & Tango The Otter',
        authorRole: 'Autonomous Revenue Research',
        publishedAt: Date.now(),
        commitSha: evaluatedSha,
        tags: ['Empirical Validation', 'Conversion Rate Optimization', 'Autonomous CI/CD'],
        insights: [
          `Achieved ${exp.currentConversionRate.toFixed(1)}% conversion rate against target ${exp.targetConversionRate}%.`,
          'Automated merge to main branch succeeded with zero developer intervention.',
          `Treasury added $${exp.revenueEarned} via verified checkout endpoints.`,
        ],
      };
      setJournalEntries((prev) => [newJournalStudy, ...prev]);

      setCharacters((prev) =>
        prev.map((c) =>
          c.id === 'tango'
            ? {
                ...c,
                action: 'cheer',
                currentBubble: {
                  id: `bubble-cheer-${Date.now()}`,
                  text: `*happy otter dance* ${exp.title} hit ${exp.currentConversionRate.toFixed(
                    1
                  )}%! Merged & logged to Meridian Journal!`,
                  role: 'CFO',
                  timestamp: Date.now(),
                  expiresAt: Date.now() + 6000,
                },
              }
            : c
        )
      );
    } else {
      // ROLLBACK -> Git revert
      sounds.playRollback();

      setExperiments((prev) =>
        prev.map((e) =>
          e.id === experimentId
            ? {
                ...e,
                status: 'rolled_back',
                evaluatedAt: Date.now(),
                decisionReason: `Decommissioned! Conversion was ${e.currentConversionRate.toFixed(
                  1
                )}% (Below ${e.targetConversionRate}% target). Reverted from branch with zero clutter.`,
              }
            : e
        )
      );

      const revertCommit: GitCommit = {
        sha: evaluatedSha,
        author: 'Autonomous Rollback Engine',
        authorRole: 'QA / DevOps',
        message: `revert(experiment): rollback ${exp.branch} [conversion < threshold]`,
        branch: 'main',
        timestamp: Date.now(),
        type: 'revert_rollback',
        experimentId: exp.id,
        diffSummary: '- Clean rollback executed via git revert',
      };
      setGitCommits((prev) => [revertCommit, ...prev]);

      setCompanyStats((prev) => ({
        ...prev,
        rolledBackCount: prev.rolledBackCount + 1,
        activeExperimentsCount: Math.max(0, prev.activeExperimentsCount - 1),
        gitCommitsCount: prev.gitCommitsCount + 1,
      }));

      setCharacters((prev) =>
        prev.map((c) =>
          c.id === 'maya'
            ? {
                ...c,
                action: 'talk',
                currentBubble: {
                  id: `bubble-rollback-${Date.now()}`,
                  text: `Cleaned up ${exp.title}. Zero technical debt left behind!`,
                  role: 'CPO',
                  timestamp: Date.now(),
                  expiresAt: Date.now() + 6000,
                },
              }
            : c
        )
      );
    }
  };

  // 9. Simulate Donation from Sandbox
  const handleSimulateDonation = (experimentId: string, amount: number) => {
    setExperiments((prev) =>
      prev.map((e) =>
        e.id === experimentId
          ? {
              ...e,
              conversions: e.conversions + 1,
              clicks: e.clicks + 1,
              impressions: e.impressions + 1,
              revenueEarned: e.revenueEarned + amount,
              currentConversionRate: ((e.conversions + 1) / (e.impressions + 1)) * 100,
            }
          : e
      )
    );

    setCompanyStats((prev) => ({
      ...prev,
      totalRevenue: prev.totalRevenue + amount,
      totalDonationsCount: prev.totalDonationsCount + 1,
    }));
  };

  // 10. Direct Patron Donation
  const handleDonationSuccess = (amount: number, note: string) => {
    setCompanyStats((prev) => ({
      ...prev,
      totalRevenue: prev.totalRevenue + amount,
      totalDonationsCount: prev.totalDonationsCount + 1,
      gitCommitsCount: prev.gitCommitsCount + 1,
    }));

    const patronSha = Math.random().toString(16).substring(2, 9);
    const patronCommit: GitCommit = {
      sha: patronSha,
      author: 'Tango Otter (Treasury Bot)',
      authorRole: 'Finance',
      message: `feat(patron): donor contributed $${amount} via PayPal (lk3mpe) / MercadoPago (lkempe) - "${note}"`,
      branch: 'main',
      timestamp: Date.now(),
      type: 'feat',
      experimentId: 'patron',
      diffSummary: `+ $${amount} added to treasury funds`,
    };
    setGitCommits((prev) => [patronCommit, ...prev]);

    setCharacters((prev) =>
      prev.map((c) =>
        c.id === 'tango'
          ? {
              ...c,
              action: 'cheer',
              currentBubble: {
                id: `bubble-patron-${Date.now()}`,
                text: `*celebrates!* Received $${amount} in treasury! Thank you!`,
                role: 'CFO',
                timestamp: Date.now(),
                expiresAt: Date.now() + 7000,
              },
            }
          : c
      )
    );
  };

  // 11. Furniture Interaction
  const handleFurnitureClick = (item: FurnitureItem) => {
    if (item.type === 'coffee_machine') {
      sounds.playCoffee();
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === 'maya' || c.id === 'leo'
            ? {
                ...c,
                action: 'coffee',
                currentBubble: {
                  id: `coffee-${Date.now()}`,
                  text: 'Fresh espresso boost! Ready for sprint deploys.',
                  role: c.role,
                  timestamp: Date.now(),
                  expiresAt: Date.now() + 4000,
                },
              }
            : c
        )
      );
    } else if (item.type === 'server_rack') {
      sounds.playDeployChime();
      setActiveTab('github');
    } else if (item.type === 'donation_kiosk') {
      sounds.playCoin();
      setIsDonationOpen(true);
    } else if (item.type === 'whiteboard') {
      sounds.playBubblePop();
      setActiveTab('journal');
    } else if (item.type === 'otter_statue') {
      sounds.playCoin();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#FBBF24', '#F59E0B'],
      });
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === 'tango'
            ? {
                ...c,
                action: 'cheer',
                currentBubble: {
                  id: `statue-${Date.now()}`,
                  text: 'Golden Otter Fortune granted! +10% conversion aura!',
                  role: 'CFO',
                  timestamp: Date.now(),
                  expiresAt: Date.now() + 5000,
                },
              }
            : c
        )
      );
    }
  };

  // 12. Manual Publish to Meridian Journal
  const handlePublishJournalEntry = (
    entryData: Omit<MeridianJournalEntry, 'id' | 'publishedAt' | 'commitSha'>
  ) => {
    sounds.playDeployChime();
    const newSha = Math.random().toString(16).substring(2, 9);
    const newEntry: MeridianJournalEntry = {
      ...entryData,
      id: `journal-${Date.now()}`,
      publishedAt: Date.now(),
      commitSha: newSha,
    };

    setJournalEntries((prev) => [newEntry, ...prev]);

    // Commit to git pipeline
    const journalCommit: GitCommit = {
      sha: newSha,
      author: entryData.author,
      authorRole: 'Research Fellow',
      message: `docs(journal): publish ${entryData.title} to LuuOW/Meridian-Research-Journal`,
      branch: 'main',
      timestamp: Date.now(),
      type: 'feat',
      experimentId: 'journal',
      diffSummary: `+ 1 paper published (${entryData.tags.join(', ')})`,
    };
    setGitCommits((prev) => [journalCommit, ...prev]);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // 13. Autonomous Peer-to-Peer Interaction & Token Budget Deduction
  const handleTriggerPeerInteraction = async () => {
    if (isInteractingPeers) return;
    setIsInteractingPeers(true);

    // Pick pairs that generate high synergy: Banner Sentinel, LinkedIn Visionary, Gemini Omni, Maya, Tango
    const synergyPairs = [
      { c1: 'banner_sentinel', c2: 'linkedin_companion' },
      { c1: 'gemini_omni_3d', c2: 'banner_sentinel' },
      { c1: 'linkedin_companion', c2: 'maya' },
      { c1: 'banner_sentinel', c2: 'tango' },
      { c1: 'gemini_omni_3d', c2: 'linkedin_companion' },
    ];
    const pair = synergyPairs[Math.floor(Math.random() * synergyPairs.length)];
    const char1 = characters.find((c) => c.id === pair.c1);
    const char2 = characters.find((c) => c.id === pair.c2);

    sounds.playBubblePop();

    try {
      const res = await fetch('/api/company/peer-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          char1Id: pair.c1,
          char2Id: pair.c2,
          currentTreasury: companyStats.totalRevenue,
          interactionCount: peerInteractionCount + 1,
        }),
      });

      const data = await res.json();
      const tokensBurned = data.tokensBurned || 1500;
      const tokenCostUsd = data.tokenCostUsd || 0.0009;

      // 1. Deduct token budget from both characters & record compute cost
      const halfBurn = Math.round(tokensBurned / 2);
      setCharacters((prev) =>
        prev.map((c) => {
          if (c.id === pair.c1 || c.id === pair.c2) {
            const currentProfile = c.tokenProfile || {
              tokenBudget: 50000,
              tokensConsumed: 0,
              computeCostUsd: 0,
              revenueAttributedUsd: 0,
            };
            return {
              ...c,
              tokenProfile: {
                ...currentProfile,
                tokensConsumed: currentProfile.tokensConsumed + halfBurn,
                computeCostUsd: Number((currentProfile.computeCostUsd + tokenCostUsd / 2).toFixed(6)),
              },
            };
          }
          return c;
        })
      );

      // 2. Deduct company treasury & update compute accounting
      setCompanyStats((prev) => ({
        ...prev,
        totalTokensBurned: prev.totalTokensBurned + tokensBurned,
        totalComputeCostUsd: Number((prev.totalComputeCostUsd + tokenCostUsd).toFixed(6)),
        netProfitUsd: Number((prev.totalRevenue - (prev.totalComputeCostUsd + tokenCostUsd)).toFixed(5)),
      }));

      // 3. Sequential speech bubbles
      const dlg = data.dialogue || {
        speaker1Text: `${char1?.name}: Analyzing conversion metrics with Temp 0.7...`,
        speaker2Text: `${char2?.name}: Concurred! Routing patron traffic to PayPal & MercadoPago.`,
        creativeConcept: 'Autonomous dynamic micro-patronage threshold',
      };

      // Speaker 1 talks
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === pair.c1
            ? {
                ...c,
                action: 'talk',
                currentBubble: {
                  id: `bubble-peer1-${Date.now()}`,
                  text: dlg.speaker1Text,
                  role: c.role,
                  timestamp: Date.now(),
                  expiresAt: Date.now() + 6500,
                },
              }
            : c
        )
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-peer1-${Date.now()}`,
          senderId: pair.c1,
          senderName: char1?.name || 'Teammate 1',
          senderRole: char1?.role || 'Staff',
          text: dlg.speaker1Text,
          timestamp: Date.now(),
          type: 'discussion',
        },
      ]);

      // Speaker 2 responds after 1.8s
      setTimeout(() => {
        sounds.playBubblePop();
        setCharacters((prev) =>
          prev.map((c) =>
            c.id === pair.c2
              ? {
                  ...c,
                  action: pair.c2 === 'tango' ? 'cheer' : 'talk',
                  currentBubble: {
                    id: `bubble-peer2-${Date.now()}`,
                    text: dlg.speaker2Text,
                    role: c.role,
                    timestamp: Date.now(),
                    expiresAt: Date.now() + 6500,
                  },
                }
              : c
          )
        );

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-peer2-${Date.now()}`,
            senderId: pair.c2,
            senderName: char2?.name || 'Teammate 2',
            senderRole: char2?.role || 'Staff',
            text: dlg.speaker2Text,
            timestamp: Date.now(),
            type: 'discussion',
          },
        ]);
      }, 1800);

      // 4. Threshold Check (e.g., after 6 interactions, spawn a creative experiment!)
      const nextCount = peerInteractionCount + 1;
      const threshold = companyStats.geminiParams.interactionBurstThreshold;
      if (nextCount >= threshold) {
        setPeerInteractionCount(0);
        setTimeout(() => {
          sounds.playDeployChime();
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#38BDF8', '#C084FC', '#10B981'],
          });

          // Banner Sentinel or Gemini Omni automatically generates an autonomous experiment!
          const autoExpId = `exp-peer-${Date.now()}`;
          const newExp: Experiment = {
            id: autoExpId,
            title: `Peer Synergy: ${dlg.creativeConcept || 'Dynamic Patron Funnel'}`,
            description: `Auto-conceived by ${char1?.name} & ${char2?.name} after ${threshold} collaborative brainstorming cycles.`,
            category: 'donation_banner',
            hypothesis: `Combining Banner Sentinel pixel positioning with 2035 futuristic copy lifts conversion above 4.5%.`,
            targetConversionRate: 4.5,
            currentConversionRate: 0.0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenueEarned: 0,
            branch: `experiment/synergy-${Date.now().toString().slice(-4)}`,
            commitSha: Math.random().toString(16).substring(2, 9),
            commitMessage: `feat(synergy): autonomous deploy generated by ${char1?.name} & ${char2?.name}`,
            codeDiffPreview: `+ // Autonomous Peer Collab Code`,
            status: 'live',
            createdAt: Date.now(),
            deployedAt: Date.now(),
            bannerHeadline: 'Direct Patronage: Power Autonomous Research',
            bannerSubtext: 'Every dollar goes directly to ask-meridian.uk open papers & Moon Plaza treasury.',
            suggestedAmounts: [10, 25, 50, 100],
            paymentConfig: {
              paypalUrl: 'https://paypal.me/lk3mpe',
              mercadopagoAlias: 'lkempe',
            },
          };

          setExperiments((prev) => [newExp, ...prev]);
          setCompanyStats((prev) => ({
            ...prev,
            activeExperimentsCount: prev.activeExperimentsCount + 1,
            gitCommitsCount: prev.gitCommitsCount + 1,
          }));
        }, 3200);
      } else {
        setPeerInteractionCount(nextCount);
      }
    } catch (err) {
      console.error('Peer interaction error:', err);
    } finally {
      setIsInteractingPeers(false);
    }
  };

  // 14. Generate 3D Short Scene via Gemini Omni
  const handleGenerateNewShort = async (platform: string) => {
    setIsGeneratingShort(true);
    sounds.playBubblePop();

    try {
      const res = await fetch('/api/company/generate-3d-short', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          topic: 'Autonomous AI mascot managing real treasury with PayPal lk3mpe and MercadoPago lkempe',
        }),
      });

      const data = await res.json();
      if (data.shortScene) {
        setThreeDShorts((prev) => [data.shortScene, ...prev]);

        // Deduct compute cost from gemini_omni_3d character profile
        setCharacters((prev) =>
          prev.map((c) => {
            if (c.id === 'gemini_omni_3d') {
              const cp = c.tokenProfile || {
                tokenBudget: 100000,
                tokensConsumed: 0,
                computeCostUsd: 0,
                revenueAttributedUsd: 0,
              };
              return {
                ...c,
                action: 'type',
                currentBubble: {
                  id: `short-rendered-${Date.now()}`,
                  text: `Rendered 3D spatial scene for ${platform}! Burned ${data.tokensBurned} tokens ($${data.tokenCostUsd} USD).`,
                  role: c.role,
                  timestamp: Date.now(),
                  expiresAt: Date.now() + 6500,
                },
                tokenProfile: {
                  ...cp,
                  tokensConsumed: cp.tokensConsumed + data.tokensBurned,
                  computeCostUsd: Number((cp.computeCostUsd + data.tokenCostUsd).toFixed(6)),
                },
              };
            }
            return c;
          })
        );

        // Update company compute stats
        setCompanyStats((prev) => ({
          ...prev,
          totalTokensBurned: prev.totalTokensBurned + data.tokensBurned,
          totalComputeCostUsd: Number((prev.totalComputeCostUsd + data.tokenCostUsd).toFixed(6)),
          netProfitUsd: Number((prev.totalRevenue - (prev.totalComputeCostUsd + data.tokenCostUsd)).toFixed(5)),
          total3DShortsRendered: prev.total3DShortsRendered + 1,
        }));

        sounds.playDeployChime();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#34D399', '#6EE7B7'],
        });
      }
    } catch (err) {
      console.error('Error generating 3D short:', err);
    } finally {
      setIsGeneratingShort(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <HeaderNav
        stats={companyStats}
        onOpenArticles={() => setIsArticlesOpen(true)}
        onOpenDonation={() => setIsDonationOpen(true)}
        onOpenJournalTab={() => setActiveTab('journal')}
        onOpen3DShorts={() => setIs3DShortsOpen(true)}
        onOpenUnitTest={() => setIsUnitTestOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          sounds.enabled = !soundEnabled;
          setSoundEnabled(!soundEnabled);
        }}
        isAutonomousLive={isAutonomousSimulation}
        onToggleAutonomous={() => setIsAutonomousSimulation(!isAutonomousSimulation)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-5">
        {/* Live Simulation Control Ticker & Action Bar */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono-code font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              HQ Simulation Controls:
            </span>

            <button
              onClick={() => {
                sounds.playBubblePop();
                setIsAutonomousSimulation(!isAutonomousSimulation);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono-code font-bold transition border ${
                isAutonomousSimulation
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isAutonomousSimulation ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>Agent Banter: {isAutonomousSimulation ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                sounds.playBubblePop();
                setIsAutonomousTraffic(!isAutonomousTraffic);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono-code font-bold transition border ${
                isAutonomousTraffic
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Live Traffic: {isAutonomousTraffic ? 'PULSING (3.8s)' : 'PAUSED'}</span>
            </button>

            {/* Creative Peer Interaction Burst (Burn Tokens & Trigger Synergy) */}
            <button
              onClick={handleTriggerPeerInteraction}
              disabled={isInteractingPeers}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 hover:text-purple-100 border border-purple-500/40 text-[11px] font-mono-code font-bold transition disabled:opacity-50"
              title="Trigger real-time banter between Banner Sentinel, LinkedIn Companion, and Gemini Omni (Temperature 0.7, Top P 0.95, Max 500k)"
            >
              <Cpu className={`w-3 h-3 text-purple-400 ${isInteractingPeers ? 'animate-spin' : ''}`} />
              <span>
                {isInteractingPeers
                  ? 'Interacting...'
                  : `Peer Collab (${peerInteractionCount}/${companyStats.geminiParams.interactionBurstThreshold})`}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIs3DShortsOpen(true)}
              className="px-2.5 py-1 rounded-md bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono-code transition font-bold flex items-center gap-1"
            >
              <Film className="w-3 h-3" />
              <span>3D Shorts Lab</span>
            </button>

            <button
              onClick={() => setIsUnitTestOpen(true)}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-mono-code transition font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Run Tests</span>
            </button>

            <button
              onClick={() => {
                if (experiments[0]) handleSimulateTraffic(experiments[0].id, 100, 0.1);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-mono-code transition font-bold"
            >
              +100 Visitors
            </button>

            <button
              onClick={() => handleFurnitureClick({ type: 'coffee_machine' } as any)}
              className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono-code transition flex items-center gap-1"
            >
              <Coffee className="w-3 h-3" />
              <span>Espresso</span>
            </button>

            <button
              onClick={() => handleDonationSuccess(25, 'Autonomous Test Patron')}
              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono-code font-bold transition shadow"
            >
              +$25 Tip
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('office')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'office'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Habbo Isometric HQ</span>
          </button>

          <button
            onClick={() => setActiveTab('experiments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'experiments'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Experiments &amp; Decision Engine</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-amber-300">
              {experiments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'journal'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Meridian Research Journal</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-950 text-indigo-300 font-mono-code border border-indigo-800">
              {journalEntries.length} papers
            </span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'github'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub Pipeline ({companyStats.githubRepo})</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-sky-300 font-mono-code">
              {gitCommits.length} commits
            </span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>All-Hands Chat Feed</span>
          </button>
        </div>

        {/* Tab 1: Habbo Isometric Office View & Broadcaster */}
        {activeTab === 'office' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Isometric Room Canvas */}
            <IsometricRoomCanvas
              characters={characters}
              furniture={furniture}
              onPlayerMove={handlePlayerMove}
              onCharacterClick={(char) => {
                setSelectedCharacter(char);
                setActiveTab('chat');
              }}
              onFurnitureClick={handleFurnitureClick}
              isBrainstorming={isBrainstorming}
            />

            {/* Founder Idea Broadcaster */}
            <FounderIdeaBroadcaster
              onBroadcastIdea={handleBroadcastIdea}
              isBrainstorming={isBrainstorming}
            />

            {/* Quick-View Grid: Experiments Summary + All-Hands Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7">
                <LiveExperimentsBoard
                  experiments={experiments}
                  onSimulateTraffic={handleSimulateTraffic}
                  onEvaluateExperiment={handleEvaluateExperiment}
                  onSimulateDonation={handleSimulateDonation}
                />
              </div>

              <div className="lg:col-span-5">
                <CompanyChatBox
                  messages={messages}
                  characters={characters}
                  onSendMessage={handleSendMessage}
                  selectedCharacter={selectedCharacter}
                  onSelectCharacter={setSelectedCharacter}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Experiments & Automated Decision Board */}
        {activeTab === 'experiments' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <FounderIdeaBroadcaster
              onBroadcastIdea={handleBroadcastIdea}
              isBrainstorming={isBrainstorming}
            />
            <LiveExperimentsBoard
              experiments={experiments}
              onSimulateTraffic={handleSimulateTraffic}
              onEvaluateExperiment={handleEvaluateExperiment}
              onSimulateDonation={handleSimulateDonation}
            />
          </div>
        )}

        {/* Tab 3: Meridian Research Journal Pipeline */}
        {activeTab === 'journal' && (
          <MeridianJournalPipeline
            journalEntries={journalEntries}
            articles={MERIDIAN_ARTICLES}
            onPublishEntry={handlePublishJournalEntry}
            journalRepo={companyStats.journalRepo}
          />
        )}

        {/* Tab 4: GitHub Deployment Pipeline View */}
        {activeTab === 'github' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <GitHubDeploymentPipeline
              commits={gitCommits}
              repoUrl={companyStats.githubRepo}
              isDeploying={isBrainstorming}
            />
            <LiveExperimentsBoard
              experiments={experiments}
              onSimulateTraffic={handleSimulateTraffic}
              onEvaluateExperiment={handleEvaluateExperiment}
              onSimulateDonation={handleSimulateDonation}
            />
          </div>
        )}

        {/* Tab 5: All-Hands Chat */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-150">
            <div className="lg:col-span-8">
              <CompanyChatBox
                messages={messages}
                characters={characters}
                onSendMessage={handleSendMessage}
                selectedCharacter={selectedCharacter}
                onSelectCharacter={setSelectedCharacter}
              />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3">
                <h4 className="font-bold text-slate-100 font-mono-code flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Autonomous Teammates
                </h4>
                <div className="space-y-2">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => setSelectedCharacter(char)}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-200 block">{char.name}</span>
                        <span className="text-[10px] text-slate-400">{char.role}</span>
                        {char.statusText && (
                          <span className="text-[9px] text-amber-400/80 block mt-0.5">
                            &bull; {char.statusText}
                          </span>
                        )}
                      </div>
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: char.avatar.shirtColor }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Meridian Articles Knowledge Modal */}
      <MeridianArticlesModal
        articles={MERIDIAN_ARTICLES}
        isOpen={isArticlesOpen}
        onClose={() => setIsArticlesOpen(false)}
        onDeployFromArticle={(art) => {
          handleBroadcastIdea(
            `Develop and deploy a monetization experiment for "${art.title}": ${art.suggestedMonetization} with PayPal (lk3mpe) & MercadoPago (lkempe)`
          );
        }}
      />

      {/* Donation & Patron Modal */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        onDonationSuccess={handleDonationSuccess}
      />

      {/* 3D Shorts Spatial Production Modal (Gemini Omni API) */}
      <ThreeDShortsModal
        isOpen={is3DShortsOpen}
        onClose={() => setIs3DShortsOpen(false)}
        shorts={threeDShorts}
        onGenerateNewShort={handleGenerateNewShort}
        isGenerating={isGeneratingShort}
        stats={companyStats}
      />

      {/* Extensive Moon Plaza Unit Test Suite Modal */}
      <UnitTestModal
        isOpen={isUnitTestOpen}
        onClose={() => setIsUnitTestOpen(false)}
        characters={characters}
        experiments={experiments}
        companyStats={companyStats}
        threeDShorts={threeDShorts}
      />
    </div>
  );
}
