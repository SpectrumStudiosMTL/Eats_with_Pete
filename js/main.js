const WALK_FRAMES = ["assets/images/walk_01.png", "assets/images/walk_02.png", "assets/images/walk_03.png", "assets/images/walk_04.png", "assets/images/walk_05.png", "assets/images/walk_06.png", "assets/images/walk_07.png", "assets/images/walk_08.png", "assets/images/walk_09.png", "assets/images/walk_10.png", "assets/images/walk_11.png", "assets/images/walk_12.png", "assets/images/walk_13.png", "assets/images/walk_14.png", "assets/images/walk_15.png", "assets/images/walk_16.png", "assets/images/walk_17.png", "assets/images/walk_18.png", "assets/images/walk_19.png", "assets/images/walk_20.png", "assets/images/walk_21.png", "assets/images/walk_22.png", "assets/images/walk_23.png", "assets/images/walk_24.png", "assets/images/walk_25.png", "assets/images/walk_26.png", "assets/images/walk_27.png", "assets/images/walk_28.png", "assets/images/walk_29.png", "assets/images/walk_30.png", "assets/images/walk_31.png", "assets/images/walk_32.png", "assets/images/walk_33.png"];

const POINT_BG_FRAMES = ["assets/images/point_bg_01.png", "assets/images/point_bg_02.png", "assets/images/point_bg_03.png", "assets/images/point_bg_04.png", "assets/images/point_bg_05.png", "assets/images/point_bg_06.png", "assets/images/point_bg_07.png", "assets/images/point_bg_08.png", "assets/images/point_bg_09.png", "assets/images/point_bg_10.png", "assets/images/point_bg_11.png", "assets/images/point_bg_12.png", "assets/images/point_bg_13.png", "assets/images/point_bg_14.png", "assets/images/point_bg_15.png", "assets/images/point_bg_16.png", "assets/images/point_bg_17.png", "assets/images/point_bg_18.png"];

const POINT_FG_FRAMES = ["assets/images/point_fg_01.png", "assets/images/point_fg_02.png", "assets/images/point_fg_03.png", "assets/images/point_fg_04.png", "assets/images/point_fg_05.png", "assets/images/point_fg_06.png", "assets/images/point_fg_07.png", "assets/images/point_fg_08.png", "assets/images/point_fg_09.png", "assets/images/point_fg_10.png", "assets/images/point_fg_11.png", "assets/images/point_fg_12.png", "assets/images/point_fg_13.png", "assets/images/point_fg_14.png"];


