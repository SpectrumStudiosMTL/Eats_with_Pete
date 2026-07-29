// Fix #1: always reload at the logo starting point instead of wherever the
// browser thinks the scroll position was. Must run before the browser's
// own scroll-restoration kicks in, so it's a separate tiny script up top.
if('scrollRestoration' in history){ history.scrollRestoration = 'manual'; }
window.scrollTo(0, 0);
