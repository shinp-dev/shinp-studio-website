import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = ['index.html', 'styles.css', 'script.js', 'assets/hero.png', 'assets/hero.webp', 'assets/spotlock-camera.png', 'assets/kaulist.png', 'fonts/IBMPlexSansJP-Regular.woff2', 'fonts/IBMPlexSansJP-Medium.woff2', 'fonts/IBMPlexSansJP-SemiBold.woff2', 'fonts/OFL.txt', 'provenance/index.html', 'robots.txt', 'sitemap.xml'];
for (const relative of required) await fs.access(path.join(root, relative));
const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
if ((html.match(/<h1\b/g) || []).length !== 1) throw new Error('index.html must contain exactly one h1');
if (!html.includes('id="products"') || !html.includes('id="about"')) throw new Error('Required anchors are missing');
if (!html.includes('type="image/webp"')) throw new Error('Optimized hero source is missing');
if (!html.includes('https://spotlock.shinp-studio.com/') || !html.includes('https://kaulist.shinp-studio.com/')) throw new Error('Product links are missing');
if (!html.includes('>KauList<')) throw new Error('KauList spelling is missing');
console.log(`Checked ${required.length} required files.`);
