import { useEffect } from 'react';
import { gsap, ScrollTrigger, MQ } from './animations/gsap.js';
import { startSmoothScroll, stopSmoothScroll } from './animations/smoothScroll.js';
import { startChapterTracker } from './animations/chapterTracker.js';

import Navigation from './components/Navigation.jsx';
import Progress from './components/Progress.jsx';
import Cursor from './components/Cursor.jsx';
import Grain from './components/Grain.jsx';
import Hero from './components/Hero.jsx';
import Story from './components/Story.jsx';
import Campus from './components/Campus.jsx';
import Academics from './components/Academics.jsx';
import Programs from './components/Programs.jsx';
import StudentLife from './components/StudentLife.jsx';
import Statistics from './components/Statistics.jsx';
import People from './components/People.jsx';
import Research from './components/Research.jsx';
import Location from './components/Location.jsx';
import Admissions from './components/Admissions.jsx';
import Finale from './components/Finale.jsx';

export default function App() {
  useEffect(() => {
    const reduceMQ = window.matchMedia(MQ.reduce);
    if (!reduceMQ.matches) startSmoothScroll();
    const stopTracker = startChapterTracker();

    // Respect a live change of the OS reduced-motion setting: a clean reload is the safest reset.
    const onReduceChange = () => window.location.reload();
    reduceMQ.addEventListener('change', onReduceChange);

    // Layout depends on webfonts and images — recalc pins once they land.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 1200);

    return () => {
      clearTimeout(t);
      window.removeEventListener('load', refresh);
      reduceMQ.removeEventListener('change', onReduceChange);
      stopTracker();
      stopSmoothScroll();
    };
  }, []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Story />
        <Campus />
        <Academics />
        <Programs />
        <StudentLife />
        <Statistics />
        <People />
        <Research />
        <Location />
        <Admissions />
        <Finale />
      </main>
      <Progress />
      <Cursor />
      <Grain />
    </>
  );
}
