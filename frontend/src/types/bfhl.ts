export type Subtree = { [child: string]: Subtree };

export interface TreeHierarchy {
  root: string;
  /** { rootNode: { child: { grandchild: {} } } } */
  tree: { [root: string]: Subtree } | Record<string, never>;
  depth?: number;
  has_cycle?: boolean;
}

export interface BFHLSummary {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string | null;
}

export interface BFHLResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: TreeHierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: BFHLSummary;
}
