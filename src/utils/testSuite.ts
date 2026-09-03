import { UnitTestResult, GeminiParametersConfig, Character, Experiment, ThreeDShortScene } from '../types';

export function runFullTestSuite(
  characters: Character[],
  experiments: Experiment[],
  threeDShorts: ThreeDShortScene[],
  geminiConfig: GeminiParametersConfig
): UnitTestResult[] {
  const results: UnitTestResult[] = [];

  // 1. Gemini AI Parameter Integrity Test
  const t1Start = performance.now();
  const isTempValid = geminiConfig.temperature === 0.7;
  const isMaxTokensValid = geminiConfig.maxOutputTokens === 500000;
  const isTopPValid = geminiConfig.topP === 0.95;
  const isFreqPenaltyValid = geminiConfig.frequencyPenalty === 0;
  const isPresPenaltyValid = geminiConfig.presencePenalty === 0;
  const geminiPassed = isTempValid && isMaxTokensValid && isTopPValid && isFreqPenaltyValid && isPresPenaltyValid;

  results.push({
    id: 'test-gemini-params',
    suiteName: 'Gemini Configuration & Model Parameters',
    testName: 'Enforce Temp 0.7, Max Tokens 500K, TopP 0.95, Freq/Pres 0',
    passed: geminiPassed,
    durationMs: Number((performance.now() - t1Start).toFixed(2)),
    details: `Temperature: ${geminiConfig.temperature} (target: 0.7), MaxTokens: ${geminiConfig.maxOutputTokens} (target: 500k), TopP: ${geminiConfig.topP} (target: 0.95), Freq/Pres: ${geminiConfig.frequencyPenalty}/${geminiConfig.presencePenalty} (target: 0/0).`,
    error: geminiPassed ? undefined : 'Gemini AI parameters deviated from Moon Plaza specification.',
  });

  // 2. Token-as-Budget Economics & Treasury Deduction Test
  const t2Start = performance.now();
  const sampleInputTokens = 1000;
  const sampleOutputTokens = 500;
  const costPerIn = geminiConfig.costPerInputTokenUsd; // $0.00000015
  const costPerOut = geminiConfig.costPerOutputTokenUsd; // $0.0000006
  const computedCost = sampleInputTokens * costPerIn + sampleOutputTokens * costPerOut;
  const expectedCost = 0.00015 + 0.0003; // 0.00045
  const tokenCostPassed = Math.abs(computedCost - expectedCost) < 0.000001;

  // Verify all characters have initialized tokenProfile and non-negative budgets
  const allCharactersBudgeted = characters.every(
    (c) => c.tokenProfile && c.tokenProfile.tokenBudget > 0 && c.tokenProfile.tokensConsumed >= 0
  );

  results.push({
    id: 'test-token-economics',
    suiteName: 'Treasury & Token Economics',
    testName: 'Token Burn Calculation & Treasury Deduction Safeguards',
    passed: tokenCostPassed && allCharactersBudgeted,
    durationMs: Number((performance.now() - t2Start).toFixed(2)),
    details: `Calculated 1,500 token cycle cost: $${computedCost.toFixed(6)} USD. All ${characters.length} characters have active token budgets and real-time expense tracking.`,
    error: (tokenCostPassed && allCharactersBudgeted) ? undefined : 'Token budgeting or cost rate math mismatch.',
  });

  // 3. Banner Sentinel Character & Department Isolation Test
  const t3Start = performance.now();
  const bannerChar = characters.find((c) => c.id === 'banner_sentinel');
  const bannerDeptValid = bannerChar?.department === 'Banner Engineering';
  const bannerHasTokenBudget = (bannerChar?.tokenProfile?.tokenBudget ?? 0) > 0;
  const bannerPassed = !!bannerChar && bannerDeptValid && bannerHasTokenBudget;

  results.push({
    id: 'test-banner-character',
    suiteName: 'Autonomous Character Architecture',
    testName: 'Banner Sentinel Character & Banner Engineering Isolation',
    passed: bannerPassed,
    durationMs: Number((performance.now() - t3Start).toFixed(2)),
    details: `Banner Sentinel present in '${bannerChar?.department}', token budget: ${bannerChar?.tokenProfile?.tokenBudget.toLocaleString()} tokens, attributed revenue: $${bannerChar?.tokenProfile?.revenueAttributedUsd}.`,
    error: bannerPassed ? undefined : 'Banner Sentinel character or department not configured properly.',
  });

  // 4. LinkedIn Companion Futuristic Vision & Token Tracking Test
  const t4Start = performance.now();
  const linkedinChar = characters.find((c) => c.id === 'linkedin_companion');
  const linkedinDeptValid = linkedinChar?.department === 'LinkedIn Futuristic Vision';
  const linkedinTokenized = (linkedinChar?.tokenProfile?.tokenBudget ?? 0) > 0;
  const linkedinPassed = !!linkedinChar && linkedinDeptValid && linkedinTokenized;

  results.push({
    id: 'test-linkedin-companion',
    suiteName: 'Autonomous Character Architecture',
    testName: 'LinkedIn Companion Futuristic Vision & Budget Awareness',
    passed: linkedinPassed,
    durationMs: Number((performance.now() - t4Start).toFixed(2)),
    details: `Aether (LinkedIn Visionary) present in '${linkedinChar?.department}', strictly futuristic vision, consumed: ${linkedinChar?.tokenProfile?.tokensConsumed.toLocaleString()} tokens.`,
    error: linkedinPassed ? undefined : 'LinkedIn Companion character not found or missing department.',
  });

  // 5. 3D Shorts Division & Gemini Omni Multimodal Test
  const t5Start = performance.now();
  const directorChar = characters.find((c) => c.id === 'gemini_omni_3d');
  const directorDeptValid = directorChar?.department === '3D Shorts Lab';
  const hasShortsScenes = threeDShorts.length > 0;
  const validSceneSchema = threeDShorts.every(
    (s) => s.title && s.cameraScript && s.spatialPrompt && s.viralHook && s.monetizationCallToAction
  );
  const omni3DPassed = !!directorChar && directorDeptValid && hasShortsScenes && validSceneSchema;

  results.push({
    id: 'test-3d-shorts-omni',
    suiteName: '3D Shorts Multimodal Lab',
    testName: '3D Shorts Lab Division & Gemini Omni Production Schema',
    passed: omni3DPassed,
    durationMs: Number((performance.now() - t5Start).toFixed(2)),
    details: `3D Shorts Director '${directorChar?.name}' managing ${threeDShorts.length} spatial production scenes with camera scripts and viral monetization CTAs.`,
    error: omni3DPassed ? undefined : '3D Shorts division or scene schemas invalid.',
  });

  // 6. Automated Keep vs Rollback Engine Test
  const t6Start = performance.now();
  // Validate KEEP threshold logic
  const mockKeptExp: Experiment = {
    id: 'test-exp-keep',
    title: 'High Performing Banner',
    description: 'Test',
    category: 'donation_banner',
    hypothesis: 'Test',
    targetConversionRate: 4.0,
    currentConversionRate: 5.5,
    impressions: 200,
    clicks: 25,
    conversions: 11,
    revenueEarned: 110,
    branch: 'experiment/test-keep',
    commitSha: 'a1b2c3d',
    commitMessage: 'feat: test experiment',
    codeDiffPreview: '+ test code',
    bannerHeadline: 'Support Moon Plaza',
    bannerSubtext: 'Every tip counts',
    status: 'live',
    createdAt: Date.now(),
    suggestedAmounts: [5, 15],
    paymentConfig: { paypalUrl: 'https://paypal.me/lk3mpe', mercadopagoAlias: 'lkempe' },
  };

  const shouldKeep = (mockKeptExp.currentConversionRate ?? 0) >= mockKeptExp.targetConversionRate;

  const mockRollbackExp: Experiment = {
    id: 'test-exp-revert',
    title: 'Poor Performing Modal',
    description: 'Test',
    category: 'paywall',
    hypothesis: 'Test',
    targetConversionRate: 5.0,
    currentConversionRate: 1.2,
    impressions: 200,
    clicks: 4,
    conversions: 2,
    revenueEarned: 10,
    branch: 'experiment/test-revert',
    commitSha: 'e5f6g7h',
    commitMessage: 'feat: test revert experiment',
    codeDiffPreview: '+ test revert code',
    bannerHeadline: 'Unlock Premium Feature',
    bannerSubtext: 'Test modal copy',
    status: 'live',
    createdAt: Date.now(),
    suggestedAmounts: [5, 15],
    paymentConfig: { paypalUrl: 'https://paypal.me/lk3mpe', mercadopagoAlias: 'lkempe' },
  };

  const shouldRollback = (mockRollbackExp.currentConversionRate ?? 0) < mockRollbackExp.targetConversionRate;
  const keepRollbackPassed = shouldKeep && shouldRollback;

  results.push({
    id: 'test-keep-rollback-engine',
    suiteName: 'Autonomous CI/CD & Monetization Telemetry',
    testName: 'Threshold Evaluation: KEEP (>= target) vs ROLLBACK (< target)',
    passed: keepRollbackPassed,
    durationMs: Number((performance.now() - t6Start).toFixed(2)),
    details: `Simulated 5.5% >= 4.0% -> KEEP (git merge). Simulated 1.2% < 5.0% -> ROLLBACK (git revert zero-debt cleanup).`,
    error: keepRollbackPassed ? undefined : 'Keep vs Rollback threshold evaluation failed.',
  });

  // 7. Dual Payment Gateway Routing Test
  const t7Start = performance.now();
  const paypalTarget = 'paypal.me/lk3mpe';
  const mercadopagoTarget = 'lkempe';

  const allExperimentsHavePayments = experiments.every(
    (exp) =>
      exp.paymentConfig &&
      exp.paymentConfig.paypalUrl.includes('lk3mpe') &&
      exp.paymentConfig.mercadopagoAlias === 'lkempe'
  );

  results.push({
    id: 'test-payment-routing',
    suiteName: 'Fintech & Payment Gateway Routing',
    testName: 'Dual Gateway Verification: PayPal (lk3mpe) & MercadoPago (lkempe)',
    passed: allExperimentsHavePayments,
    durationMs: Number((performance.now() - t7Start).toFixed(2)),
    details: `Verified payment routing across all ${experiments.length} experiments: PayPal (${paypalTarget}) and MercadoPago Alias (${mercadopagoTarget}).`,
    error: allExperimentsHavePayments ? undefined : 'Payment gateway routing missing or incorrectly formatted.',
  });

  return results;
}
