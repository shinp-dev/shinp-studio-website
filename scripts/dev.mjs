import { createReadStream } from 'node:fs';
import { promises as fs } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoots = [root, path.join(root, 'dist')];
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8' };

const server = http.createServer(async (request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const candidates = [requestPath, requestPath.endsWith('/') ? `${requestPath}index.html` : `${requestPath}.html`];
  let filePath;
  for (const publicRoot of publicRoots) {
    for (const candidate of candidates) {
      const resolved = path.resolve(publicRoot, `.${candidate}`);
      if (resolved.startsWith(publicRoot) && (await fs.stat(resolved).catch(() => null))?.isFile()) { filePath = resolved; break; }
    }
    if (filePath) break;
  }
  if (!filePath) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
});
server.listen(port, () => console.log(`Shinp Studio: http://localhost:${port}`));
