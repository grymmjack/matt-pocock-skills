#!/usr/bin/env node
/**
 * generate-xmind.js — turn a hierarchical topic tree into a real .xmind file.
 *
 * Prior art: DRAW's DEV/generate-draw-mindmap.js and the `create-xmind` skill
 *   https://github.com/grymmjack/DRAW/blob/main/DEV/XMIND-GENERATOR.md
 *
 * Reads a JSON topic tree and writes:
 *   <name>.xmind   — the real XMind file (single- or multi-sheet)
 *   <name>.mmd     — a Mermaid `mindmap` twin (for render.sh → svg/png/pdf)
 *   <name>.md      — a nested-bullet outline twin (for markmap, or plain reading)
 *
 * Usage:
 *   node generate-xmind.js --tree topic.json [options]
 *
 * Options:
 *   --tree  <path>    JSON tree file (required). See reference/tree-format.md.
 *   --out   <dir>     Output directory (default: current directory).
 *   --name  <base>    Output basename, no extension (default: slug of the title).
 *   --title <str>     Central topic title (overrides the tree's own title).
 *   --theme <name>    snowbrush | robust | business (default: snowbrush).
 *   --layout <mode>   single | multi | auto (default: auto).
 *                     auto → multi when there is more than one top-level branch,
 *                     otherwise single.
 *   --no-companions   Skip the .mmd and .md twins; write only the .xmind.
 */

const fs = require('fs');
const path = require('path');
const { Workbook, Topic, Zipper } = require('xmind');
const { Theme } = require(require.resolve('xmind/dist/core/theme'));

