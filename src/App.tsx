import React, { useState, useEffect } from 'react';
import {
  CLASS_CONTEXT,
  LESSON_FLOW_LOOPS,
  LEARNING_OUTCOMES,
  PREREQUISITES,
  HAVE_READY,
  WARMUP_GAMES,
  LESSON_PARTS,
  COMMON_MISTAKES,
  CLASS_ACTIVITIES,
  HOMEWORK_TASKS,
  QUIZ_QUESTIONS,
} from './data/tuplesLessonData';
import { CodePlayground } from './components/CodePlayground';
import { LessonPartSection } from './components/LessonPartSection';
import {
  FlipFlopPalindromeSimulator,
  WeatherTupleSimulator,
} from './components/TupleVisualSandbox';
import { DrawingBoardModal } from './components/DrawingBoardModal';
import { WorksheetGenerator } from './components/WorksheetGenerator';
import { TeacherPlanSection } from './components/TeacherPlanSection';

export default function App() {
  // Reading & Accessibility Modes
  const [textScale, setTextScale] = useState<'sm' | 'normal' | 'lg'>('normal');
  const [focusMode, setFocusMode] = useState(false);
  const [bwMode, setBwMode] = useState(false);
  const [savedLesson, setSavedLesson] = useState(false);

  // Interactive Modals / Drawers
  const [drawingOpen, setDrawingOpen] = useState(false);
  const [prepBriefOpen, setPrepBriefOpen] = useState(false);
  const [teachModeActive, setTeachModeActive] = useState(false);
  const [teachStepIdx, setTeachStepIdx] = useState(0);

  // Progress tracking (27 interactive checkpoints across the lesson)
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());
  const TOTAL_PROGRESS_ITEMS = 27;

  const markCompleted = (id: string) => {
    setCompletedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Warm-up Games with Bolt the Robot state
  const [gameIdx, setGameIdx] = useState(0);
  const [selectedGameOption, setSelectedGameOption] = useState<string | null>(null);
  const [showGameAnswer, setShowGameAnswer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (timerSeconds === null || timerSeconds <= 0) return;
    const t = setInterval(() => {
      setTimerSeconds((s) => (s !== null && s > 0 ? s - 1 : null));
    }, 1000);
    return () => clearInterval(t);
  }, [timerSeconds]);

  // Project Checklist state
  const [projectChecks, setProjectChecks] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const currentGame = WARMUP_GAMES[gameIdx];

  const handleSpinGame = () => {
    const nextIdx = (gameIdx + 2) % WARMUP_GAMES.length;
    setGameIdx(nextIdx);
    setSelectedGameOption(null);
    setShowGameAnswer(false);
  };

  const handleNextGame = () => {
    const nextIdx = (gameIdx + 1) % WARMUP_GAMES.length;
    setGameIdx(nextIdx);
    setSelectedGameOption(null);
    setShowGameAnswer(false);
  };

  const handleSelectTeachStep = (idx: number) => {
    const clamped = Math.max(0, Math.min(LESSON_FLOW_LOOPS.length - 1, idx));
    setTeachStepIdx(clamped);
    const targetId = LESSON_FLOW_LOOPS[clamped].target.replace('#', '');
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correctIndex
  ).length;

  const fontSizeClass =
    textScale === 'sm'
      ? 'text-[15px]'
      : textScale === 'lg'
      ? 'text-[18px]'
      : 'text-[16px]';

  return (
    <div className={`min-h-screen ${bwMode ? 'bw-mode' : ''} ${fontSizeClass}`}>
      {/* Top 4-Color Comic Accent Strip */}
      <div
        aria-hidden="true"
        className="h-1.5 w-full grid grid-cols-4"
      >
        <div className="bg-[#FFD23F]" />
        <div className="bg-[#EC4899]" />
        <div className="bg-[#6C4DE6]" />
        <div className="bg-[#34D399]" />
      </div>

      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 bg-[#FAF5EE]/95 backdrop-blur border-b-[3px] border-[#1B1340] px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-[#1B1340] whitespace-nowrap shrink-0"
          >
            <span className="w-9 h-9 rounded-xl bg-[#1B1340] text-[#FFD23F] font-comic text-2xl flex items-center justify-center border-2 border-[#1B1340] shadow-[2px_2px_0px_#6C4DE6]">
              L.
            </span>
            <span>LearnFun</span>
          </a>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            aria-label="Primary Lesson Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-bold text-[#1B1340]"
          >
            <a
              href="#lesson"
              className="hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Lesson Plan
            </a>
            <a
              href="#part-1"
              className="hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Core Loops
            </a>
            <a
              href="#activity-1"
              className="hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Activities
            </a>
            <a
              href="#quiz"
              className="hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Final Quiz
            </a>
            <a
              href="#teacher"
              className="hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Teacher Guide
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setTeachModeActive((prev) => !prev);
                if (!teachModeActive) {
                  handleSelectTeachStep(0);
                }
              }}
              className="comic-btn px-4 py-2 rounded-full bg-[#FFD23F] text-[#1B1340] text-xs font-extrabold cursor-pointer whitespace-nowrap shrink-0"
            >
              {teachModeActive ? '⏹ Exit Teach Mode' : '▶ Teach this lesson'}
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Teacher Step-by-Step Presentation Bar when Teach Mode is Active */}
      {teachModeActive && (
        <div
          role="region"
          aria-label="Live Teacher Presentation Bar"
          className="sticky top-[63px] z-30 bg-[#1B1340] text-white border-b-[3px] border-[#FFD23F] px-4 md:px-8 py-2.5 shadow-lg"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFD23F] text-[#1B1340] font-comic text-sm uppercase">
                Live Class Loop {teachStepIdx + 1} of {LESSON_FLOW_LOOPS.length}
              </span>
              <span className="font-bold text-sm text-white">
                {LESSON_FLOW_LOOPS[teachStepIdx].label} ({LESSON_FLOW_LOOPS[teachStepIdx].duration})
              </span>
              <span className="text-xs text-[#CBD5E1] hidden lg:inline">
                · Student: {CLASS_CONTEXT.studentName} ({CLASS_CONTEXT.grade})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectTeachStep(teachStepIdx - 1)}
                disabled={teachStepIdx === 0}
                className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-40 text-xs font-bold cursor-pointer"
              >
                ← Prev Loop
              </button>
              <button
                type="button"
                onClick={() => handleSelectTeachStep(teachStepIdx + 1)}
                disabled={teachStepIdx === LESSON_FLOW_LOOPS.length - 1}
                className="px-3.5 py-1 rounded-full bg-[#FFD23F] text-[#1B1340] text-xs font-extrabold cursor-pointer"
              >
                Next Loop →
              </button>
              <button
                type="button"
                onClick={() => setDrawingOpen(true)}
                className="px-3 py-1 rounded-full bg-[#6C4DE6] text-white text-xs font-bold cursor-pointer"
              >
                ✏️ Whiteboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Stage */}
      <div
        id="top"
        className="relative overflow-hidden border-b-[3px] border-[#1B1340]"
        style={{
          background: 'linear-gradient(180deg, #EDE7FF 0%, #F7F2E9 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#4A4238] mb-4"
          >
            <a href="#top" className="hover:underline">
              Home
            </a>
            <span>/</span>
            <a href="#lesson" className="hover:underline">
              Teach
            </a>
            <span>/</span>
            <a href="#lesson" className="hover:underline">
              {CLASS_CONTEXT.courseTitle}
            </a>
            <span>/</span>
            <span className="text-[#1B1340]">Session 2: Tuples</span>
            <button
              type="button"
              onClick={() => setSavedLesson((s) => !s)}
              className="ml-2 px-3 py-0.5 rounded-full border-2 border-[#1B1340] bg-white text-[#1B1340] text-xs font-extrabold cursor-pointer shadow-[2px_2px_0px_#1B1340]"
            >
              {savedLesson ? '★ Saved' : '☆ Save'}
            </button>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Title, Story Lead, Controls, On This Page */}
            <div className="lg:col-span-7">
              <div className="comic-ribbon mb-3">
                🗂️ PYTHON DATA STRUCTURES · SESSION 2 OF 12 · 60 MINUTES · {CLASS_CONTEXT.grade}
              </div>

              <h1
                className="font-comic text-5xl sm:text-6xl md:text-7xl text-white uppercase leading-[0.95] tracking-wide my-2"
                style={{
                  WebkitTextStroke: '2.5px #1B1340',
                  textShadow: '5px 5px 0px #6C4DE6, 8px 8px 0px #1B1340',
                }}
              >
                GETTING STARTED WITH TUPLES
              </h1>

              <p className="mt-4 text-base md:text-lg font-semibold text-[#1B1340] leading-relaxed max-w-2xl">
                In this chapter, you will be introduced to Python&apos;s unchangeable data
                structure named <strong>tuple</strong> and perform operations on a tuple:
                create heterogeneous tuples with <code className="font-mono-code">()</code> and{' '}
                <code className="font-mono-code">tuple()</code>, read items by positive and
                negative indexes, slice ranges, test why tuples lock out accidental changes,
                concatenate with <code className="font-mono-code">+</code>, and unlock nested
                tuples!
              </p>

              {/* Sneha Class Session Banner + Smart Class Prep Brief Trigger (from PDF Page 1) */}
              <div className="mt-5 p-4 rounded-2xl border-[3px] border-[#1B1340] bg-white shadow-[5px_5px_0px_#1B1340]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div>
                      <span className="text-[#857A6C] block font-semibold">Student name</span>
                      <strong className="text-sm font-extrabold text-[#FF5A36]">
                        {CLASS_CONTEXT.studentName}
                      </strong>
                    </div>
                    <span aria-hidden="true" className="text-[#CBD5E1]">|</span>
                    <div>
                      <span className="text-[#857A6C] block font-semibold">Class date &amp; time</span>
                      <strong className="text-sm font-extrabold text-[#FF5A36]">
                        {CLASS_CONTEXT.classDateTime}
                      </strong>
                    </div>
                    <span aria-hidden="true" className="text-[#CBD5E1]">|</span>
                    <div>
                      <span className="text-[#857A6C] block font-semibold">Grade</span>
                      <strong className="text-sm font-extrabold text-[#FF5A36]">
                        {CLASS_CONTEXT.grade}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPrepBriefOpen((prev) => !prev)}
                    className="comic-btn px-4 py-2 rounded-full bg-[#FF5A36] text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    📖 {prepBriefOpen ? 'Hide prep brief' : 'Generate prep brief'}
                  </button>
                </div>

                {/* Expandable Smart Class Prep Brief for Sneha */}
                {prepBriefOpen && (
                  <div className="mt-3 pt-3 border-t-2 border-[#E0D5C3] text-xs space-y-2 bg-[#FFF8F6] p-3 rounded-xl">
                    <p className="font-extrabold text-[#1B1340]">
                      ✨ Personalized Smart Class Prep Brief for {CLASS_CONTEXT.studentName} ({CLASS_CONTEXT.grade}):
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[#4A4238] font-medium">
                      <li>
                        <strong>Prior Session Recap:</strong> {CLASS_CONTEXT.studentName} completed Python Lists (`indexing`, `slicing`, `.append()`). Contrast list mutability `[]` with tuple immutability `()`.
                      </li>
                      <li>
                        <strong>Key Watch-Out:</strong> Highlight why adding a single item requires a trailing comma `tuplex = tuplex + (9,)` in Activity 1, and walk step-by-step through the two-pointer `while(s &lt; e):` loop in Activity 2 (Flip Flop).
                      </li>
                      <li>
                        <strong>Pacing Target:</strong> Aim to reach Activity 1 by minute 35 so {CLASS_CONTEXT.studentName} submits all 3 class activities during the live call.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setTeachModeActive(true);
                    handleSelectTeachStep(0);
                  }}
                  className="comic-btn px-5 py-3 rounded-full bg-[#FFD23F] text-[#1B1340] text-sm font-extrabold cursor-pointer"
                >
                  ▶ Teach this lesson
                </button>
                <a
                  href="#activity-1"
                  className="comic-btn px-5 py-3 rounded-full bg-white text-[#1B1340] text-sm font-extrabold"
                >
                  🎯 3 Class Activities
                </a>
                <a
                  href="#print"
                  className="comic-btn px-5 py-3 rounded-full bg-white text-[#1B1340] text-sm font-extrabold"
                >
                  🖨 Print a worksheet
                </a>
                <button
                  type="button"
                  onClick={() => setDrawingOpen(true)}
                  className="comic-btn px-5 py-3 rounded-full bg-white text-[#1B1340] text-sm font-extrabold cursor-pointer"
                >
                  ✏️ Drawing board
                </button>
              </div>

              {/* Reading View Controls */}
              <div
                role="group"
                aria-label="Reading view"
                className="flex flex-wrap items-center gap-2 mt-4 text-xs font-extrabold text-[#1B1340]"
              >
                <span>Text size:</span>
                <button
                  type="button"
                  onClick={() => setTextScale('sm')}
                  aria-label="Smaller text"
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#1B1340] cursor-pointer ${
                    textScale === 'sm' ? 'bg-[#FFD23F]' : 'bg-white'
                  }`}
                >
                  A−
                </button>
                <button
                  type="button"
                  onClick={() => setTextScale('normal')}
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#1B1340] cursor-pointer ${
                    textScale === 'normal' ? 'bg-[#FFD23F]' : 'bg-white'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setTextScale('lg')}
                  aria-label="Bigger text"
                  className={`px-2.5 py-1 rounded-lg border-2 border-[#1B1340] cursor-pointer ${
                    textScale === 'lg' ? 'bg-[#FFD23F]' : 'bg-white'
                  }`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => setFocusMode((f) => !f)}
                  className={`px-3 py-1 rounded-lg border-2 border-[#1B1340] cursor-pointer ${
                    focusMode ? 'bg-[#1B1340] text-[#FFD23F]' : 'bg-white'
                  }`}
                >
                  🔦 Focus {focusMode ? 'On' : ''}
                </button>
                <button
                  type="button"
                  onClick={() => setBwMode((b) => !b)}
                  className={`px-3 py-1 rounded-lg border-2 border-[#1B1340] cursor-pointer ${
                    bwMode ? 'bg-[#1B1340] text-white' : 'bg-white'
                  }`}
                >
                  ◐ Black &amp; white
                </button>
              </div>

              {/* On This Page Anchor Pills */}
              <nav
                aria-label="On this page"
                className="flex flex-wrap items-center gap-2 mt-5"
              >
                <span className="text-xs font-bold text-[#4A4238] mr-1">
                  On this page:
                </span>
                {[
                  { label: 'Plan', href: '#lesson' },
                  { label: 'Warm-up', href: '#warmup' },
                  { label: '🎮 Games', href: '#warmup-games' },
                  { label: 'Part 1', href: '#part-1' },
                  { label: 'Part 2', href: '#part-2' },
                  { label: 'Part 3', href: '#part-3' },
                  { label: 'Mistakes', href: '#mistakes' },
                  { label: 'Activity 1', href: '#activity-1' },
                  { label: 'Activity 2', href: '#activity-2' },
                  { label: 'Activity 3', href: '#activity-3' },
                  { label: 'Project', href: '#project' },
                  { label: 'Homework', href: '#homework' },
                  { label: 'Final quiz', href: '#quiz' },
                  { label: 'Print', href: '#print' },
                  { label: 'For teachers', href: '#teacher' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1 rounded-full border border-[#1B1340]/30 bg-white/90 hover:bg-[#FFD23F] text-xs font-bold text-[#1B1340] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right Column: Custom Comic Robot & Locked Tuple Vault Illustration + Sneha's Live Activity Tracker */}
            <div className="lg:col-span-5 space-y-4">
              <div className="comic-card p-6 bg-[#FFFDF9] relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="comic-ribbon">🔒 THE PYTHON TUPLE VAULT</span>
                  <span className="font-mono-code text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#1B1340] text-[#FFD23F]">
                    IMMUTABLE ()
                  </span>
                </div>

                {/* Custom SVG Comic Artwork of Bolt the Robot guarding the Tuple Vault */}
                <svg
                  viewBox="0 0 420 220"
                  className="w-full h-auto rounded-2xl border-2 border-[#1B1340] bg-[#FAF5EE]"
                  role="img"
                  aria-label="Comic illustration of Bolt the Robot and a locked Python Tuple Vault"
                >
                  {/* Decorative Stars */}
                  <polygon
                    points="375,20 382,36 399,38 386,49 390,66 375,57 360,66 364,49 351,38 368,36"
                    fill="#FFD23F"
                    stroke="#1B1340"
                    strokeWidth="2.5"
                  />
                  {/* Robot Character */}
                  <rect
                    x="26"
                    y="52"
                    width="96"
                    height="82"
                    rx="16"
                    fill="#E3F8EF"
                    stroke="#1B1340"
                    strokeWidth="4"
                  />
                  <rect
                    x="38"
                    y="66"
                    width="72"
                    height="38"
                    rx="8"
                    fill="#34D399"
                    stroke="#1B1340"
                    strokeWidth="3"
                  />
                  <circle cx="58" cy="85" r="6" fill="#1B1340" />
                  <circle cx="90" cy="85" r="6" fill="#1B1340" />
                  <path
                    d="M66 93 Q74 100 82 93"
                    stroke="#1B1340"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Robot Antennae */}
                  <line x1="54" y1="52" x2="50" y2="30" stroke="#1B1340" strokeWidth="4" />
                  <circle cx="50" cy="26" r="7" fill="#FF5A36" stroke="#1B1340" strokeWidth="3" />
                  <line x1="94" y1="52" x2="98" y2="30" stroke="#1B1340" strokeWidth="4" />
                  <circle cx="98" cy="26" r="7" fill="#FFD23F" stroke="#1B1340" strokeWidth="3" />

                  {/* Locked Tuple Container */}
                  <rect
                    x="136"
                    y="58"
                    width="268"
                    height="122"
                    rx="20"
                    fill="#F3EFFF"
                    stroke="#1B1340"
                    strokeWidth="4"
                  />
                  <text
                    x="270"
                    y="83"
                    textAnchor="middle"
                    fill="#1B1340"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="800"
                    fontSize="11.5"
                  >
                    tuple1 = (&apos;P&apos;,&apos;Y&apos;,&apos;T&apos;,&apos;H&apos;,&apos;O&apos;,&apos;N&apos;)
                  </text>

                  {/* 6 Mini Index Cells */}
                  {['P', 'Y', 'T', 'H', 'O', 'N'].map((ch, i) => (
                    <g key={ch} transform={`translate(${160 + i * 38}, 98)`}>
                      <rect
                        width="32"
                        height="42"
                        rx="6"
                        fill="#FFD23F"
                        stroke="#1B1340"
                        strokeWidth="2.5"
                      />
                      <text
                        x="10"
                        y="26"
                        fill="#1B1340"
                        fontFamily="Bangers, sans-serif"
                        fontSize="20"
                      >
                        {ch}
                      </text>
                      <text
                        x="11"
                        y="56"
                        fill="#6C4DE6"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="700"
                        fontSize="10"
                      >
                        [{i}]
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Activities Done by Student in Class Tracker (from PDF Page 1 Right Sidebar) */}
                <div className="mt-4 pt-4 border-t-2 border-[#E0D5C3]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF5A36]">
                      📋 Activities done by {CLASS_CONTEXT.studentName} in class
                    </span>
                    <span className="text-xs font-bold text-[#1B1340]">
                      {
                        CLASS_ACTIVITIES.filter((a) => completedIds.has(a.id))
                          .length
                      }{' '}
                      / 3 Submitted
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {CLASS_ACTIVITIES.map((act) => {
                      const isDone = completedIds.has(act.id);
                      return (
                        <a
                          key={act.id}
                          href={`#${act.id}`}
                          className={`p-2.5 rounded-xl border-2 border-[#1B1340] text-xs transition-colors ${
                            isDone ? 'bg-[#D1FAE5]' : 'bg-[#FFF5F2]'
                          }`}
                        >
                          <div className="font-extrabold text-[#1B1340]">
                            Activity {act.number}: {act.title}
                          </div>
                          <div
                            className={`mt-1 text-[11px] font-bold ${
                              isDone ? 'text-[#065F46]' : 'text-[#B5461E]'
                            }`}
                          >
                            {isDone ? '✓ Submitted & Verified' : '⏳ Pending in class'}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main
        id="main"
        className={`max-w-6xl mx-auto px-4 md:px-8 pb-24 ${
          focusMode ? 'max-w-4xl' : ''
        }`}
      >
        {/* SECTION: LESSON AT A GLANCE (#lesson) */}
        <section id="lesson" className="my-12 scroll-mt-24">
          <div className="comic-card p-6 md:p-8 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Cols: 60-Min Loop Overview */}
              <div className="lg:col-span-7">
                <span className="comic-ribbon">A complete lesson · 60 minutes</span>
                <h2 className="font-comic text-4xl md:text-5xl text-[#1B1340] comic-title-gold mt-3 leading-none">
                  TEACH IT, SEE IT, PRACTISE IT,{' '}
                  <span className="text-[#6C4DE6]">ALL ON THIS PAGE.</span>
                </h2>
                <p className="text-sm md:text-base font-medium text-[#1B1340] mt-3 leading-relaxed">
                  Open this page with <strong>{CLASS_CONTEXT.studentName}</strong> and work
                  down it, or press <strong>Teach this lesson</strong> to step through it
                  one loop at a time on a shared screen. Every section has live Python code
                  to run and check.
                </p>

                <div className="flex flex-wrap gap-3 my-5">
                  <button
                    type="button"
                    onClick={() => {
                      setTeachModeActive(true);
                      handleSelectTeachStep(0);
                    }}
                    className="comic-btn px-5 py-2.5 rounded-full bg-[#FFD23F] text-[#1B1340] text-sm font-extrabold cursor-pointer"
                  >
                    ▶ Teach this lesson
                  </button>
                  <a
                    href="#teacher"
                    className="comic-btn px-5 py-2.5 rounded-full bg-white text-[#1B1340] text-sm font-extrabold"
                  >
                    See the teacher&apos;s plan
                  </a>
                </div>

                {/* 10 Numbered Loop Pills */}
                <ol className="flex flex-wrap gap-2.5 mt-4">
                  {LESSON_FLOW_LOOPS.map((loop) => (
                    <li key={loop.step}>
                      <a
                        href={loop.target}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-[#1B1340] bg-[#FFF8DC] hover:bg-[#FFD23F] text-xs font-extrabold text-[#1B1340] transition-colors"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#1B1340] text-white text-[11px] flex items-center justify-center">
                          {loop.step}
                        </span>
                        <span>{loop.label}</span>
                        <span className="text-[#5B5677] font-semibold">
                          {loop.duration}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right 5 Cols: By the end you can / Before you start / Have ready */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="p-4 rounded-2xl border-2 border-[#1B1340] bg-[#F3EFFF]">
                  <h3 className="font-extrabold text-base text-[#1B1340] mb-1.5">
                    By the end you can
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm font-medium text-[#1B1340]">
                    {LEARNING_OUTCOMES.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border-2 border-[#1B1340] bg-[#E3F8EF]">
                  <h3 className="font-extrabold text-base text-[#1B1340] mb-1.5">
                    Before you start
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm font-medium text-[#1B1340]">
                    {PREREQUISITES.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border-2 border-[#1B1340] bg-[#FFF1D6]">
                  <h3 className="font-extrabold text-base text-[#1B1340] mb-1.5">
                    Have ready
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm font-medium text-[#1B1340]">
                    {HAVE_READY.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs font-extrabold uppercase tracking-wider text-[#5B5677]">
                  GRADE 11 · AGES 15 TO 17 · PYTHON DATA STRUCTURES
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: WARM-UP SPEECH BUBBLE (#warmup) */}
        <section id="warmup" className="my-12 scroll-mt-24">
          <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-[26px] border-[3px] border-[#1B1340] bg-[#FFD23F] shadow-[7px_7px_0px_#1B1340] relative">
            <span className="comic-ribbon bg-white">Warm-up · think first</span>
            <h2 className="font-extrabold text-xl md:text-2xl text-[#1B1340] mt-3 leading-snug">
              Your game stores a player&apos;s secret spawn coordinates{' '}
              <code className="font-mono-code bg-white/70 px-1.5 py-0.5 rounded">
                (120, 340)
              </code>{' '}
              and their changing inventory items. Why would you lock the coordinates inside a{' '}
              <strong>tuple</strong> instead of a list?
            </h2>

            <details
              onToggle={() => markCompleted('warmup-thought')}
              className="mt-4 border-2 border-[#1B1340] rounded-xl bg-white p-3.5 text-sm"
            >
              <summary className="font-extrabold cursor-pointer text-[#1B1340]">
                Show the answer
              </summary>
              <p className="mt-2 text-xs md:text-sm text-[#1B1340] leading-relaxed">
                If spawn coordinates are stored in a list <code className="font-mono-code">[120, 340]</code>, a stray line of code could accidentally overwrite <code className="font-mono-code">spawn[0] = 9999</code> and trap the player off-map! A <strong>tuple</strong> <code className="font-mono-code">(120, 340)</code> is <strong>immutable (unchangeable)</strong>—Python guarantees those coordinates stay locked for the entire game.
              </p>
            </details>

            <p className="text-xs font-bold text-[#1B1340] mt-3">
              🧑‍🏫 Teacher tip: Ask {CLASS_CONTEXT.studentName} to name 2 other things in real life that should never change once recorded (like a date of birth or RGB color code).
            </p>
          </div>
        </section>

        {/* SECTION: WARM-UP GAMES WITH BOLT THE ROBOT (#warmup-games) */}
        <section id="warmup-games" className="my-12 scroll-mt-24">
          <div className="mb-4">
            <span className="comic-ribbon">🎮 Warm-up games · 5 quick games</span>
            <h2 className="font-comic text-4xl md:text-5xl text-[#1B1340] comic-title-gold mt-2">
              PLAY WITH <span className="text-[#6C4DE6]">BOLT THE ROBOT</span>
            </h2>
            <p className="text-sm font-semibold text-[#4A4238]">
              Five minutes in the Tuple Vault studio. Vote, say why, then show the answer.
            </p>
          </div>

          <div className="comic-card p-6 md:p-8 bg-[#E6F4F8]">
            {/* Bolt Avatar Header */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full border-[3px] border-[#1B1340] bg-white flex items-center justify-center text-3xl shadow-[3px_3px_0px_#1B1340]">
                🤖
              </div>
              <div className="px-5 py-2.5 rounded-2xl border-[3px] border-[#1B1340] bg-white font-extrabold text-sm md:text-base text-[#1B1340] shadow-[3px_3px_0px_#1B1340]">
                Hi {CLASS_CONTEXT.studentName}, I&apos;m Bolt! Pick an option and explain your reasoning!
              </div>
            </div>

            {/* Active Game Card */}
            <article className="max-w-3xl mx-auto p-6 rounded-2xl border-[3px] border-[#1B1340] bg-white shadow-[5px_5px_0px_#1B1340]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#0D9488] text-white text-xs font-extrabold">
                  {currentGame.tag}
                </span>
                {timerSeconds !== null && (
                  <span className="font-mono-code text-xs font-extrabold px-3 py-1 rounded-full bg-[#FFD23F] text-[#1B1340] border border-[#1B1340]">
                    ⏱ {Math.floor(timerSeconds / 60)}:
                    {String(timerSeconds % 60).padStart(2, '0')}
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-xl md:text-2xl text-[#1B1340] mb-4">
                {currentGame.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentGame.options.map((opt) => {
                  const isPicked = selectedGameOption === opt;
                  const isRight = opt === currentGame.correctOption;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedGameOption(opt);
                        setShowGameAnswer(true);
                        markCompleted(currentGame.id);
                      }}
                      className={`p-4 rounded-2xl border-[2.5px] border-[#1B1340] font-extrabold text-sm md:text-base cursor-pointer transition-transform ${
                        isPicked
                          ? isRight
                            ? 'bg-[#34D399] text-[#1B1340] shadow-[4px_4px_0px_#1B1340]'
                            : 'bg-[#FCA5A5] text-[#1B1340] shadow-[4px_4px_0px_#1B1340]'
                          : 'bg-white hover:bg-[#F3EFFF] text-[#1B1340] shadow-[3px_3px_0px_#1B1340]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showGameAnswer && (
                <div
                  role="status"
                  className="mt-4 p-4 rounded-xl border-2 border-[#1B1340] bg-[#FFF8DC] text-xs md:text-sm font-bold text-[#1B1340]"
                >
                  <p>
                    🎯 <strong>Answer: {currentGame.correctOption}</strong> —{' '}
                    {currentGame.explanation}
                  </p>
                </div>
              )}

              <p className="text-xs text-[#4A4238] font-semibold mt-4">
                Teacher tip: {currentGame.teacherTip}
              </p>
            </article>

            {/* Game Controls Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => {
                  setShowGameAnswer((s) => !s);
                  markCompleted(currentGame.id);
                }}
                className="comic-btn px-4 py-2 rounded-full bg-[#FFD23F] text-[#1B1340] text-xs font-extrabold cursor-pointer"
              >
                {showGameAnswer ? 'Hide the answer' : 'Show the answer'}
              </button>
              <button
                type="button"
                onClick={handleNextGame}
                className="comic-btn px-4 py-2 rounded-full bg-white text-[#1B1340] text-xs font-extrabold cursor-pointer"
              >
                Next → ({gameIdx + 1}/5)
              </button>
              <button
                type="button"
                onClick={handleSpinGame}
                className="comic-btn px-4 py-2 rounded-full bg-white text-[#1B1340] text-xs font-extrabold cursor-pointer"
              >
                🎡 Spin
              </button>
              <button
                type="button"
                onClick={() =>
                  setTimerSeconds((prev) => (prev === null ? 120 : null))
                }
                className="comic-btn px-4 py-2 rounded-full bg-white text-[#1B1340] text-xs font-extrabold cursor-pointer"
              >
                ⏱ {timerSeconds !== null ? 'Stop timer' : '2-minute timer'}
              </button>
            </div>
          </div>
        </section>

        {/* SECTIONS: PART 1, PART 2, PART 3 */}
        {LESSON_PARTS.map((part, idx) => (
          <LessonPartSection
            key={part.id}
            part={part}
            partIndex={idx}
            onCompleteItem={markCompleted}
            completedIds={completedIds}
          />
        ))}

        {/* SECTION: COMMON MISTAKES (#mistakes) */}
        <section id="mistakes" className="my-12 scroll-mt-24">
          <div className="comic-card p-6 md:p-8 bg-[#FFF5F5]">
            <span className="comic-ribbon bg-[#FCA5A5]">⚠️ Watch out</span>
            <h2 className="font-comic text-3xl md:text-4xl text-[#1B1340] comic-title-gold mt-3">
              COMMON MISTAKES WITH TUPLES
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {COMMON_MISTAKES.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border-2 border-[#1B1340] bg-white shadow-[4px_4px_0px_#1B1340]"
                >
                  <h3 className="font-extrabold text-base text-[#1B1340]">
                    {m.title}
                  </h3>
                  <p className="text-xs text-[#4A4238] mt-1 leading-relaxed">
                    {m.body}
                  </p>
                  <div className="mt-3 space-y-1.5 font-mono-code text-xs">
                    <div className="p-2 rounded-lg bg-[#FEE2E2] text-[#991B1B] font-bold">
                      ❌ {m.wrong}
                    </div>
                    <div className="p-2 rounded-lg bg-[#D1FAE5] text-[#065F46] font-bold">
                      ✅ {m.right}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTIONS: 3 CLASS ACTIVITIES FROM THE PDF (#activity-1, #activity-2, #activity-3) */}
        {CLASS_ACTIVITIES.map((act) => {
          const isSubmitted = completedIds.has(act.id);
          return (
            <section
              key={act.id}
              id={act.id}
              className="my-12 scroll-mt-24"
            >
              <div className="comic-card p-6 md:p-8 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="comic-ribbon bg-[#FF5A36] text-white">
                    Class activity {act.number} of 3
                  </span>
                  <span
                    className={`px-3.5 py-1 rounded-full border-2 border-[#1B1340] text-xs font-extrabold ${
                      isSubmitted
                        ? 'bg-[#34D399] text-[#1B1340]'
                        : 'bg-[#FFF1D6] text-[#B5461E]'
                    }`}
                  >
                    {isSubmitted
                      ? `✓ Submitted by ${CLASS_CONTEXT.studentName}`
                      : `⏳ Not submitted by ${CLASS_CONTEXT.studentName} yet`}
                  </span>
                </div>

                <h2 className="font-comic text-3xl md:text-5xl text-[#1B1340] comic-title-gold mt-3 uppercase">
                  ACTIVITY {act.number}: {act.title}
                </h2>
                <p className="text-sm md:text-base font-semibold text-[#1B1340] mt-2 leading-relaxed">
                  {act.shortDescription}
                </p>

                {/* Interactive Simulator for Activity 2 (Flip Flop) and Activity 3 (Weather Prediction) */}
                {act.number === 2 && <FlipFlopPalindromeSimulator />}
                {act.number === 3 && <WeatherTupleSimulator />}

                {/* Step-by-Step Instructions + Expected Console Output Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5 items-start">
                  <div className="lg:col-span-7 p-4 rounded-2xl border-2 border-[#1B1340] bg-[#FAF5EE]">
                    <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#1B1340] mb-2">
                      Step-by-step instructions
                    </h3>
                    <ul className="space-y-2 text-xs md:text-sm font-semibold text-[#1B1340]">
                      {act.steps.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#6C4DE6] font-extrabold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-5 p-4 rounded-2xl border-2 border-[#1B1340] bg-[#151030] text-white">
                    <div className="flex items-center justify-between text-[11px] font-mono-code text-[#FFD23F] uppercase mb-2">
                      <span>Console · Expected Output</span>
                      <span>Shell</span>
                    </div>
                    <pre className="font-mono-code text-xs text-[#4ADE80] whitespace-pre-wrap leading-relaxed">
                      {act.expectedOutputPreview}
                    </pre>
                  </div>
                </div>

                {/* Live Code Playground with Boilerplate + Auto-Check + Solution */}
                <CodePlayground
                  id={act.id}
                  title={`Activity ${act.number}: ${act.title}`}
                  subtitle="✏️ Complete the boilerplate & press Check"
                  initialCode={act.boilerplateCode}
                  validationRule={act.validation}
                  hint={act.hint}
                  modelAnswer={act.solutionCode}
                  onComplete={markCompleted}
                />
              </div>
            </section>
          );
        })}

        {/* SECTION: AFTER-CLASS PROJECT (#project) */}
        <section id="project" className="my-12 scroll-mt-24">
          <div className="comic-card p-6 md:p-8 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <span className="comic-ribbon">After class · project (ACP)</span>
                <h2 className="font-comic text-3xl md:text-4xl text-[#1B1340] comic-title-gold mt-3">
                  MY TUPLE VAULT &amp; WEATHER REPORTER
                </h2>
                <p className="text-sm font-semibold text-[#1B1340] mt-2 leading-relaxed">
                  Combine all three class activities into one complete Python program for{' '}
                  <strong>{CLASS_CONTEXT.studentName}</strong>&apos;s After-Class Project:
                  store locked student records in tuples, check if a secret code tuple is a
                  Flip-Flop palindrome, and summarize a 7-day weather tuple!
                </p>

                <ul className="mt-4 space-y-2">
                  {[
                    'Create a heterogeneous student_profile tuple with (name, grade, is_active, score).',
                    'Add a bonus badge tuple ("Tuple Master",) using the + operator.',
                    'Write palind(code_tuple) to verify if a vault pin tuple reads the same forward and backward.',
                    'Count how many rainy (0) vs sunny (1) days appear in a 7-day weather tuple.',
                    'Print a clean summary report with zero TypeErrors.',
                  ].map((item, idx) => (
                    <li key={idx}>
                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl border-2 border-[#1B1340] bg-[#FAF5EE] cursor-pointer text-xs md:text-sm font-bold text-[#1B1340]">
                        <input
                          type="checkbox"
                          checked={projectChecks[idx]}
                          onChange={() => {
                            const next = [...projectChecks];
                            next[idx] = !next[idx];
                            setProjectChecks(next);
                            markCompleted(`proj-check-${idx}`);
                          }}
                          className="w-4 h-4 accent-[#6C4DE6]"
                        />
                        <span>{item}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl border-2 border-[#1B1340] bg-[#F3EFFF]">
                <h3 className="font-extrabold text-base text-[#1B1340] mb-2">
                  How it is marked
                </h3>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1B1340] text-left">
                      <th className="py-2 font-extrabold">Look for</th>
                      <th className="py-2 font-extrabold">Done well when</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B1340]/20">
                    <tr>
                      <td className="py-2 font-bold">Runs cleanly</td>
                      <td className="py-2">No red TypeError when pressing Run</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">Tuple ops</td>
                      <td className="py-2">Uses (), len(), slicing, .count(), and +</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">Flip-Flop</td>
                      <td className="py-2">palind(r) works for any tuple length</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">Neat output</td>
                      <td className="py-2">Prints profile, palindrome status &amp; weather</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-extrabold text-base text-[#1B1340]">
                Starter code to take home
              </h3>
              <CodePlayground
                id="project-starter"
                title="Project starter"
                initialCode={`# ===== My Tuple Vault & Weather Reporter =====
student_profile = ("Sneha", 11, True, 98.5)
student_profile = student_profile + ("Tuple Master",)
print("Profile:", student_profile)
print("Items in profile:", len(student_profile))

pin = (7, 3, 1, 1, 3, 7)
print("Vault PIN reversed:", pin[::-1])
print("PIN count of 7:", pin.count(7))`}
                autoRunOnMount={true}
                onComplete={markCompleted}
              />
            </div>
          </div>
        </section>

        {/* SECTION: HOMEWORK & THINK-HARD CHALLENGE (#homework & #challenge) */}
        <section id="homework" className="my-12 scroll-mt-24">
          <div className="comic-card p-6 md:p-8 bg-white">
            <span className="comic-ribbon">🏠 Homework</span>
            <h2 className="font-comic text-3xl md:text-4xl text-[#1B1340] comic-title-gold mt-3">
              PRACTISE AT HOME
            </h2>
            <p className="text-sm text-[#4A4238] mt-1">
              Each task checks itself right in the browser, or print the worksheet below.
            </p>

            <div className="mt-5 space-y-6">
              {HOMEWORK_TASKS.map((hw) => (
                <div
                  key={hw.id}
                  className="p-5 rounded-2xl border-2 border-[#1B1340] bg-[#FAF5EE]"
                >
                  <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded bg-[#FFD23F] text-[#1B1340] border border-[#1B1340]">
                    {hw.tier}
                  </span>
                  <p className="text-sm md:text-base font-bold text-[#1B1340] mt-2">
                    {hw.prompt}
                  </p>
                  <CodePlayground
                    id={hw.id}
                    title={hw.number}
                    initialCode={hw.starterCode}
                    validationRule={hw.validation}
                    modelAnswer={hw.modelAnswer}
                    onComplete={markCompleted}
                  />
                </div>
              ))}
            </div>

            {/* Think-Hard Challenge (#challenge) */}
            <div
              id="challenge"
              className="mt-8 p-5 rounded-2xl border-[3px] border-[#1B1340] bg-[#F3EFFF] shadow-[4px_4px_0px_#1B1340]"
            >
              <h3 className="font-comic text-2xl text-[#1B1340]">
                🧠 THINK-HARD CHALLENGE: WHEN CAN SOMETHING INSIDE A TUPLE CHANGE?
              </h3>
              <p className="text-sm font-semibold text-[#1B1340] mt-1">
                From Page 2 of the lesson notes: <em>&quot;Unlike lists, tuples are immutable. But, if the element is itself a mutable data type as a list, its nested items can be changed.&quot;</em> Run the code below to see it in action!
              </p>
              <CodePlayground
                id="challenge-nested-mutation"
                title="Challenge: Mutable list inside an immutable tuple"
                initialCode={`nest_tup = (1, 2, ('a', 'b'), [4, 5, 'nesting'])
# Change 'nesting' inside the inner list at index 3, position 2:
nest_tup[3][2] = 'modified_inside_list!'
print(nest_tup)`}
                autoRunOnMount={true}
                onComplete={markCompleted}
              />
            </div>
          </div>
        </section>

        {/* SECTION: FINAL QUIZ (#quiz) */}
        <section id="quiz" className="my-12 scroll-mt-24">
          <div className="comic-card p-6 md:p-8 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="comic-ribbon">🏆 Final check</span>
                <h2 className="font-comic text-3xl md:text-4xl text-[#1B1340] comic-title-gold mt-3">
                  FINAL QUIZ: CHECK WHAT YOU LEARNED
                </h2>
              </div>
              <div className="px-4 py-2 rounded-2xl border-2 border-[#1B1340] bg-[#FFD23F] font-comic text-xl text-[#1B1340]">
                Score: {quizCorrectCount} / {QUIZ_QUESTIONS.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {QUIZ_QUESTIONS.map((q) => {
                const picked = quizAnswers[q.id];
                const answered = picked !== undefined;
                const isRight = picked === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border-2 border-[#1B1340] bg-[#FAF5EE] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-full bg-[#1B1340] text-[#FFD23F] font-comic text-base flex items-center justify-center">
                          {q.id}
                        </span>
                        <h3 className="font-extrabold text-sm md:text-base text-[#1B1340]">
                          {q.question}
                        </h3>
                      </div>

                      {q.code && (
                        <pre className="p-3 rounded-xl bg-[#151030] text-[#F8FAFC] font-mono-code text-xs overflow-x-auto my-2.5">
                          {q.code}
                        </pre>
                      )}

                      <div className="grid grid-cols-1 gap-2 mt-3">
                        {q.options.map((opt, idx) => {
                          const isThisPicked = picked === idx;
                          const isThisCorrect = idx === q.correctIndex;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: idx }));
                                if (idx === q.correctIndex) {
                                  markCompleted(`quiz-${q.id}`);
                                }
                              }}
                              className={`p-2.5 rounded-xl border-2 border-[#1B1340] text-left text-xs font-bold cursor-pointer transition-colors ${
                                isThisPicked
                                  ? isThisCorrect
                                    ? 'bg-[#34D399] text-[#1B1340]'
                                    : 'bg-[#FCA5A5] text-[#1B1340]'
                                  : 'bg-white hover:bg-[#F3EFFF] text-[#1B1340]'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {answered && (
                      <div
                        role="status"
                        className={`mt-3 p-2.5 rounded-xl border border-[#1B1340] text-xs font-bold ${
                          isRight
                            ? 'bg-[#D1FAE5] text-[#065F46]'
                            : 'bg-[#FEE2E2] text-[#991B1B]'
                        }`}
                      >
                        {isRight ? '✅ Correct! ' : '❌ Try again: '}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION: PRINT WORKSHEET GENERATOR (#print) */}
        <WorksheetGenerator />

        {/* SECTION: TEACHER 60-MINUTE PLAN, AGENDA, EYE EXERCISE & FEEDBACK (#teacher) */}
        <TeacherPlanSection />
      </main>

      {/* Floating Bottom Lesson Progress Pill & Quick Drawing Board Button (matches LearnFun) */}
      <div className="fixed bottom-4 inset-x-0 z-30 pointer-events-none flex items-center justify-center px-4 no-print">
        <div
          role="status"
          aria-label="Lesson progress"
          className="pointer-events-auto flex items-center gap-3 px-5 py-2 rounded-full border-[3px] border-[#1B1340] bg-white shadow-[4px_4px_0px_#1B1340]"
        >
          <span className="text-xs font-extrabold text-[#1B1340]">
            Lesson progress
          </span>
          <div className="w-28 h-2.5 rounded-full border-2 border-[#1B1340] bg-[#FAF5EE] overflow-hidden">
            <div
              className="h-full bg-[#34D399] transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((completedIds.size / TOTAL_PROGRESS_ITEMS) * 100)
                )}%`,
              }}
            />
          </div>
          <span className="font-mono-code text-xs font-extrabold text-[#1B1340]">
            {completedIds.size} of {TOTAL_PROGRESS_ITEMS}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDrawingOpen(true)}
        aria-label="Open the drawing board"
        className="fixed bottom-4 right-5 z-30 w-12 h-12 rounded-full border-[3px] border-[#1B1340] bg-[#FFD23F] text-xl flex items-center justify-center shadow-[4px_4px_0px_#1B1340] cursor-pointer hover:scale-105 transition-transform no-print"
      >
        ✏️
      </button>

      {/* Interactive Drawing Board Modal */}
      <DrawingBoardModal
        isOpen={drawingOpen}
        onClose={() => setDrawingOpen(false)}
      />
    </div>
  );
}
