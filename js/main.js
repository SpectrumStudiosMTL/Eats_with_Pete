const WALK_FRAMES = ["assets/images/walk_01.png", "assets/images/walk_02.png", "assets/images/walk_03.png", "assets/images/walk_04.png", "assets/images/walk_05.png", "assets/images/walk_06.png", "assets/images/walk_07.png", "assets/images/walk_08.png", "assets/images/walk_09.png", "assets/images/walk_10.png", "assets/images/walk_11.png", "assets/images/walk_12.png", "assets/images/walk_13.png", "assets/images/walk_14.png", "assets/images/walk_15.png", "assets/images/walk_16.png", "assets/images/walk_17.png", "assets/images/walk_18.png", "assets/images/walk_19.png", "assets/images/walk_20.png", "assets/images/walk_21.png", "assets/images/walk_22.png", "assets/images/walk_23.png", "assets/images/walk_24.png", "assets/images/walk_25.png", "assets/images/walk_26.png", "assets/images/walk_27.png", "assets/images/walk_28.png", "assets/images/walk_29.png", "assets/images/walk_30.png", "assets/images/walk_31.png", "assets/images/walk_32.png", "assets/images/walk_33.png"];

const POINT_BG_FRAMES = ["assets/images/point_bg_01.png", "assets/images/point_bg_02.png", "assets/images/point_bg_03.png", "assets/images/point_bg_04.png", "assets/images/point_bg_05.png", "assets/images/point_bg_06.png", "assets/images/point_bg_07.png", "assets/images/point_bg_08.png", "assets/images/point_bg_09.png", "assets/images/point_bg_10.png", "assets/images/point_bg_11.png", "assets/images/point_bg_12.png", "assets/images/point_bg_13.png", "assets/images/point_bg_14.png", "assets/images/point_bg_15.png", "assets/images/point_bg_16.png", "assets/images/point_bg_17.png", "assets/images/point_bg_18.png"];

const POINT_FG_FRAMES = ["assets/images/point_fg_01.png", "assets/images/point_fg_02.png", "assets/images/point_fg_03.png", "assets/images/point_fg_04.png", "assets/images/point_fg_05.png", "assets/images/point_fg_06.png", "assets/images/point_fg_07.png", "assets/images/point_fg_08.png", "assets/images/point_fg_09.png", "assets/images/point_fg_10.png", "assets/images/point_fg_11.png", "assets/images/point_fg_12.png", "assets/images/point_fg_13.png", "assets/images/point_fg_14.png"];


const YEAH_FRAMES = ["assets/images/yeah_01.png", "assets/images/yeah_02.png", "assets/images/yeah_03.png", "assets/images/yeah_04.png", "assets/images/yeah_05.png", "assets/images/yeah_06.png", "assets/images/yeah_07.png", "assets/images/yeah_08.png", "assets/images/yeah_09.png", "assets/images/yeah_10.png"];
const DISCO_FRAMES = ["assets/images/disco_01.png", "assets/images/disco_02.png", "assets/images/disco_03.png", "assets/images/disco_04.png", "assets/images/disco_05.png", "assets/images/disco_06.png", "assets/images/disco_07.png", "assets/images/disco_08.png", "assets/images/disco_09.png", "assets/images/disco_10.png", "assets/images/disco_11.png", "assets/images/disco_12.png", "assets/images/disco_13.png", "assets/images/disco_14.png", "assets/images/disco_15.png", "assets/images/disco_16.png", "assets/images/disco_17.png", "assets/images/disco_18.png", "assets/images/disco_19.png", "assets/images/disco_20.png"];
const JAZZHANDS_FRAMES = ["assets/images/jazzhands_01.png", "assets/images/jazzhands_02.png", "assets/images/jazzhands_03.png", "assets/images/jazzhands_04.png", "assets/images/jazzhands_05.png", "assets/images/jazzhands_06.png", "assets/images/jazzhands_07.png", "assets/images/jazzhands_08.png", "assets/images/jazzhands_09.png", "assets/images/jazzhands_10.png", "assets/images/jazzhands_11.png", "assets/images/jazzhands_12.png", "assets/images/jazzhands_13.png", "assets/images/jazzhands_14.png", "assets/images/jazzhands_15.png", "assets/images/jazzhands_16.png", "assets/images/jazzhands_17.png", "assets/images/jazzhands_18.png"];
const CARROT_FRAMES = Array.from({length:22}, (_, i) => `assets/images/carrot peddler${String(i).padStart(4,'0')}.png`);
const BANANA_STAND_FRAMES = Array.from({length:32}, (_, i) => `assets/images/banana_stand_${String(i+1).padStart(2,'0')}.png`);
const HANDSUP_FRAMES = Array.from({length:47}, (_, i) => `assets/images/handsup_${String(i+1).padStart(2,'0')}.png`);

