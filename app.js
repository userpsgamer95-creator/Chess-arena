/* ==========================================================================
   CHESS WORKSPACE CLIENT ENGINE (Core Chess Logic, UI, & Game State Controller)
   ========================================================================== */

// HIGH-RESOLUTION OPTIMIZED VECTOR SVG PATHS FOR CHESS PIECES (Chess.com Aesthetic)
const PIECE_SVGS = {
  // WHITE PIECES
  wp: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-.83 1.06-1.41 2.37-1.41 3.97 0 2.21 1.79 4 4 4h3c2.21 0 4-1.79 4-4 0-1.6-.58-2.91-1.41-3.97C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#ffffff" stroke="#161512" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  wn: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M 22,10 C 22,10 19,11 16,15 C 13,19 13,23 13,23 C 13,23 14,21 16,20 C 18,19 20,19 20,19 C 20,19 16,22 14,26 C 12,30 13,34 13,34 C 13,34 15,31 19,30 C 23,29 25,31 28,29 C 31,27 32,22 30,17 C 28,12 24,10 22,10 z" fill="#ffffff" stroke="#161512" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 9,26 C 9,26 11,28 13,27 C 15,26 16,24 16,24" fill="none" stroke="#161512" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="25" cy="15" r="2" fill="#161512"/>
  </svg>`,
  wb: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 36h27v2H9zm13.5-32c-3.14 0-5.5 2.5-5.5 5.5 0 1.13.34 2.19.92 3.06C14.77 14.54 13 17.56 13 21c0 5.27 3.51 9.68 8.5 10.72V35h2v-3.28c4.99-1.04 8.5-5.45 8.5-10.72 0-3.44-1.77-6.46-4.92-8.38.58-.87.92-1.93.92-3.06 0-3-2.36-5.5-5.5-5.5z" fill="#ffffff" stroke="#161512" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="22.5" cy="6" r="1.5" fill="#161512"/>
    <path d="M17.5 18h10M22.5 13v10" stroke="#161512" stroke-width="1.5"/>
  </svg>`,
  wr: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 39h27v2H9zm3-3h21v-4H12zm2.5-4l1.5-12h14l1.5 12h-17z" fill="#ffffff" stroke="#161512" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 16h4v4h-4zm7 0h3v4h-3zm6 0h4v4h-4z" fill="#ffffff" stroke="#161512" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 12h23v4H11z" fill="#ffffff" stroke="#161512" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  wq: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 37h27v3H9zm3-3h21l2-17-7 6-4-11-4 11-7-6 2 17z" fill="#ffffff" stroke="#161512" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="9" cy="16" r="1.5" fill="#ffffff" stroke="#161512"/>
    <circle cx="14" cy="6" r="1.5" fill="#ffffff" stroke="#161512"/>
    <circle cx="22.5" cy="2" r="1.5" fill="#ffffff" stroke="#161512"/>
    <circle cx="31" cy="6" r="1.5" fill="#ffffff" stroke="#161512"/>
    <circle cx="36" cy="16" r="1.5" fill="#ffffff" stroke="#161512"/>
  </svg>`,
  wk: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 11.63V6M20 8h5M9 38h27v3H9zm3.5-3h20c1.5 0 2.5-1.5 2.5-3 0-5.5-4-9-12.5-9h-1c-8.5 0-12.5 3.5-12.5 9 0 1.5 1 3 2.5 3z" fill="#ffffff" stroke="#161512" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.5 30C15 33 20 34 22.5 34s7.5-1 11-4" fill="none" stroke="#161512" stroke-width="1.5"/>
    <path d="M17 21.5c4 2.5 7 2.5 11 0" fill="none" stroke="#161512" stroke-width="1.5"/>
  </svg>`,

  // BLACK PIECES
  bp: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-.83 1.06-1.41 2.37-1.41 3.97 0 2.21 1.79 4 4 4h3c2.21 0 4-1.79 4-4 0-1.6-.58-2.91-1.41-3.97C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#312e2b" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  bn: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M 22,10 C 22,10 19,11 16,15 C 13,19 13,23 13,23 C 13,23 14,21 16,20 C 18,19 20,19 20,19 C 20,19 16,22 14,26 C 12,30 13,34 13,34 C 13,34 15,31 19,30 C 23,29 25,31 28,29 C 31,27 32,22 30,17 C 28,12 24,10 22,10 z" fill="#312e2b" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 9,26 C 9,26 11,28 13,27 C 15,26 16,24 16,24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="25" cy="15" r="2" fill="#ffffff"/>
  </svg>`,
  bb: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 36h27v2H9zm13.5-32c-3.14 0-5.5 2.5-5.5 5.5 0 1.13.34 2.19.92 3.06C14.77 14.54 13 17.56 13 21c0 5.27 3.51 9.68 8.5 10.72V35h2v-3.28c4.99-1.04 8.5-5.45 8.5-10.72 0-3.44-1.77-6.46-4.92-8.38.58-.87.92-1.93.92-3.06 0-3-2.36-5.5-5.5-5.5z" fill="#312e2b" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="22.5" cy="6" r="1.5" fill="#ffffff"/>
    <path d="M17.5 18h10M22.5 13v10" stroke="#ffffff" stroke-width="1.5"/>
  </svg>`,
  br: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 39h27v2H9zm3-3h21v-4H12zm2.5-4l1.5-12h14l1.5 12h-17z" fill="#312e2b" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 16h4v4h-4zm7 0h3v4h-3zm6 0h4v4h-4z" fill="#312e2b" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 12h23v4H11z" fill="#312e2b" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  bq: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 37h27v3H9zm3-3h21l2-17-7 6-4-11-4 11-7-6 2 17z" fill="#312e2b" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="9" cy="16" r="1.5" fill="#312e2b" stroke="#ffffff"/>
    <circle cx="14" cy="6" r="1.5" fill="#312e2b" stroke="#ffffff"/>
    <circle cx="22.5" cy="2" r="1.5" fill="#312e2b" stroke="#ffffff"/>
    <circle cx="31" cy="6" r="1.5" fill="#312e2b" stroke="#ffffff"/>
    <circle cx="36" cy="16" r="1.5" fill="#312e2b" stroke="#ffffff"/>
  </svg>`,
  bk: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5 11.63V6M20 8h5M9 38h27v3H9zm3.5-3h20c1.5 0 2.5-1.5 2.5-3 0-5.5-4-9-12.5-9h-1c-8.5 0-12.5 3.5-12.5 9 0 1.5 1 3 2.5 3z" fill="#312e2b" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11.5 30C15 33 20 34 22.5 34s7.5-1 11-4" fill="none" stroke="#ffffff" stroke-width="1.5"/>
    <path d="M17 21.5c4 2.5 7 2.5 11 0" fill="none" stroke="#ffffff" stroke-width="1.5"/>
  </svg>`,
};

// SYNTHESIZED SOUND SYSTEM (Procedural Synthesis using native Web Audio API - Zero Assets Required)
const SoundSynth = (() => {
  let audioCtx = null;
  let muted = false;

  const initCtx = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const play = (type) => {
    if (muted) return;
    try {
      initCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'move') {
        // High quality snap click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'capture') {
        // Shorter, sharper, noisier wooden sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.09);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.09);
      } else if (type === 'check') {
        // Warning alert double tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, audioCtx.currentTime);
        osc.frequency.setValueAtTime(650, audioCtx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.28);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.28);
      } else if (type === 'game-over') {
        // Resolved brassy triumph chord
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4
        osc.frequency.linearRampToValueAtTime(196.00, audioCtx.currentTime + 0.85); // G3
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.85);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
        osc2.frequency.linearRampToValueAtTime(261.63, audioCtx.currentTime + 0.85); // C4
        gain2.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.85);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.85);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.85);
      }
    } catch (e) {
      console.warn("Web Audio API failed or blocked: ", e);
    }
  };

  const setMute = (state) => {
    muted = state;
  };

  return { play, setMute };
})();

// CORE CHESS RULES AND LOGIC CONTROLLER
class ChessEngine {
  constructor() {
    this.resetGame();
  }

  resetGame() {
    // 8x8 Board Array Representation
    // row 0 is Rank 8 (Black side), row 7 is Rank 1 (White side)
    // col 0 is file a, col 7 is file h
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    this.turn = 'w'; // 'w' or 'b'
    
    // Castling Rights
    this.castlingRights = {
      w: { kingSide: true, queenSide: true },
      b: { kingSide: true, queenSide: true }
    };

    // Square where an en passant capture is available (passed over by 2-step pawn push)
    this.enPassantTarget = null; // { row, col }
    
    // History logs stack for undoing moves
    this.history = [];

    // Tracks captured pieces list
    this.capturedPieces = { w: [], b: [] };

    this.setupStartingPosition();
  }

  setupStartingPosition() {
    const backRow = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    
    // Setup Black back rank (Row 0) and Pawn rank (Row 1)
    for (let col = 0; col < 8; col++) {
      this.board[0][col] = { type: backRow[col], color: 'b' };
      this.board[1][col] = { type: 'p', color: 'b' };
    }

    // Setup White Pawn rank (Row 6) and back rank (Row 7)
    for (let col = 0; col < 8; col++) {
      this.board[6][col] = { type: 'p', color: 'w' };
      this.board[7][col] = { type: backRow[col], color: 'w' };
    }
  }

