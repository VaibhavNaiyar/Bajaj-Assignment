'use client';

import { useRef } from 'react';

interface Props {
  onSubmit: (raw: string) => void;
  loading: boolean;
  error: string | null;
}

export default function InputPanel({ onSubmit, loading, error }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    onSubmit(ref.current?.value ?? '');
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submit();
  }

  return (
    <aside
      className="w-[400px] shrink-0 flex flex-col gap-5 p-6 overflow-y-auto"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      <h2
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: 'var(--muted)' }}
      >
        Input
      </h2>

      {/* Hint */}
      <div
        className="text-[12px] leading-relaxed rounded-lg p-3"
        style={{
          background: 'rgba(108,99,255,.07)',
          border: '1px solid rgba(108,99,255,.18)',
          color: 'var(--muted)',
        }}
      >
        Enter edges one per line or comma-separated.
        <br />
        Format:{' '}
        <code
          className="rounded px-1 py-px font-mono"
          style={{ background: 'rgba(108,99,255,.15)', color: 'var(--text)' }}
        >
          A-&gt;B
        </code>{' '}
        · Single uppercase letters only.
        <br />
        <span style={{ color: 'var(--muted)' }}>
          Tip: <kbd className="font-mono text-[11px]">Ctrl+Enter</kbd> to submit
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={ref}
        rows={14}
        placeholder={'A->B\nA->C\nB->D\nE->F\nF->E\nA->B\nX->X\ninvalid'}
        onKeyDown={onKeyDown}
        disabled={loading}
        className="
          w-full flex-1 rounded-xl p-4 resize-y outline-none
          font-mono text-[13.5px] leading-relaxed
          transition-colors duration-200
          disabled:opacity-60
        "
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
      />

      {/* Submit button */}
      <button
        onClick={submit}
        disabled={loading}
        className="
          w-full flex items-center justify-center gap-2
          rounded-xl py-3 px-6
          font-semibold text-[14px] text-white
          transition-all duration-150
          hover:opacity-85 active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        style={{ background: 'var(--accent)' }}
      >
        {loading ? (
          <>
            <span className="spinner" />
            <span>Processing…</span>
          </>
        ) : (
          <>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Submit
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div
          className="flex items-start gap-3 rounded-xl p-4 text-[13px] font-medium fade-up"
          style={{
            background: 'rgba(255,107,107,.08)',
            border: '1px solid rgba(255,107,107,.3)',
            color: 'var(--error)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 mt-px"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </aside>
  );
}
