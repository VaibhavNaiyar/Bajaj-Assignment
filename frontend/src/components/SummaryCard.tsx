import type { BFHLResponse } from '@/types/bfhl';

interface Props {
  data: BFHLResponse;
}

export default function SummaryCard({ data }: Props) {
  const { user_id, email_id, college_roll_number, summary, hierarchies } = data;

  const stats = [
    { val: summary.total_trees,  label: 'Trees'  },
    { val: summary.total_cycles, label: 'Cycles' },
    { val: hierarchies.length,   label: 'Groups' },
  ];

  const identityFields = [
    { key: 'User ID',      value: user_id },
    { key: 'Email',        value: email_id },
    { key: 'Roll Number',  value: college_roll_number },
    {
      key: 'Largest Root',
      value: summary.largest_tree_root ?? '—',
      accent: !!summary.largest_tree_root,
    },
  ];

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Identity */}
      <div className="grid grid-cols-2 gap-3">
        {identityFields.map(({ key, value, accent }) => (
          <div key={key}>
            <div className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--muted)' }}>
              {key}
            </div>
            <div className="text-[13px] font-semibold" style={{ color: accent ? 'var(--accent)' : 'var(--text)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)' }} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ val, label }) => (
          <div
            key={label}
            className="rounded-xl p-4 text-center"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
          >
            <div className="font-extrabold text-[30px] leading-none mb-1 grad-text">{val}</div>
            <div className="text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
