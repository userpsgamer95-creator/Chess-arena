const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 3000;
const STOCKFISH_PATH = path.join(__dirname, '..', 'stockfish-windows-x86-64-avx2', 'stockfish', 'stockfish-windows-x86-64-avx2.exe');

// Helper to determine mime types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Start Stockfish and get best move
function getStockfishMove(fen, skillLevel, depth, callback) {
  console.log(`Launching Stockfish for FEN: ${fen} (Skill: ${skillLevel}, Depth: ${depth})`);
  
  const child = spawn(STOCKFISH_PATH);
  
  let output = '';
  let evalScore = null;
  child.stdout.on('data', (data) => {
    output += data.toString();
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.includes('score cp')) {
        const match = line.match(/score cp (-?\d+)/);
        if (match) {
          evalScore = parseInt(match[1]);
        }
      } else if (line.includes('score mate')) {
        const match = line.match(/score mate (-?\d+)/);
        if (match) {
          const mateIn = parseInt(match[1]);
          evalScore = mateIn > 0 ? 9999 : -9999;
        }
      }
    }
    if (output.includes('bestmove')) {
      child.stdin.write('quit\n');
    }
  });

  child.on('error', (err) => {
    console.error('Failed to start Stockfish process:', err);
    callback(err, null);
  });

  child.on('close', (code) => {
    const lines = output.split('\n');
    let bestMove = null;
    for (const line of lines) {
      if (line.trim().startsWith('bestmove')) {
        const parts = line.trim().split(/\s+/);
        bestMove = parts[1]; // e.g. "e2e4"
        break;
      }
    }
    if (bestMove) {
      callback(null, bestMove, evalScore);
    } else {
      callback(new Error('Could not find best move in Stockfish output: ' + output), null, evalScore);
    }
  });

  // Send UCI commands
  child.stdin.write('uci\n');
  child.stdin.write(`setoption name Skill Level value ${skillLevel}\n`);
  child.stdin.write('isready\n');
  child.stdin.write(`position fen ${fen}\n`);
  child.stdin.write(`go depth ${depth}\n`);
}

// Analyze a single position (returns best move and evaluation without making a move)
function analyzePosition(fen, depth, callback) {
  const child = spawn(STOCKFISH_PATH);
  let output = '';
  let evalScore = null;
  let bestMove = null;

  child.stdout.on('data', (data) => {
    output += data.toString();
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.includes('score cp')) {
        const match = line.match(/score cp (-?\d+)/);
        if (match) evalScore = parseInt(match[1]);
      } else if (line.includes('score mate')) {
        const match = line.match(/score mate (-?\d+)/);
        if (match) evalScore = parseInt(match[1]) > 0 ? 9999 : -9999;
      }
      if (line.trim().startsWith('bestmove')) {
        const parts = line.trim().split(/\s+/);
        bestMove = parts[1];
      }
    }
    if (output.includes('bestmove')) child.stdin.write('quit\n');
  });

  child.on('error', (err) => callback(err, null, null));
  child.on('close', () => {
    if (bestMove) callback(null, bestMove, evalScore);
    else callback(new Error('No bestmove in analysis'), null, null);
  });

  child.stdin.write('uci\n');
  child.stdin.write('isready\n');
  child.stdin.write(`position fen ${fen}\n`);
  child.stdin.write(`go depth ${depth}\n`);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/move') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { fen, skillLevel = 20, depth = 10 } = data;
        if (!fen) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing FEN position' }));
          return;
        }

        getStockfishMove(fen, skillLevel, depth, (err, bestMove, evalScore) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ bestMove, evaluation: evalScore !== null ? evalScore : 0 }));
          }
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // Analyze endpoint - returns best move and evaluation for a position
  if (req.method === 'POST' && req.url === '/api/analyze') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { fen, depth = 8 } = data;
        if (!fen) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing FEN position' }));
          return;
        }
        analyzePosition(fen, depth, (err, bestMove, evalScore) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ bestMove, evaluation: evalScore !== null ? evalScore : 0 }));
          }
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // Static file serving
  let reqUrl = req.url.split('?')[0]; // strip query params
  let filePath = reqUrl === '/' ? '/index.html' : reqUrl;
  filePath = path.join(__dirname, filePath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath);
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chess Arena Server running at http://localhost:${PORT}`);
});
