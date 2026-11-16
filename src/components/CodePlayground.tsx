import React, { useState, useEffect } from 'react';
import {
  runPythonCode,
  validatePythonTask,
  TaskValidationRule,
  ExecutionResult,
} from '../utils/pythonEngine';

interface CodePlaygroundProps {
  id: string;
  title: string;
  subtitle?: string;
  initialCode: string;
  autoRunOnMount?: boolean;
  validationRule?: TaskValidationRule;
  hint?: string;
  modelAnswer?: string;
  onComplete?: (id: string) => void;
  externalCodeOverride?: string | null;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  id,
  title,
  subtitle = '✏️ Type your code here',
  initialCode,
  autoRunOnMount = false,
  validationRule,
  hint,
  modelAnswer,
  onComplete,
  externalCodeOverride,
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<ExecutionResult>(() =>
    autoRunOnMount
      ? runPythonCode(initialCode)
      : { output: '', error: null, memory: runPythonCode(initialCode).memory }
  );
  const [checkStatus, setCheckStatus] = useState<{
    passed: boolean;
    feedback: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (externalCodeOverride !== undefined && externalCodeOverride !== null) {
      setCode(externalCodeOverride);
      const res = runPythonCode(externalCodeOverride);
      setResult(res);
    }
  }, [externalCodeOverride]);

  const handleRun = () => {
    const res = runPythonCode(code);
    setResult(res);
    setCheckStatus(null);
    if (!validationRule && !res.error && code.trim() && onComplete) {
      onComplete(id);
    }
  };

  const handleCheck = () => {
    if (!validationRule) {
      handleRun();
      return;
    }
    const check = validatePythonTask(code, validationRule);
    setResult(check.result);
    setCheckStatus({ passed: check.passed, feedback: check.feedback });
    if (check.passed && onComplete) {
      onComplete(id);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    const res = autoRunOnMount
      ? runPythonCode(initialCode)
      : { output: '', error: null, memory: runPythonCode(initialCode).memory };
    setResult(res);
    setCheckStatus(null);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleLoadModelAnswer = () => {
    if (!modelAnswer) return;
    setCode(modelAnswer);
    const res = runPythonCode(modelAnswer);
    setResult(res);
    if (validationRule) {
      const check = validatePythonTask(modelAnswer, validationRule);
      setCheckStatus({ passed: check.passed, feedback: check.feedback });
      if (check.passed && onComplete) {
        onComplete(id);
      }
    }
  };

  const lineCount = Math.max(code.split('\n').length, 4);

  return (
    <div className="my-4">
      <div className="border-[3px] border-[#1B1340] rounded-[22px] overflow-hidden bg-[#151030] shadow-[5px_5px_0px_#1B1340]">
        {/* Comic Gradient Top Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b-[3px] border-[#1B1340]"
          style={{
            background: 'linear-gradient(90deg, #6C4DE6 0%, #C026D3 55%, #EC4899 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="font-comic text-white text-xl tracking-wider uppercase drop-shadow-[2px_2px_0px_#1B1340]">
              {title}
            </span>
            <span className="text-xs font-bold text-white/95 hidden sm:inline">
              {subtitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRun}
              aria-label={`Run ${title}`}
              className="comic-btn px-3.5 py-1.5 rounded-full bg-[#FFD23F] text-[#1B1340] text-xs font-extrabold cursor-pointer whitespace-nowrap shrink-0"
            >
              ▶ Run
            </button>
            {validationRule && (
              <button
                type="button"
                onClick={handleCheck}
                aria-label={`Check ${title}`}
                className="comic-btn px-3.5 py-1.5 rounded-full bg-[#34D399] text-[#1B1340] text-xs font-extrabold cursor-pointer whitespace-nowrap shrink-0"
              >
                ✓ Check
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              aria-label={`Reset ${title}`}
              className="comic-btn px-3.5 py-1.5 rounded-full bg-white text-[#1B1340] text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={`Copy ${title} code`}
              className="comic-btn px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#1B1340] text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="relative flex bg-[#151030] text-[#F8FAFC] font-mono-code text-sm">
          {/* Line Numbers */}
          <div
            aria-hidden="true"
            className="select-none py-3.5 px-3 text-right text-[#6D6594] bg-[#110C28] border-r border-[#2A2250] min-w-[2.75rem]"
          >
            {Array.from({ length: lineCount }).map((_, idx) => (
              <div key={idx} className="leading-6">
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Editable Textarea */}
          <textarea
            aria-label={`${title}: Python code you can edit`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={Math.min(Math.max(lineCount, 5), 18)}
            spellCheck={false}
            className="w-full py-3.5 px-4 bg-transparent text-[#F8FAFC] font-mono-code text-sm leading-6 focus:outline-none resize-y"
            placeholder="# Write your Python tuple code here..."
          />
        </div>

        {/* Check Validation Banner */}
        {checkStatus && (
          <div
            role="status"
            className={`px-4 py-2.5 border-t-2 border-[#1B1340] text-xs font-bold flex items-center justify-between gap-3 ${
              checkStatus.passed
                ? 'bg-[#D1FAE5] text-[#065F46]'
                : 'bg-[#FEE2E2] text-[#991B1B]'
            }`}
          >
            <span>
              {checkStatus.passed ? '🎉 PASS: ' : '💡 TRY AGAIN: '}
              {checkStatus.feedback}
            </span>
            {checkStatus.passed && (
              <span className="font-comic text-sm uppercase tracking-wider px-2.5 py-0.5 bg-[#059669] text-white rounded-full">
                +1 Loop Solved!
              </span>
            )}
          </div>
        )}

        {/* Bottom Split: Output & Memory Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t-[3px] border-[#1B1340] bg-[#0E0A24]">
          {/* Output Console */}
          <div className="p-4 border-b md:border-b-0 md:border-r border-[#28204D]">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFD23F] mb-2">
              ▶ OUTPUT
            </p>
            {result.error ? (
              <pre className="font-mono-code text-xs text-[#F87171] whitespace-pre-wrap leading-relaxed bg-[#2A1220] p-2.5 rounded-lg border border-[#F87171]/40">
                {result.error}
              </pre>
            ) : result.output ? (
              <pre className="font-mono-code text-sm text-[#4ADE80] whitespace-pre-wrap leading-relaxed">
                {result.output}
              </pre>
            ) : (
              <p className="font-mono-code text-sm text-[#4ADE80]/80">
                (nothing is printed)
              </p>
            )}
          </div>

          {/* Memory Boxes */}
          <div className="p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFD23F] mb-2">
              📦 MEMORY BOXES
            </p>
            {result.memory.length === 0 ? (
              <p className="text-xs text-[#948BB8]">No variables yet</p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {result.memory.map((box) => (
                  <div
                    key={box.name}
                    className="px-3 py-2 rounded-xl border-2 border-[#FFD23F] bg-[#1A143B] text-white min-w-[120px]"
                  >
                    <div className="text-[11px] font-extrabold text-[#FFD23F]">
                      {box.name}
                    </div>
                    <code className="block font-mono-code text-xs text-white font-semibold my-0.5 break-all">
                      {box.value}
                    </code>
                    <div className="text-[10px] font-mono-code text-[#A78BFA] uppercase">
                      {box.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optional Hint & Teacher Model Answer */}
      {(hint || modelAnswer) && (
        <div className="mt-2.5 space-y-2">
          {hint && (
            <details className="border-2 border-[#1B1340] rounded-xl bg-[#FFFDF9] px-3.5 py-2 text-sm">
              <summary className="font-bold cursor-pointer text-[#1B1340]">
                💡 Hint
              </summary>
              <p className="mt-2 text-xs text-[#4A4238] leading-relaxed whitespace-pre-line">
                {hint}
              </p>
            </details>
          )}
          {modelAnswer && (
            <details className="border-2 border-[#1B1340] rounded-xl bg-[#F3EFFF] px-3.5 py-2 text-sm">
              <summary className="font-bold cursor-pointer text-[#1B1340]">
                🧑‍🏫 Model answer (for the teacher)
              </summary>
              <div className="mt-2 space-y-2">
                <pre className="p-3 rounded-lg bg-[#151030] text-[#4ADE80] font-mono-code text-xs overflow-x-auto">
                  {modelAnswer}
                </pre>
                <button
                  type="button"
                  onClick={handleLoadModelAnswer}
                  className="comic-btn px-3 py-1 rounded-full bg-[#FFD23F] text-[#1B1340] text-xs font-extrabold cursor-pointer"
                >
                  ⚡ Load model answer into editor & run
                </button>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
};
