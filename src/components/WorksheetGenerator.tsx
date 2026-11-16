import React, { useState } from 'react';
import { LESSON_PARTS, CLASS_ACTIVITIES, HOMEWORK_TASKS } from '../data/tuplesLessonData';

export const WorksheetGenerator: React.FC = () => {
  const [includePart1, setIncludePart1] = useState(true);
  const [includePart2, setIncludePart2] = useState(true);
  const [includePart3, setIncludePart3] = useState(true);
  const [includeActivities, setIncludeActivities] = useState(true);
  const [includeHomework, setIncludeHomework] = useState(true);
  const [includeProject, setIncludeProject] = useState(false);

  const [shuffleOrder, setShuffleOrder] = useState(false);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(true);
  const [includeWorkSpace, setIncludeWorkSpace] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const selectedParts = [
    includePart1 ? LESSON_PARTS[0] : null,
    includePart2 ? LESSON_PARTS[1] : null,
    includePart3 ? LESSON_PARTS[2] : null,
  ].filter(Boolean);

  return (
    <section id="print" className="my-12 scroll-mt-24">
      <div className="comic-card p-6 md:p-8 bg-white">
        <span className="comic-ribbon">🖨 Print what we learned</span>
        <h2 className="font-comic text-3xl md:text-4xl text-[#1B1340] comic-title-gold mt-3">
          MAKE A WORKSHEET FROM THIS LESSON
        </h2>
        <p className="text-sm text-[#4A4238] mt-1 max-w-2xl">
          Pick what to practise, then preview the formatted worksheet or choose Save as PDF in the print window to download it for Sneha.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Include Group */}
          <fieldset className="p-4 rounded-2xl border-2 border-[#1B1340] bg-[#F3EFFF]">
            <legend className="px-2 font-extrabold text-xs uppercase tracking-wider text-[#1B1340]">
              Include Sections
            </legend>
            <div className="space-y-2.5 text-sm font-semibold text-[#1B1340]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePart1}
                  onChange={(e) => setIncludePart1(e.target.checked)}
                  className="w-4 h-4 accent-[#6C4DE6]"
                />
                <span>Part 1: What is a tuple? Make them &amp; size them</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePart2}
                  onChange={(e) => setIncludePart2(e.target.checked)}
                  className="w-4 h-4 accent-[#6C4DE6]"
                />
                <span>Part 2: Indexing, slicing &amp; tuple immutability</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePart3}
                  onChange={(e) => setIncludePart3(e.target.checked)}
                  className="w-4 h-4 accent-[#6C4DE6]"
                />
                <span>Part 3: Concatenation (+), .count() &amp; nested tuples</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeActivities}
                  onChange={(e) => setIncludeActivities(e.target.checked)}
                  className="w-4 h-4 accent-[#6C4DE6]"
                />
                <span>Class activities (Tuple Operations, Flip Flop, Weather Prediction)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHomework}
                  onChange={(e) => setIncludeHomework(e.target.checked)}
                  className="w-4 h-4 accent-[#6C4DE6]"
                />
                <span>Homework tasks</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProject}
                  onChange={(e) => setIncludeProject(e.target.checked)}
                  className="w-4 h-4 accent-[#6C4DE6]"
                />
                <span>After-class project template</span>
              </label>
            </div>
          </fieldset>

          {/* Options Group */}
          <fieldset className="p-4 rounded-2xl border-2 border-[#1B1340] bg-[#E3F8EF]">
            <legend className="px-2 font-extrabold text-xs uppercase tracking-wider text-[#1B1340]">
              Worksheet Options
            </legend>
            <div className="space-y-2.5 text-sm font-semibold text-[#1B1340]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOrder}
                  onChange={(e) => setShuffleOrder(e.target.checked)}
                  className="w-4 h-4 accent-[#059669]"
                />
                <span>Mix up the order of the questions (a fresh sheet each time)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnswerKey}
                  onChange={(e) => setIncludeAnswerKey(e.target.checked)}
                  className="w-4 h-4 accent-[#059669]"
                />
                <span>Answer key on the last page</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeWorkSpace}
                  onChange={(e) => setIncludeWorkSpace(e.target.checked)}
                  className="w-4 h-4 accent-[#059669]"
                />
                <span>Space to write the working</span>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowPreview((p) => !p)}
                className="comic-btn px-5 py-2.5 rounded-full bg-[#FFD23F] text-[#1B1340] text-sm font-extrabold cursor-pointer"
              >
                🖨 {showPreview ? 'Hide worksheet preview' : 'Make my worksheet'}
              </button>
              {showPreview && (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="comic-btn px-4 py-2.5 rounded-full bg-[#1B1340] text-white text-sm font-bold cursor-pointer"
                >
                  Save / Print Sheet
                </button>
              )}
            </div>
          </fieldset>
        </div>

        {/* Live Generated Worksheet Preview */}
        {showPreview && (
          <div className="mt-6 p-6 rounded-2xl border-[3px] border-[#1B1340] bg-[#FFFDF9] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-2 border-[#1B1340]">
              <div>
                <p className="text-xs font-extrabold uppercase text-[#6C4DE6]">
                  LearnFun Printable Practice Sheet · Grade 11 Python
                </p>
                <h3 className="font-comic text-2xl text-[#1B1340]">
                  SESSION 2: PYTHON TUPLES WORKSHEET
                </h3>
              </div>
              <div className="text-xs font-bold text-[#1B1340]">
                Student Name: <u>Sneha</u> &nbsp;|&nbsp; Date: <u>Nov 16, 2026</u>
              </div>
            </div>

            {selectedParts.map((part) =>
              part ? (
                <div key={part.id} className="space-y-2">
                  <h4 className="font-extrabold text-sm text-[#1B1340] uppercase">
                    {part.title}
                  </h4>
                  {(shuffleOrder ? [...part.practiceTasks].reverse() : part.practiceTasks).map(
                    (t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl border border-[#1B1340]/30 bg-white text-xs space-y-1.5"
                      >
                        <p className="font-bold text-[#1B1340]">
                          [{t.tier}] {t.number}: {t.prompt}
                        </p>
                        {includeWorkSpace && (
                          <div className="h-12 border border-dashed border-[#94A3B8] rounded-lg px-2 py-1 text-[10px] text-[#64748B] font-mono-code">
                            # Write your Python tuple code here:
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : null
            )}

            {includeActivities && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-[#1B1340] uppercase">
                  Class Activities (Tuple Operations, Flip Flop, Weather Prediction)
                </h4>
                {CLASS_ACTIVITIES.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl border border-[#1B1340]/30 bg-white text-xs space-y-1"
                  >
                    <p className="font-bold text-[#1B1340]">
                      Activity {act.number}: {act.title} — {act.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {includeHomework && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-[#1B1340] uppercase">
                  Homework Practice
                </h4>
                {HOMEWORK_TASKS.map((hw) => (
                  <p key={hw.id} className="text-xs font-semibold text-[#1B1340]">
                    • {hw.prompt}
                  </p>
                ))}
              </div>
            )}

            {includeAnswerKey && (
              <div className="pt-4 border-t-2 border-[#1B1340] space-y-2">
                <h4 className="font-comic text-lg text-[#1B1340]">
                  🔑 TEACHER ANSWER KEY
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CLASS_ACTIVITIES.map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-lg bg-[#151030] text-[#4ADE80] font-mono-code text-[11px]"
                    >
                      <div className="text-[#FFD23F] font-bold mb-1">
                        Activity {act.number}: {act.title}
                      </div>
                      <pre className="whitespace-pre-wrap">{act.expectedOutputPreview}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
