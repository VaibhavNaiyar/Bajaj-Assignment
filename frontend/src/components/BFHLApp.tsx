'use client';

import { useState } from 'react';
import type { BFHLResponse } from '@/types/bfhl';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';

export default function BFHLApp() {
  const [response, setResponse] = useState<BFHLResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(raw: string) {
    setError(null);
    const items = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!items.length) {
      setError('Please enter at least one edge, for example A->B.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://bajaj-assignment-isxf.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: items }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Server error (${res.status})`);
      }
      const data: BFHLResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reach the API. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-8 py-4 shrink-0"
        style={{ background: 'var(--dark)', borderBottom: '1px solid rgba(255,219,187,0.15)' }}
      >
        <div className="flex items-center gap-5">
          {/* Wordmark */}
          <span
            className="font-display text-2xl tracking-tight italic"
            style={{ color: 'var(--peach)' }}
          >
            BFHL
          </span>
          <div style={{ width: 1, height: 28, background: 'rgba(255,219,187,0.2)' }} />
          <div>
            <p
              className="font-display italic text-[15px] leading-tight"
              style={{ color: 'var(--peach)' }}
            >
              Tree Hierarchy Processor
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,219,187,0.5)' }}>
              SRM Full Stack Engineering Challenge
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px]"
          style={{
            background: 'rgba(255,219,187,0.1)',
            border: '1px solid rgba(255,219,187,0.18)',
            color: 'rgba(255,219,187,0.65)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#5A7A40', boxShadow: '0 0 6px #5A7A40' }}
          />
          API ready
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        <InputPanel onSubmit={handleSubmit} loading={loading} error={error} />
        <OutputPanel response={response} loading={loading} />
      </div>
    </div>
  );
}
