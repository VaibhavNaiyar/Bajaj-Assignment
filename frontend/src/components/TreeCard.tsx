import type { TreeHierarchy } from '@/types/bfhl';
import TreeNode from './TreeNode';

interface Props {
  hierarchy: TreeHierarchy;
  isLargest: boolean;
}

export default function TreeCard({ hierarchy, isLargest }: Props) {
  const { root, tree, depth, has_cycle } = hierarchy;
  const subtree = !has_cycle
    ? (tree as Record<string, Record<string, unknown>>)[root] ?? {}
    : null;

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: has_cycle ? 'rgba(184,58,26,0.04)' : '#FFF8F0',
        border: `1px solid ${has_cycle ? 'rgba(184,58,26,0.2)' : 'var(--border)'}`,
        boxShadow: '0 1px 6px rgba(102,73,48,0.07)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>
          Root
        </span>
        <span
          className="font-display italic text-[17px]"
          style={{ color: 'var(--dark)' }}
        >
          {root}
        </span>

        {has_cycle ? (
          <span className="badge badge-red">↻ cycle</span>
        ) : (
          <span className="badge badge-taupe">depth {depth}</span>
        )}

        {isLargest && (
          <span className="badge badge-best">★ largest</span>
        )}
      </div>

      {/* Divider */}
      <div className="warm-divider" />

      {/* Tree or message */}
      {has_cycle ? (
        <p
          className="text-[12px] italic"
          style={{ color: 'var(--error)', fontFamily: 'var(--font-body)' }}
        >
          This group forms a cycle — no tree structure to display.
        </p>
      ) : (
        <TreeNode
          name={root}
          subtree={subtree as Record<string, never>}
          isRoot
        />
      )}
    </div>
  );
}