// --- preload every animation-frame PNG up front ----------------------
// Frames were previously only fetched the first time their index came up,
// so loops that start ping-ponging within milliseconds of page load
// (HandsUp idle, the carrot/banana ambient loops) would show blank/missing
// frames until the browser caught up — worse on a cold cache or a slow
// connection, which is why it looked different across browsers/machines.
// fetchPriority 'low' keeps these from competing with the background art
// and Pete's first frame for bandwidth, while still warming the cache well
// ahead of when each sequence actually gets used.
function preloadFrames(frameArrays, priority){
  const seen = new Set();
  for(const frames of frameArrays){
    for(const src of frames){
      if(seen.has(src)) continue;
      seen.add(src);
      const img = new Image();
      if(priority) img.fetchPriority = priority;
      img.src = src;
    }
  }
}
// DISCO/HANDSUP/WALK load at normal priority and gate the loading screen
// (see boot() below) — everything else can trickle in at low priority
// since it isn't needed until later (a click, a scroll, or a prop the
// user hasn't reached yet).
preloadFrames([DISCO_FRAMES, HANDSUP_FRAMES, WALK_FRAMES]);
preloadFrames([POINT_BG_FRAMES, POINT_FG_FRAMES, JAZZHANDS_FRAMES, CARROT_FRAMES, BANANA_STAND_FRAMES], 'low');

const bgImg = document.getElementById('bgImg');
const track = document.getElementById('track');
const scene = document.getElementById('scene');
const leadMargin = document.getElementById('leadMargin');
const trailMargin = document.getElementById('trailMargin');
const scrollSpace = document.getElementById('scrollSpace');
const pete = document.getElementById('pete');
const peteImg = document.getElementById('peteImg');
const hint = document.getElementById('hint');
const carrotProp = document.getElementById('carrotProp');
const carrotSound1 = document.getElementById('carrotSound1');
const carrotSound2 = document.getElementById('carrotSound2');
const ambienceSound = document.getElementById('ambienceSound');
const muteBtn = document.getElementById('muteBtn');
const carrotImg = document.getElementById('carrotImg');
const bananaStandImg = document.getElementById('bananaStandImg');

// Fix #1 (belt-and-suspenders): force the logo starting point on every
// fresh load or restore, in case scrollRestoration alone isn't enough on
// this browser (e.g. async restores, or back/forward-cache pageshow).
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));
window.addEventListener('pageshow', (e) => { if(e.persisted) window.scrollTo(0, 0); });

let maxTranslate = 0;
let frameIndex = 0;
let currentX = 0;
let targetX = 0;
let cartHomeLeftPx = 0; // cart-prop's screen-space "home" left offset (px), recomputed in layout()
let lastRenderedX = 0;
let isWrapping = false;
let maxScrollTop = 0; // one-way ratchet: highest scrollY reached so far (Pete can't walk backward)

const GROUND_FRACTION = 0.87;
const PETE_HEIGHT_RATIO = 0.34;

/* ============================================================
   PETE STATE MACHINE
   'idle'    — static spot 300px left of the logo, HandsUp loop,
               until the user starts scrolling (also the state on
               every fresh page load/refresh)
   'walking' — normal scroll-driven walk cycle
   'dance'   — click Pete anytime to trigger, then back to walking/idle
   ============================================================ */
let peteState = 'idle';
let hasArrived = false; // true once the user has started scrolling at least once
let lostFoundOpen = false; // true while the Lost and Found video modal is open — freezes scroll input
let siteLoading = true; // true until boot() below decides enough has loaded — freezes scroll input

