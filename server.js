const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── Identity ────────────────────────────────────────────────────────────────
const USER_ID = 'john_doe_01012000';
const EMAIL_ID = 'john.doe@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2111003010001';

// ── POST /bfhl ───────────────────────────────────────────────────────────────
app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Request body must contain a "data" array.' });
  }

  // ── 1. Validate & deduplicate ─────────────────────────────────────────────
  const invalid_entries = [];
  const duplicate_edges = [];
  const seenEdges = new Set();    // all edges seen (first occurrence kept)
  const duplicateSeen = new Set(); // edges already added to duplicate_edges
  const validEdges = [];           // [{from, to}] in encounter order

  for (const raw of data) {
    if (typeof raw !== 'string') {
      invalid_entries.push(String(raw));
      continue;
    }
    const entry = raw.trim();
    const m = entry.match(/^([A-Z])->([A-Z])$/);

    if (!m || m[1] === m[2]) {
      // Wrong format OR self-loop
      invalid_entries.push(raw);
      continue;
    }

    const [, from, to] = m;
    const key = `${from}->${to}`;

    if (seenEdges.has(key)) {
      // Duplicate: push one copy regardless of repetition count
      if (!duplicateSeen.has(key)) {
        duplicate_edges.push(entry);
        duplicateSeen.add(key);
      }
      continue;
    }

    seenEdges.add(key);
    validEdges.push({ from, to });
  }

  // ── 2. Build directed graph; discard multi-parent edges ───────────────────
  const childParent = new Map(); // child → first parent
  const adjacency = new Map();   // node → [children]
  const nodeSet = new Set();

  for (const { from, to } of validEdges) {
    nodeSet.add(from);
    nodeSet.add(to);

    if (childParent.has(to)) {
      // 'to' already has a parent — discard this edge silently
      continue;
    }

    childParent.set(to, from);
    if (!adjacency.has(from)) adjacency.set(from, []);
    adjacency.get(from).push(to);
  }

  // Ensure every node has an adjacency entry (even leaf / isolated nodes)
  for (const node of nodeSet) {
    if (!adjacency.has(node)) adjacency.set(node, []);
  }

  // ── 3. Connected components (undirected BFS over FINAL edges) ─────────────
  const undirected = new Map();
  for (const node of nodeSet) undirected.set(node, new Set());

  for (const [parent, children] of adjacency) {
    for (const child of children) {
      undirected.get(parent).add(child);
      undirected.get(child).add(parent);
    }
  }

  const gVisited = new Set();
  const components = [];

  for (const start of [...nodeSet].sort()) {
    if (gVisited.has(start)) continue;
    const comp = new Set();
    const queue = [start];
    while (queue.length) {
      const cur = queue.shift();
      if (gVisited.has(cur)) continue;
      gVisited.add(cur);
      comp.add(cur);
      for (const nb of undirected.get(cur)) {
        if (!gVisited.has(nb)) queue.push(nb);
      }
    }
    components.push(comp);
  }

  // ── 4. Per-component: cycle detection, tree building ─────────────────────
  function hasCycleInComponent(comp) {
    // 0 = unvisited, 1 = in-progress, 2 = done
    const state = new Map();
    for (const n of comp) state.set(n, 0);
    let cycle = false;

    function dfs(node) {
      if (cycle) return;
      if (state.get(node) === 1) { cycle = true; return; }
      if (state.get(node) === 2) return;
      state.set(node, 1);
      for (const child of (adjacency.get(node) || [])) {
        if (comp.has(child)) dfs(child);
        if (cycle) return;
      }
      state.set(node, 2);
    }

    for (const node of comp) {
      if (state.get(node) === 0) dfs(node);
      if (cycle) break;
    }
    return cycle;
  }

  function buildSubtree(node) {
    const obj = {};
    for (const child of (adjacency.get(node) || [])) {
      obj[child] = buildSubtree(child);
    }
    return obj;
  }

  function nodeDepth(node) {
    const children = adjacency.get(node) || [];
    if (!children.length) return 1;
    return 1 + Math.max(...children.map(nodeDepth));
  }

  const hierarchies = [];

  for (const comp of components) {
    const sorted = [...comp].sort();
    const cyclic = hasCycleInComponent(comp);

    // Natural roots: nodes that never appear as a child
    const roots = sorted.filter(n => !childParent.has(n));

    if (cyclic) {
      // Use natural root if it exists, else lex-smallest node
      const root = roots.length > 0 ? roots[0] : sorted[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      for (const root of roots) {
        const subtree = buildSubtree(root);
        const depth = nodeDepth(root);
        hierarchies.push({ root, tree: { [root]: subtree }, depth });
      }
    }
  }

  // ── 5. Summary ────────────────────────────────────────────────────────────
  const nonCyclic = hierarchies.filter(h => !h.has_cycle);
  const total_trees = nonCyclic.length;
  const total_cycles = hierarchies.filter(h => h.has_cycle).length;

  let largest_tree_root = null;
  if (nonCyclic.length) {
    let maxDepth = -Infinity;
    for (const h of nonCyclic) {
      if (h.depth > maxDepth || (h.depth === maxDepth && h.root < largest_tree_root)) {
        maxDepth = h.depth;
        largest_tree_root = h.root;
      }
    }
  }

  res.json({
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: { total_trees, total_cycles, largest_tree_root },
  });
});


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
