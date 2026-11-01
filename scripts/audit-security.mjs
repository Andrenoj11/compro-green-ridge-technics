import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// This advisory describes firstPhasePreProcess with optimizationLevel >= 2.
// minimatch 3.1.5 has neither facility. Its affected range currently includes v3.
// Keep this exception dev-only, exact-version/advisory-only, and time-bounded.
export function auditFindings(report, lock, now = new Date()) {
  const unresolved = [], exceptions = [];
  for (const [name, item] of Object.entries(report.vulnerabilities || {})) {
    for (const advisory of item.via || []) {
      if (typeof advisory === 'string') {
        // Causes are checked at their direct advisory node. Unknown graph nodes
        // must not disappear behind another reviewed finding.
        if (!report.vulnerabilities[advisory]) unresolved.push({ name: advisory, url: 'missing-advisory-node' });
        continue;
      }
      const allowed = name === 'minimatch'
        && advisory.url === 'https://github.com/advisories/GHSA-g3hv-75wg-m249'
        && advisory.severity === 'moderate'
        && now < new Date('2026-12-01T00:00:00Z')
        && item.nodes?.length > 0
        && item.nodes.every(path => lock.packages?.[path]?.dev === true && lock.packages[path].version === '3.1.5');
      (allowed ? exceptions : unresolved).push({ name, url: advisory.url });
    }
  }
  // A changed or incomplete audit format must fail closed.
  if (report.error || !report.metadata?.vulnerabilities || (report.metadata.vulnerabilities.total > 0 && !unresolved.length && !exceptions.length)) unresolved.push({ name: 'audit-format', url: '' });
  return { unresolved, exceptions };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let report;
  try { report = JSON.parse(execFileSync('npm', ['audit', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 90_000 })); }
  catch (error) {
    try { report = JSON.parse(error.stdout?.toString() || ''); }
    catch { console.error('Security audit unavailable; refusing to pass.'); process.exit(1); }
  }
  const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
  const { unresolved, exceptions } = auditFindings(report, lock);
  console.log('npm audit totals:', report.metadata?.vulnerabilities);
  for (const item of exceptions) console.log(`Reviewed dev-only non-applicable advisory: ${item.name} ${item.url}; review expires 2026-12-01.`);
  for (const item of unresolved) console.error(`Unresolved security finding: ${item.name} ${item.url}`);
  process.exitCode = unresolved.length ? 1 : 0;
}
