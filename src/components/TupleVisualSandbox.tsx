import React, { useState } from 'react';

export const TupleIndexSliceExplorer: React.FC = () => {
  const letters = ['P', 'Y', 'T', 'H', 'O', 'N'];
  const [selectedIdx, setSelectedIdx] = useState<number>(3);
  const [sliceStart, setSliceStart] = useState<number>(3);
  const [sliceStop, setSliceStop] = useState<number>(6);
  const [mutateAttempted, setMutateAttempted] = useState<boolean>(false);

  const slicedItems = letters.slice(sliceStart, sliceStop);
  const negIdx = selectedIdx - letters.length;

  return (
    <div className="comic-card p-5 my-5 bg-[#FFFDF9]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="comic-ribbon">🔬 Interactive Tuple Vault Visualizer</span>
          <h3 className="font-comic text-2xl text-[#1B1340] mt-2 tracking-wide">
            CLICK ANY ITEM OR DRAG THE SLICE SLIDERS ON{' '}
            <code className="font-mono-code text-[#6C4DE6]">
              tuple1 = (&apos;P&apos;, &apos;Y&apos;, &apos;T&apos;, &apos;H&apos;, &apos;O&apos;, &apos;N&apos;)
            </code>
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setMutateAttempted((prev) => !prev)}
          className="comic-btn px-4 py-2 rounded-full bg-[#FCA5A5] text-[#1B1340] text-xs font-extrabold cursor-pointer whitespace-nowrap"
        >
          💥 Test Immutability: Try tuple1[2] = &apos;G&apos;
        </button>
      </div>

      {/* Immutability Comic POW Alert */}
      {mutateAttempted && (
        <div
          role="alert"
          className="mb-4 p-4 rounded-2xl border-[3px] border-[#1B1340] bg-[#FEE2E2] shadow-[4px_4px_0px_#1B1340] flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <p className="font-comic text-xl text-[#991B1B] tracking-wide">
              🛡️ POW! IMMUTABILITY SHIELD ACTIVATED!
            </p>
            <p className="font-mono-code text-xs text-[#7F1D1D] mt-0.5">
              TypeError: &apos;tuple&apos; object does not support item assignment (tuple1[2] = &apos;G&apos; is blocked!)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMutateAttempted(false)}
            className="comic-btn px-3 py-1 rounded-full bg-white text-[#1B1340] text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 6 Tuple Vault Cells */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 my-4">
        {letters.map((char, idx) => {
          const inSlice = idx >= sliceStart && idx < sliceStop;
          const isSelected = idx === selectedIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              aria-label={`Select tuple index ${idx} letter ${char}`}
              className={`p-3 rounded-2xl border-[3px] border-[#1B1340] text-center cursor-pointer transition-transform ${
                isSelected
                  ? 'bg-[#FFD23F] -translate-y-1 shadow-[5px_5px_0px_#1B1340]'
                  : inSlice
                  ? 'bg-[#E3F8EF] shadow-[4px_4px_0px_#1B1340]'
                  : 'bg-white shadow-[3px_3px_0px_#1B1340]'
              }`}
            >
              <div className="text-[11px] font-mono-code font-bold text-[#6C4DE6]">
                Index [{idx}]
              </div>
              <div className="font-comic text-3xl text-[#1B1340] my-1">
                &apos;{char}&apos;
              </div>
              <div className="text-[11px] font-mono-code font-semibold text-[#64748B]">
                Neg [{idx - letters.length}]
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Readout + Slice Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t-2 border-[#E0D5C3]">
        <div className="p-3.5 rounded-xl border-2 border-[#1B1340] bg-[#F3EFFF]">
          <p className="text-xs font-extrabold uppercase text-[#1B1340] mb-1">
            🎯 Selected Element Inspector
          </p>
          <p className="font-mono-code text-sm font-bold text-[#1B1340]">
            tuple1[{selectedIdx}] == &apos;{letters[selectedIdx]}&apos; &nbsp;·&nbsp; tuple1[{negIdx}] == &apos;{letters[selectedIdx]}&apos;
          </p>
          <p className="text-xs text-[#4A4238] mt-1">
            Length: <code className="font-mono-code font-bold">len(tuple1) = 6</code> ·{' '}
            {selectedIdx === 0
              ? 'First element (index 0)'
              : selectedIdx === 5
              ? 'Last element (index 5 or -1)'
              : `Position ${selectedIdx + 1} from left (index ${selectedIdx})`}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border-2 border-[#1B1340] bg-[#E3F8EF]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-[#1B1340]">
              ✂️ Live Slice Explorer: <code className="font-mono-code">tuple1[{sliceStart}:{sliceStop}]</code>
            </span>
            <span className="font-mono-code text-xs font-bold px-2 py-0.5 rounded bg-[#1B1340] text-[#FFD23F]">
              ({slicedItems.map((c) => `'${c}'`).join(', ')}{slicedItems.length === 1 ? ',' : ''})
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="flex flex-col gap-1 font-bold text-[#1B1340]">
              <span>Start index (inclusive): {sliceStart}</span>
              <input
                type="range"
                min={0}
                max={6}
                value={sliceStart}
                onChange={(e) => setSliceStart(Math.min(Number(e.target.value), sliceStop))}
                aria-label="Slice start index"
                className="accent-[#6C4DE6]"
              />
            </label>
            <label className="flex flex-col gap-1 font-bold text-[#1B1340]">
              <span>Stop index (exclusive): {sliceStop}</span>
              <input
                type="range"
                min={0}
                max={6}
                value={sliceStop}
                onChange={(e) => setSliceStop(Math.max(Number(e.target.value), sliceStart))}
                aria-label="Slice stop index"
                className="accent-[#6C4DE6]"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlipFlopPalindromeSimulator: React.FC = () => {
  const presets = [
    { label: '(1, 2, 3, 3, 2, 1) — Flip-Flop!', items: [1, 2, 3, 3, 2, 1] },
    { label: '(1, 2, 3, 4, 2, 1) — Not Flip-Flop', items: [1, 2, 3, 4, 2, 1] },
  ];
  const [presetIdx, setPresetIdx] = useState(0);
  const [step, setStep] = useState(0);

  const items = presets[presetIdx].items;
  const maxSteps = Math.floor(items.length / 2);
  const s = Math.min(step, maxSteps - 1);
  const e = items.length - 1 - s;
  const matchesAtCurrent = items[s] === items[e];
  const allChecked = step >= maxSteps;
  const isFullPalindrome = items.every((val, idx) => val === items[items.length - 1 - idx]);

  return (
    <div className="comic-card-sm p-4 my-4 bg-[#FFF8DC]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#6C4DE6]">
            🪞 Interactive Activity 2 Visualizer · Two-Pointer Palindrome Loop
          </span>
          <h4 className="font-comic text-xl text-[#1B1340]">
            WATCH <code className="font-mono-code">s</code> AND <code className="font-mono-code">e</code> WALK INWARD IN <code className="font-mono-code">while(s &lt; e):</code>
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setPresetIdx(i);
                setStep(0);
              }}
              className={`comic-btn px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                presetIdx === i ? 'bg-[#FFD23F] text-[#1B1340]' : 'bg-white text-[#1B1340]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 my-3">
        {items.map((val, idx) => {
          const isStart = !allChecked && idx === s;
          const isEnd = !allChecked && idx === e;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border-2 border-[#1B1340] text-center ${
                isStart || isEnd
                  ? matchesAtCurrent
                    ? 'bg-[#34D399] font-extrabold shadow-[3px_3px_0px_#1B1340]'
                    : 'bg-[#FCA5A5] font-extrabold shadow-[3px_3px_0px_#1B1340]'
                  : 'bg-white'
              }`}
            >
              <div className="text-[10px] font-mono-code text-[#4A4238]">
                idx {idx}
              </div>
              <div className="font-comic text-2xl text-[#1B1340]">{val}</div>
              <div className="text-[11px] font-mono-code font-bold text-[#1B1340]">
                {isStart ? '▲ s' : isEnd ? '▲ e' : '\u00A0'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <div className="font-mono-code text-xs font-bold text-[#1B1340]">
          {allChecked ? (
            isFullPalindrome ? (
              <span className="text-[#065F46]">
                ✅ Loop finished (s &gt;= e) with zero mismatches → return True (&quot;The Tuple is Flip-Flop&quot;)
              </span>
            ) : (
              <span className="text-[#991B1B]">
                ❌ Mismatch detected → return False (&quot;The Tuple is not Flip-Flop&quot;)
              </span>
            )
          ) : (
            <span>
              Comparing r[{s}] ({items[s]}) and r[{e}] ({items[e]}):{' '}
              {matchesAtCurrent ? '✅ Equal! Move s += 1, e -= 1' : '❌ Not equal! Return False immediately'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStep((prev) => (prev + 1 > maxSteps ? 0 : prev + 1))}
            className="comic-btn px-3.5 py-1.5 rounded-full bg-[#6C4DE6] text-white text-xs font-extrabold cursor-pointer"
          >
            {allChecked ? '↺ Restart Pointers' : 'Step Pointers (s += 1, e -= 1) →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const WeatherTupleSimulator: React.FC = () => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [weather, setWeather] = useState<number[]>([1, 0, 0, 0, 1, 1, 0]);

  const rainyCount = weather.filter((w) => w === 0).length;
  const sunnyCount = weather.filter((w) => w === 1).length;
  const isGoodWeather = sunnyCount > rainyCount;

  const toggleDay = (idx: number) => {
    setWeather((prev) => prev.map((v, i) => (i === idx ? (v === 0 ? 1 : 0) : v)));
  };

  return (
    <div className="comic-card-sm p-4 my-4 bg-[#E3F8EF]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#065F46]">
            🌦️ Interactive Activity 3 Visualizer · 7-Day Weather Tuple
          </span>
          <h4 className="font-comic text-xl text-[#1B1340]">
            CLICK ANY DAY TO TOGGLE <code className="font-mono-code">weather = ({weather.join(', ')})</code>
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setWeather([1, 0, 0, 0, 1, 1, 0])}
          className="comic-btn px-3 py-1 rounded-full bg-white text-[#1B1340] text-xs font-bold cursor-pointer"
        >
          Reset to PDF Tuple (1, 0, 0, 0, 1, 1, 0)
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 my-3">
        {weather.map((val, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => toggleDay(idx)}
            aria-label={`Toggle ${dayNames[idx]} weather currently ${val === 0 ? 'Rainy 0' : 'Sunny 1'}`}
            className={`p-2 rounded-xl border-2 border-[#1B1340] text-center cursor-pointer transition-transform hover:-translate-y-0.5 ${
              val === 1 ? 'bg-[#FFD23F]' : 'bg-[#BAE6FD]'
            }`}
          >
            <div className="text-[10px] font-bold text-[#1B1340]">{dayNames[idx]}</div>
            <div className="text-xl my-0.5">{val === 1 ? '☀️' : '🌧️'}</div>
            <div className="font-mono-code text-xs font-extrabold text-[#1B1340]">
              {val}
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-bold text-[#1B1340]">
        <div className="flex items-center gap-4">
          <span>🌧️ Rainy days (0s): <strong className="font-mono-code">{rainyCount}</strong></span>
          <span>☀️ Sunny days (1s): <strong className="font-mono-code">{sunnyCount}</strong></span>
        </div>
        <div
          className={`px-3.5 py-1 rounded-full border-2 border-[#1B1340] font-extrabold ${
            isGoodWeather ? 'bg-[#FFD23F] text-[#1B1340]' : 'bg-[#FCA5A5] text-[#1B1340]'
          }`}
        >
          Prediction: {isGoodWeather ? '☀️ "Good weather" (sunny > rainy)' : '🌧️ "Bad weather" (rainy >= sunny)'}
        </div>
      </div>
    </div>
  );
};