const YEAH_FRAMES = ["assets/images/yeah_01.png", "assets/images/yeah_02.png", "assets/images/yeah_03.png", "assets/images/yeah_04.png", "assets/images/yeah_05.png", "assets/images/yeah_06.png", "assets/images/yeah_07.png", "assets/images/yeah_08.png", "assets/images/yeah_09.png", "assets/images/yeah_10.png"];
const DISCO_FRAMES = ["assets/images/disco_01.png", "assets/images/disco_02.png", "assets/images/disco_03.png", "assets/images/disco_04.png", "assets/images/disco_05.png", "assets/images/disco_06.png", "assets/images/disco_07.png", "assets/images/disco_08.png", "assets/images/disco_09.png", "assets/images/disco_10.png", "assets/images/disco_11.png", "assets/images/disco_12.png", "assets/images/disco_13.png", "assets/images/disco_14.png", "assets/images/disco_15.png", "assets/images/disco_16.png", "assets/images/disco_17.png", "assets/images/disco_18.png", "assets/images/disco_19.png", "assets/images/disco_20.png"];
const JAZZHANDS_FRAMES = ["assets/images/jazzhands_01.png", "assets/images/jazzhands_02.png", "assets/images/jazzhands_03.png", "assets/images/jazzhands_04.png", "assets/images/jazzhands_05.png", "assets/images/jazzhands_06.png", "assets/images/jazzhands_07.png", "assets/images/jazzhands_08.png", "assets/images/jazzhands_09.png", "assets/images/jazzhands_10.png", "assets/images/jazzhands_11.png", "assets/images/jazzhands_12.png", "assets/images/jazzhands_13.png", "assets/images/jazzhands_14.png", "assets/images/jazzhands_15.png", "assets/images/jazzhands_16.png", "assets/images/jazzhands_17.png", "assets/images/jazzhands_18.png"];
const CARROT_FRAMES = ["assets/images/carrot_01.png", "assets/images/carrot_02.png", "assets/images/carrot_03.png", "assets/images/carrot_04.png", "assets/images/carrot_05.png", "assets/images/carrot_06.png", "assets/images/carrot_07.png", "assets/images/carrot_08.png", "assets/images/carrot_09.png", "assets/images/carrot_10.png", "assets/images/carrot_11.png", "assets/images/carrot_12.png", "assets/images/carrot_13.png", "assets/images/carrot_14.png", "assets/images/carrot_15.png", "assets/images/carrot_16.png", "assets/images/carrot_17.png", "assets/images/carrot_18.png", "assets/images/carrot_19.png", "assets/images/carrot_20.png", "assets/images/carrot_21.png"];
const HANDSUP_FRAMES = ["assets/images/handsup_01.png", "assets/images/handsup_02.png", "assets/images/handsup_03.png", "assets/images/handsup_04.png", "assets/images/handsup_05.png", "assets/images/handsup_06.png", "assets/images/handsup_07.png", "assets/images/handsup_08.png", "assets/images/handsup_09.png", "assets/images/handsup_10.png", "assets/images/handsup_11.png", "assets/images/handsup_12.png", "assets/images/handsup_13.png", "assets/images/handsup_14.png", "assets/images/handsup_15.png", "assets/images/handsup_16.png", "assets/images/handsup_17.png", "assets/images/handsup_18.png", "assets/images/handsup_19.png", "assets/images/handsup_20.png", "assets/images/handsup_21.png", "assets/images/handsup_22.png", "assets/images/handsup_23.png", "assets/images/handsup_24.png", "assets/images/handsup_25.png", "assets/images/handsup_26.png", "assets/images/handsup_27.png", "assets/images/handsup_28.png", "assets/images/handsup_29.png", "assets/images/handsup_30.png", "assets/images/handsup_31.png", "assets/images/handsup_32.png", "assets/images/handsup_33.png", "assets/images/handsup_34.png", "assets/images/handsup_35.png", "assets/images/handsup_36.png", "assets/images/handsup_37.png", "assets/images/handsup_38.png", "assets/images/handsup_39.png", "assets/images/handsup_40.png", "assets/images/handsup_41.png", "assets/images/handsup_42.png", "assets/images/handsup_43.png", "assets/images/handsup_44.png", "assets/images/handsup_45.png", "assets/images/handsup_46.png", "assets/images/handsup_47.png", "assets/images/handsup_48.png", "assets/images/handsup_49.png", "assets/images/handsup_50.png", "assets/images/handsup_51.png", "assets/images/handsup_52.png", "assets/images/handsup_53.png"];



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
      cartProp.style.left = (cartHomeLeftPx) + 'px';
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

// --- proximity-triggered pointing gestures --------------------------
// storefronts: Pete points at the BACKGROUND (the shop itself) as he passes
// the cart / carrot peddler: Pete points at the FOREGROUND (the prop right in front of him)
const POINT_TRIGGER_PX = 140;   // how close to screen-centre before it fires
const POINT_RESET_PX   = 500;   // how far away before it can fire again
const POINT_BG_FRAME_MS = 110;
const POINT_FG_FRAME_MS = 110;
const POINT_DURATION_MS = 1100;

const storefronts = Array.from(document.querySelectorAll('.storefront')).map(el => ({el, triggered:false}));
const fgGestureTargets = [cartProp, carrotProp].map(el => ({el, triggered:false}));