let peteOffsetTarget = 0;   // where Pete should sit, relative to screen centre
let peteOffsetCurrent = 0;  // eased actual position

const IDLE_OFFSET_PX = -300; // moved 200px further left of the logo (was -100) so Pete stops blocking it

// one-shot / looping timed animations
let animFrames = null;
let animStart = 0;
let animFrameMs = 90;
let animDurationMs = 0;
let animOnDone = null;

const IDLE_FRAME_MS = 110;
const DANCE_FRAME_MS   = 130;
const DANCE_DURATION_MS = 2600;

function playAnim(frames, frameMs, durationMs, onDone){
  animFrames = frames;
  animStart = performance.now();
  animFrameMs = frameMs;
  animDurationMs = durationMs || frames.length * frameMs;
  animOnDone = onDone || null;
}

function layout(){
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  leadMargin.style.width = viewportWidth + 'px';
  trailMargin.style.width = viewportWidth + 'px';

  const sceneWidth = scene.clientWidth;
  const artHeightPx = track.clientHeight;

  // cart-prop used to be `left:19%` of .scene (inside the transformed .track);
  // now it's a fixed sibling of #pete so its screen position is computed by
  // hand each frame in renderLoop as cartHomeLeftPx + currentX
  const CART_LEFT_FRACTION = 0.19;
  cartHomeLeftPx = viewportWidth + CART_LEFT_FRACTION * sceneWidth;

  const totalTrackWidth = viewportWidth + sceneWidth + viewportWidth;
  maxTranslate = Math.max(totalTrackWidth - viewportWidth, 0);

  const artTop = (viewportHeight - artHeightPx) / 2;
  const groundY = artTop + GROUND_FRACTION * artHeightPx;
  const peteHeightPx = artHeightPx * PETE_HEIGHT_RATIO;
  pete.style.height = peteHeightPx + 'px';
  pete.style.bottom = (viewportHeight - groundY) + 'px';

  // idle spot: static, 300px left of the logo (which sits at screen centre
  // at rest, since leadMargin is centred and currentX starts at 0)
  if(peteState === 'idle'){
    peteOffsetCurrent = IDLE_OFFSET_PX;
    peteOffsetTarget = IDLE_OFFSET_PX;
  }

  updateTarget();
}

function updateTarget(){
  // one-way ratchet: block any backward scroll so Pete can only walk right
  if(!isWrapping){
    const sy = window.scrollY;
    if(sy < maxScrollTop){
      window.scrollTo(0, maxScrollTop);
      return; // the scrollTo above re-fires 'scroll' -> this runs again, corrected
    }
    maxScrollTop = Math.max(maxScrollTop, sy);
  }

  const rect = scrollSpace.getBoundingClientRect();
  const total = scrollSpace.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  const progress = total > 0 ? scrolled / total : 0;

  targetX = -progress * maxTranslate;

  // --- leave the idle HandsUp loop the moment scrolling begins --------
  if(peteState === 'idle' && progress > 0){
    hasArrived = true;
    peteState = 'walking';
    peteOffsetTarget = 0;
  }

  if(peteState === 'idle'){
    hint.textContent = 'scroll to walk →';
    hint.style.opacity = 1;
  } else if(progress > 0.95){
    hint.textContent = 'keep scrolling to loop back ↻';
    hint.style.opacity = 1;
  } else if(peteState === 'walking' && progress > 0.15 && progress < 0.22){
    hint.textContent = 'psst — click Pete';
    hint.style.opacity = 1;
  } else {
    hint.style.opacity = 0;
  }

  if(!isWrapping && total > 0 && scrolled >= total - 2){
    isWrapping = true;
    // snap fully to the true end position first (pure trailMargin, logo
    // centred, no residual eased lag) so this frame's paint is pixel-identical
    // to the leadMargin's resting state we're about to reset to — that's what
    // makes the loop-back seamless instead of a visible pop.
    currentX = targetX;
    track.style.transform = 'translateX(' + currentX + 'px)';
    requestAnimationFrame(() => {
      window.scrollTo(0, 1);
      currentX = 0;
      targetX = 0;
      lastRenderedX = 0;
      maxScrollTop = 1; // release the one-way ratchet so forward progress can resume
      track.style.transform = 'translateX(0px)';
      cartProp.style.transform = 'translate(' + cartHomeLeftPx + 'px, 50px)';
      setTimeout(() => { isWrapping = false; }, 50);
    });
  }
}