// ---------- args ----------
function parseArgs(argv) {
  const args = { theme: 'snowbrush', layout: 'auto', out: '.', companions: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--tree': args.tree = next(); break;
      case '--out': args.out = next(); break;
      case '--name': args.name = next(); break;
      case '--title': args.title = next(); break;
      case '--theme': args.theme = next(); break;
      case '--layout': args.layout = next(); break;
      case '--no-companions': args.companions = false; break;
      case '-h': case '--help': args.help = true; break;
      default: throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

const USAGE = `Usage: node generate-xmind.js --tree topic.json [--out dir] [--name base]
       [--title "Central Topic"] [--theme snowbrush|robust|business]
       [--layout single|multi|auto] [--no-companions]`;

// ---------- tree loading / normalization ----------
function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'mindmap';
}

function normalizeTree(raw, cliTitle) {
  let root;
  if (Array.isArray(raw)) {
    root = { title: cliTitle || 'Mind Map', children: raw };
  } else if (raw && typeof raw === 'object') {
    // Accept { title, children } or a wrapper { title, theme, layout, tree|children }
    const children = raw.children || raw.tree || [];
    root = { title: cliTitle || raw.title || 'Mind Map', children };
  } else {
    throw new Error('Tree must be a JSON array of nodes or an object with a `children` array.');
  }
  if (!Array.isArray(root.children)) root.children = [];
  return { root, meta: (raw && !Array.isArray(raw)) ? raw : {} };
}

function countNodes(node) {
  let n = 1;
  for (const c of node.children || []) n += countNodes(c);
  return n;
}

// ---------- xmind building ----------
// Attach `children` under a Topic. parentUUID null → attach to the sheet root.
function addChildren(topic, parentUUID, children) {
  for (const child of children || []) {
    if (parentUUID) topic.on(parentUUID); else topic.on();
    topic.add({ title: String(child.title) });
    const uuid = topic.cid();
    if (child.children && child.children.length) addChildren(topic, uuid, child.children);
  }
}

function applyTheme(wb, sheetId, themeName) {
  const sheet = wb.getSheet(sheetId);
  if (sheet && sheet.changeTheme) {
    sheet.changeTheme(new Theme({ themeName }).data);
  }
}

function buildSingleSheet(root, themeName) {
  const wb = new Workbook();
  const created = wb.createSheets([{ s: root.title, t: root.title }]);
  const sheetId = created[0].id;
  const sheet = wb.getSheet(sheetId);
  const topic = new Topic({ sheet });
  addChildren(topic, null, root.children);
  applyTheme(wb, sheetId, themeName);
  return wb;
}

function buildMultiSheet(root, themeName) {
  // One Overview sheet + one sheet per top-level branch.
  const OVERVIEW = 'Overview';
  const sheetDefs = [{ s: OVERVIEW, t: root.title }];
  for (const branch of root.children) sheetDefs.push({ s: branch.title, t: branch.title });

  const wb = new Workbook();
  const created = wb.createSheets(sheetDefs);

  // createSheets can de-dupe / reorder — map by title, then fall back by index.
  const sheetIds = {};
  created.forEach((c, i) => { sheetIds[c.title] = c.id; sheetIds['#' + i] = c.id; });
  const overviewId = sheetIds[OVERVIEW] || sheetIds['#0'];
  const overviewSheet = wb.getSheet(overviewId);

  // Cross-sheet links must target a topic ID, not a sheet ID.
  const branchTopicId = {};
  root.children.forEach((branch, i) => {
    const sid = sheetIds[branch.title] || sheetIds['#' + (i + 1)];
    branchTopicId[i] = wb.getSheet(sid).getRootTopic().getId();
  });

  // Overview: one child per branch, hyperlinked to that branch's sub-sheet root.
  const overviewTopic = new Topic({ sheet: overviewSheet });
  root.children.forEach((branch, i) => {
    overviewTopic.on().add({ title: String(branch.title) });
    const uuid = overviewTopic.cid();
    const comp = overviewSheet.findComponentById(uuid);
    if (comp && comp.addHref) comp.addHref('xmind:#' + branchTopicId[i]);
  });

  // Sub-sheets: back-link the root to Overview, then attach the full subtree.
  const overviewRootId = overviewSheet.getRootTopic().getId();
  root.children.forEach((branch, i) => {
    const sid = sheetIds[branch.title] || sheetIds['#' + (i + 1)];
    const sheet = wb.getSheet(sid);
    sheet.getRootTopic().addHref('xmind:#' + overviewRootId);
    const topic = new Topic({ sheet });
    addChildren(topic, null, branch.children || []);
  });

  // Theme every sheet.
  applyTheme(wb, overviewId, themeName);
  root.children.forEach((branch, i) => {
    const sid = sheetIds[branch.title] || sheetIds['#' + (i + 1)];
    applyTheme(wb, sid, themeName);
  });

  return wb;
}

// ---------- companions ----------
function sanitizeMermaid(s) {
  // Mermaid mindmap treats ()[]{} as shape delimiters; strip them from labels.
  return String(s).replace(/[()\[\]{}]/g, '').replace(/\s+/g, ' ').trim();
}

function toMermaid(root) {
  const lines = ['mindmap', `  root((${sanitizeMermaid(root.title)}))`];
  const walk = (nodes, depth) => {
    for (const n of nodes || []) {
      lines.push('  '.repeat(depth) + sanitizeMermaid(n.title));
      if (n.children && n.children.length) walk(n.children, depth + 1);
    }
  };
  walk(root.children, 2);
  return lines.join('\n') + '\n';
}

function toMarkdownOutline(root) {
  const lines = ['# ' + String(root.title), ''];
  const walk = (nodes, depth) => {
    for (const n of nodes || []) {
      lines.push('  '.repeat(depth) + '- ' + String(n.title));
      if (n.children && n.children.length) walk(n.children, depth + 1);
    }
  };
  walk(root.children, 0);
  return lines.join('\n') + '\n';
}

// ---------- main ----------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.tree) {
    console.log(USAGE);
    process.exit(args.help ? 0 : 1);
  }

  const raw = JSON.parse(fs.readFileSync(args.tree, 'utf8'));
  const { root, meta } = normalizeTree(raw, args.title);

  const themeName = args.theme || meta.theme || 'snowbrush';
  const allowed = ['snowbrush', 'robust', 'business'];
  if (!allowed.includes(themeName)) {
    throw new Error(`Theme "${themeName}" not allowed. Use one of: ${allowed.join(', ')}`);
  }

  let layout = args.layout || meta.layout || 'auto';
  if (layout === 'auto') layout = root.children.length > 1 ? 'multi' : 'single';
  if (!['single', 'multi'].includes(layout)) {
    throw new Error(`Layout "${layout}" invalid. Use single, multi, or auto.`);
  }

  const total = countNodes(root);
  const wb = layout === 'multi' ? buildMultiSheet(root, themeName)
                                : buildSingleSheet(root, themeName);

  const outDir = path.resolve(args.out);
  fs.mkdirSync(outDir, { recursive: true });
  const base = args.name || slugify(root.title);

  const zipper = new Zipper({ path: outDir, workbook: wb, filename: base });
  const ok = await zipper.save();
  if (!ok) throw new Error('Zipper.save() returned false — the .xmind was not written.');

  const xmindPath = path.join(outDir, base + '.xmind');
  const sheetCount = layout === 'multi' ? root.children.length + 1 : 1;
  console.log(`nodes: ${total}  sheets: ${sheetCount}  layout: ${layout}  theme: ${themeName}`);
  console.log('xmind: ' + xmindPath);

  if (args.companions) {
    const mmd = path.join(outDir, base + '.mmd');
    const md = path.join(outDir, base + '.md');
    fs.writeFileSync(mmd, toMermaid(root));
    fs.writeFileSync(md, toMarkdownOutline(root));
    console.log('mermaid: ' + mmd);
    console.log('outline: ' + md);
  }
}

main().catch((err) => {
  console.error('ERROR: ' + err.message);
  process.exit(1);
});
