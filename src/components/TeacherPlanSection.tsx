import React, { useState, useEffect } from 'react';
import {
  TEACHER_AGENDA_STEPS,
  TEACHER_THUMB_RULES,
  CLASS_CONTEXT,
  LEARNING_OUTCOMES,
} from '../data/tuplesLessonData';

export const TeacherPlanSection: React.FC = () => {
  // Interactive 60-second Eye Exercise timer (from Codingal Agenda step 4)
  const [eyeTimerRunning, setEyeTimerRunning] = useState(false);
  const [eyeSecondsLeft, setEyeSecondsLeft] = useState(60);

  // Lesson feedback & teacher comments (from PDF Page 6)
  const [rating, setRating] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<
    { author: string; role: string; text: string; time: string }[]
  >([
    {
      author: 'Ashkam (Teacher)',
      role: 'Instructor Note',
      text: 'Prepared Tuple memory-box visualizers and Flip-Flop two-pointer walk for Sneha’s 10:30 PM IST Grade 11 session.',
      time: 'Mon, Nov 16, 2026',
    },
  ]);

  const [showPdfEmbed, setShowPdfEmbed] = useState(false);

  useEffect(() => {
    if (!eyeTimerRunning) return;
    const id = setInterval(() => {
      setEyeSecondsLeft((s) => {
        if (s <= 1) {
          setEyeTimerRunning(false);
          return 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [eyeTimerRunning]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        author: 'Ashkam (Teacher)',
        role: 'Class Note',
        text: commentInput.trim(),
        time: 'Just now',
      },
    ]);
    setCommentInput('');
  };

  return (
    <section id="teacher" className="my-12 scroll-mt-24 space-y-8">
      {/* Main 60-Minute Lesson Plan + Codingal 7-Step Agenda */}
      <div className="comic-card p-6 md:p-8 bg-white">
        <span className="comic-ribbon">🧑‍🏫 For parents and teachers</span>
        <h2 className="font-comic text-3xl md:text-4xl text-[#1B1340] comic-title-gold mt-3">
          THE 60-MINUTE LESSON PLAN &amp; AGENDA
        </h2>
        <p className="text-sm text-[#4A4238] mt-1">
          Converted directly from the Codingal Grade 11 Tuples Teacher Agenda for{' '}
          <strong>{CLASS_CONTEXT.studentName}</strong> ({CLASS_CONTEXT.classDateTime}).
        </p>

        {/* 7-Step Session Table */}
        <div className="mt-5 overflow-x-auto border-2 border-[#1B1340] rounded-2xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#1B1340] text-[#FFD23F] font-extrabold text-xs uppercase">
                <th className="p-3.5 border-b-2 border-[#1B1340]">Agenda Step</th>
                <th className="p-3.5 border-b-2 border-[#1B1340]">The Teacher</th>
                <th className="p-3.5 border-b-2 border-[#1B1340]">The Learner (Sneha)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0D5C3] bg-white">
              {TEACHER_AGENDA_STEPS.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF5EE]">
                  <td className="p-3.5 font-extrabold text-[#1B1340] whitespace-nowrap">
                    {row.step}
                  </td>
                  <td className="p-3.5 text-[#4A4238]">{row.teacherAction}</td>
                  <td className="p-3.5 font-semibold text-[#1B1340]">
                    {row.studentAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Interactive Step 4: 60-Second Eye Exercise Widget */}
        <div className="mt-6 p-5 rounded-2xl border-[3px] border-[#1B1340] bg-[#E3F8EF] shadow-[4px_4px_0px_#1B1340] flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#065F46]">
              👀 Agenda Step 4 · Interactive 60-Second Eye Exercise Break
            </span>
            <h3 className="font-comic text-2xl text-[#1B1340] mt-0.5">
              20-20-20 CLASSROOM EYE RELAXATION LOOP
            </h3>
            <p className="text-xs text-[#1B1340] mt-0.5">
              {eyeTimerRunning
                ? eyeSecondsLeft > 40
                  ? 'Step 1: Blink gently 10 times & look 20 feet away from the screen...'
                  : eyeSecondsLeft > 20
                  ? 'Step 2: Roll eyes slowly clockwise, then counter-clockwise...'
                  : 'Step 3: Rub palms warm and cup gently over closed eyes...'
                : 'Mid-class screen break! Start the 60s guided eye exercise with Sneha after Activity 2.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono-code text-2xl font-extrabold px-4 py-1.5 rounded-xl border-2 border-[#1B1340] bg-white text-[#1B1340]">
              {eyeSecondsLeft}s
            </span>
            <button
              type="button"
              onClick={() => {
                if (eyeTimerRunning) {
                  setEyeTimerRunning(false);
                  setEyeSecondsLeft(60);
                } else {
                  setEyeTimerRunning(true);
                }
              }}
              className="comic-btn px-4 py-2 rounded-full bg-[#FFD23F] text-[#1B1340] text-xs font-extrabold cursor-pointer"
            >
              {eyeTimerRunning ? '⏹ Reset Eye Break' : '▶ Start 60s Eye Exercise'}
            </button>
          </div>
        </div>

        {/* 3 Coaching Cards: Questions to ask, Thumb Rules, Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <div className="p-4 rounded-2xl border-2 border-[#1B1340] bg-[#F3EFFF]">
            <h3 className="font-extrabold text-base text-[#1B1340] mb-2">
              Questions to ask at the end
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs font-semibold text-[#1B1340]">
              <li>Did you enjoy today’s lesson on Python Tuples?</li>
              <li>Are you excited about the next lesson (Dictionaries)?</li>
              <li>Why does `tuplex + (9,)` need a comma inside `(9,)`?</li>
              <li>Do you have any doubts or want to share anything about the lesson?</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl border-2 border-[#1B1340] bg-[#FFF1D6]">
            <h3 className="font-extrabold text-base text-[#1B1340] mb-2">
              Teacher Thumb Rules
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs font-semibold text-[#1B1340]">
              {TEACHER_THUMB_RULES.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl border-2 border-[#1B1340] bg-[#E3F8EF]">
            <h3 className="font-extrabold text-base text-[#1B1340] mb-2">
              Learning Outcomes Verified
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs font-semibold text-[#1B1340]">
              {LEARNING_OUTCOMES.map((out, i) => (
                <li key={i}>{out}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reference Source Sheet Toggle */}
        <div className="mt-6 pt-5 border-t-2 border-[#E0D5C3] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-bold text-[#4A4238]">
            📄 Original Codingal Teacher Dashboard Capture: all 6 pages converted into interactive loops above.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPdfEmbed((prev) => !prev)}
              className="comic-btn px-4 py-1.5 rounded-full bg-white text-[#1B1340] text-xs font-extrabold cursor-pointer"
            >
              {showPdfEmbed ? 'Hide Original Lesson PDF' : '📄 View Original Lesson PDF'}
            </button>
          </div>
        </div>

        {showPdfEmbed && (
          <div className="mt-4 border-[3px] border-[#1B1340] rounded-2xl overflow-hidden bg-[#151030]">
            <iframe
              src={CLASS_CONTEXT.referencePdfPath}
              title="Original Codingal Tuples Lesson PDF"
              className="w-full h-[520px]"
            />
          </div>
        )}
      </div>

      {/* How was this lesson? Feedback & Comments Card (from PDF Page 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="comic-card p-6 bg-white">
          <span className="comic-ribbon">⭐ Lesson Feedback</span>
          <h3 className="font-comic text-2xl text-[#1B1340] mt-2">
            HOW WAS THIS LESSON WITH SNEHA?
          </h3>
          <p className="text-xs text-[#4A4238] mt-1">
            Your feedback helps us make interactive Python lessons even better.
          </p>

          <div className="flex flex-wrap gap-2 my-4">
            {['🤩 Loved it!', '👍 Smooth class', '🤔 Needs more practice', '⚡ Too fast'].map(
              (opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setRating(opt);
                    setFeedbackSubmitted(false);
                  }}
                  className={`comic-btn px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer ${
                    rating === opt
                      ? 'bg-[#FFD23F] text-[#1B1340]'
                      : 'bg-white text-[#1B1340]'
                  }`}
                >
                  {opt}
                </button>
              )
            )}
          </div>

          <label className="block text-xs font-bold text-[#1B1340] mb-1">
            Session reflection note (optional)
          </label>
          <textarea
            value={feedbackNote}
            onChange={(e) => setFeedbackNote(e.target.value)}
            rows={2}
            placeholder="E.g. Sneha mastered slicing and the Flip-Flop while loop quickly!"
            className="w-full p-3 rounded-xl border-2 border-[#1B1340] text-xs font-semibold bg-[#FAF5EE]"
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (rating || feedbackNote.trim()) {
                  setFeedbackSubmitted(true);
                }
              }}
              className="comic-btn px-4 py-2 rounded-full bg-[#FF5A36] text-white text-xs font-extrabold cursor-pointer"
            >
              Share your feedback
            </button>
            {feedbackSubmitted && (
              <span role="status" className="text-xs font-extrabold text-[#059669]">
                ✓ Feedback saved for Sneha’s Grade 11 session!
              </span>
            )}
          </div>
        </div>

        {/* Teacher Comments Stream */}
        <div className="comic-card p-6 bg-white">
          <span className="comic-ribbon">💬 Class Comments</span>
          <h3 className="font-comic text-2xl text-[#1B1340] mt-2">
            TEACHER &amp; STUDENT SESSION NOTES
          </h3>

          <form onSubmit={handlePostComment} className="mt-3 space-y-2.5">
            <label htmlFor="teacher-comment-input" className="sr-only">
              Add comment
            </label>
            <textarea
              id="teacher-comment-input"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              rows={2}
              placeholder="Add comment or homework reminder for Sneha..."
              className="w-full p-3 rounded-xl border-2 border-[#1B1340] text-xs font-semibold bg-[#FAF5EE]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="comic-btn px-4 py-1.5 rounded-full bg-[#FFD23F] text-[#1B1340] text-xs font-extrabold cursor-pointer"
              >
                Post Comment
              </button>
            </div>
          </form>

          <div className="mt-4 space-y-2.5 max-h-44 overflow-y-auto">
            {comments.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border-2 border-[#1B1340] bg-[#F3EFFF] text-xs"
              >
                <div className="flex items-center justify-between font-extrabold text-[#1B1340]">
                  <span>
                    {c.author} · <span className="text-[#6C4DE6]">{c.role}</span>
                  </span>
                  <span className="text-[10px] text-[#4A4238]">{c.time}</span>
                </div>
                <p className="mt-1 text-[#1B1340] font-medium">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
