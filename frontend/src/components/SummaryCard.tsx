import type { BFHLResponse } from '@/types/bfhl';

export default function SummaryCard({ data }: { data: BFHLResponse }) {
  const { user_id, email_id, college_roll_number, summary, hierarchies } = data;

  const stats = [
    { val: summary.total_trees,  label: 'Trees found',   sub: 'acyclic groups' },
    { val: summary.total_cycles, label: 'Cycles found',  sub: 'cyclic groups' },
    { val: hierarchies.length,   label: 'Total groups',  sub: 'components' },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)', boxShadow: '0 2px 16px rgba(102,73,48,0.08)' }}
    >
      {/* Identity row */}
      <div
        className="px-6 py-4 grid grid-cols-2 gap-4"
        style={{ background: 'var(--dark)' }}
      >
        {[
          { key: 'User', value: user_id },
          { key: 'Email', value: email_id },
          { key: 'Roll No.', value: college_roll_number },
          {
            key: 'Largest tree',
            value: summary.largest_tree_root ?? '—',
            highlight: !!summary.largest_tree_root,
          },
        ].map(({ key, value, highlight }) => (
          <div key={key}>
            <div
              className="text-[10.5px] uppercase tracking-wider mb-0.5"
              style={{ color: 'rgba(255,219,187,0.45)', fontFamily: 'var(--font-ui)' }}
            >
              {key}
            </div>
            <div
              className="text-[13px] font-medium truncate"
              style={{
                color: highlight ? 'var(--peach)' : 'rgba(255,219,187,0.85)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-3 divide-x"
        style={{
          background: '#FFF8F0',
          borderTop: '1px solid var(--border)',
        }}
      >
        {stats.map(({ val, label, sub }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center py-6 px-4 text-center"
            style={{ borderRight: '1px solid var(--border)' }}
          >
            <div
              className="font-display italic leading-none mb-1"
              style={{ fontSize: 52, color: 'var(--dark)' }}
            >
              {val}
            </div>
            <div
              className="text-[12.5px] font-medium"
              style={{ color: 'var(--dark)', fontFamily: 'var(--font-ui)' }}
            >
              {label}
            </div>
            <div className="text-[10.5px] mt-0.5" style={{ color: 'var(--muted)' }}>
              {sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
