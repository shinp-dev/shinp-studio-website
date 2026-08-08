import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const sourceFiles = [
  'index.html', 'styles.css', 'script.js', 'favicon.svg', 'robots.txt', 'sitemap.xml',
  'assets/hero.png', 'assets/hero.webp', 'assets/spotlock-camera.png', 'assets/kaulist.png',
  'fonts/IBMPlexSansJP-Regular.woff2', 'fonts/IBMPlexSansJP-Medium.woff2',
  'fonts/IBMPlexSansJP-SemiBold.woff2', 'fonts/OFL.txt', 'provenance/index.html'
];
const env = process.env;

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(path.join(out, 'provenance'), { recursive: true });

const manifestEntries = [];
for (const relative of sourceFiles) {
  const source = path.join(root, relative);
  const target = path.join(out, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
  const digest = createHash('sha256').update(await fs.readFile(source)).digest('hex');
  manifestEntries.push({ digest, filePath: relative.replaceAll('\\', '/') });
}
manifestEntries.sort((a, b) => a.filePath.localeCompare(b.filePath));
const manifest = `${manifestEntries.map(({ digest, filePath }) => `${digest}  ${filePath}`).join('\n')}\n`;
const manifestHash = createHash('sha256').update(manifest).digest('hex');
await fs.writeFile(path.join(out, 'provenance', 'manifest.sha256'), manifest);

const provenance = {
  product: 'Shinp Studio website',
  publisher: 'Shinp Studio',
  repository: env.GITHUB_REPOSITORY ? `${env.GITHUB_SERVER_URL || 'https://github.com'}/${env.GITHUB_REPOSITORY}` : '未設定',
  commitSha: env.GITHUB_SHA || '未設定',
  workflow: env.GITHUB_WORKFLOW || (env.GITHUB_ACTIONS ? 'GitHub Actions' : '未設定'),
  run: env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY && env.GITHUB_RUN_ID ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}` : '未設定',
  publishedAt: env.PUBLISHED_AT || null,
  manifestPath: '/provenance/manifest.sha256',
  manifestSha256: manifestHash,
  attestation: env.ATTESTATION_URL || null
};
await fs.writeFile(path.join(out, 'provenance', 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);

console.log(`Built ${sourceFiles.length} files into ${path.relative(root, out)}`);
console.log(`Manifest SHA-256: ${manifestHash}`);
