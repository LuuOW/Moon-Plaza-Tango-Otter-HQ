import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, XCircle, Play, ShieldCheck, Cpu, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { UnitTestResult, Character, Experiment, ThreeDShortScene, CompanyStats } from '../types';
import { runFullTestSuite } from '../utils/testSuite';

interface UnitTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  experiments: Experiment[];
  threeDShorts: ThreeDShortScene[];
  companyStats: CompanyStats;
}

export const UnitTestModal: React.FC<UnitTestModalProps> = ({
  isOpen,
  onClose,
  characters,
  experiments,
  threeDShorts,
  companyStats,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<UnitTestResult[]>(() =>
    runFullTestSuite(characters, experiments, threeDShorts, companyStats.geminiParams)
  );

  const handleRunAllTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runFullTestSuite(characters, experiments, threeDShorts, companyStats.geminiParams);
      setTestResults(results);
      setIsRunning(false);
    }, 400);
  };

  if (!isOpen) return null;

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const allPassed = passedCount === totalCount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  allPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">Extensive Moon Plaza Unit Test Suite</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      allPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {passedCount}/{totalCount} Passed ({((passedCount / totalCount) * 100).toFixed(0)}%)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Verifying token economics, Gemini parameters (Temp 0.7, 500k max), Banner Sentinel, LinkedIn companion, and payment gateways.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunAllTests}
                disabled={isRunning}
                className="py-1.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executing Suites...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Run All Tests
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex flex-col gap-3">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-xl border transition-all ${
                  result.passed
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    : 'bg-red-950/30 border-red-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {result.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {result.suiteName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{result.durationMs}ms</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{result.testName}</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{result.details}</p>
                      {result.error && (
                        <div className="mt-2 text-xs text-red-400 bg-red-950/50 p-2 rounded-lg border border-red-800">
                          <strong>Error:</strong> {result.error}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      result.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with AI Spec Summary */}
          <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>Temp: <strong className="text-indigo-400 font-mono">0.7</strong></span>
              <span>Max Tokens: <strong className="text-indigo-400 font-mono">500,000</strong></span>
              <span>Top P: <strong className="text-indigo-400 font-mono">0.95</strong></span>
              <span>Freq/Pres Penalty: <strong className="text-indigo-400 font-mono">0 / 0</strong></span>
            </div>
            <div>
              PayPal: <strong className="text-emerald-400 font-mono">lk3mpe</strong> | MercadoPago: <strong className="text-emerald-400 font-mono">lkempe</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