// click Pete: alternate Disco -> JazzHands -> Disco -> JazzHands ...
let peteClickToggle = 0;
pete.addEventListener('click', () => {
  if(peteState === 'dance') return;
  peteState = 'dance';
  const frames = (peteClickToggle % 2 === 0) ? DISCO_FRAMES : JAZZHANDS_FRAMES;
  peteClickToggle++;
  playAnim(frames, DANCE_FRAME_MS, null, () => {
    if(hasArrived){
      peteState = 'walking';
    } else {
      peteState = 'idle';
      peteOffsetTarget = IDLE_OFFSET_PX;
    }
  });
});

// --- click the cart: play its sound ---------------------------------
const cartProp = document.querySelector('.cart-prop');
const hotdogSound = document.getElementById('hotdogSound');
cartProp.addEventListener('click', (e) => {
  e.stopPropagation();
  hotdogSound.currentTime = 0;
  hotdogSound.play().catch(() => {});
});

// --- click the carrot peddler: alternate gotthestuff -> lazerwave -> ... ---
let carrotClickToggle = 0;
carrotProp.addEventListener('click', (e) => {
  e.stopPropagation();
  const snd = (carrotClickToggle % 2 === 0) ? carrotSound1 : carrotSound2;
  carrotClickToggle++;
  snd.currentTime = 0;
  snd.play().catch(() => {});
});

// --- click the banana stand: play its sound --------------------------
const bananaStandSound = document.getElementById('bananaStandSound');
bananaStandImg.addEventListener('click', (e) => {
  e.stopPropagation();
  bananaStandSound.currentTime = 0;
  bananaStandSound.play().catch(() => {});
});

// --- proximity-triggered pointing gestures --------------------------
// storefronts, the carrot peddler, and the banana stand all sit back in the
// scene, so Pete points at the BACKGROUND for them; the cart is the one
// prop actually in front of him, so it gets the FOREGROUND point instead.
const POINT_TRIGGER_PX = 140;   // how close to screen-centre before it fires
const POINT_RESET_PX   = 500;   // how far away before it can fire again
const POINT_BG_FRAME_MS = 110;
const POINT_FG_FRAME_MS = 110;
const POINT_DURATION_MS = 1100;

const bgGestureTargets = [...document.querySelectorAll('.storefront'), carrotProp, bananaStandImg].map(el => ({el, triggered:false}));
const fgGestureTargets = [cartProp].map(el => ({el, triggered:false}));

function checkPointTriggers(){
  if(peteState !== 'walking' || animFrames) return;
  const centerX = window.innerWidth / 2;

  for(const s of bgGestureTargets){
    const r = s.el.getBoundingClientRect();
    const dist = Math.abs((r.left + r.width/2) - centerX);
    if(dist < POINT_TRIGGER_PX && !s.triggered){
      s.triggered = true;
      peteState = 'point-bg';
      playAnim(POINT_BG_FRAMES, POINT_BG_FRAME_MS, POINT_DURATION_MS, () => {
        peteState = 'walking';
      });
      return;
    }
    if(dist > POINT_RESET_PX) s.triggered = false;
  }

  for(const g of fgGestureTargets){
    const r = g.el.getBoundingClientRect();
    const dist = Math.abs((r.left + r.width/2) - centerX);
    if(dist < POINT_TRIGGER_PX && !g.triggered){
      g.triggered = true;
      peteState = 'point-fg';
      playAnim(POINT_FG_FRAMES, POINT_FG_FRAME_MS, POINT_DURATION_MS, () => {
        peteState = 'walking';
      });
      return;
    }
    if(dist > POINT_RESET_PX) g.triggered = false;
  }
}

