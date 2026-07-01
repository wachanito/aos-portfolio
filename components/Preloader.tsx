'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone]   = useState(false);

  useEffect(() => {
    function finish() {
      (window as any).__aosLoaded = true;
      window.dispatchEvent(new Event('aos:loaded'));
      setDone(true);
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setCount(100); finish(); return; }

    const dur = 1200, start = performance.now();
    let raf = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 2);
    function tick(now: number) {
      const t = Math.min(1, (now - start) / dur);
      setCount(Math.round(ease(t) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 160);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`aos-preloader${done ? ' is-done' : ''}`} aria-hidden="true">
      <span className="aos-preloader__mark">AOS<i>.</i></span>
      <span className="aos-preloader__count">{String(count).padStart(3, '0')}</span>
      <span className="aos-preloader__bar"><span style={{ transform: `scaleX(${count / 100})` }} /></span>
    </div>
  );
}
