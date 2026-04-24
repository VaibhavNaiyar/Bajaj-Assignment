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

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center" style={{ color: 'var(--muted)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <p className="text-[13px]">Processing edges…</p>
        </div>
      </main>
    );
  }

  if (!response) {
    return (
      <main
        className="flex-1 flex flex-col items-center justify-center gap-4"
        style={{ color: 'var(--muted)' }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={0.3}
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <line x1="12" y1="7" x2="5.5" y2="17.2" />
          <line x1="12" y1="7" x2="18.5" y2="17.2" />
        </svg>
        <p className="text-[14px]">Enter edges and hit Submit to visualise hierarchies.</p>
      </main>
    );
  }

  const { hierarchies, invalid_entries, duplicate_edges, summary } = response;

  return (
    <main className="flex-1 overflow-y-auto p-7 flex flex-col gap-7">

      {/* Summary */}
      <Section title="Summary">
        <SummaryCard data={response} />
      </Section>

      {/* Trees */}
      {hierarchies.length > 0 && (
        <Section title={`Hierarchies (${hierarchies.length})`}>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {hierarchies.map((h) => (
              <TreeCard
                key={h.root + (h.has_cycle ? '-cycle' : '')}
                hierarchy={h}
                isLargest={!h.has_cycle && summary.largest_tree_root === h.root}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Invalid entries */}
      <Section title={`Invalid Entries (${invalid_entries.length})`}>
        <PillRow items={invalid_entries} variant="invalid" empty="No invalid entries" />
      </Section>

      {/* Duplicates */}
      <Section title={`Duplicate Edges (${duplicate_edges.length})`}>
        <PillRow items={duplicate_edges} variant="dup" empty="No duplicate edges" />
      </Section>

      {/* Raw JSON */}
      <Section title="Raw JSON Response">
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setShowRaw((v) => !v)}
            className="w-full text-left px-4 py-3 text-[12px] font-medium flex items-center justify-between transition-colors"
            style={{
              background: 'var(--surface)',
              color: 'var(--muted)',
              borderBottom: showRaw ? '1px solid var(--border)' : 'none',
            }}
          >
            <span>{showRaw ? 'Hide' : 'Show'} raw response</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ transform: showRaw ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showRaw && (
            <pre
              className="p-4 text-[11.5px] leading-relaxed overflow-auto max-h-80 font-mono fade-up"
              style={{ background: 'var(--bg)', color: 'var(--text)' }}
            >
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </div>
      </Section>
    </main>
  );
}

/* ── Sub-components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 fade-up">
      <h3
        className="text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--muted)' }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function PillRow({
  items,
  variant,
  empty,
}: {
  items: string[];
  variant: 'invalid' | 'dup';
  empty: string;
}) {
  const styles: Record<typeof variant, React.CSSProperties> = {
    invalid: { background: 'rgba(255,107,107,.1)', color: 'var(--error)',  border: '1px solid rgba(255,107,107,.25)' },
    dup:     { background: 'rgba(255,212,59,.08)', color: 'var(--warn)',   border: '1px solid rgba(255,212,59,.25)' },
  };

  return (
    <div
      className="rounded-xl p-4 flex flex-wrap gap-2"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', minHeight: 52 }}
    >
      {items.length === 0 ? (
        <span className="text-[13px] italic self-center" style={{ color: 'var(--muted)' }}>
          {empty}
        </span>
      ) : (
        items.map((item, i) => (
          <span
            key={i}
            className="inline-block px-3 py-1 rounded-full text-[12.5px] font-mono font-medium"
            style={styles[variant]}
          >
            {item}
          </span>
        ))
      )}
    </div>
  );
}
