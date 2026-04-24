'use client';

import { useRef } from 'react';

interface Props {
  onSubmit: (raw: string) => void;
  loading: boolean;
  error: string | null;
}

export default function InputPanel({ onSubmit, loading, error }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() { onSubmit(ref.current?.value ?? ''); }
  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submit();
  }

  return (
    <aside
      className="w-[390px] shrink-0 flex flex-col gap-6 p-7 overflow-y-auto"
      style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border-dark)' }}
    >

      {/* Heading */}
      <div>
        <h2
          className="font-display italic text-[22px] leading-tight"
          style={{ color: 'var(--dark)' }}
        >
          Enter your edges
        </h2>
        <p className="text-[12.5px] mt-1" style={{ color: 'var(--muted)' }}>
          One per line, or comma-separated
        </p>
      </div>

      {/* Format hint */}
      <div
        className="rounded-lg p-4 text-[12.5px] leading-relaxed"
        style={{
          background: 'rgba(102,73,48,0.06)',
          border: '1px solid rgba(102,73,48,0.14)',
          color: 'var(--text-mid)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <strong style={{ color: 'var(--dark)' }}>Format:</strong>{' '}
        <code
          className="rounded px-1.5 py-px text-[12px]"
          style={{ background: 'rgba(102,73,48,0.1)', color: 'var(--dark)' }}
        >
          A-&gt;B
        </code>
        {' '}— single uppercase letters only.
        <br />
        <span style={{ color: 'var(--brown)' }}>
          Self-loops, lowercase, and invalid formats are flagged automatically.
        </span>
        <br />
        <span style={{ color: 'var(--muted)', fontSize: 11 }}>
          Tip: Ctrl + Enter to submit quickly
        </span>
      </div>

      {/* Textarea with terminal-header chrome */}
      <div className="flex flex-col" style={{ flex: 1 }}>
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg"
          style={{
            background: 'var(--taupe)',
            border: '1.5px solid var(--border)',
            borderBottom: 'none',
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--brown)' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(153,126,103,0.5)' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(153,126,103,0.3)' }} />
          <span
            className="ml-2 text-[11px]"
            style={{ color: 'var(--dark)', fontFamily: 'var(--font-ui)', opacity: 0.6 }}
          >
            edges.txt
          </span>
        </div>
        <textarea
          ref={ref}
          rows={12}
          placeholder={'A->B\nA->C\nB->D\nE->F\nF->E\n\n— try a cycle like E->F, F->E'}
          onKeyDown={onKeyDown}
          disabled={loading}
          className="warm-textarea rounded-t-none disabled:opacity-60"
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        />
      </div>

      {/* Submit */}
      <button onClick={submit} disabled={loading} className="btn-primary">
        {loading ? (
          <>
            <svg className="spin-anim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span className="font-display italic">Processing…</span>
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span>Analyse edges</span>
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-lg p-4 text-[13px] leading-snug fade-up"
          style={{
            background: 'var(--error-bg)',
            border: '1px solid rgba(184,58,26,0.25)',
            color: 'var(--error)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </aside>
  );
}
