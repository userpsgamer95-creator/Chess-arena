window.SFClient = (function() {
  const client = {
    worker: null,
    callbacks: {},
    msgId: 0,
    initPromise: null,
  };

  client.init = function() {
    if (client.initPromise) return client.initPromise;

    const workerCode = `
      let engine;
      let pendingEval = null;
      let currentMsgId = null;
      let buffer = [];

      self.onmessage = async function(e) {
        const msg = e.data;

        if (msg.type === 'init') {
          try {
            const mod = await import('https://cdn.jsdelivr.net/npm/stockfish.wasm@0.10.0/dist/stockfish.js');
            engine = await mod.default();

            let uciOk = false;

            engine.onmessage = function(line) {
              if (line.includes('uciok')) uciOk = true;

              if (line.includes('score cp')) {
                const m = line.match(/score cp (-?\\d+)/);
                if (m) pendingEval = parseInt(m[1]);
              } else if (line.includes('score mate')) {
                const m = line.match(/score mate (-?\\d+)/);
                if (m) pendingEval = parseInt(m[1]) > 0 ? 9999 : -9999;
              }

              if (line.trim().startsWith('bestmove')) {
                const parts = line.trim().split(/\\s+/);
                const bestMove = parts[1];
                self.postMessage({
                  type: 'result',
                  id: currentMsgId,
                  bestMove: bestMove !== '(none)' ? bestMove : null,
                  evaluation: pendingEval
                });
                pendingEval = null;
                currentMsgId = null;
              }
            };

            engine.postMessage('uci');

            // Wait for uciok
            await new Promise(function(resolve, reject) {
              var uciTimeout = setTimeout(function() {
                reject(new Error('UCI initialization timed out'));
              }, 15000);
              var check = function() {
                if (uciOk) { clearTimeout(uciTimeout); resolve(); return; }
                setTimeout(check, 10);
              };
              check();
            });

            engine.postMessage('isready');
            self.postMessage({ type: 'ready' });

            // Process any buffered commands
            for (var i = 0; i < buffer.length; i++) {
              processMsg(buffer[i]);
            }
            buffer = null;

          } catch (err) {
            self.postMessage({ type: 'error', message: err.message });
          }
        } else if (msg.type === 'go') {
          if (buffer !== null) {
            buffer.push(msg);
          } else {
            processMsg(msg);
          }
        }
      };

      function processMsg(msg) {
        currentMsgId = msg.id;
        pendingEval = null;
        engine.postMessage('position fen ' + msg.fen);
        if (msg.skillLevel !== undefined && msg.skillLevel < 20) {
          engine.postMessage('setoption name Skill Level value ' + msg.skillLevel);
        }
        engine.postMessage('go depth ' + msg.depth);
      }
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    client.worker = new Worker(URL.createObjectURL(blob), { type: 'module' });

    client.initPromise = new Promise(function(resolve, reject) {
      var timeout = setTimeout(function() {
        reject(new Error('Stockfish initialization timed out'));
      }, 30000);

      client.worker.onmessage = function(e) {
        if (e.data.type === 'ready') {
          clearTimeout(timeout);
          client.worker.onmessage = function(e) {
            if (e.data.type === 'result') {
              var cb = client.callbacks[e.data.id];
              if (cb) {
                cb({ bestMove: e.data.bestMove, evaluation: e.data.evaluation });
                delete client.callbacks[e.data.id];
              }
            }
          };
          resolve();
        }
        if (e.data.type === 'error') {
          reject(new Error(e.data.message));
        }
      };
      client.worker.postMessage({ type: 'init' });
    });

    return client.initPromise;
  };

  client.getMove = function(fen, skillLevel, depth) {
    skillLevel = skillLevel || 20;
    depth = depth || 10;
    var id = ++client.msgId;
    return client.init().then(function() {
      return new Promise(function(resolve) {
        client.callbacks[id] = resolve;
        client.worker.postMessage({ type: 'go', fen: fen, skillLevel: skillLevel, depth: depth, id: id });
      });
    });
  };

  client.analyzePosition = function(fen, depth) {
    depth = depth || 8;
    return client.getMove(fen, 20, depth);
  };

  return client;
})();