// --- auto-play sounds as Pete approaches (independent of click sounds) ---
const heyManSound = document.getElementById('heyManSound');
const PROXIMITY_SOUND_TRIGGER_PX = 260; // a bit wider than the point-gesture trigger, so it cues in a little earlier
const PROXIMITY_SOUND_RESET_PX = 650;
const proximitySoundTargets = [
  { el: cartProp,       sound: hotdogSound,      triggered:false, pending:false },
  { el: carrotProp,     sound: heyManSound,       triggered:false, pending:false },
  { el: bananaStandImg, sound: bananaStandSound,  triggered:false, pending:false },
];

function checkProximitySounds(){
  // NOT gated on peteState === 'walking' — checkPointTriggers() switches
  // peteState to 'point-bg'/'point-fg' for ~1.1s whenever Pete passes a
  // storefront, and during that window Pete's position keeps advancing
  // with scroll. If this check were skipped while a gesture was playing,
  // fast scrolling could carry Pete straight through the cart/carrot's
  // trigger zone with the sound never firing. Proximity sound playback
  // only cares about Pete's screen position, so it must run every frame
  // regardless of what animation is currently on his sprite.
  if(peteState === 'idle') return;
  const centerX = window.innerWidth / 2;
  for(const t of proximitySoundTargets){
    const r = t.el.getBoundingClientRect();
    const dist = Math.abs((r.left + r.width/2) - centerX);
    // Only latch `triggered` once play() actually resolves. Browsers block
    // unprompted audio.play() until the page has seen a real user gesture
    // (click/keydown/touchstart) — scrolling itself doesn't count in
    // Chrome/Firefox. If we latched on the attempt instead of the result,
    // one blocked call permanently gave up on that prop for the rest of
    // the pass (Pete can never walk back to it), which is why this only
    // "worked" when the visitor happened to have already clicked or
    // pressed a key before reaching it. Retrying every frame the whole
    // time Pete is within range gives the unlock (see below) many more
    // chances to have landed by the time he's closest.
    if(dist < PROXIMITY_SOUND_TRIGGER_PX && !t.triggered && !t.pending){
      t.pending = true;
      t.sound.currentTime = 0;
      t.sound.play().then(() => { t.triggered = true; }).catch(() => { t.pending = false; });
    }
    if(dist > PROXIMITY_SOUND_RESET_PX){ t.triggered = false; t.pending = false; }
  }
}

// --- ambient carrot peddler loop (independent of Pete / scroll) -----
const CARROT_FRAME_MS = 90;
let carrotFrameIndex = 0;
let carrotLastStep = 0;
function stepCarrotLoop(now){
  if(now - carrotLastStep > CARROT_FRAME_MS){
    carrotLastStep = now;
    carrotFrameIndex = (carrotFrameIndex + 1) % CARROT_FRAMES.length;
    carrotImg.src = CARROT_FRAMES[carrotFrameIndex];
  }
}

// --- ambient banana stand loop (purely decorative, independent of scroll) ---
const BANANA_STAND_FRAME_MS = 90;
let bananaStandFrameIndex = 0;
let bananaStandLastStep = 0;
function stepBananaStandLoop(now){
  if(now - bananaStandLastStep > BANANA_STAND_FRAME_MS){
    bananaStandLastStep = now;
    bananaStandFrameIndex = (bananaStandFrameIndex + 1) % BANANA_STAND_FRAMES.length;
    bananaStandImg.src = BANANA_STAND_FRAMES[bananaStandFrameIndex];
  }
}

// --- Fix #2: lock walk speed to a fixed rate, no ramping ----------------
// Wheel/touch input used to be queued proportional to each event's raw
// delta, then drained a fixed number of px per animation frame. That has
// two problems: trackpad deltaY magnitude (and event frequency, e.g. long
// momentum tails) varies wildly by OS/driver, so the "same" swipe could
// queue very different amounts on different machines; and draining by a
// fixed px-per-*frame* amount is itself frame-rate dependent — the exact
// same input converges faster in wall-clock time on a 144Hz display than
// a 60Hz one. Both show up as "speed varies by machine".
//
// Fix: (1) every wheel/touch event queues the SAME fixed amount regardless
// of how hard/fast the trackpad reports the gesture — direction only,
// magnitude ignored — so a gentle nudge and a violent flick walk Pete at
// the same speed; (2) the queue drains by a fixed px-per-*second* rate
// (time-normalized via the frame's real elapsed ms, not a per-frame
// constant), so speed no longer depends on frame rate either. The result
// is a single constant walk speed, the same on every machine/input device.
const MAX_SCROLL_PX_PER_SEC = 300; // constant walk speed (was 5px/frame at an assumed 60fps)
const SCROLL_QUEUE_CAP = MAX_SCROLL_PX_PER_SEC * 0.1; // ~100ms of backlog, so input release stops things quickly
let scrollQueuePx = 0;

