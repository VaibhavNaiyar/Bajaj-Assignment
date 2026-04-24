import type { TreeHierarchy } from '@/types/bfhl';
import TreeNode from './TreeNode';

interface Props {
  hierarchy: TreeHierarchy;
  isLargest: boolean;
}

export default function TreeCard({ hierarchy, isLargest }: Props) {
  const { root, tree, depth, has_cycle } = hierarchy;
  const subtree = has_cycle ? null : (tree as Record<string, Record<string, unknown>>)[root];

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: 'var(--bg)',
        border: `1px solid ${has_cycle ? 'rgba(255,107,107,.35)' : 'var(--border)'}`,
      }}
    >
      {/* Card header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
          Root:
        </span>
        <span className="font-bold text-[15px]" style={{ color: 'var(--text)' }}>
          {root}
        </span>

        {has_cycle ? (
          <Badge variant="cycle">⟳ Cycle</Badge>
        ) : (
          <Badge variant="depth">depth {depth}</Badge>
        )}

        {isLargest && <Badge variant="largest">★ Largest</Badge>}
      </div>

      {/* Tree or cycle message */}
      {has_cycle ? (
        <p className="text-[12px] italic" style={{ color: 'var(--muted)' }}>
          Cyclic group — no tree structure available.
        </p>
      ) : subtree ? (
        <TreeNode name={root} subtree={subtree as Record<string, never>} isRoot />
      ) : (
        // Single node (no children)
        <TreeNode name={root} subtree={{}} isRoot />
      )}
    </div>
  );
}

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'cycle' | 'depth' | 'largest';
}) {
  const styles: Record<typeof variant, React.CSSProperties> = {
    cycle:   { background: 'rgba(255,107,107,.15)', color: 'var(--error)',   border: '1px solid rgba(255,107,107,.25)' },
    depth:   { background: 'rgba(78,205,196,.12)',  color: 'var(--accent2)', border: '1px solid rgba(78,205,196,.25)' },
    largest: { background: 'rgba(108,99,255,.15)',  color: 'var(--accent)',  border: '1px solid rgba(108,99,255,.25)' },
  };

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
      style={styles[variant]}
    >
      {children}
    </span>
  );
}
