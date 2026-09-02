/**
 * Types for Moon Plaza: Tango Otter HQ
 * Habbo-style Isometric Pixel Office & Autonomous Revenue Experimentation
 */

export type Direction = 0 | 1 | 2 | 3; // 0: SE, 1: SW, 2: NW, 3: NE

export type CharacterAction = 'idle' | 'walk' | 'type' | 'talk' | 'cheer' | 'coffee';

export type DepartmentType =
  | 'Executive'
  | 'Product'
  | 'Engineering'
  | 'Growth'
  | 'Finance'
  | 'Banner Engineering'
  | 'LinkedIn Futuristic Vision'
  | '3D Shorts Lab'
  | 'Operations';

export interface AvatarStyle {
  skinColor: string;
  hairStyle: 'messy' | 'short' | 'pompadour' | 'curly' | 'otter_fur' | 'slick' | 'hologram_crest' | 'neural_halo';
  hairColor: string;
  shirtStyle: 'hoodie' | 'tshirt' | 'suit' | 'turtleneck' | 'otter_vest' | 'billboard_frame' | 'futuristic_robe' | 'director_jacket';
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
  accessory?: 'glasses' | 'headset' | 'badge' | 'coffee_cup' | 'tie' | 'otter_ears' | 'hologram_display' | 'camera_lens' | 'neon_visor';
  isMascot?: boolean;
}

export interface SpeechBubble {
  id: string;
  text: string;
  isIdea?: boolean;
  role?: string;
  timestamp: number;
  durationMs?: number;
  expiresAt?: number;
  tokenCost?: number;
  tokensConsumed?: number;
}

export interface CharacterTokenProfile {
  tokenBudget: number; // e.g. 50,000 tokens allocated
  tokensConsumed: number; // total tokens burned
  tokenCostRateUsd: number; // e.g. $0.00002 / token
  totalMoneyBurnedUsd: number; // actual money deducted from treasury
  revenueAttributedUsd: number; // revenue from kept experiments originating from this character
  interactionTurns: number;
  budgetWarningThreshold: number; // percentage (e.g. 80%)
}

export interface Character {
  id: string;
  name: string;
  role: string;
  department: DepartmentType;
  bio: string;
  x: number; // grid X (0-11)
  y: number; // grid Y (0-11)
  targetX?: number;
  targetY?: number;
  direction: Direction;
  action: CharacterAction;
  avatar: AvatarStyle;
  currentBubble?: SpeechBubble;
  assignedDesk?: { x: number; y: number; dir: Direction };
  isPlayer?: boolean;
  statusText?: string;
  tokenProfile: CharacterTokenProfile;
}

export interface GeminiParametersConfig {
  temperature: number; // 0.7
  maxOutputTokens: number; // 500,000 (500K)
  topP: number; // 0.95
  frequencyPenalty: number; // 0
  presencePenalty: number; // 0
  interactionBurstThreshold: number; // e.g. 6 rounds before cooldown/approval
  costPerInputTokenUsd: number; // $0.00000015
  costPerOutputTokenUsd: number; // $0.0000006
}

export interface ThreeDShortScene {
  id: string;
  title: string;
  concept: string;
  durationSeconds: number; // e.g. 15, 30, 45, 60
  targetPlatform: 'YouTube Shorts' | 'TikTok' | 'Instagram Reels' | 'Spatial Web';
  cameraScript: string;
  spatialPrompt: string;
  habboAssetsRequired: string[];
  viralHook: string;
  monetizationCallToAction: string;
  tokensBurned: number;
  tokenCostUsd: number;
  status: 'draft' | 'rendered' | 'published';
  createdAt: number;
  directorCharacterId: string;
  previewColor: string;
}

export interface UnitTestResult {
  id: string;
  suiteName: string;
  testName: string;
  passed: boolean;
  durationMs: number;
  details: string;
  error?: string;
}

export interface FurnitureItem {
  id: string;
  name: string;
  type: 'desk' | 'chair' | 'server_rack' | 'coffee_machine' | 'whiteboard' | 'sofa' | 'plant' | 'donation_kiosk' | 'otter_statue' | 'arcade_machine' | 'window' | 'banner_pod' | 'holo_stage' | 'omni_render_rig';
  x: number;
  y: number;
  w: number;
  h: number;
  direction: Direction;
  color?: string;
  label?: string;
  interactable?: boolean;
  interactionTooltip?: string;
}

export type ExperimentCategory =
  | 'donation_banner'
  | 'paywall'
  | 'sponsorship_card'
  | 'meridian_tier'
  | 'interactive_tip_capsule';

export type ExperimentStatus =
  | 'proposed'
  | 'deploying'
  | 'live'
  | 'evaluating'
  | 'kept'
  | 'rolled_back';

export interface Experiment {
  id: string;
  title: string;
  description: string;
  category: ExperimentCategory;
  hypothesis: string;
  targetConversionRate: number; // e.g. 4.5%
  currentConversionRate: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenueEarned: number; // in USD / equivalent
  branch: string;
  commitSha: string;
  commitMessage: string;
  codeDiffPreview: string;
  status: ExperimentStatus;
  createdAt: number;
  deployedAt?: number;
  evaluatedAt?: number;
  decisionReason?: string;
  bannerHeadline: string;
  bannerSubtext: string;
  suggestedAmounts: number[];
  paymentConfig: {
    paypalUrl: string;
    mercadopagoAlias: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: number;
  type: 'idea' | 'discussion' | 'decision' | 'system' | 'celebration';
  experimentId?: string;
}

export interface GitCommit {
  sha: string;
  author: string;
  authorRole: string;
  message: string;
  branch: string;
  timestamp: number;
  type: 'feat' | 'deploy' | 'merge_kept' | 'revert_rollback';
  experimentId: string;
  diffSummary: string;
}

export interface MeridianArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  suggestedMonetization: string;
  readTime: string;
}

export interface MeridianJournalEntry {
  id: string;
  title: string;
  articleSlug: string;
  articleTitle: string;
  hypothesis: string;
  methodology: string;
  observedRoi: string;
  conversionDelta: number; // e.g. +4.8%
  sampleSize: number;
  status: 'published' | 'peer_reviewed' | 'in_progress';
  author: string;
  authorRole: string;
  publishedAt: number;
  commitSha: string;
  tags: string[];
  insights: string[];
}

export interface CompanyStats {
  totalRevenue: number;
  totalDonationsCount: number;
  activeExperimentsCount: number;
  keptExperimentsCount: number;
  rolledBackCount: number;
  gitCommitsCount: number;
  totalCompanyBrainstorms: number;
  totalTokensBurned: number;
  totalComputeCostUsd: number;
  netProfitUsd: number;
  total3DShortsRendered: number;
  geminiParams: GeminiParametersConfig;
  githubRepo: string;
  journalRepo: string;
  isAutonomousLive: boolean;
}