function queueScroll(direction){
  // direction is a sign (+1/-1) — always jump straight to the cap, since
  // every qualifying input should walk at the one fixed speed, not ramp
  // up toward it.
  scrollQueuePx = Math.sign(direction) * SCROLL_QUEUE_CAP;
}

window.addEventListener('wheel', (e) => {
  if(lostFoundOpen || siteLoading) return; // don't walk Pete behind the video popup / loading screen
  e.preventDefault();
  queueScroll(e.deltaY);
}, { passive:false });

let touchStartY = null;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive:true });
window.addEventListener('touchmove', (e) => {
  if(lostFoundOpen || siteLoading) return;
  if(touchStartY === null) return;
  const y = e.touches[0].clientY;
  queueScroll(touchStartY - y);
  touchStartY = y;
  e.preventDefault();
}, { passive:false });

const SCROLL_KEY_PX = {
  ' ': 120, 'ArrowRight': 40, 'ArrowLeft': -40,
  'PageDown': 400, 'PageUp': -400,
};
window.addEventListener('keydown', (e) => {
  // leave Space/Arrow keys alone while the video modal is open — they're
  // the native <video> controls' own play/pause/seek shortcuts
  if(lostFoundOpen || siteLoading) return;
  if(e.key in SCROLL_KEY_PX){
    e.preventDefault();
    queueScroll(SCROLL_KEY_PX[e.key]);
  }
}, { passive:false });

function drainScrollQueue(dtMs){
  if(scrollQueuePx !== 0){
    const maxStep = MAX_SCROLL_PX_PER_SEC * (dtMs / 1000);
    const step = Math.sign(scrollQueuePx) * Math.min(Math.abs(scrollQueuePx), maxStep);
    window.scrollBy(0, step);
    scrollQueuePx -= step;
  }
}

window.addEventListener('scroll', updateTarget, { passive:true });
window.addEventListener('resize', layout);

if(bgImg.complete && bgImg.naturalWidth > 0){
  layout();
} else {
  bgImg.addEventListener('load', layout);
}

// Pete's idle-spot -> walking-position offset used to exponentially ease
// toward its target — that always takes its biggest single step on the
// very first frame, the same frame the sprite swaps from the HandsUp
// idle pose to the walk cycle, so the pose change and a big sudden jump
// toward the logo landed simultaneously (walk cycle never visibly seen
// left of the logo). A fixed px/sec time-based fix for THAT introduced a
// new problem: it ran on its own clock, independent of the leg-cycle
// animation below (which is purely distance-based, driven by currentX).
// A single short scroll burst finishes draining quickly — currentX stops
// moving and the legs freeze on one frame — while the time-based offset
// kept gliding for its full duration regardless, so Pete's body kept
// sliding toward the logo with frozen legs until more scroll input came
// in. Fix: drive the offset from the SAME accumulated |Δcurrentx| that
// drives the leg cycle, so the two can only ever move in lockstep —
// there's no clock of its own to get out of sync with.
let walkOffsetProgress = 0; // accumulated |Δcurrentx| since Pete started walking, capped at -IDLE_OFFSET_PX
const FRAME_DISTANCE = 11;
let idleFrameIndex = 0;
let idleFrameDir = 1;
let idleLastStep = 0;
let lastFrameTime = performance.now();

