import React, { useState } from 'react';
import { LessonPart } from '../data/tuplesLessonData';
import { CodePlayground } from './CodePlayground';
import { TupleIndexSliceExplorer } from './TupleVisualSandbox';

interface LessonPartSectionProps {
  part: LessonPart;
  partIndex: number;
  onCompleteItem: (id: string) => void;
  completedIds: Set<string>;
}

export const LessonPartSection: React.FC<LessonPartSectionProps> = ({
  part,
  partIndex,
  onCompleteItem,
  completedIds,
}) => {
  // Type-along line state
  const [typedLineCount, setTypedLineCount] = useState<number>(0);
  const [typeAlongCodeOverride, setTypeAlongCodeOverride] = useState<string | null>(null);

  // Puzzle break state
  const [activePuzzleIdx, setActivePuzzleIdx] = useState<number>(0);
  const [puzzleSelections, setPuzzleSelections] = useState<Record<string, string>>({});

  const handleTypeNextLine = () => {
    const nextCount =
      typedLineCount >= part.typeAlongLines.length ? 1 : typedLineCount + 1;
    setTypedLineCount(nextCount);
    const joinedCode = part.typeAlongLines
      .slice(0, nextCount)
      .map((l) => l.code)
      .join('\n');
    setTypeAlongCodeOverride(joinedCode);
    if (nextCount === part.typeAlongLines.length) {
      onCompleteItem(`${part.id}-typealong`);
    }
  };

  const activePuzzle = part.puzzles[activePuzzleIdx];
  const selectedAnswer = puzzleSelections[activePuzzle.id];
  const isCorrect = selectedAnswer === activePuzzle.correctAnswer;
  const solvedPuzzlesCount = part.puzzles.filter(
    (p) => puzzleSelections[p.id] === p.correctAnswer
  ).length;

  const handleSelectPuzzleOption = (option: string) => {
    setPuzzleSelections((prev) => ({ ...prev, [activePuzzle.id]: option }));
    if (option === activePuzzle.correctAnswer) {
      onCompleteItem(activePuzzle.id);
    }
  };

  return (
    <section id={part.id} className="my-12 scroll-mt-24">
      <div className="comic-card p-6 md:p-8 bg-white">
        {/* Dark Comic Ribbon */}
        <span className="comic-ribbon-dark">{part.partLabel}</span>

        {/* Big Comic Heading */}
        <h2 className="font-comic text-3xl md:text-5xl text-[#1B1340] comic-title-gold mt-3 uppercase">
          {part.title}
        </h2>

        {/* Bolt the Robot Speech Bubble */}
        <div className="mt-5 flex items-start gap-3.5">
          <div
            aria-hidden="true"
            className="w-12 h-12 rounded-full border-[3px] border-[#1B1340] bg-[#E3F8EF] flex items-center justify-center text-2xl shrink-0 shadow-[3px_3px_0px_#1B1340]"
          >
            🤖
          </div>
          <div className="flex-1 p-4 rounded-2xl border-[3px] border-[#1B1340] bg-[#FFFDF9] shadow-[4px_4px_0px_#1B1340] text-sm font-semibold text-[#1B1340] leading-relaxed">
            {part.boltLog}
          </div>
        </div>

        {/* Yellow Comic Callout Box + Additional Concept Paragraphs */}
        <div className="mt-5 space-y-4">
          <div className="p-5 rounded-2xl border-[3px] border-[#1B1340] bg-[#FFF3B0] shadow-[5px_5px_0px_#1B1340]">
            <p className="text-base md:text-lg font-extrabold text-[#1B1340] leading-snug">
              {part.concepts[0]}
            </p>
          </div>
          {part.concepts.slice(1).map((para, i) => (
            <p
              key={i}
              className="text-base font-semibold text-[#1B1340] leading-relaxed max-w-4xl"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Interactive Tuple Index & Slice Explorer inside Part 2 */}
        {partIndex === 1 && <TupleIndexSliceExplorer />}

        {/* Teacher Live Type-Along Card */}
        <div className="mt-7 p-5 md:p-6 rounded-2xl border-[3px] border-[#1B1340] bg-[#F8FAFF] shadow-[5px_5px_0px_#1B1340]">
          <div className="w-full py-2 px-4 rounded-xl border-2 border-[#1B1340] bg-[#FFD23F] text-xs font-extrabold uppercase tracking-wider text-[#1B1340] shadow-[3px_3px_0px_#1B1340] -rotate-[0.4deg]">
            🧑‍🏫 Teacher: type this live with the class (Sneha)
          </div>

          <h3 className="font-editorial text-xl md:text-2xl font-bold text-[#1B1340] mt-4 mb-3">
            {part.typeAlongTitle}
          </h3>

          <ol className="space-y-2.5">
            {part.typeAlongLines.map((line, idx) => {
              const isTyped = idx < typedLineCount;
              const isCurrent = idx === typedLineCount;
              return (
                <li
                  key={idx}
                  className={`p-3 rounded-xl border-2 transition-colors flex items-start gap-3 ${
                    isCurrent
                      ? 'border-[#6C4DE6] bg-[#F3EFFF] shadow-[2px_2px_0px_#6C4DE6]'
                      : isTyped
                      ? 'border-[#059669] bg-[#E3F8EF]/60'
                      : 'border-[#CBD5E1] bg-white'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                      isTyped
                        ? 'bg-[#059669] text-white'
                        : 'bg-[#E2E8F0] text-[#1B1340]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <code className="font-mono-code text-sm font-bold text-[#1B1340] block break-all">
                      {line.code}
                    </code>
                    <p className="text-xs text-[#4A4238] mt-0.5">{line.note}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleTypeNextLine}
              className="comic-btn px-4 py-2 rounded-full bg-white text-[#1B1340] text-xs font-extrabold cursor-pointer"
            >
              ⌨️ Type the next line for me
            </button>
            <span role="status" className="text-xs font-bold text-[#4A4238]">
              Line {Math.max(1, typedLineCount)} of {part.typeAlongLines.length}
            </span>
          </div>

          <CodePlayground
            id={`${part.id}-typealong`}
            title="Type here"
            subtitle="✏️ Type your code here"
            initialCode=""
            externalCodeOverride={typeAlongCodeOverride}
            onComplete={onCompleteItem}
          />
        </div>

        {/* Example: Run It, Then Change It */}
        <div className="mt-7">
          <CodePlayground
            id={`${part.id}-example`}
            title="Example: run it, then change it"
            subtitle="👀 Read it, run it, change it"
            initialCode={part.exampleCode}
            autoRunOnMount={true}
            onComplete={onCompleteItem}
          />
          <div className="p-3.5 rounded-xl bg-[#FFF8DC] border-2 border-[#FFD23F] text-sm font-bold text-[#1B1340]">
            💡 {part.exampleTryPrompt}
          </div>
        </div>

        {/* Puzzle Break */}
        <div className="mt-8">
          <h3 className="font-extrabold text-xl text-[#1B1340]">
            {part.puzzleTitle}
          </h3>
          <p className="text-sm text-[#4A4238] mt-0.5">
            Read it the way Python does, line by line, before anyone runs it.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-start">
            {/* Left Puzzle Card */}
            <div className="lg:col-span-7 p-5 rounded-2xl border-[3px] border-[#1B1340] bg-white shadow-[5px_5px_0px_#1B1340]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  {part.puzzles.map((p, idx) => {
                    const solved = puzzleSelections[p.id] === p.correctAnswer;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePuzzleIdx(idx)}
                        aria-label={p.label}
                        className={`comic-btn px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer ${
                          activePuzzleIdx === idx
                            ? 'bg-[#FFD23F] text-[#1B1340]'
                            : solved
                            ? 'bg-[#D1FAE5] text-[#065F46]'
                            : 'bg-white text-[#1B1340]'
                        }`}
                      >
                        {p.type === 'predict' ? '🔮' : p.type === 'bug' ? '🐞' : '🧩'}{' '}
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-extrabold text-[#4A4238]">
                  {solvedPuzzlesCount} of {part.puzzles.length} solved
                </span>
              </div>

              <span className="inline-block px-3 py-1 rounded-md border-2 border-[#1B1340] bg-[#BAE6FD] font-comic text-base text-[#1B1340] uppercase tracking-wider mb-3">
                {activePuzzle.badgeText}
              </span>

              <pre className="p-4 rounded-xl bg-[#151030] text-[#F8FAFC] font-mono-code text-sm overflow-x-auto mb-4">
                {activePuzzle.code}
              </pre>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activePuzzle.options.map((opt) => {
                  const chosen = selectedAnswer === opt;
                  const right = opt === activePuzzle.correctAnswer;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectPuzzleOption(opt)}
                      className={`p-3 rounded-xl border-2 border-[#1B1340] font-mono-code text-xs font-bold text-left cursor-pointer transition-transform ${
                        chosen
                          ? right
                            ? 'bg-[#34D399] text-[#1B1340] shadow-[3px_3px_0px_#1B1340]'
                            : 'bg-[#FCA5A5] text-[#1B1340] shadow-[3px_3px_0px_#1B1340]'
                          : 'bg-white hover:bg-[#F3EFFF] text-[#1B1340] shadow-[2px_2px_0px_#1B1340]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <div
                  role="status"
                  className={`mt-3 p-3 rounded-xl border-2 border-[#1B1340] text-xs font-bold ${
                    isCorrect
                      ? 'bg-[#D1FAE5] text-[#065F46]'
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                  }`}
                >
                  {isCorrect ? '✅ Correct! ' : '❌ Not quite — '}
                  {activePuzzle.explanation}
                </div>
              )}
            </div>

            {/* Right Puzzle Checklist */}
            <ul className="lg:col-span-5 space-y-2.5">
              {part.puzzles.map((p, idx) => {
                const solved = puzzleSelections[p.id] === p.correctAnswer;
                return (
                  <li
                    key={p.id}
                    onClick={() => setActivePuzzleIdx(idx)}
                    className={`p-3.5 rounded-2xl border-2 border-[#1B1340] flex items-center gap-3 cursor-pointer shadow-[3px_3px_0px_#1B1340] ${
                      solved ? 'bg-[#E3F8EF]' : 'bg-white'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border-2 border-[#1B1340] flex items-center justify-center text-xs font-extrabold ${
                        solved ? 'bg-[#059669] text-white' : 'bg-white'
                      }`}
                    >
                      {solved ? '✓' : ''}
                    </span>
                    <span className="text-sm font-bold text-[#1B1340]">
                      {p.prompt}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Practise It Section */}
        <div className="mt-8 pt-6 border-t-2 border-[#E0D5C3]">
          <h3 className="font-extrabold text-xl text-[#1B1340]">Practise it</h3>
          <p className="text-sm text-[#4A4238] mt-0.5">
            Start with the warm-up and go as far as you can. The stretch questions are meant to be hard.
          </p>

          <div className="mt-4 space-y-6">
            {part.practiceTasks.map((task) => {
              const isTaskDone = completedIds.has(task.id);
              return (
                <div
                  key={task.id}
                  className="p-5 rounded-2xl border-2 border-[#1B1340] bg-[#FAF5EE]/70"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-[#1B1340] ${
                        task.tier === 'Warm-up'
                          ? 'bg-[#E3F8EF] text-[#065F46]'
                          : task.tier === 'Core'
                          ? 'bg-[#DBEAFE] text-[#1E40AF]'
                          : 'bg-[#FEF3C7] text-[#92400E]'
                      }`}
                    >
                      {task.tier}
                    </span>
                    {isTaskDone && (
                      <span className="text-xs font-extrabold text-[#059669]">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base font-bold text-[#1B1340]">
                    {task.number} {task.prompt}
                  </p>
                  <CodePlayground
                    id={task.id}
                    title={`Task ${task.number}`}
                    initialCode={task.starterCode}
                    validationRule={task.validation}
                    modelAnswer={task.modelAnswer}
                    onComplete={onCompleteItem}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
