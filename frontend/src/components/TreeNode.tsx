import type { Subtree } from '@/types/bfhl';

interface Props {
  name: string;
  subtree: Subtree;
  isRoot?: boolean;
}

export default function TreeNode({ name, subtree, isRoot = false }: Props) {
  const children = Object.keys(subtree);

  return (
    <div className="tree-root-wrap">
      <div className={`node-dot ${isRoot ? 'node-dot-root' : 'node-dot-child'}`}>{name}</div>

      {children.length > 0 && (
        <div className="tree-children">
          {children.map((child) => (
            <div key={child} className="tree-child-item">
              <TreeNode name={child} subtree={subtree[child]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