function checkPointTriggers(){
  if(peteState !== 'walking' || animFrames) return;
  const centerX = window.innerWidth / 2;

  for(const s of storefronts){
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
  { el: cartProp,   sound: hotdogSound, triggered:false },
  { el: carrotProp, sound: heyManSound, triggered:false },
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
    if(dist < PROXIMITY_SOUND_TRIGGER_PX && !t.triggered){
      t.triggered = true;
      t.sound.currentTime = 0;
      t.sound.play().catch(() => {});
    }
    if(dist > PROXIMITY_SOUND_RESET_PX) t.triggered = false;
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

// --- Fix #2: cap real scroll speed --------------------------------------
// Fast wheel spins / trackpad flicks could jump window.scrollY by hundreds
// or thousands of px between 'scroll' events, so props could be passed
// before their proximity check ever got a frame to notice. We take over
// wheel/touch/keyboard input ourselves, queue the requested movement
// (capped to a small buffer so releasing the input stops it quickly
// instead of coasting on a huge backlog), then drain that queue by a
// limited number of px every animation frame. The real window.scrollY —
// and everything derived from it (progress, proximity/point triggers,
// the end-of-scroll wrap check) — can then never advance faster than
// that per-frame cap, no matter how hard the user scrolls.
const MAX_SCROLL_PX_PER_FRAME = 9; // lower = slower max walk speed
const SCROLL_QUEUE_CAP = MAX_SCROLL_PX_PER_FRAME * 6; // backlog limit, so input release stops things quickly
let scrollQueuePx = 0;

function queueScroll(deltaY){
  scrollQueuePx += deltaY;
  scrollQueuePx = Math.max(-SCROLL_QUEUE_CAP, Math.min(SCROLL_QUEUE_CAP, scrollQueuePx));
}

window.addEventListener('wheel', (e) => {
  e.preventDefault();
  // deltaMode 1 = lines (typical mouse wheel notches) — normalize to ~px
  const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  queueScroll(px);
}, { passive:false });

let touchStartY = null;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive:true });
window.addEventListener('touchmove', (e) => {
  if(touchStartY === null) return;
  const y = e.touches[0].clientY;
  queueScroll(touchStartY - y);
  touchStartY = y;
  e.preventDefault();
}, { passive:false });

const SCROLL_KEY_PX = {
  ' ': 120, 'ArrowDown': 40, 'ArrowUp': -40,
  'PageDown': 400, 'PageUp': -400,
};
window.addEventListener('keydown', (e) => {
  if(e.key in SCROLL_KEY_PX){
    e.preventDefault();
    queueScroll(SCROLL_KEY_PX[e.key]);
  }
}, { passive:false });

function drainScrollQueue(){
  if(scrollQueuePx !== 0){
    const step = Math.sign(scrollQueuePx) * Math.min(Math.abs(scrollQueuePx), MAX_SCROLL_PX_PER_FRAME);
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

const EASE = 0.09;
const OFFSET_EASE = 0.12;
const FRAME_DISTANCE = 11;
let idleFrameIndex = 0;
let idleLastStep = 0;

function renderLoop(){
  drainScrollQueue();

  currentX += (targetX - currentX) * EASE;
  if(Math.abs(targetX - currentX) < 0.05) currentX = targetX;
  track.style.transform = 'translateX(' + currentX + 'px)';
  cartProp.style.left = (cartHomeLeftPx + currentX) + 'px';

  peteOffsetCurrent += (peteOffsetTarget - peteOffsetCurrent) * OFFSET_EASE;
  if(Math.abs(peteOffsetTarget - peteOffsetCurrent) < 0.05) peteOffsetCurrent = peteOffsetTarget;
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
    // ambient HandsUp loop, independent of scroll, until the user scrolls
    const now = performance.now();
    if(now - idleLastStep > IDLE_FRAME_MS){
      idleLastStep = now;
      idleFrameIndex = (idleFrameIndex + 1) % HANDSUP_FRAMES.length;
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

  requestAnimationFrame(renderLoop);
}

peteImg.src = HANDSUP_FRAMES[0];
carrotImg.src = CARROT_FRAMES[0];
layout();
requestAnimationFrame(renderLoop);

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

// --- ambience: play on load; browsers block unmuted autoplay before the
// first user interaction, so retry once on the first scroll/click/key/touch ---
function tryStartAmbience(){
  ambienceSound.play().catch(() => {});
}
tryStartAmbience();
const ambienceRetryEvents = ['scroll', 'click', 'keydown', 'touchstart'];
function ambienceRetryOnce(){
  tryStartAmbience();
  ambienceRetryEvents.forEach(ev => window.removeEventListener(ev, ambienceRetryOnce));
}
ambienceRetryEvents.forEach(ev => window.addEventListener(ev, ambienceRetryOnce, { passive:true }));

