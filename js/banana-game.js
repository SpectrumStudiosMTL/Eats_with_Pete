// ============================================================
// Chef Peter's Banana Blitz — a lightweight Pac-Man-style easter
// egg, opened by clicking the banana stand. Self-contained: the
// only coupling with main.js is the window.BananaGame / window.
// miniGameOpen bridge (see index.html/main.js for the click that
// opens it and the input-gating checks that read miniGameOpen).
// ============================================================
(function(){

// --- maze -----------------------------------------------------
// # wall, . pellet, o power pellet (carrot), space = open floor,
// D = ghost-house door (walkable by B.R.O.s always, by Peter only
// once every pellet is gone), H = ghost-house interior, P = Peter's
// start cell. Symmetric bordered room with 12 isolated pillar
// obstacles (guarantees connectivity — nothing touches the border
// or another pillar) and a single-entrance ghost house dead centre.
const MAZE = [
  "###################",
  "#o...............o#",
  "#.##...#...#...##.#",
  "#.##...#...#...##.#",
  "#....##.....##....#",
  "#....##.....##....#",
  "#.................#",
  "#.....###D###.....#",
  "#.....#HHHHH#.....#",
  "#......#####......#",
  "#.................#",
  "#....##.....##....#",
  "#....##..P..##....#",
  "#.##...#...#...##.#",
  "#.##...#...#...##.#",
  "#o...............o#",
  "###################",
];
const COLS = MAZE[0].length;
const ROWS = MAZE.length;
const CELL = 26; // backing-resolution px per grid cell — bumped up for legibility

const CHEESE_COL = 9, CHEESE_ROW = 8;
const HOLD_COL = 9, HOLD_ROW = 8;   // same cell as the cheese — this maze only has one H cell
const DOOR_COL = 9, DOOR_ROW = 7;

const BRO_START = [
  { col: 8, row: 6 },
  { col: 10, row: 6 },
];

let peterStart = { col: 9, row: 12 };
let pelletOrigin = new Set();   // "col,row" keys, the full original pellet layout
let powerOrigin = new Set();

(function parseMaze(){
  for(let r = 0; r < ROWS; r++){
    for(let c = 0; c < COLS; c++){
      const ch = MAZE[r][c];
      if(ch === '.') pelletOrigin.add(c + ',' + r);
      else if(ch === 'o') powerOrigin.add(c + ',' + r);
      else if(ch === 'P') peterStart = { col: c, row: r };
    }
  }
})();

function isWalkable(col, row, isGhost){
  if(col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
  const ch = MAZE[row][col];
  if(ch === '#') return false;
  if(ch === 'D') return isGhost ? true : (livePellets.size + livePowers.size === 0);
  return true;
}

// --- directions -------------------------------------------------
const UP = {dx:0, dy:-1}, DOWN = {dx:0, dy:1}, LEFT = {dx:-1, dy:0}, RIGHT = {dx:1, dy:0}, NONE = {dx:0, dy:0};
const ALL_DIRS = [UP, DOWN, LEFT, RIGHT];
function isReverse(a, b){ return a.dx === -b.dx && a.dy === -b.dy; }
function isNoneDir(d){ return d.dx === 0 && d.dy === 0; } // value-based, not reference (===NONE) — a direction object that happens to equal {0,0} but isn't the NONE singleton must still count as "no direction"

// --- tunable constants -------------------------------------------
const PETER_SPEED = 3.8;        // cells/sec — slowed from 5.2, was too fast to reliably catch turns into side rows
const BRO_SPEED = 2.6;          // widened the gap from Peter's speed (was 3.1) so open-corridor escapes are reliable
const BRO_FRIGHTENED_SPEED = 1.7;
const RESPAWN_GRACE = 1.5;      // seconds of immunity right after a life-loss reset, so getting cornered again isn't instant
const SPEED_BOOST_MULT = 1.3;
const FRIGHTENED_DURATION = 7.5; // seconds
const FRIGHTENED_WARNING = 2.0;  // seconds left when flicker starts
const HOLD_DURATION = 1.0;       // seconds an eaten B.R.O. waits in the house
const DYING_FREEZE = 1.4;
const READY_FREEZE = 1.1;
const MAX_DT = 0.05; // caps a stale/huge first tick (e.g. tab was backgrounded)

const SCORE_PELLET = 10, SCORE_POWER = 50, SCORE_BRO = 200, SCORE_CHEESE = 500;
const TOTAL_ROUNDS = 3;

// --- assets -------------------------------------------------------
function img(src){ const i = new Image(); i.src = src; return i; }
const IMG_PETE_CLOSED = img('assets/images/game_pete_mouth_closed.png');
const IMG_PETE_OPEN = img('assets/images/game_pete_mouth_open.png');
const IMG_BANANA = img('assets/images/game_banana.png');
const IMG_CARROT = img('assets/images/game_carrot.png');
const IMG_BRO_HEAD = img('assets/images/game_bro_head.png');
const IMG_ARREST_WARRANT = img('assets/images/game_arrest_warrant.png');
const CHEESE_WHEEL_FRAMES = Array.from({length: 32}, (_, i) => img('assets/images/game_cheese_wheel_' + String(i).padStart(2, '0') + '.png'));

// --- DOM ------------------------------------------------------------
const modal = document.getElementById('bananaGameModal');
const backdrop = document.getElementById('bananaGameBackdrop');
const closeBtn = document.getElementById('bananaGameClose');
const canvas = document.getElementById('bananaGameCanvas');
const ctx = canvas.getContext('2d');
const hudLives = document.getElementById('gameLives');
const hudRound = document.getElementById('gameRound');
const hudScore = document.getElementById('gameScore');
const messageEl = document.getElementById('gameMessage');
const freezeSound = document.getElementById('gameFreezeSound');
const peteArrghSound = document.getElementById('gamePeteArrghSound');
const miniMusic = document.getElementById('gameMiniMusic');
const ambienceSound = document.getElementById('ambienceSound'); // main site's background track — ducked while the game is open
const cheeseRoomVideo = document.getElementById('cheeseRoomVideo');
const handcuffsVideo = document.getElementById('handcuffsVideo');
const gameWinnerVideo = document.getElementById('gameWinnerVideo');
const gameOverPrompt = document.getElementById('gameOverPrompt');
const playAgainBtn = document.getElementById('playAgainBtn');

canvas.width = COLS * CELL;
canvas.height = ROWS * CELL;
miniMusic.volume = 0.22; // lowered further, still too loud at 0.35 per feedback
freezeSound.volume = 0.55; // the B.R.O. catch cues were a little loud per feedback
peteArrghSound.volume = 0.55;

function playSfx(a){ try{ a.currentTime = 0; a.play().catch(()=>{}); }catch(e){} }

// --- serialized SFX queue -------------------------------------------
// Playing multiple one-shot sounds at the same moment (e.g. a catch
// landing right as another cue fires) stacked audio on top of itself
// and felt chaotic. Route every one-shot SFX through a shared promise
// chain so only one plays at a time — anything else queued waits its
// turn instead of overlapping.
let sfxChain = Promise.resolve();
function queueSfx(taskFn){
  sfxChain = sfxChain.then(taskFn).catch(() => {});
}
function playAudioAwait(audioEl){
  return new Promise(resolve => {
    const onEnd = () => { audioEl.removeEventListener('ended', onEnd); resolve(); };
    audioEl.addEventListener('ended', onEnd);
    audioEl.currentTime = 0;
    audioEl.play().catch(() => { audioEl.removeEventListener('ended', onEnd); resolve(); });
  });
}
function waitMs(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

// --- synthesized SFX (Web Audio) ------------------------------------
// No files were supplied for these two, so they're generated tones
// instead of asset files — same lightweight-easter-egg spirit as the
// rest of the game. Respects the site's mute toggle via the
// window.isSiteMuted bridge, since these never touch an <audio>
// element for applyMuteState() to reach.
let audioCtx = null;
function getAudioCtx(){
  if(!audioCtx){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    audioCtx = new AC();
  }
  if(audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}
function synthTone(freqStart, freqEnd, duration, type, gainPeak, startDelay){
  if(window.isSiteMuted && window.isSiteMuted()) return;
  const ctxA = getAudioCtx();
  if(!ctxA) return;
  try{
    const t0 = ctxA.currentTime + (startDelay || 0);
    const osc = ctxA.createOscillator();
    const gain = ctxA.createGain();
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freqStart, t0);
    osc.frequency.linearRampToValueAtTime(freqEnd, t0 + duration);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(gainPeak || 0.15, t0 + Math.min(0.02, duration/4));
    gain.gain.linearRampToValueAtTime(0, t0 + duration);
    osc.connect(gain); gain.connect(ctxA.destination);
    osc.start(t0); osc.stop(t0 + duration + 0.02);
  }catch(e){}
}
function playPowerUpSfx(){
  queueSfx(() => { synthTone(220, 660, 0.35, 'square', 0.12); return waitMs(370); });
}
function playVictorySfx(){
  queueSfx(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => { // C5 E5 G5 C6, ascending fanfare
      synthTone(f, f, 0.16, 'square', 0.12, i * 0.13);
    });
    return waitMs(700);
  });
}

// Plays centered and FREEZES gameplay (the 'roundWon' state returns early
// in update(), see below) the moment the cheese is collected — it's short
// enough that waiting for it feels fine. Advances to the next round when
// the video ends, with a fallback timeout in case it can't play at all
// (missing file, autoplay blocked, etc.) so the game never gets stuck.
let cheeseVideoFallback = null;
function playCheeseRoomVideo(){
  cheeseRoomVideo.currentTime = 0;
  cheeseRoomVideo.classList.add('show');
  cheeseRoomVideo.play().catch(() => {});
  clearTimeout(cheeseVideoFallback);
  cheeseVideoFallback = setTimeout(advanceAfterCheeseVideo, 8000);
}
function hideCheeseRoomVideo(){
  clearTimeout(cheeseVideoFallback);
  cheeseRoomVideo.pause();
  cheeseRoomVideo.classList.remove('show');
}
function advanceAfterCheeseVideo(){
  clearTimeout(cheeseVideoFallback);
  hideCheeseRoomVideo();
  if(state === 'roundWon') startNextRound();
}
cheeseRoomVideo.addEventListener('ended', advanceAfterCheeseVideo);

// --- game-over sequence: handcuffs video, then a Play Again prompt ------
let gameOverPromptTimeout = null;
function playGameOverSequence(){
  handcuffsVideo.currentTime = 0;
  handcuffsVideo.classList.add('show');
  handcuffsVideo.play().catch(() => {});
  clearTimeout(gameOverPromptTimeout);
  gameOverPromptTimeout = setTimeout(showGameOverPrompt, 8000); // fallback in case the video can't play
}
function showGameOverPrompt(){
  clearTimeout(gameOverPromptTimeout);
  gameOverPrompt.classList.add('show');
}
function hideGameOverSequence(){
  clearTimeout(gameOverPromptTimeout);
  handcuffsVideo.pause();
  handcuffsVideo.classList.remove('show');
  gameOverPrompt.classList.remove('show');
}
handcuffsVideo.addEventListener('ended', showGameOverPrompt);
playAgainBtn.addEventListener('click', () => {
  hideGameOverSequence();
  resetGame();
});

// --- final win: special video plays over the confetti/YOU WIN screen,
// which is already up underneath (see winRound() below) — nothing to
// advance to afterward, just hide it and let that screen show through ---
let gameWinnerVideoFallback = null;
function playGameWinnerVideo(){
  gameWinnerVideo.currentTime = 0;
  gameWinnerVideo.classList.add('show');
  gameWinnerVideo.play().catch(() => {});
  clearTimeout(gameWinnerVideoFallback);
  gameWinnerVideoFallback = setTimeout(hideGameWinnerVideo, 8000); // fallback in case the video can't play
}
function hideGameWinnerVideo(){
  clearTimeout(gameWinnerVideoFallback);
  gameWinnerVideo.pause();
  gameWinnerVideo.classList.remove('show');
}
gameWinnerVideo.addEventListener('ended', hideGameWinnerVideo);

// --- game state -------------------------------------------------------
let livePellets, livePowers;
let peter, bros;
let state, stateTimer;
let lives, round, score;
let frightenedTimer;
let lastPrevLives = null, lastPrevRound = null, lastPrevScore = null;

function makePeter(){
  return { col: peterStart.col, row: peterStart.row, dir: NONE, nextDir: NONE, speedMult: 1, mouthOpen: true, mouthTimer: 0, invincibleTimer: 0 };
}
function makeBros(){
  return BRO_START.map(p => ({ col: p.col, row: p.row, dir: NONE, state: 'chase', frightened: false, holdTimer: 0 }));
}

function resetRoundBoard(){
  livePellets = new Set(pelletOrigin);
  livePowers = new Set(powerOrigin);
  peter = makePeter();
  bros = makeBros();
  frightenedTimer = 0;
}

function resetGame(){
  lives = 5;
  round = 1;
  score = 0;
  resetRoundBoard();
  setState('ready', READY_FREEZE);
  restartMusic();
}

function restartMusic(){
  miniMusic.currentTime = 0;
  miniMusic.play().catch(() => {});
}

function setState(next, timer){
  state = next;
  stateTimer = timer || 0;
}

// --- input --------------------------------------------------------------
const KEY_DIR = { ArrowUp: UP, ArrowDown: DOWN, ArrowLeft: LEFT, ArrowRight: RIGHT };
function handleKeydown(e){
  if(e.key in KEY_DIR){
    e.preventDefault();
    if(state === 'playing') peter.nextDir = KEY_DIR[e.key];
  } else if(e.key === 'Escape'){
    e.preventDefault();
    close();
  }
}

// --- movement -----------------------------------------------------------
// Grid movement is driven by CELL-CROSSING detection rather than a
// "is my position within epsilon of an integer" proximity check. The
// latter can silently miss a cell entirely when the per-frame movement
// step is larger than the epsilon window (it was, at these speeds/frame
// rates) — Peter could glide straight through a pellet without it ever
// registering as eaten, or slip past a wall-ahead check into a wall he
// could then get stuck in. Comparing the rounded cell before and after
// each frame's tentative move catches every crossing exactly once,
// regardless of frame rate, and a rejected crossing snaps cleanly back
// to the cell being left — Peter (and B.R.O.s) can now never occupy a
// non-walkable cell.
function stepPeter(dt){
  if(!isNoneDir(peter.dir)){
    peter.mouthTimer += dt;
    if(peter.mouthTimer > 0.09){ peter.mouthTimer = 0; peter.mouthOpen = !peter.mouthOpen; }
  } else {
    peter.mouthOpen = true;
  }

  if(isNoneDir(peter.dir)){
    if(!isNoneDir(peter.nextDir) && isWalkable(peter.col + peter.nextDir.dx, peter.row + peter.nextDir.dy, false)){
      peter.dir = peter.nextDir;
    }
    return;
  }

  const speed = PETER_SPEED * peter.speedMult;
  const axisIsCol = peter.dir.dx !== 0;
  const prevVal = axisIsCol ? peter.col : peter.row;
  const prevCell = Math.round(prevVal);
  const tentative = prevVal + (axisIsCol ? peter.dir.dx : peter.dir.dy) * speed * dt;
  const tentCell = Math.round(tentative);

  if(tentCell !== prevCell){
    const destCol = axisIsCol ? tentCell : Math.round(peter.col);
    const destRow = axisIsCol ? Math.round(peter.row) : tentCell;
    if(isWalkable(destCol, destRow, false)){
      peter.col = destCol; peter.row = destRow;
      onPeterEnterCell();
      if(state !== 'playing') return; // a round/life transition fired mid-move
      if(!isNoneDir(peter.nextDir) && isWalkable(peter.col + peter.nextDir.dx, peter.row + peter.nextDir.dy, false)){
        peter.dir = peter.nextDir;
      } else if(!isWalkable(peter.col + peter.dir.dx, peter.row + peter.dir.dy, false)){
        peter.dir = NONE;
      }
    } else {
      if(axisIsCol) peter.col = prevCell; else peter.row = prevCell;
      peter.dir = NONE;
    }
  } else {
    if(axisIsCol) peter.col = tentative; else peter.row = tentative;
  }
}

function onPeterEnterCell(){
  const key = peter.col + ',' + peter.row;
  if(livePellets.has(key)){
    livePellets.delete(key);
    score += SCORE_PELLET;
    // pellet SFX disabled for now, per feedback
  } else if(livePowers.has(key)){
    livePowers.delete(key);
    score += SCORE_POWER;
    playPowerUpSfx();
    frightenedTimer = FRIGHTENED_DURATION;
    peter.speedMult = SPEED_BOOST_MULT;
    for(const bro of bros){
      if(bro.state === 'chase'){
        bro.frightened = true;
        bro.dir = { dx: -bro.dir.dx, dy: -bro.dir.dy };
      }
    }
  }
  if(livePellets.size + livePowers.size === 0 && peter.col === CHEESE_COL && peter.row === CHEESE_ROW){
    winRound();
  }
}

function decideBroDir(bro){
  const col = bro.col, row = bro.row;
  const walkable = ALL_DIRS.filter(d => isWalkable(col + d.dx, row + d.dy, true));
  if(walkable.length === 0) return NONE; // shouldn't happen in a connected maze
  const nonReverse = walkable.filter(d => !isReverse(d, bro.dir));
  const candidates = nonReverse.length > 0 ? nonReverse : walkable;

  if(bro.frightened){
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  let best = candidates[0], bestDist = Infinity;
  for(const d of candidates){
    const dist = Math.abs(col + d.dx - peter.col) + Math.abs(row + d.dy - peter.row);
    if(dist < bestDist){ bestDist = dist; best = d; }
  }
  return best;
}

function stepBro(bro, dt){
  if(bro.state === 'holding'){
    bro.holdTimer -= dt;
    if(bro.holdTimer <= 0){ bro.state = 'chase'; }
    return;
  }
  if(isNoneDir(bro.dir)){
    bro.dir = decideBroDir(bro);
    if(isNoneDir(bro.dir)) return;
  }

  const speed = bro.frightened ? BRO_FRIGHTENED_SPEED : BRO_SPEED;
  const axisIsCol = bro.dir.dx !== 0;
  const prevVal = axisIsCol ? bro.col : bro.row;
  const prevCell = Math.round(prevVal);
  const tentative = prevVal + (axisIsCol ? bro.dir.dx : bro.dir.dy) * speed * dt;
  const tentCell = Math.round(tentative);

  if(tentCell !== prevCell){
    const destCol = axisIsCol ? tentCell : Math.round(bro.col);
    const destRow = axisIsCol ? Math.round(bro.row) : tentCell;
    if(isWalkable(destCol, destRow, true)){
      bro.col = destCol; bro.row = destRow;
      bro.dir = decideBroDir(bro);
    } else {
      // shouldn't happen (decideBroDir only picks walkable directions) — safety net
      if(axisIsCol) bro.col = prevCell; else bro.row = prevCell;
      bro.dir = decideBroDir(bro);
    }
  } else {
    if(axisIsCol) bro.col = tentative; else bro.row = tentative;
  }
}

function dist(a, b){ return Math.hypot(a.col - b.col, a.row - b.row); }

// --- round / life transitions --------------------------------------------
function loseLife(){
  lives--;
  miniMusic.pause(); // stop the music bed so the catch sound is actually audible instead of buried
  const isGameOver = lives <= 0;
  queueSfx(async () => {
    await playAudioAwait(freezeSound);
    if(!isGameOver) await playAudioAwait(peteArrghSound); // skipped on the final life — it would overlap the handcuffs video
  });
  if(isGameOver){
    setState('gameOver', 0);
    playGameOverSequence();
  } else {
    setState('dying', DYING_FREEZE);
  }
}

function repositionAfterDeath(){
  peter.col = peterStart.col; peter.row = peterStart.row;
  peter.dir = NONE; peter.nextDir = NONE;
  peter.invincibleTimer = RESPAWN_GRACE;
  bros = makeBros();
  frightenedTimer = 0;
  restartMusic(); // picks back up from the beginning once play resumes
}

function winRound(){
  score += SCORE_CHEESE;
  if(round >= TOTAL_ROUNDS){
    playVictorySfx();
    spawnConfetti();
    setState('gameWon', 0);
    playGameWinnerVideo(); // final round: special video instead of the usual cheese-room cutscene
  } else {
    playCheeseRoomVideo();
    // no fixed timer here — advances once the cheese-room video ends
    // (or its fallback timeout), see playCheeseRoomVideo() above
    setState('roundWon', 0);
  }
}

function startNextRound(){
  round++;
  resetRoundBoard();
  setState('playing', 0);
}

// --- update ---------------------------------------------------------------
function update(dt){
  if(state === 'ready'){
    stateTimer -= dt;
    if(stateTimer <= 0) setState('playing', 0);
    return;
  }
  if(state === 'dying'){
    stateTimer -= dt;
    if(stateTimer <= 0){ repositionAfterDeath(); setState('playing', 0); }
    return;
  }
  if(state === 'roundWon') return; // advances via the cheese-room video, see playCheeseRoomVideo()/advanceAfterCheeseVideo()
  if(state === 'gameWon'){ updateConfetti(dt); return; }
  if(state === 'gameOver') return;

  // state === 'playing'
  stepPeter(dt);
  if(state !== 'playing') return; // winRound() may have fired inside stepPeter

  for(const bro of bros) stepBro(bro, dt);

  if(frightenedTimer > 0){
    frightenedTimer -= dt;
    if(frightenedTimer <= 0){
      for(const bro of bros) if(bro.frightened) bro.frightened = false;
      peter.speedMult = 1;
    }
  }
  if(peter.invincibleTimer > 0) peter.invincibleTimer -= dt;

  for(const bro of bros){
    if(bro.state === 'holding') continue;
    if(dist(peter, bro) < 0.6){
      if(bro.frightened){
        bro.frightened = false;
        bro.state = 'holding';
        bro.col = HOLD_COL; bro.row = HOLD_ROW;
        bro.dir = NONE;
        bro.holdTimer = HOLD_DURATION;
        score += SCORE_BRO;
      } else if(peter.invincibleTimer <= 0){
        loseLife();
        return;
      }
    }
  }
}

// --- rendering --------------------------------------------------------------
function drawWalls(){
  ctx.fillStyle = '#1c3fa8';
  for(let r = 0; r < ROWS; r++){
    for(let c = 0; c < COLS; c++){
      if(MAZE[r][c] === '#') ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
    }
  }
}
function drawDoor(){
  const open = livePellets.size + livePowers.size === 0;
  ctx.fillStyle = open ? '#ffd84d' : '#c62a2a';
  ctx.fillRect(DOOR_COL * CELL + 3, DOOR_ROW * CELL + CELL/2 - 3, CELL - 6, 5);
}
function drawRoomSign(){
  const cx = CHEESE_COL * CELL + CELL/2;
  const cy = (DOOR_ROW + 2) * CELL + CELL/2; // painted on the room's bottom (seal) wall — solid, nothing walks through it
  ctx.save();
  ctx.font = "7px 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000';
  ctx.strokeText('CHEESE BACKROOMS', cx, cy);
  ctx.fillStyle = '#ffd84d';
  ctx.fillText('CHEESE BACKROOMS', cx, cy);
  ctx.restore();
}
function drawPellets(){
  // pixel-art assets: keep their hard edges, no smoothing
  ctx.imageSmoothingEnabled = false;
  const s = CELL * 0.5;
  for(const key of livePellets){
    const [c, r] = key.split(',').map(Number);
    ctx.drawImage(IMG_BANANA, c*CELL + (CELL-s)/2, r*CELL + (CELL-s)/2, s, s);
  }
  const ps = CELL * 0.8;
  for(const key of livePowers){
    const [c, r] = key.split(',').map(Number);
    ctx.drawImage(IMG_CARROT, c*CELL + (CELL-ps)/2, r*CELL + (CELL-ps)/2, ps, ps);
  }
  ctx.imageSmoothingEnabled = true;
}
const CHEESE_WHEEL_FRAME_MS = 80;
let cheeseWheelFrameIndex = 0;
let cheeseWheelLastStep = 0;
function drawCheese(){
  // floats in the room all the time now, visible through the door even
  // while it's still closed — only actually collectible once the door
  // opens (gated separately in onPeterEnterCell/isWalkable)
  const now = performance.now();
  if(now - cheeseWheelLastStep > CHEESE_WHEEL_FRAME_MS){
    cheeseWheelLastStep = now;
    cheeseWheelFrameIndex = (cheeseWheelFrameIndex + 1) % CHEESE_WHEEL_FRAMES.length;
  }
  const cx = CHEESE_COL*CELL + CELL/2, cy = CHEESE_ROW*CELL + CELL/2;
  const size = CELL * 1.3;
  ctx.drawImage(CHEESE_WHEEL_FRAMES[cheeseWheelFrameIndex], cx - size/2, cy - size/2, size, size);
}
function drawPeter(){
  const cx = peter.col*CELL + CELL/2, cy = peter.row*CELL + CELL/2;
  const size = CELL * 1.6;
  const im = peter.mouthOpen ? IMG_PETE_OPEN : IMG_PETE_CLOSED;
  // flicker while the post-respawn grace period is active, so it reads as
  // temporary safety rather than looking like a rendering glitch
  if(peter.invincibleTimer > 0 && Math.floor(performance.now()/100) % 2 === 0) return;
  ctx.drawImage(im, cx - size/2, cy - size/2, size, size);
}
// Frightened-mode tinting needs to happen on an isolated offscreen buffer.
// source-atop composites against whatever is ALREADY on the target canvas
// within that rectangle — not just the sprite just drawn — so applying it
// directly on the main canvas tinted the maze/pellets behind the head too,
// showing up as a solid blue box rather than just the head turning blue.
// Drawing onto a small transparent buffer first means source-atop only has
// the head's own pixels to composite against.
const broBuffer = document.createElement('canvas');
const broBufferCtx = broBuffer.getContext('2d');

function drawBro(bro){
  const cx = bro.col*CELL + CELL/2, cy = bro.row*CELL + CELL/2;
  const size = Math.round(CELL * 1.5);
  const flicker = bro.frightened && frightenedTimer < FRIGHTENED_WARNING && Math.floor(performance.now()/150) % 2 === 0;

  ctx.save();
  if(bro.state === 'holding') ctx.globalAlpha = 0.45;

  if(bro.frightened){
    if(broBuffer.width !== size || broBuffer.height !== size){
      broBuffer.width = size; broBuffer.height = size; // resizing implicitly clears
    } else {
      broBufferCtx.clearRect(0, 0, size, size);
    }
    broBufferCtx.drawImage(IMG_BRO_HEAD, 0, 0, size, size);
    broBufferCtx.globalCompositeOperation = 'source-atop';
    broBufferCtx.fillStyle = flicker ? 'rgba(255,255,255,0.85)' : 'rgba(35,95,230,0.8)';
    broBufferCtx.fillRect(0, 0, size, size);
    broBufferCtx.globalCompositeOperation = 'source-over';
    ctx.drawImage(broBuffer, cx - size/2, cy - size/2, size, size);
  } else {
    ctx.drawImage(IMG_BRO_HEAD, cx - size/2, cy - size/2, size, size);
  }
  ctx.restore();
}
function drawCaughtFlavor(){
  if(state !== 'dying' && state !== 'gameOver') return;
  ctx.save();
  ctx.globalAlpha = 0.92;
  const iw = canvas.width * 0.88;
  const ih = iw * (IMG_ARREST_WARRANT.height / (IMG_ARREST_WARRANT.width || 1) || 1.3);
  ctx.drawImage(IMG_ARREST_WARRANT, (canvas.width-iw)/2, (canvas.height-ih)/2, iw, ih);
  ctx.restore();
}

// --- confetti (final win only) --------------------------------------
const CONFETTI_COLORS = ['#ffd84d', '#c62a2a', '#f3ecd8', '#4caf50', '#2a5fd8'];
let confetti = [];
function spawnConfetti(){
  confetti = [];
  for(let i = 0; i < 90; i++){
    confetti.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height, // staggered so it's already mid-fall on the first frame
      vx: (Math.random() - 0.5) * 40,
      vy: 40 + Math.random() * 60,
      size: 4 + Math.random() * 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 6,
    });
  }
}
function updateConfetti(dt){
  for(const p of confetti){
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 20 * dt;
    p.rot += p.rotSpeed * dt;
    if(p.y > canvas.height + 10){ // recycle back to the top — keeps it falling for as long as the win screen is up
      p.y = -10;
      p.x = Math.random() * canvas.width;
      p.vy = 40 + Math.random() * 60;
    }
  }
}
function drawConfetti(){
  for(const p of confetti){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
    ctx.restore();
  }
}

function render(){
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawWalls();
  drawDoor();
  drawRoomSign();
  drawPellets();
  drawCheese();
  drawCaughtFlavor();
  for(const bro of bros) drawBro(bro);
  drawPeter();
  if(state === 'gameWon') drawConfetti();

  let msg = '';
  if(state === 'ready') msg = 'READY!';
  else if(state === 'dying') msg = 'ARRESTED!';
  else if(state === 'roundWon') msg = 'OBSIDIAN CHEESE FOUND!';
  else if(state === 'gameWon') msg = 'YOU WIN!\n3 CHEESE COLLECTED';
  else if(state === 'gameOver') msg = 'GAME OVER';
  messageEl.textContent = msg;
  messageEl.style.whiteSpace = 'pre-line';
  messageEl.classList.toggle('win', state === 'gameWon');
}

function updateHUD(){
  if(lives !== lastPrevLives){ hudLives.textContent = 'LIVES: ' + lives; lastPrevLives = lives; }
  if(round !== lastPrevRound){ hudRound.textContent = 'ROUND ' + round + '/' + TOTAL_ROUNDS; lastPrevRound = round; }
  if(score !== lastPrevScore){ hudScore.textContent = 'SCORE: ' + score; lastPrevScore = score; }
}

// --- loop / open / close ---------------------------------------------------
let rafId = null;
let lastTime = 0;
function loop(now){
  const dt = Math.min((now - lastTime) / 1000, MAX_DT);
  lastTime = now;
  update(dt);
  updateHUD();
  render();
  rafId = requestAnimationFrame(loop);
}

function open(){
  if(window.miniGameOpen) return;
  if(window.isLostFoundOpen && window.isLostFoundOpen()) return; // don't stack modals
  window.miniGameOpen = true;
  resetGame();
  lastPrevLives = lastPrevRound = lastPrevScore = null;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.addEventListener('keydown', handleKeydown, { capture: true });
  ambienceSound.pause();
  lastTime = performance.now();
  rafId = requestAnimationFrame(loop);
}
function close(){
  window.miniGameOpen = false;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.removeEventListener('keydown', handleKeydown, { capture: true });
  if(rafId) cancelAnimationFrame(rafId);
  rafId = null;
  hideCheeseRoomVideo();
  hideGameOverSequence();
  hideGameWinnerVideo();
  miniMusic.pause();
  ambienceSound.play().catch(() => {});
}

backdrop.addEventListener('click', close);
closeBtn.addEventListener('click', close);

window.BananaGame = { open, close };
window.miniGameOpen = false;

})();
