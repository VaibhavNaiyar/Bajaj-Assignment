'use client';

import { useState } from 'react';
import type { BFHLResponse } from '@/types/bfhl';
import SummaryCard from './SummaryCard';
import TreeCard from './TreeCard';

interface Props {
  response: BFHLResponse | null;
  loading: boolean;
}

export default function OutputPanel({ response, loading }: Props) {
  const [showRaw, setShowRaw] = useState(false);

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-5">
        <svg
          className="spin-anim"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--brown)"
          strokeWidth="1.5"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p
          className="font-body italic text-[15px]"
          style={{ color: 'var(--muted)' }}
        >
          Building your hierarchies…
        </p>
      </main>
    );
  }

  /* ── Empty ── */
  if (!response) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-12 text-center">
        {/* Decorative tree illustration */}
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" opacity={0.2}>
          <circle cx="36" cy="12" r="8" fill="var(--dark)" />
          <circle cx="18" cy="44" r="7" fill="var(--brown)" />
          <circle cx="54" cy="44" r="7" fill="var(--brown)" />
          <circle cx="10" cy="64" r="5" fill="var(--taupe)" />
          <circle cx="26" cy="64" r="5" fill="var(--taupe)" />
          <circle cx="46" cy="64" r="5" fill="var(--taupe)" />
          <circle cx="62" cy="64" r="5" fill="var(--taupe)" />
          <line x1="36" y1="20" x2="18" y2="37" stroke="var(--brown)" strokeWidth="1.5" />
          <line x1="36" y1="20" x2="54" y2="37" stroke="var(--brown)" strokeWidth="1.5" />
          <line x1="18" y1="51" x2="10" y2="59" stroke="var(--taupe)" strokeWidth="1.5" />
          <line x1="18" y1="51" x2="26" y2="59" stroke="var(--taupe)" strokeWidth="1.5" />
          <line x1="54" y1="51" x2="46" y2="59" stroke="var(--taupe)" strokeWidth="1.5" />
          <line x1="54" y1="51" x2="62" y2="59" stroke="var(--taupe)" strokeWidth="1.5" />
        </svg>

        <div>
          <h3
            className="font-display italic text-[20px]"
            style={{ color: 'var(--dark)' }}
          >
            Nothing to show yet
          </h3>
          <p
            className="text-[13px] mt-2 max-w-xs leading-relaxed"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}
          >
            Enter some edges on the left and click <em>Analyse edges</em> to see the tree
            hierarchies, cycles, and more.
          </p>
        </div>
      </main>
    );
  }

  const { hierarchies, invalid_entries, duplicate_edges, summary } = response;

  return (
    <main
      className="flex-1 overflow-y-auto p-8 flex flex-col gap-8"
      style={{ background: 'var(--bg)' }}
    >

      {/* Summary */}
      <Section title="Summary">
        <SummaryCard data={response} />
      </Section>

      {/* Trees */}
      {hierarchies.length > 0 && (
        <Section title={`Hierarchies — ${hierarchies.length} group${hierarchies.length !== 1 ? 's' : ''}`}>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
          >
            {hierarchies.map((h) => (
              <TreeCard
                key={`${h.root}-${h.has_cycle ? 'c' : 't'}`}
                hierarchy={h}
                isLargest={!h.has_cycle && summary.largest_tree_root === h.root}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Invalid entries */}
      <Section title={`Invalid entries${invalid_entries.length ? ` — ${invalid_entries.length}` : ''}`}>
        <PillRow
          items={invalid_entries}
          pillStyle={{
            background: 'rgba(184,58,26,0.08)',
            color: 'var(--error)',
            border: '1px solid rgba(184,58,26,0.2)',
          }}
          empty="No invalid entries — everything looks good."
        />
      </Section>

      {/* Duplicates */}
      <Section title={`Duplicate edges${duplicate_edges.length ? ` — ${duplicate_edges.length}` : ''}`}>
        <PillRow
          items={duplicate_edges}
          pillStyle={{
            background: 'rgba(153,126,103,0.12)',
            color: 'var(--dark)',
            border: '1px solid rgba(153,126,103,0.28)',
          }}
          empty="No duplicate edges found."
        />
      </Section>

      {/* Raw JSON toggle */}
      <Section title="Raw API response">
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setShowRaw((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-[12.5px] transition-colors"
            style={{
              background: '#FFF0E2',
              color: 'var(--text-mid)',
              borderBottom: showRaw ? '1px solid var(--border)' : 'none',
              fontFamily: 'var(--font-ui)',
            }}
          >
            <span className="font-medium">{showRaw ? 'Hide' : 'View'} raw JSON</span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              style={{ transform: showRaw ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showRaw && (
            <pre
              className="p-5 text-[11.5px] leading-relaxed overflow-auto max-h-80 fade-up"
              style={{
                background: '#FFF8F2',
                color: 'var(--text)',
                fontFamily: 'monospace',
              }}
            >
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </div>
      </Section>
    </main>
  );
}

/* ── Local sub-components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 fade-up">
      <div className="section-label">{title}</div>
      {children}
    </div>
  );
}

function PillRow({
  items,
  pillStyle,
  empty,
}: {
  items: string[];
  pillStyle: React.CSSProperties;
  empty: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-wrap gap-2 min-h-[52px] items-start"
      style={{ background: '#FFF0E2', border: '1px solid var(--border)' }}
    >
      {items.length === 0 ? (
        <span
          className="italic text-[13px] self-center"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
        >
          {empty}
        </span>
      ) : (
        items.map((item, i) => (
          <span
            key={i}
            className="inline-block px-3 py-1 rounded-full text-[12.5px] font-medium"
            style={{ fontFamily: 'monospace', ...pillStyle }}
          >
            {item}
          </span>
        ))
      )}
    </div>
  );
}
