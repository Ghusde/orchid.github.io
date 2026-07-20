// ---------- Traveling glow timeline (The Experience section) ----------
// Cycles the "active" dot left to right through the 5 steps, with a
// short fading trail behind it, then loops back to the start forever.
(function initTimelineGlow(){
  const steps = document.querySelectorAll('.ritual .tstep');
  const n = steps.length;
  if(!n) return;

  const INTERVAL_MS = 1600; // speed of the glow moving to the next step
  let idx = 0;

  function paint(){
    steps.forEach((step, i) => {
      step.classList.toggle('tl-active', i === idx);
    });
  }

  paint();
  setInterval(() => {
    idx = (idx + 1) % n;
    paint();
  }, INTERVAL_MS);
})();