function renderLoop(){
  const now = performance.now();
  const dtMs = now - lastFrameTime;
  lastFrameTime = now;
  drainScrollQueue(dtMs);

  // no easing here on purpose — currentX tracks targetX directly so walk
  // speed is set entirely by the fixed-rate scroll drain above, with no
  // extra smoothing/ramp layered on top (see Fix #2 above)
  const walkedThisFrame = Math.abs(targetX - currentX);
  currentX = targetX;
  track.style.transform = 'translateX(' + currentX + 'px)';
  cartProp.style.transform = 'translate(' + (cartHomeLeftPx + currentX) + 'px, 50px)';

  if(peteOffsetTarget === 0){
    walkOffsetProgress = Math.min(-IDLE_OFFSET_PX, walkOffsetProgress + walkedThisFrame);
    peteOffsetCurrent = IDLE_OFFSET_PX + walkOffsetProgress;
  } else {
    peteOffsetCurrent = peteOffsetTarget;
  }
  pete.style.transform = 'translateX(calc(-50% + ' + peteOffsetCurrent + 'px))';

  if(animFrames){
    // time-based one-shot / looped animation (dance or point gesture)
    const elapsed = performance.now() - animStart;
    if(elapsed >= animDurationMs){
      const done = animOnDone;
      animFrames = null;
      animOnDone = null;
      if(done) done();
      peteImg.src = WALK_FRAMES[frameIndex];
    } else {
      const i = Math.floor(elapsed / animFrameMs) % animFrames.length;
      peteImg.src = animFrames[i];
    }
  } else if(peteState === 'idle'){
    // ambient HandsUp loop, independent of scroll, until the user scrolls.
    // HANDSUP_FRAMES is a one-directional crouch->big-jump animation, not
    // a seamless tile (frame 1 and the last frame are very different
    // poses) — wrapping straight back to frame 0 caused a visible pop
    // once per cycle, so ping-pong back and forth instead.
    const now = performance.now();
    if(now - idleLastStep > IDLE_FRAME_MS){
      idleLastStep = now;
      idleFrameIndex += idleFrameDir;
      if(idleFrameIndex >= HANDSUP_FRAMES.length - 1){
        idleFrameIndex = HANDSUP_FRAMES.length - 1;
        idleFrameDir = -1;
      } else if(idleFrameIndex <= 0){
        idleFrameIndex = 0;
        idleFrameDir = 1;
      }
      peteImg.src = HANDSUP_FRAMES[idleFrameIndex];
    }
  } else {
    // normal scroll-driven walk cycle
    const delta = Math.abs(currentX - lastRenderedX);
    if(delta > FRAME_DISTANCE){
      lastRenderedX = currentX;
      frameIndex = (frameIndex + 1) % WALK_FRAMES.length;
      peteImg.src = WALK_FRAMES[frameIndex];
    }
  }

  checkPointTriggers();
  checkProximitySounds();
  stepCarrotLoop(performance.now());
  stepBananaStandLoop(performance.now());

  requestAnimationFrame(renderLoop);
}

peteImg.src = HANDSUP_FRAMES[0];
carrotImg.src = CARROT_FRAMES[0];
bananaStandImg.src = BANANA_STAND_FRAMES[0];
layout();
requestAnimationFrame(renderLoop);

// --- loading screen: Pete's Disco spin, shown until the assets the site
// actually needs first (background art, the idle loop, the walk cycle)
// are ready, or LOADING_TIMEOUT_MS elapses — whichever comes first, so a
// slow connection gets a spinner instead of a stuck page rather than an
// indefinite wait. Scroll input stays frozen (siteLoading, checked in the
// wheel/touch/keydown handlers above) until this resolves. ------------
const loadingScreen = document.getElementById('loadingScreen');
const loadingPeteImg = document.getElementById('loadingPeteImg');
const LOADING_SPIN_FRAME_MS = 90;
const LOADING_TIMEOUT_MS = 6000;

let loadingSpinIndex = 0;
const loadingSpinTimer = setInterval(() => {
  loadingSpinIndex = (loadingSpinIndex + 1) % DISCO_FRAMES.length;
  loadingPeteImg.src = DISCO_FRAMES[loadingSpinIndex];
}, LOADING_SPIN_FRAME_MS);
loadingPeteImg.src = DISCO_FRAMES[0];

function loadImage(src){
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve; // don't let one broken asset hang the loading screen forever
    img.src = src;
  });
}