  cloneBoardState() {
    return {
      board: this.board.map(row => row.map(cell => cell ? { ...cell } : null)),
      turn: this.turn,
      castlingRights: {
        w: { ...this.castlingRights.w },
        b: { ...this.castlingRights.b }
      },
      enPassantTarget: this.enPassantTarget ? { ...this.enPassantTarget } : null,
      capturedPieces: {
        w: [...this.capturedPieces.w],
        b: [...this.capturedPieces.b]
      }
    };
  }

  loadBoardState(state) {
    this.board = state.board.map(row => row.map(cell => cell ? { ...cell } : null));
    this.turn = state.turn;
    this.castlingRights = {
      w: { ...state.castlingRights.w },
      b: { ...state.castlingRights.b }
    };
    this.enPassantTarget = state.enPassantTarget ? { ...state.enPassantTarget } : null;
    this.capturedPieces = {
      w: [...state.capturedPieces.w],
      b: [...state.capturedPieces.b]
    };
  }

  getFEN() {
    let fenParts = [];

    // 1. Piece placement
    let rows = [];
    for (let r = 0; r < 8; r++) {
      let rowStr = '';
      let emptyCount = 0;
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece) {
          if (emptyCount > 0) {
            rowStr += emptyCount;
            emptyCount = 0;
          }
          const letter = piece.type === 'p' ? 'p' : piece.type;
          rowStr += piece.color === 'w' ? letter.toUpperCase() : letter.toLowerCase();
        } else {
          emptyCount++;
        }
      }
      if (emptyCount > 0) {
        rowStr += emptyCount;
      }
      rows.push(rowStr);
    }
    fenParts.push(rows.join('/'));

    // 2. Turn
    fenParts.push(this.turn);

    // 3. Castling rights
    let castling = '';
    if (this.castlingRights.w.kingSide) castling += 'K';
    if (this.castlingRights.w.queenSide) castling += 'Q';
    if (this.castlingRights.b.kingSide) castling += 'k';
    if (this.castlingRights.b.queenSide) castling += 'q';
    if (castling === '') castling = '-';
    fenParts.push(castling);

    // 4. En passant target square
    if (this.enPassantTarget) {
      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
      fenParts.push(files[this.enPassantTarget.col] + ranks[this.enPassantTarget.row]);
    } else {
      fenParts.push('-');
    }

    // 5. Halfmove clock
    fenParts.push('0');

    // 6. Fullmove number
    const fullmove = Math.floor(this.history.length / 2) + 1;
    fenParts.push(fullmove.toString());

    return fenParts.join(' ');
  }

  // Gets piece at specific position safely
  getPiece(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    return this.board[row][col];
  }

  // Calculate material score: positive = White ahead, negative = Black ahead
  getMaterialScore() {
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece) {
          const val = values[piece.type] || 0;
          score += piece.color === 'w' ? val : -val;
        }
      }
    }
    return score;
  }

  // Find coordinates of king for current active turn or specific color
  findKing(color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece && piece.type === 'k' && piece.color === color) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  }

  // Check if a specific square is under threat/attack by opposite color
  isSquareAttacked(row, col, attackerColor) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece && piece.color === attackerColor) {
          const pseudoMoves = this.getPseudoLegalMoves(r, c, true); // ignore special moves (castling, etc) to avoid infinite loops
          const hits = pseudoMoves.some(m => m.toRow === row && m.toCol === col);
          if (hits) return true;
        }
      }
    }
    return false;
  }

  isInCheck(color) {
    const kingPos = this.findKing(color);
    if (!kingPos) return false;
    const attackerColor = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(kingPos.row, kingPos.col, attackerColor);
  }

  // Generates all legal moves for a piece at (row, col)
  getLegalMoves(row, col) {
    const piece = this.getPiece(row, col);
    if (!piece || piece.color !== this.turn) return [];

    const pseudoMoves = this.getPseudoLegalMoves(row, col);
    const legalMoves = [];

    // Filter moves: try move, check if king is in check, revert
    const originalState = this.cloneBoardState();
    for (const move of pseudoMoves) {
      this.executeMoveOnBoard(move);
      if (!this.isInCheck(piece.color)) {
        legalMoves.push(move);
      }
      this.loadBoardState(originalState);
    }

    return legalMoves;
  }

  // Generate ALL legal moves for the active color
  getAllLegalMoves(color) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece && piece.color === color) {
          moves.push(...this.getLegalMoves(r, c));
        }
      }
    }
    return moves;
  }

  // Generates pseudolegal moves (moves adhering to paths but ignoring check boundaries)
  getPseudoLegalMoves(row, col, rawAttacksOnly = false) {
    const piece = this.getPiece(row, col);
    if (!piece) return [];

    const moves = [];
    const color = piece.color;
    const enemyColor = color === 'w' ? 'b' : 'w';

    switch (piece.type) {
      case 'p': {
        const dir = color === 'w' ? -1 : 1;
        const startRank = color === 'w' ? 6 : 1;
        
        // Single step forward
        if (!rawAttacksOnly) {
          const fRow = row + dir;
          if (this.isValidSquare(fRow, col) && !this.getPiece(fRow, col)) {
            moves.push(this.createMoveObj(row, col, fRow, col, 'push'));
            
            // Double step forward from starting rank
            const ffRow = row + 2 * dir;
            if (row === startRank && !this.getPiece(ffRow, col)) {
              moves.push(this.createMoveObj(row, col, ffRow, col, 'double-push'));
            }
          }
        }

        // Standard Diagonal Captures
        const captures = [{ r: row + dir, c: col - 1 }, { r: row + dir, c: col + 1 }];
        for (const cap of captures) {
          if (this.isValidSquare(cap.r, cap.c)) {
            const dest = this.getPiece(cap.r, cap.c);
            if (dest && dest.color === enemyColor) {
              moves.push(this.createMoveObj(row, col, cap.r, cap.c, 'capture'));
            } else if (rawAttacksOnly) {
              // Threat monitoring maps
              moves.push(this.createMoveObj(row, col, cap.r, cap.c, 'threat'));
            }
            
            // En Passant diagonal captures
            if (!rawAttacksOnly && this.enPassantTarget && this.enPassantTarget.row === cap.r && this.enPassantTarget.col === cap.c) {
              moves.push(this.createMoveObj(row, col, cap.r, cap.c, 'en-passant'));
            }
          }
        }
        break;
      }

      case 'n': {
        const jumps = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        for (const j of jumps) {
          const r = row + j[0];
          const c = col + j[1];
          if (this.isValidSquare(r, c)) {
            const dest = this.getPiece(r, c);
            if (!dest) {
              moves.push(this.createMoveObj(row, col, r, c, 'normal'));
            } else if (dest.color === enemyColor) {
              moves.push(this.createMoveObj(row, col, r, c, 'capture'));
            } else if (rawAttacksOnly) {
              moves.push(this.createMoveObj(row, col, r, c, 'threat'));
            }
          }
        }
        break;
      }

      case 'b': {
        this.getSlidingMoves(moves, row, col, [[-1, -1], [-1, 1], [1, -1], [1, 1]], enemyColor, rawAttacksOnly);
        break;
      }

      case 'r': {
        this.getSlidingMoves(moves, row, col, [[-1, 0], [1, 0], [0, -1], [0, 1]], enemyColor, rawAttacksOnly);
        break;
      }

      case 'q': {
        this.getSlidingMoves(moves, row, col, [
          [-1, -1], [-1, 1], [1, -1], [1, 1],
          [-1, 0], [1, 0], [0, -1], [0, 1]
        ], enemyColor, rawAttacksOnly);
        break;
      }

      case 'k': {
        const steps = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],          [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
        for (const s of steps) {
          const r = row + s[0];
          const c = col + s[1];
          if (this.isValidSquare(r, c)) {
            const dest = this.getPiece(r, c);
            if (!dest) {
              moves.push(this.createMoveObj(row, col, r, c, 'normal'));
            } else if (dest.color === enemyColor) {
              moves.push(this.createMoveObj(row, col, r, c, 'capture'));
            } else if (rawAttacksOnly) {
              moves.push(this.createMoveObj(row, col, r, c, 'threat'));
            }
          }
        }

        // CASTLING RULES
        if (!rawAttacksOnly) {
          const rights = this.castlingRights[color];
          const attackerColor = enemyColor;

          // King must not be currently in check
          if (rights && !this.isInCheck(color)) {
            // King Side Castling
            if (rights.kingSide) {
              const c1 = col + 1, c2 = col + 2;
              if (!this.getPiece(row, c1) && !this.getPiece(row, c2)) {
                // Intermediate squares must not be attacked
                if (!this.isSquareAttacked(row, c1, attackerColor) && !this.isSquareAttacked(row, c2, attackerColor)) {
                  moves.push(this.createMoveObj(row, col, row, c2, 'castle-king'));
                }
              }
            }

            // Queen Side Castling
            if (rights.queenSide) {
              const c1 = col - 1, c2 = col - 2, c3 = col - 3;
              if (!this.getPiece(row, c1) && !this.getPiece(row, c2) && !this.getPiece(row, c3)) {
                // Passing squares (col-1 and col-2) must not be attacked
                if (!this.isSquareAttacked(row, c1, attackerColor) && !this.isSquareAttacked(row, c2, attackerColor)) {
                  moves.push(this.createMoveObj(row, col, row, c2, 'castle-queen'));
                }
              }
            }
          }
        }
        break;
      }
    }

    return moves;
  }

  // General slider helper (Rooks, Bishops, Queens)
  getSlidingMoves(movesList, startRow, startCol, directions, enemyColor, rawAttacksOnly) {
    for (const dir of directions) {
      let r = startRow + dir[0];
      let c = startCol + dir[1];

      while (this.isValidSquare(r, c)) {
        const dest = this.getPiece(r, c);
        if (!dest) {
          movesList.push(this.createMoveObj(startRow, startCol, r, c, 'normal'));
        } else {
          if (dest.color === enemyColor) {
            movesList.push(this.createMoveObj(startRow, startCol, r, c, 'capture'));
          } else if (rawAttacksOnly) {
            movesList.push(this.createMoveObj(startRow, startCol, r, c, 'threat'));
          }
          break; // slide path is blocked by piece
        }
        r += dir[0];
        c += dir[1];
      }
    }
  }

  isValidSquare(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  createMoveObj(fromR, fromC, toR, toC, flags) {
    return {
      fromRow: fromR,
      fromCol: fromC,
      toRow: toR,
      toCol: toC,
      flags: flags, // push, double-push, normal, capture, en-passant, castle-king, castle-queen, promotion
      piece: this.getPiece(fromR, fromC)
    };
  }

  // Helper: Executes the move directly on the active board array
  executeMoveOnBoard(move) {
    const { fromRow, fromCol, toRow, toCol, flags, piece } = move;
    
    // Lift piece from origin
    this.board[fromRow][fromCol] = null;

    // Handle standard captures, including promotion captures.
    const capturedOnTarget = this.board[toRow][toCol];
    if (capturedOnTarget) {
      this.capturedPieces[capturedOnTarget.color].push(capturedOnTarget.type);
    }

    // Handle En Passant Capture
    if (flags === 'en-passant') {
      const captRow = fromRow; // pawn captured is on the same row as attacker
      const captCol = toCol;
      const captured = this.board[captRow][captCol];
      if (captured) {
        this.capturedPieces[captured.color].push(captured.type);
      }
      this.board[captRow][captCol] = null;
    }

    // Move piece to target destination
    this.board[toRow][toCol] = piece;

    // Handle Castling moves
    if (flags === 'castle-king') {
      // Move Rook: from col 7 to col 5
      const rook = this.board[toRow][7];
      this.board[toRow][5] = rook;
      this.board[toRow][7] = null;
    } else if (flags === 'castle-queen') {
      // Move Rook: from col 0 to col 3
      const rook = this.board[toRow][0];
      this.board[toRow][3] = rook;
      this.board[toRow][0] = null;
    }

    // Set En Passant targets for double-push pawns
    if (flags === 'double-push') {
      this.enPassantTarget = {
        row: (fromRow + toRow) / 2,
        col: fromCol
      };
    } else {
      this.enPassantTarget = null;
    }

    // If a pawn moves, check for promotion (handled in UI via promotion trigger)
    
    // Toggle active player turns
    this.turn = this.turn === 'w' ? 'b' : 'w';
  }

  // Makes a legal move, updates castling rights, triggers sounds, registers rollback history
  makeMove(move, promotionType = null) {
    const stateSnapshot = this.cloneBoardState();
    const capturedPiece = move.flags === 'en-passant'
      ? this.board[move.fromRow][move.toCol]
      : this.board[move.toRow][move.toCol];
    const capturedPieceSnapshot = capturedPiece ? { ...capturedPiece } : null;
    
    // Perform promotion if requested
    if (move.flags === 'promotion' || (move.piece.type === 'p' && (move.toRow === 0 || move.toRow === 7))) {
      move.flags = 'promotion';
      move.piece.type = promotionType || 'q'; // Default to Queen if not specified
    }

    // Track standard piece capture logs
    const hasCapture = move.flags === 'capture' || move.flags === 'en-passant' || this.board[move.toRow][move.toCol] !== null;
    if (hasCapture && move.flags !== 'en-passant' && move.flags !== 'promotion') {
      move.flags = 'capture';
    }

    this.executeMoveOnBoard(move);

    // Update Castling Rights based on king or rook movement
    const pieceType = move.piece.type;
    const color = move.piece.color;
    
    if (pieceType === 'k') {
      this.castlingRights[color].kingSide = false;
      this.castlingRights[color].queenSide = false;
    } else if (pieceType === 'r') {
      if (move.fromCol === 7) this.castlingRights[color].kingSide = false;
      if (move.fromCol === 0) this.castlingRights[color].queenSide = false;
    }

    // If rook gets captured in back ranks, rescind castling rights for opponent
    if (capturedPieceSnapshot && capturedPieceSnapshot.type === 'r') {
      const capturedColor = capturedPieceSnapshot.color;
      if (move.toRow === (capturedColor === 'w' ? 7 : 0)) {
        if (move.toCol === 7) this.castlingRights[capturedColor].kingSide = false;
        if (move.toCol === 0) this.castlingRights[capturedColor].queenSide = false;
      }
    }

    // Generate Algebraic Move Notation string
    const san = this.generateSAN(move, stateSnapshot, hasCapture);

    // Save state to rollback history log
    this.history.push({
      snapshot: stateSnapshot,
      move: move,
      san: san
    });

    // Play synthesized sound effects
    const inCheck = this.isInCheck(this.turn);
    if (inCheck) {
      SoundSynth.play('check');
    } else if (hasCapture) {
      SoundSynth.play('capture');
    } else {
      SoundSynth.play('move');
    }

     // --- INJECT STOCKFISH AI TRIGGER ---
    if (this.turn === 'b') {
      const currentFen = this.getFEN();
      
      // Pull difficulty depth straight from your dropdown element
      const levelEl = document.getElementById('stockfish-level');
      const level = levelEl ? levelEl.value : 'medium';
      let selectedDepth = 10;
      if (level === 'easy') selectedDepth = 2;
      else if (level === 'medium') selectedDepth = 6;
      else if (level === 'hard') selectedDepth = 12;
      else if (level === 'grandmaster') selectedDepth = 15;

      const safeDepth = selectedDepth > 15 ? 15 : selectedDepth;

      setTimeout(() => {
        if (window.SFClient) {
          window.SFClient.getMove(currentFen + " b", 20, safeDepth)
            .then(response => {
              if (response && response.bestMove) {
                // Map columns: 'a' is 0, 'b' is 1, etc.
                const fromCol = response.bestMove.charCodeAt(0) - 97;
                // Map ranks: '8' is 0, '7' is 1, etc.
                const fromRow = 8 - parseInt(response.bestMove[1]);
                const toCol = response.bestMove.charCodeAt(2) - 97;
                const toRow = 8 - parseInt(response.bestMove[3]);
                
                const aiMove = {
                  fromRow: fromRow, 
                  fromCol: fromCol, 
                  toRow: toRow, 
                  toCol: toCol,
                  piece: this.board[fromRow][fromCol],
                  flags: this.board[toRow][toCol] ? 'capture' : 'normal'
                };
                
                if (aiMove.piece && aiMove.piece.color === 'b') {
                  this.makeMove(aiMove);
                  // Force render if your UI needs a manual refresh update
                  if (typeof window.renderBoard === 'function') {
                    window.renderBoard();
                  } else if (typeof this.render === 'function') {
                    this.render();
                  }
                }
              }
            })
            .catch(err => console.error("AI engine fetch exception caught safely:", err));
        }
      }, 300);
    }
    return { san: san, check: inCheck };
  }

  // Rolls back board state to previous turn
  undoMove() {
    if (this.history.length === 0) return null;
    const lastItem = this.history.pop();
    this.loadBoardState(lastItem.snapshot);
    SoundSynth.play('move');
    return lastItem.move;
  }

  // Generate Standard Chess Algebraic Notation (e.g. e4, Nf3, Bxe5, O-O)
  generateSAN(move, previousState, captured) {
    if (move.flags === 'castle-king') return 'O-O';
    if (move.flags === 'castle-queen') return 'O-O-O';

    let san = '';
    const piece = move.piece;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    if (piece.type !== 'p') {
      san += piece.type.toUpperCase();
      
      // Handle piece ambiguities (e.g., if two knights can leap to the same square, we disambiguate files)
      const otherSamePieces = [];
      const boardArr = previousState.board;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = boardArr[r][c];
          if (p && p.type === piece.type && p.color === piece.color && (r !== move.fromRow || c !== move.fromCol)) {
            otherSamePieces.push({ r, c });
          }
        }
      }

      let disambiguateFile = false;
      let disambiguateRank = false;

      for (const other of otherSamePieces) {
        // Construct temp simulation engine using previous state
        const tempEngine = new ChessEngine();
        tempEngine.loadBoardState(previousState);
        const legalOtherMoves = tempEngine.getLegalMoves(other.r, other.c);
        if (legalOtherMoves.some(m => m.toRow === move.toRow && m.toCol === move.toCol)) {
          if (other.c !== move.fromCol) {
            disambiguateFile = true;
          } else {
            disambiguateRank = true;
          }
        }
      }

      if (disambiguateFile) san += files[move.fromCol];
      if (disambiguateRank) san += ranks[move.fromRow];
    } else if (captured) {
      // If capturing pawn, add source file letter (e.g., exd5)
      san += files[move.fromCol];
    }

    if (captured) {
      san += 'x';
    }

    san += files[move.toCol] + ranks[move.toRow];

    if (move.flags === 'promotion') {
      san += '=' + piece.type.toUpperCase();
    }

    // Check checkmate signs after move
    const tempEngine = new ChessEngine();
    tempEngine.loadBoardState(this.cloneBoardState());
    const nextTurn = tempEngine.turn;
    const isOppCheck = tempEngine.isInCheck(nextTurn);
    const oppLegalMoves = tempEngine.getAllLegalMoves(nextTurn);

    if (isOppCheck) {
      if (oppLegalMoves.length === 0) {
        san += '#'; // Checkmate
      } else {
        san += '+'; // Check
      }
    }

    return san;
  }
}

