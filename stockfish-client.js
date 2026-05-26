window.SFClient = (function() {
    const client = {
        initPromise: null
    };

    client.init = function() {
        if (client.initPromise) return client.initPromise;
        console.log("Stockfish API Client Initialized.");
        client.initPromise = Promise.resolve();
        return client.initPromise;
    };

    client.getMove = function(fen, skillLevel, depth) {
        // Fallback defaults if app.js doesn't pass them
        skillLevel = skillLevel || 20;
        depth = depth || 10;
        
        if (depth > 15) depth = 15;

        return client.init().then(function() {
            return fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=${depth}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.bestmove) {
                        const parts = data.bestmove.split(' ');
                        const bestMove = parts[1]; // e.g. "e2e4"
                        const evaluation = data.evaluation !== undefined ? data.evaluation * 100 : 0;

                        return {
                            bestMove: bestMove !== '(none)' ? bestMove : null,
                            evaluation: evaluation
                        };
                    }
                    throw new Error("Invalid API response");
                })
                .catch(err => {
                    console.error("Stockfish API Error:", err);
                    // Safe backup move so the game never freezes if API fails
                    return { bestMove: "e2e4", evaluation: 0 };
                });
        });
    };

    client.analyzePosition = function(fen, depth) {
        depth = depth || 8;
        return client.getMove(fen, 20, depth);
    };

    return client;
})();