const criticalLoad = Promise.all([
  loadImage(bgImg.getAttribute('src')),
  ...DISCO_FRAMES.map(loadImage),
  ...HANDSUP_FRAMES.map(loadImage),
  ...WALK_FRAMES.map(loadImage),
]);
const loadingTimeout = new Promise((resolve) => setTimeout(resolve, LOADING_TIMEOUT_MS));

Promise.race([criticalLoad, loadingTimeout]).then(() => {
  clearInterval(loadingSpinTimer);
  siteLoading = false;
  loadingScreen.classList.add('hidden');
});

// --- mute / sound-on toggle, applies to every audio element on the page ---
let isMuted = false;
try { isMuted = localStorage.getItem('eatsWithPeteMuted') === '1'; } catch(e) {}

function applyMuteState(){
  document.querySelectorAll('audio').forEach(a => { a.muted = isMuted; });
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
  muteBtn.setAttribute('aria-label', isMuted ? 'Unmute sound' : 'Mute sound');
}
applyMuteState();

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  applyMuteState();
  try { localStorage.setItem('eatsWithPeteMuted', isMuted ? '1' : '0'); } catch(e) {}
  if(!isMuted) ambienceSound.play().catch(() => {});
});

// --- ambience: attempt autoplay immediately on load, in case this domain
// has already crossed the browser's media-engagement threshold ---
ambienceSound.play().catch(() => {});

// --- unlock every sound on the page on the first real user gesture -------
// Browsers require an actual "user activation" event (click, keydown,
// touchstart, pointerdown) before audio.play() is allowed to succeed
// unprompted — and scrolling (wheel/trackpad) does NOT count as one in
// Chrome or Firefox. This page's whole interaction model is "scroll to
// walk", so a visitor who only ever scrolls may never trip a qualifying
// gesture, and every proximity/ambience sound stays silently blocked for
// the rest of the session. We listen (capture phase, once) for the widest
// practical set of real gesture types and, on the first one, play()+pause()
// every <audio> element so all of them are unlocked together — regardless
// of which specific interaction ends up being the one that qualifies.
const allSounds = [hotdogSound, carrotSound1, carrotSound2, heyManSound, bananaStandSound, ambienceSound];
const UNLOCK_EVENTS = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'wheel'];
let audioUnlocked = false;
function unlockAudioOnce(){
  if(audioUnlocked) return;
  audioUnlocked = true;
  allSounds.forEach(a => {
    a.play().then(() => {
      if(a !== ambienceSound){ a.pause(); a.currentTime = 0; }
    }).catch(() => {});
  });
  UNLOCK_EVENTS.forEach(ev => window.removeEventListener(ev, unlockAudioOnce, true));
}
UNLOCK_EVENTS.forEach(ev => window.addEventListener(ev, unlockAudioOnce, { capture:true, passive:true }));

// --- Lost and Found: click the icon to pop up the video --------------
const lostFoundIcon = document.getElementById('lostFoundIcon');
const lostFoundModal = document.getElementById('lostFoundModal');
const lostFoundBackdrop = document.getElementById('lostFoundBackdrop');
const lostFoundClose = document.getElementById('lostFoundClose');
const lostFoundVideo = document.getElementById('lostFoundVideo');

function openLostFound(){
  lostFoundOpen = true;
  lostFoundModal.classList.add('open');
  lostFoundModal.setAttribute('aria-hidden', 'false');
  lostFoundVideo.currentTime = 0;
  lostFoundVideo.play().catch(() => {});
}

function closeLostFound(){
  lostFoundOpen = false;
  lostFoundModal.classList.remove('open');
  lostFoundModal.setAttribute('aria-hidden', 'true');
  lostFoundVideo.pause();
}

lostFoundIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  openLostFound();
});
lostFoundIcon.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    openLostFound();
  }
});
lostFoundBackdrop.addEventListener('click', closeLostFound);
lostFoundClose.addEventListener('click', closeLostFound);
lostFoundVideo.addEventListener('ended', closeLostFound);
window.addEventListener('keydown', (e) => {
  if(lostFoundOpen && e.key === 'Escape') closeLostFound();
});

