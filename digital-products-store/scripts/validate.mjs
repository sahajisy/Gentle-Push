// Dependency-free sanity checks: workflow JSON integrity + public catalog safety.
import { readFileSync, readdirSync } from 'node:fs';

let failed = 0;
const fail = (m) => { failed++; console.error('FAIL', m); };

const dir = 'n8n/workflows';
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  let wf;
  try { wf = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')); } catch (e) { fail(`${f}: invalid JSON (${e.message})`); continue; }
  const names = new Set(), ids = new Set();
  for (const n of wf.nodes) {
    if (names.has(n.name)) fail(`${f}: duplicate node name "${n.name}"`);
    if (ids.has(n.id)) fail(`${f}: duplicate node id "${n.id}"`);
    names.add(n.name); ids.add(n.id);
  }
  for (const [src, kinds] of Object.entries(wf.connections)) {
    if (!names.has(src)) fail(`${f}: connection from unknown node "${src}"`);
    for (const outs of Object.values(kinds))
      for (const branch of outs) for (const c of branch)
        if (!names.has(c.node)) fail(`${f}: "${src}" connects to unknown node "${c.node}"`);
  }
  const text = readFileSync(`${dir}/${f}`, 'utf8');
  if (/sk_live_|sk-ant-|xox[bp]-|ghp_|github_pat_/.test(text)) fail(`${f}: looks like it contains a secret`);
  console.log(`ok   ${f} (${wf.nodes.length} nodes)`);
}

const cat = JSON.parse(readFileSync('site/products.json', 'utf8'));
for (const p of cat.products) {
  for (const k of ['sku', 'title', 'price', 'currency']) if (p[k] === undefined || p[k] === '') fail(`products.json: ${p.sku || '?'} missing ${k}`);
  if ('supplier_download_url' in p || 'supplierUrl' in p) fail(`products.json: ${p.sku} leaks a supplier URL`);
  if (p.checkoutUrl && !/^https:\/\/(buy|checkout)\.stripe\.com\//.test(p.checkoutUrl)) fail(`products.json: ${p.sku} checkoutUrl must be a Stripe URL`);
}
console.log(`ok   products.json (${cat.products.length} products)`);
process.exit(failed ? 1 : 0);