// FRONTEND INTERACTION & CLIENT PRESENTATION CONTROLLER
class ChessApp {
  constructor() {
    this.engine = new ChessEngine();
    this.boardEl = document.getElementById('chessboard');
    this.flipped = false; // Board orientation tracker
    this.selectedSquare = null; // { row, col } of selected piece
    this.playerColor = 'w'; // Play as 'w' (White) or 'b' (Black)
    this.gameActive = false;
    this.stockfishThinking = false;
    this.stockfishRequestId = 0;
    
    // Timer counters
    this.timers = { w: 600, b: 600 };
    this.activePreset = 600; // 10 minutes rapid
    this.timerInterval = null;
    this.soundMuted = false;
    this.showHints = true;

    // Promotion pending values
    this.pendingPromoMove = null;

    // Evaluation bar
    this.currentEval = 0;

    // Arrow drawing
    this.tempArrowLine = null;
    this.tempArrowHead = null;
    this.drawnArrows = [];
    this.drawnCircles = [];

    // Game review data
    this.reviewMoves = [];
    this.lastPlayerEval = 0;
    this.lastPlayerBestMove = null;
    this.pendingReviewIndex = -1;
    this.firstMoveMade = false;

    this.init();
  }

  init() {
    this.setupUIListeners();
    this.newGame();

    // Initialize browser-based Stockfish
    const oppNameEl = document.getElementById('opponent-name');
    if (oppNameEl) oppNameEl.textContent = 'Loading Stockfish...';
    SFClient.init().then(() => {
      if (oppNameEl) oppNameEl.textContent = 'Stockfish 18';
    }).catch(err => {
      console.error('Failed to load Stockfish:', err);
      if (oppNameEl) oppNameEl.textContent = 'Stockfish (unavailable)';
    });
  }

