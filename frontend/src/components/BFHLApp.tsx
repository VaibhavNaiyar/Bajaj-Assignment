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

    // Parse: split by commas and/or newlines, trim, drop empty
    const items = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!items.length) {
      setError('Please enter at least one edge (e.g. A->B).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: items }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const data: BFHLResponse = await res.json();
      setResponse(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Is the server running?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header
        className="flex items-center gap-4 px-8 py-4 shrink-0"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
        >
          BF
        </div>
        <div>
          <h1 className="font-bold text-[17px] tracking-tight" style={{ color: 'var(--text)' }}>
            BFHL Challenge
          </h1>
          <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
            SRM Full Stack Engineering · Tree Hierarchy Processor
          </p>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <InputPanel onSubmit={handleSubmit} loading={loading} error={error} />
        <OutputPanel response={response} loading={loading} />
      </div>
    </div>
  );
}