  getOpponentColor() {
    return this.playerColor === 'w' ? 'b' : 'w';
  }

  canPlayerMove() {
    return this.gameActive && !this.stockfishThinking && this.engine.turn === this.playerColor;
  }

  beginTurn() {
    clearInterval(this.timerInterval);
    if (!this.gameActive) return;

    this.toggleTimersActiveState();
    if (this.engine.turn !== this.playerColor) {
      this.triggerStockfishMove();
    } else {
      this.updateUndoButton();
    }
  }

  // Draw core interactive chessboard grid
  renderBoard(animateLastMove = false) {
    this.boardEl.innerHTML = '';
    
    // Adjust colors theme
    const theme = document.getElementById('board-theme').value;
    this.boardEl.className = `chess-board ${theme}`;

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    // If flipped, render squares from row 7 down to 0, and cols 7 down to 0
    const rowOrder = this.flipped ? Array.from({length: 8}, (_, i) => 7 - i) : Array.from({length: 8}, (_, i) => i);
    const colOrder = this.flipped ? Array.from({length: 8}, (_, i) => 7 - i) : Array.from({length: 8}, (_, i) => i);

    for (const r of rowOrder) {
      for (const c of colOrder) {
        const square = document.createElement('div');
        const sqClass = (r + c) % 2 === 0 ? 'light-sq' : 'dark-sq';
        square.className = `square ${sqClass}`;
        square.dataset.row = r;
        square.dataset.col = c;

        // Overlay last-move highlighters
        const lastMoveItem = this.engine.history[this.engine.history.length - 1];
        if (lastMoveItem) {
          const m = lastMoveItem.move;
          if ((m.fromRow === r && m.fromCol === c) || (m.toRow === r && m.toCol === c)) {
            square.classList.add('last-move-trail');
          }
        }

        // Overlay checked king flash alert
        const piece = this.engine.getPiece(r, c);
        if (piece) {
          if (piece.type === 'k' && this.engine.isInCheck(piece.color)) {
            square.classList.add('checked-king-alert');
          }

          // Injected optimized piece vectors SVG
          const pieceEl = document.createElement('div');
          pieceEl.className = 'piece';
          pieceEl.innerHTML = PIECE_SVGS[piece.color + piece.type];
          
          // Drag and Drop support
          pieceEl.draggable = true;
          pieceEl.addEventListener('dragstart', (e) => this.handleDragStart(e, r, c));
          
          square.appendChild(pieceEl);
        }

        // Selected square highlight
        if (this.selectedSquare && this.selectedSquare.row === r && this.selectedSquare.col === c) {
          square.classList.add('selected');
        }

        // Render Chess.com-style coordinates inside board corners
        const isLeftColumn = this.flipped ? (c === 7) : (c === 0);
        const isBottomRow = this.flipped ? (r === 0) : (r === 7);

        if (isLeftColumn) {
          const rankLabel = document.createElement('span');
          rankLabel.className = 'coord-label coord-rank';
          rankLabel.textContent = ranks[r];
          square.appendChild(rankLabel);
        }

        if (isBottomRow) {
          const fileLabel = document.createElement('span');
          fileLabel.className = 'coord-label coord-file';
          fileLabel.textContent = files[c];
          square.appendChild(fileLabel);
        }

        // Highlight dots/circles for legal destinations hints
        if (this.selectedSquare && this.showHints) {
          const legalMoves = this.engine.getLegalMoves(this.selectedSquare.row, this.selectedSquare.col);
          const hasLegalTarget = legalMoves.some(m => m.toRow === r && m.toCol === c);
          if (hasLegalTarget) {
            const hint = document.createElement('div');
            if (piece) {
              hint.className = 'capture-hint';
            } else {
              hint.className = 'legal-hint';
            }
            square.appendChild(hint);
          }
        }

        // Click selection binds
        square.addEventListener('click', () => this.handleSquareClick(r, c));

        // Dragover and Drop binds
        square.addEventListener('dragover', (e) => e.preventDefault());
        square.addEventListener('drop', (e) => this.handleDrop(e, r, c));

        this.boardEl.appendChild(square);
      }
    }

    this.updateCaptureBarInfo();

    if (animateLastMove && this.engine.history.length > 0) {
      const lastMove = this.engine.history[this.engine.history.length - 1].move;
      const toSquare = this.boardEl.querySelector(`[data-row="${lastMove.toRow}"][data-col="${lastMove.toCol}"]`);
      if (toSquare) {
        const pieceEl = toSquare.querySelector('.piece');
        if (pieceEl) {
          const fromSquare = this.boardEl.querySelector(`[data-row="${lastMove.fromRow}"][data-col="${lastMove.fromCol}"]`);
          if (fromSquare) {
            const fromRect = fromSquare.getBoundingClientRect();
            const toRect = toSquare.getBoundingClientRect();
            const dx = fromRect.left - toRect.left;
            const dy = fromRect.top - toRect.top;
            
            pieceEl.style.transform = `translate(${dx}px, ${dy}px)`;
            pieceEl.classList.add('animating');
            
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                pieceEl.style.transform = 'translate(0, 0)';
              });
            });
            
            pieceEl.addEventListener('transitionend', () => {
              pieceEl.classList.remove('animating');
              pieceEl.style.transform = '';
            }, { once: true });
          }
        }
      }
    }
  }

  // Handle click coordinates selection
  handleSquareClick(row, col) {
    if (!this.canPlayerMove()) return;
    const piece = this.engine.getPiece(row, col);

    // If a piece is already selected
    if (this.selectedSquare) {
      const legalMoves = this.engine.getLegalMoves(this.selectedSquare.row, this.selectedSquare.col);
      const matchedMove = legalMoves.find(m => m.toRow === row && m.toCol === col);

      if (matchedMove) {
        this.processGameMove(matchedMove);
        this.selectedSquare = null;
        return;
      }
    }

    // Select new piece belonging to the active color turn
    if (piece && piece.color === this.engine.turn) {
      this.selectedSquare = { row, col };
    } else {
      this.selectedSquare = null; // click on empty or opponent piece de-selects
    }

    this.renderBoard();
  }

  // Handlers for HTML5 drag & drop standard
  handleDragStart(e, row, col) {
    if (!this.canPlayerMove()) {
      e.preventDefault();
      return;
    }
    const piece = this.engine.getPiece(row, col);
    if (piece && piece.color === this.engine.turn) {
      this.selectedSquare = { row, col };
      e.dataTransfer.setData('text/plain', JSON.stringify({ row, col }));
      // Soften board highlights instantly on drag
      setTimeout(() => this.renderBoard(), 10);
    } else {
      e.preventDefault();
    }
  }

  handleDrop(e, targetRow, targetCol) {
    e.preventDefault();
    if (!this.canPlayerMove()) return;
    if (this.selectedSquare) {
      const legalMoves = this.engine.getLegalMoves(this.selectedSquare.row, this.selectedSquare.col);
      const matchedMove = legalMoves.find(m => m.toRow === targetRow && m.toCol === targetCol);

      if (matchedMove) {
        this.processGameMove(matchedMove);
      }
      this.selectedSquare = null;
      this.renderBoard();
    }
  }

  // Core move executor pipeline
  processGameMove(move) {
    // Detect Pawn Promotion trigger
    const piece = move.piece;
    const isPromoRow = (piece.color === 'w' && move.toRow === 0) || (piece.color === 'b' && move.toRow === 7);
    
    if (piece.type === 'p' && isPromoRow) {
      this.triggerPawnPromotionSelector(move);
      return;
    }

    // Standard Move execution
    this.engine.makeMove(move);
    this.postMoveTasks();
  }

  postMoveTasks() {
    this.renderBoard(true);
    this.appendMoveLogList();

    const isPlayerMove = this.engine.history.length > 0 &&
      this.engine.history[this.engine.history.length - 1].move.piece.color === this.playerColor;

    // After first move, flag and enable the timer
    if (!this.firstMoveMade && this.engine.history.length > 0) {
      this.firstMoveMade = true;
    }

    this.toggleTimersActiveState();

    // Update evaluation bar with material-based eval after player moves
    if (isPlayerMove) {
      this.updateEvalFromMaterial();
    }

    // Record player move for review if it was the player's move
    if (this.engine.history.length > 0) {
      const lastItem = this.engine.history[this.engine.history.length - 1];
      const lastMoveColor = lastItem.move.piece.color;
      if (lastMoveColor === this.playerColor) {
        this.recordPlayerMoveForReview(lastItem.san);
      }
    }

    const isGameOver = this.checkGameOutcomeState();
    if (isGameOver) {
      // Show review after a brief delay
      setTimeout(() => this.showGameReview(), 500);
      return;
    }

    // Enable undo buttons
    document.getElementById('btn-undo').disabled = false;

    // Trigger Stockfish move if it's Stockfish's turn!
    if (this.engine.turn !== this.playerColor) {
      this.triggerStockfishMove();
    }
  }

  updateEvalFromMaterial() {
    const materialScore = this.engine.getMaterialScore();
    const evalScore = materialScore * 100; // 1 pawn = 100 centipawns
    this.updateEvaluationBar(evalScore);
  }

  // Update the evaluation bar based on centipawn score
  updateEvaluationBar(evalScore) {
    const whiteFill = document.getElementById('eval-white-fill');
    const blackFill = document.getElementById('eval-black-fill');
    const marker = document.getElementById('eval-marker');
    
    if (!whiteFill || !blackFill || !marker) return;

    // Clamp eval to reasonable range (-1000 to +1000 centipawns)
    const clampedEval = Math.max(-1000, Math.min(1000, evalScore));
    this.currentEval = clampedEval;

    // Convert centipawns to percentage (0% = black winning hard, 50% = equal, 100% = white winning hard)
    const percentage = ((clampedEval + 1000) / 2000) * 100;

    whiteFill.style.height = `${percentage}%`;
    blackFill.style.height = `${100 - percentage}%`;
    marker.style.top = `${percentage}%`;
  }

  // Arrow drawing helpers
  getSquareFromPixelXY(px, py) {
    const svg = document.getElementById('arrow-overlay');
    const svgRect = svg.getBoundingClientRect();
    const squareSize = svgRect.width / 8;
    const col = Math.floor(px / squareSize);
    const row = Math.floor(py / squareSize);
    const actualRow = this.flipped ? 7 - row : row;
    const actualCol = this.flipped ? 7 - col : col;
    if (actualRow >= 0 && actualRow < 8 && actualCol >= 0 && actualCol < 8) {
      return { row: actualRow, col: actualCol };
    }
    return null;
  }

  getSquareFromEvent(e) {
    const svg = document.getElementById('arrow-overlay');
    const svgRect = svg.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;
    const squareSize = svgRect.width / 8;
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);
    
    // Account for flipped board
    const actualRow = this.flipped ? 7 - row : row;
    const actualCol = this.flipped ? 7 - col : col;
    
    if (actualRow >= 0 && actualRow < 8 && actualCol >= 0 && actualCol < 8) {
      return { row: actualRow, col: actualCol };
    }
    return null;
  }

  getPixelFromSquare(row, col) {
    const svg = document.getElementById('arrow-overlay');
    const svgRect = svg.getBoundingClientRect();
    const squareSize = svgRect.width / 8;
    
    const displayRow = this.flipped ? 7 - row : row;
    const displayCol = this.flipped ? 7 - col : col;
    
    return {
      x: displayCol * squareSize + squareSize / 2,
      y: displayRow * squareSize + squareSize / 2
    };
  }

  createArrowSVG(parent, x1, y1, x2, y2, color) {
    const svg = document.getElementById('arrow-overlay');
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    if (dist < 10) return g;
    
    const headLen = Math.min(22, dist * 0.35);
    const lineEndFrac = (dist - headLen - 4) / dist;
    
    const lineEndX = x1 + dx * lineEndFrac;
    const lineEndY = y1 + dy * lineEndFrac;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', lineEndX);
    line.setAttribute('y2', lineEndY);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '8');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('opacity', '0.65');
    line.style.pointerEvents = 'none';
    g.appendChild(line);
    
    // Glow line behind
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    glow.setAttribute('x1', x1);
    glow.setAttribute('y1', y1);
    glow.setAttribute('x2', lineEndX);
    glow.setAttribute('y2', lineEndY);
    glow.setAttribute('stroke', color);
    glow.setAttribute('stroke-width', '14');
    glow.setAttribute('stroke-linecap', 'round');
    glow.setAttribute('opacity', '0.2');
    glow.style.pointerEvents = 'none';
    g.insertBefore(glow, line);
    
    // Arrowhead
    const headAngle1 = angle + Math.PI * 0.82;
    const headAngle2 = angle - Math.PI * 0.82;
    const headX = x2 - 2 * Math.cos(angle);
    const headY = y2 - 2 * Math.sin(angle);
    const points = `${headX},${headY} ${headX - Math.cos(headAngle1) * headLen},${headY - Math.sin(headAngle1) * headLen} ${headX - Math.cos(headAngle2) * headLen},${headY - Math.sin(headAngle2) * headLen}`;
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', color);
    polygon.setAttribute('opacity', '0.65');
    polygon.style.pointerEvents = 'none';
    g.appendChild(polygon);
    
    svg.appendChild(g);
    return g;
  }

  createCircleSVG(row, col, color) {
    const pos = this.getPixelFromSquare(row, col);
    const svg = document.getElementById('arrow-overlay');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    
    const svgRect = svg.getBoundingClientRect();
    const radius = (svgRect.width / 8) * 0.4;
    
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', radius);
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '5');
    circle.setAttribute('fill', 'none');
    circle.setAttribute('opacity', '0.6');
    circle.style.pointerEvents = 'none';
    
    svg.appendChild(circle);
    return circle;
  }

  clearArrows() {
    const svg = document.getElementById('arrow-overlay');
    svg.innerHTML = '';
    this.drawnArrows = [];
    this.drawnCircles = [];
  }

  // Analyze position for player's next turn (pre-fetch for review)
  analyzeNextPlayerPosition() {
    if (!this.gameActive) return;
    const fen = this.engine.getFEN();
    
    SFClient.analyzePosition(fen, 8).then(data => {
      if (data.bestMove && this.gameActive) {
        this.lastPlayerBestMove = data.bestMove;
        this.lastPlayerEval = data.evaluation;
      }
    }).catch(() => {});
  }

  // Record a player move for review
  recordPlayerMoveForReview(moveSAN) {
    if (!this.gameActive) return;
    const moveNum = Math.floor((this.engine.history.length) / 2) + 1;
    
    // Get current evaluation after player's move (from SF perspective)
    const fen = this.engine.getFEN();
    SFClient.analyzePosition(fen, 8).then(data => {
      if (!this.gameActive) return;
      const evalAfter = data.evaluation !== undefined ? -data.evaluation : 0;
      
      const entry = {
        moveNum,
        san: moveSAN,
        evalBefore: this.lastPlayerEval,
        evalAfter,
        bestMove: this.lastPlayerBestMove,
        classification: this.classifyMove(this.lastPlayerEval, evalAfter, this.playerColor)
      };
      this.reviewMoves.push(entry);
    })
    .catch(() => {});
  }

  classifyMove(evalBefore, evalAfter, playerColor) {
    const perspective = playerColor === 'w' ? 1 : -1;
    const before = evalBefore * perspective;
    const after = evalAfter * perspective;
    const loss = before - after;

    if (loss < 15) return { label: 'Brilliant', color: '#81b64c', icon: '★' };
    if (loss < 40) return { label: 'Excellent', color: '#a3d968', icon: '◆' };
    if (loss < 100) return { label: 'Good', color: '#bababa', icon: '●' };
    if (loss < 200) return { label: 'Inaccuracy', color: '#f0a050', icon: '▼' };
    if (loss < 400) return { label: 'Mistake', color: '#e67e22', icon: '✕' };
    return { label: 'Blunder', color: '#e04f53', icon: '✖' };
  }

  showGameReview() {
    if (this.reviewMoves.length === 0) return;
    
    document.getElementById('game-over-overlay').classList.add('hidden');
    document.getElementById('review-overlay').classList.remove('hidden');
    const container = document.getElementById('review-moves-list');
    container.innerHTML = '';

    let totalAccuracy = 0;
    let bestCount = 0;
    let mistakeCount = 0;

    for (const entry of this.reviewMoves) {
      const row = document.createElement('div');
      row.className = 'review-move-row';
      
      const numEl = document.createElement('span');
      numEl.className = 'review-move-num';
      numEl.textContent = `${entry.moveNum}.`;
      
      const sanEl = document.createElement('span');
      sanEl.className = 'review-move-san';
      sanEl.textContent = entry.san || '-';
      
      const badgeEl = document.createElement('span');
      badgeEl.className = 'review-move-badge';
      badgeEl.textContent = `${entry.classification.icon} ${entry.classification.label}`;
      badgeEl.style.color = entry.classification.color;
      badgeEl.style.borderColor = entry.classification.color;
      
      const evalEl = document.createElement('span');
      evalEl.className = 'review-move-eval';
      const e = entry.evalAfter;
      evalEl.textContent = e > 0 ? `+${(e / 100).toFixed(1)}` : (e / 100).toFixed(1);
      
      const bestEl = document.createElement('span');
      bestEl.className = 'review-move-best';
      bestEl.textContent = entry.bestMove || '-';
      
      row.appendChild(numEl);
      row.appendChild(sanEl);
      row.appendChild(badgeEl);
      row.appendChild(evalEl);
      row.appendChild(bestEl);
      container.appendChild(row);

      if (entry.classification.label === 'Brilliant' || entry.classification.label === 'Excellent') bestCount++;
      if (entry.classification.label === 'Mistake' || entry.classification.label === 'Blunder') mistakeCount++;
    }

    totalAccuracy = this.reviewMoves.length > 0 ? Math.round((bestCount / this.reviewMoves.length) * 100) : 0;
    document.getElementById('review-accuracy').textContent = `${totalAccuracy}%`;
    document.getElementById('review-best-count').textContent = `${bestCount}/${this.reviewMoves.length}`;
    document.getElementById('review-mistake-count').textContent = mistakeCount.toString();
    
    // Update accuracy circle
    const accuracyCircle = document.getElementById('review-accuracy-circle');
    accuracyCircle.style.strokeDasharray = `${totalAccuracy}, 100`;
    if (totalAccuracy >= 80) {
      accuracyCircle.style.stroke = '#81b64c';
    } else if (totalAccuracy >= 60) {
      accuracyCircle.style.stroke = '#f0a050';
    } else {
      accuracyCircle.style.stroke = '#e04f53';
    }
  }

  triggerStockfishMove() {
    if (this.stockfishThinking) return;
    const oppNameEl = document.getElementById('opponent-name');
    const originalOppName = oppNameEl ? oppNameEl.textContent : 'Stockfish';
    if (oppNameEl) {
      oppNameEl.innerHTML = 'Stockfish thinking<span class="thinking-indicator"><span class="thinking-dot"></span><span class="thinking-dot"></span><span class="thinking-dot"></span></span>';
    }

    const fen = this.engine.getFEN();
    const level = document.getElementById('stockfish-level').value;
    
    let skillLevel = 20;
    let depth = 10;
    if (level === 'easy') {
      skillLevel = 1;
      depth = 2;
    } else if (level === 'medium') {
      skillLevel = 5;
      depth = 6;
    } else if (level === 'hard') {
      skillLevel = 12;
      depth = 12;
    } else if (level === 'grandmaster') {
      skillLevel = 20;
      depth = 18;
    }

    this.stockfishThinking = true;
    this.stockfishRequestId++;
    const currentRequestId = this.stockfishRequestId;

    SFClient.getMove(fen, skillLevel, depth).then(data => {
      this.stockfishThinking = false;
      if (oppNameEl) {
        oppNameEl.textContent = originalOppName;
      }
      if (currentRequestId !== this.stockfishRequestId || !this.gameActive) {
        return;
      }
      if (data.evaluation !== undefined) {
        this.updateEvaluationBar(data.evaluation);
        // Store evaluation for game review: from player's perspective
        this.lastPlayerEval = -data.evaluation;
        this.lastPlayerBestMove = data.bestMove;
      }
      if (data.bestMove) {
        this.applyStockfishMove(data.bestMove);
        // After Stockfish moves, analyze for review
        this.analyzeNextPlayerPosition();
      } else {
        console.error('No bestmove returned from Stockfish:', data);
      }
    }).catch(err => {
      this.stockfishThinking = false;
      if (oppNameEl) {
        oppNameEl.textContent = originalOppName;
      }
      console.error('Error getting Stockfish move:', err);
    });
  }

  applyStockfishMove(coordMoveStr) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    const fromFileChar = coordMoveStr[0];
    const fromRankChar = coordMoveStr[1];
    const toFileChar = coordMoveStr[2];
    const toRankChar = coordMoveStr[3];
    const promoChar = coordMoveStr[4]; // optional promotion piece

    const fromCol = files.indexOf(fromFileChar);
    const fromRow = ranks.indexOf(fromRankChar);
    const toCol = files.indexOf(toFileChar);
    const toRow = ranks.indexOf(toRankChar);

    const legalMoves = this.engine.getLegalMoves(fromRow, fromCol);
    const matchedMove = legalMoves.find(m => m.toRow === toRow && m.toCol === toCol);

    if (matchedMove) {
      this.engine.makeMove(matchedMove, promoChar);
      this.postMoveTasks();
    } else {
      console.error('Stockfish suggested illegal move or move not found:', coordMoveStr);
    }
  }

  // Opens promotion overlays
  triggerPawnPromotionSelector(move) {
    this.pendingPromoMove = move;
    
    // Display dynamic SVG piece buttons in modal depending on color
    const container = document.querySelector('.promotion-choices');
    container.innerHTML = '';
    
    const color = move.piece.color;
    const types = ['q', 'r', 'b', 'n'];

    for (const t of types) {
      const btn = document.createElement('button');
      btn.className = 'promo-btn';
      btn.innerHTML = PIECE_SVGS[color + t];
      btn.addEventListener('click', () => {
        this.engine.makeMove(this.pendingPromoMove, t);
        document.getElementById('promotion-overlay').classList.add('hidden');
        this.pendingPromoMove = null;
        this.postMoveTasks();
      });
      container.appendChild(btn);
    }

    document.getElementById('promotion-overlay').classList.remove('hidden');
  }

  // Algebraic SAN Move Log panels update
  appendMoveLogList() {
    const container = document.getElementById('move-history-log');
    container.innerHTML = '';

    const history = this.engine.history;
    let rowEl = null;

    history.forEach((item, index) => {
      if (index % 2 === 0) {
        // White moves trigger a new numbered row
        rowEl = document.createElement('div');
        rowEl.className = 'move-row';
        
        const numEl = document.createElement('span');
        numEl.className = 'move-num';
        numEl.textContent = `${Math.floor(index / 2) + 1}.`;
        
        rowEl.appendChild(numEl);
        container.appendChild(rowEl);
      }

      const moveEl = document.createElement('span');
      moveEl.className = 'move-val';
      moveEl.textContent = item.san;
      
      // Select board snapshot on click
      moveEl.addEventListener('click', () => {
        // Rollback engine to clicked move snapshot for inspection preview
        this.engine.loadBoardState(item.snapshot);
        this.renderBoard();
        // Pause active clocks on inspection
        clearInterval(this.timerInterval);
      });

      if (rowEl) rowEl.appendChild(moveEl);
    });

    // Auto scroll move log
    const outerLog = document.getElementById('move-history-container');
    outerLog.scrollTop = outerLog.scrollHeight;
  }

  // Dynamic Captured pieces and advantages calculation
  updateCaptureBarInfo() {
    const whiteCaptured = document.getElementById('captured-by-white');
    const blackCaptured = document.getElementById('captured-by-black');
    
    whiteCaptured.innerHTML = '';
    blackCaptured.innerHTML = '';

    const capturedByWhiteList = this.engine.capturedPieces.b; // White captured Black's pieces
    const capturedByBlackList = this.engine.capturedPieces.w;

    // Piece static value ratings (Advantage Score calculation)
    const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

    let scoreWhite = 0;
    let scoreBlack = 0;

    // Standard sort orders (Queens first, Pawns last)
    const order = ['q', 'r', 'b', 'n', 'p'];
    capturedByWhiteList.sort((a,b) => order.indexOf(a) - order.indexOf(b));
    capturedByBlackList.sort((a,b) => order.indexOf(a) - order.indexOf(b));

    // Render White captured
    capturedByWhiteList.forEach(t => {
      scoreWhite += values[t];
      const icon = document.createElement('div');
      icon.innerHTML = PIECE_SVGS['b' + t]; // draw black piece inside white bar
      icon.style.width = '14px';
      icon.style.height = '14px';
      whiteCaptured.appendChild(icon);
    });

    // Render Black captured
    capturedByBlackList.forEach(t => {
      scoreBlack += values[t];
      const icon = document.createElement('div');
      icon.innerHTML = PIECE_SVGS['w' + t];
      icon.style.width = '14px';
      icon.style.height = '14px';
      blackCaptured.appendChild(icon);
    });

    // Display advantages
    const advWhiteEl = document.getElementById('white-advantage');
    const advBlackEl = document.getElementById('black-advantage');

    if (scoreWhite > scoreBlack) {
      advWhiteEl.textContent = `+${scoreWhite - scoreBlack}`;
      advWhiteEl.classList.remove('hidden');
      advBlackEl.classList.add('hidden');
    } else if (scoreBlack > scoreWhite) {
      advBlackEl.textContent = `+${scoreBlack - scoreWhite}`;
      advBlackEl.classList.remove('hidden');
      advWhiteEl.classList.add('hidden');
    } else {
      advWhiteEl.classList.add('hidden');
      advBlackEl.classList.add('hidden');
    }
  }

  // CHESS TIMER LOGIC
  toggleTimersActiveState() {
    clearInterval(this.timerInterval);

    if (this.activePreset === 'infinite') return;

    const timerBoxWhite = document.getElementById('player-timer');
    const timerBoxBlack = document.getElementById('opponent-timer');

    if (this.engine.turn === 'w') {
      timerBoxWhite.classList.add('active-turn');
      timerBoxBlack.classList.remove('active-turn');
    } else {
      timerBoxBlack.classList.add('active-turn');
      timerBoxWhite.classList.remove('active-turn');
    }

    // Don't tick the timer until after White's first move
    if (!this.firstMoveMade && this.engine.history.length === 0) return;

    this.timerInterval = setInterval(() => {
      const activeColor = this.engine.turn;
      this.timers[activeColor]--;

      this.updateTimerDisplay();

      // Check Flag-fall (Game Over on time loss)
      if (this.timers[activeColor] <= 0) {
        clearInterval(this.timerInterval);
        this.triggerGameOver('Time Out!', activeColor === 'w' ? 'Black wins on time.' : 'White wins on time.', 'Flag-fall exhaustion.');
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const timerBoxWhite = document.getElementById('player-timer');
    const timerBoxBlack = document.getElementById('opponent-timer');

    const format = (seconds) => {
      if (seconds < 0) seconds = 0;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    timerBoxWhite.textContent = format(this.timers.w);
    timerBoxBlack.textContent = format(this.timers.b);

    // Apply danger warning animation for sub-30 seconds remaining
    if (this.timers.w < 30 && this.activePreset !== 'infinite') {
      timerBoxWhite.classList.add('danger');
    } else {
      timerBoxWhite.classList.remove('danger');
    }

    if (this.timers.b < 30 && this.activePreset !== 'infinite') {
      timerBoxBlack.classList.add('danger');
    } else {
      timerBoxBlack.classList.remove('danger');
    }
  }

  // Outcomes verification (Checkmate, Stalemate, Insufficient Material, Draws)
  checkGameOutcomeState() {
    const color = this.engine.turn;
    const legalMoves = this.engine.getAllLegalMoves(color);

    if (legalMoves.length === 0) {
      clearInterval(this.timerInterval);
      const inCheck = this.engine.isInCheck(color);
      
      if (inCheck) {
        // CHECKMATE
        const winner = color === 'w' ? 'Black Wins!' : 'White Wins!';
        this.triggerGameOver('Checkmate!', winner, `By checkmate on move ${this.engine.history.length}.`);
      } else {
        // STALEMATE
        this.triggerGameOver('Draw!', 'Stalemate reached.', 'No legal moves remaining on the turn.');
      }
      return true;
    } else {
      // Insufficient Material Draw calculations
      return this.checkDrawConditions();
    }
  }

  checkDrawConditions() {
    // Insufficient Material Draw
    const wPieces = [];
    const bPieces = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.engine.board[r][c];
        if (p) {
          if (p.color === 'w') wPieces.push(p.type);
          if (p.color === 'b') bPieces.push(p.type);
        }
      }
    }

    const isDraw = this.isInsufficientMaterial(wPieces, bPieces);
    if (isDraw) {
      clearInterval(this.timerInterval);
      this.triggerGameOver('Draw!', 'Insufficient Material.', 'Only Kings and lone minor pieces remain.');
      return true;
    }
    return false;
  }

  isInsufficientMaterial(w, b) {
    // King vs King
    if (w.length === 1 && b.length === 1) return true;

    // King + Knight or King + Bishop vs King
    if ((w.length === 2 && w.includes('n') && b.length === 1) || (b.length === 2 && b.includes('n') && w.length === 1)) return true;
    if ((w.length === 2 && w.includes('b') && b.length === 1) || (b.length === 2 && b.includes('b') && w.length === 1)) return true;

    return false;
  }

  // Opens game outcomes dialogues
  triggerGameOver(title, result, reason) {
    this.gameActive = false;
    clearInterval(this.timerInterval);
    document.getElementById('game-over-title').textContent = title;
    document.getElementById('game-over-result').textContent = result;
    document.getElementById('game-over-reason').textContent = reason;
    document.getElementById('game-over-overlay').classList.remove('hidden');
    SoundSynth.play('game-over');
  }

  updatePlayerNamesAndAvatars() {
    const playerNameEl = document.getElementById('player-name');
    const opponentNameEl = document.getElementById('opponent-name');
    
    if (this.playerColor === 'w') {
      playerNameEl.textContent = 'Player (White)';
      opponentNameEl.textContent = 'Stockfish (Black)';
    } else {
      playerNameEl.textContent = 'Player (Black)';
      opponentNameEl.textContent = 'Stockfish (White)';
    }
  }

  // Interactive configurations binds
  setupUIListeners() {
    // New Game triggers
    document.getElementById('btn-new-game').addEventListener('click', () => {
      document.getElementById('side-selector-overlay').classList.remove('hidden');
    });
    document.getElementById('btn-over-new-game').addEventListener('click', () => {
      document.getElementById('game-over-overlay').classList.add('hidden');
      document.getElementById('review-overlay').classList.add('hidden');
      document.getElementById('side-selector-overlay').classList.remove('hidden');
    });
    document.getElementById('btn-over-review').addEventListener('click', () => {
      document.getElementById('game-over-overlay').classList.add('hidden');
      this.showGameReview();
    });
    document.getElementById('btn-review-new-game').addEventListener('click', () => {
      document.getElementById('review-overlay').classList.add('hidden');
      document.getElementById('side-selector-overlay').classList.remove('hidden');
    });

    // Side Selector Choices
    const sideBtns = document.querySelectorAll('.side-btn');
    sideBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const side = btn.dataset.side;
        this.playerColor = side;
        this.flipped = (side === 'b');
        
        // Hide the overlay
        document.getElementById('side-selector-overlay').classList.add('hidden');
        
        // Update names and avatars based on playerColor
        this.updatePlayerNamesAndAvatars();
        
        // Start new game
        this.newGame();
        
        // Activate and begin the game turn
        this.gameActive = true;
        this.beginTurn();
      });
    });

    // Time Presets
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const seconds = btn.dataset.time;
        this.activePreset = seconds === 'infinite' ? 'infinite' : parseInt(seconds);
        
        // Show side selector overlay to choose side for the new time control
        document.getElementById('side-selector-overlay').classList.remove('hidden');
      });
    });

    // Sidebar Tab selection
    document.getElementById('tab-moves').addEventListener('click', () => {
      document.getElementById('tab-moves').classList.add('active');
      document.getElementById('tab-settings').classList.remove('active');
      document.getElementById('moves-content').classList.remove('hidden');
      document.getElementById('settings-content').classList.add('hidden');
    });

    document.getElementById('tab-settings').addEventListener('click', () => {
      document.getElementById('tab-settings').classList.add('active');
      document.getElementById('tab-moves').classList.remove('active');
      document.getElementById('settings-content').classList.remove('hidden');
      document.getElementById('moves-content').classList.add('hidden');
    });

    // Settings adjustments
    document.getElementById('board-theme').addEventListener('change', () => this.renderBoard());
    
    // Audio toggler
    const sBtn = document.getElementById('btn-sound-toggle');
    sBtn.addEventListener('click', () => {
      this.soundMuted = !this.soundMuted;
      sBtn.textContent = this.soundMuted ? 'OFF' : 'ON';
      sBtn.classList.toggle('active');
      SoundSynth.setMute(this.soundMuted);
    });

    // Hints toggler
    const hBtn = document.getElementById('btn-hints-toggle');
    hBtn.addEventListener('click', () => {
      this.showHints = !this.showHints;
      hBtn.textContent = this.showHints ? 'ON' : 'OFF';
      hBtn.classList.toggle('active');
      this.renderBoard();
    });

    // Board right-click arrow drawing (always active, no toggle needed)
    this.boardEl.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Track arrow drag state globally
    let dragArrow = {
      startSquare: null,
      tempLine: null,
      tempHead: null,
      tempGlow: null,
      currentX: 0,
      currentY: 0,
    };
    
    const updateTempArrow = (x, y) => {
      if (!dragArrow.tempLine || !dragArrow.tempHead) return;
      dragArrow.currentX = x;
      dragArrow.currentY = y;
      
      const startX = parseFloat(dragArrow.tempLine.getAttribute('x1'));
      const startY = parseFloat(dragArrow.tempLine.getAttribute('y1'));
      
      // Line end before arrowhead
      const dx = x - startX;
      const dy = y - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const headLen = Math.min(22, dist * 0.35);
      const lineEndFrac = dist > 0 ? (dist - headLen - 4) / dist : 0;
      
      const lineEndX = startX + dx * lineEndFrac;
      const lineEndY = startY + dy * lineEndFrac;
      
      dragArrow.tempLine.setAttribute('x2', lineEndX);
      dragArrow.tempLine.setAttribute('y2', lineEndY);
      if (dragArrow.tempGlow) {
        dragArrow.tempGlow.setAttribute('x2', lineEndX);
        dragArrow.tempGlow.setAttribute('y2', lineEndY);
      }
      
      // Arrowhead
      const headX = x - 2 * Math.cos(angle);
      const headY = y - 2 * Math.sin(angle);
      const headAngle1 = angle + Math.PI * 0.82;
      const headAngle2 = angle - Math.PI * 0.82;
      const points = `${headX},${headY} ${headX - Math.cos(headAngle1) * headLen},${headY - Math.sin(headAngle1) * headLen} ${headX - Math.cos(headAngle2) * headLen},${headY - Math.sin(headAngle2) * headLen}`;
      
      dragArrow.tempHead.setAttribute('points', points);
    };
    
    const finishArrow = () => {
      if (!dragArrow.startSquare) return;
      
      const endSquare = this.getSquareFromPixelXY(dragArrow.currentX, dragArrow.currentY);
      
      if (endSquare) {
        const startPos = this.getPixelFromSquare(dragArrow.startSquare.row, dragArrow.startSquare.col);
        const endPos = this.getPixelFromSquare(endSquare.row, endSquare.col);
        
        if (endSquare.row === dragArrow.startSquare.row && endSquare.col === dragArrow.startSquare.col) {
          // Same square = draw circle
          this.createCircleSVG(endSquare.row, endSquare.col, '#81b64c');
        } else {
          // Draw green arrow
          this.createArrowSVG(null, startPos.x, startPos.y, endPos.x, endPos.y, '#81b64c');
        }
      }
      
      // Cleanup temp
      if (dragArrow.tempGlow) { try { dragArrow.tempGlow.remove(); } catch(e) {} dragArrow.tempGlow = null; }
      if (dragArrow.tempLine) { try { dragArrow.tempLine.remove(); } catch(e) {} dragArrow.tempLine = null; }
      if (dragArrow.tempHead) { try { dragArrow.tempHead.remove(); } catch(e) {} dragArrow.tempHead = null; }
      dragArrow.startSquare = null;
    };
    
    this.boardEl.addEventListener('mousedown', (e) => {
      if (e.button !== 2) return;
      
      const square = this.getSquareFromEvent(e);
      if (!square) return;
      
      dragArrow.startSquare = square;
      const startPos = this.getPixelFromSquare(square.row, square.col);
      dragArrow.currentX = startPos.x;
      dragArrow.currentY = startPos.y;
      
      // Create temp arrow with glow
      dragArrow.tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      dragArrow.tempLine.setAttribute('x1', startPos.x);
      dragArrow.tempLine.setAttribute('y1', startPos.y);
      dragArrow.tempLine.setAttribute('x2', startPos.x);
      dragArrow.tempLine.setAttribute('y2', startPos.y);
      dragArrow.tempLine.setAttribute('stroke', '#81b64c');
      dragArrow.tempLine.setAttribute('stroke-width', '8');
      dragArrow.tempLine.setAttribute('stroke-linecap', 'round');
      dragArrow.tempLine.setAttribute('opacity', '0.65');
      
      // Glow behind temp arrow
      const tempGlow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tempGlow.setAttribute('x1', startPos.x);
      tempGlow.setAttribute('y1', startPos.y);
      tempGlow.setAttribute('x2', startPos.x);
      tempGlow.setAttribute('y2', startPos.y);
      tempGlow.setAttribute('stroke', '#81b64c');
      tempGlow.setAttribute('stroke-width', '14');
      tempGlow.setAttribute('stroke-linecap', 'round');
      tempGlow.setAttribute('opacity', '0.2');
      dragArrow.tempGlow = tempGlow;
      
      dragArrow.tempHead = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      dragArrow.tempHead.setAttribute('points', `${startPos.x},${startPos.y} ${startPos.x},${startPos.y} ${startPos.x},${startPos.y}`);
      dragArrow.tempHead.setAttribute('fill', '#81b64c');
      dragArrow.tempHead.setAttribute('opacity', '0.65');
      
      const svg = document.getElementById('arrow-overlay');
      svg.appendChild(tempGlow);
      svg.appendChild(dragArrow.tempLine);
      svg.appendChild(dragArrow.tempHead);
    });
    
    // Global mousemove for dragging anywhere
    document.addEventListener('mousemove', (e) => {
      if (!dragArrow.startSquare || !dragArrow.tempLine) return;
      
      const svg = document.getElementById('arrow-overlay');
      const svgRect = svg.getBoundingClientRect();
      const x = e.clientX - svgRect.left;
      const y = e.clientY - svgRect.top;
      
      updateTempArrow(x, y);
    });
    
    // Global mouseup to finish arrow even if released outside board
    document.addEventListener('mouseup', (e) => {
      if (!dragArrow.startSquare) return;
      finishArrow();
    });

    // Clear arrows on any left-click on the board
    this.boardEl.addEventListener('click', () => {
      this.clearArrows();
    });

    // Undo action
    document.getElementById('btn-undo').addEventListener('click', () => {
      const historyLength = this.engine.history.length;
      if (historyLength === 0) return;
      
      const lastMoveItem = this.engine.history[historyLength - 1];
      const lastMoveColor = lastMoveItem.move.piece.color;
      
      if (lastMoveColor !== this.playerColor) {
        if (historyLength >= 2) {
          this.engine.undoMove(); // Revert Stockfish's move
          this.engine.undoMove(); // Revert Player's move
        } else {
          return;
        }
      } else {
        this.engine.undoMove();
      }
      
      this.selectedSquare = null;
      this.renderBoard();
      this.appendMoveLogList();
      this.toggleTimersActiveState();
      
      const newLength = this.engine.history.length;
      if (newLength === 0 || (newLength === 1 && this.playerColor === 'b')) {
        document.getElementById('btn-undo').disabled = true;
      }
    });

    // Resign action
    document.getElementById('btn-resign').addEventListener('click', () => {
      clearInterval(this.timerInterval);
      const activeColorText = this.engine.turn === 'w' ? 'Black wins by resignation.' : 'White wins by resignation.';
      this.triggerGameOver('Resigned!', activeColorText, 'Voluntary match surrender.');
    });

    // Board Flip
    document.getElementById('btn-flip').addEventListener('click', () => {
      this.flipped = !this.flipped;
      this.renderBoard();
    });
  }

  // Wipes boards and resets clock counters
  newGame() {
    clearInterval(this.timerInterval);
    this.engine.resetGame();
    this.selectedSquare = null;
    this.gameActive = false;
    this.stockfishThinking = false;
    this.stockfishRequestId++;

    if (this.activePreset === 'infinite') {
      this.timers = { w: 0, b: 0 };
      document.getElementById('player-timer').textContent = '∞';
      document.getElementById('opponent-timer').textContent = '∞';
    } else {
      this.timers = { w: this.activePreset, b: this.activePreset };
      this.updateTimerDisplay();
    }

    document.getElementById('btn-undo').disabled = true;
    document.getElementById('move-history-log').innerHTML = '';
    document.getElementById('review-overlay').classList.add('hidden');
    
    // Clear danger flashes
    document.getElementById('player-timer').className = 'timer-box';
    document.getElementById('opponent-timer').className = 'timer-box';

    // Reset evaluation bar
    this.currentEval = 0;
    this.updateEvaluationBar(0);
    
    // Clear arrows
    this.clearArrows();

    // Reset game review data
    this.reviewMoves = [];
    this.lastPlayerEval = 0;
    this.lastPlayerBestMove = null;
    this.firstMoveMade = false;
    
    this.renderBoard();
  }

  updateUndoButton() {
    const historyLength = this.engine.history.length;
    const btnUndo = document.getElementById('btn-undo');
    if (!btnUndo) return;
    if (historyLength === 0 || (historyLength === 1 && this.playerColor === 'b')) {
      btnUndo.disabled = true;
    } else {
      btnUndo.disabled = false;
    }
  }
}

// Instantiate fully functioning frontend client application on screen ready
document.addEventListener('DOMContentLoaded', () => {
  window.ChessWorkspace = new ChessApp();
});
