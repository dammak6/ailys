async function verifyLiveMarquee() {
  const BASE_URL = 'https://ailys-beige.vercel.app';
  console.log(`Connecting to ${BASE_URL}...`);
  const res = await fetch(BASE_URL);
  console.log('HTTP Status:', res.status);
  const html = await res.text();
  
  const hasRegion = html.includes('Annonces Maison AÏLYS');
  const hasMarqueeClass = html.includes('animate-marquee-infinite');
  const hasWillChange = html.includes('will-change');
  console.log('HTML checks:');
  console.log(' - Contains AnnouncementBar region:', hasRegion);
  console.log(' - Contains animate-marquee-infinite:', hasMarqueeClass);
  console.log(' - Contains will-change style:', hasWillChange);

  // Extract CSS
  const cssMatches = Array.from(html.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)).map(m => m[1]);
  console.log(`Found ${cssMatches.length} linked CSS file(s).`);

  for (const cssPath of cssMatches) {
    const cssRes = await fetch(BASE_URL + cssPath);
    const css = await cssRes.text();
    if (css.includes('marquee-scroll')) {
      console.log(`\nVerified CSS in: ${cssPath}`);
      console.log(' - Has @keyframes marquee-scroll:', css.includes('@keyframes marquee-scroll'));
      console.log(' - Has translateX(-50%):', css.includes('translateX(-50%)'));
      console.log(' - Has prefers-reduced-motion override:', css.includes('.animate-marquee-infinite{animation:marquee-scroll 32s linear infinite!important}'));
      console.log(' - Has will-change:transform:', css.includes('will-change:transform'));
      console.log(' - Has touch-safe hover media query:', css.includes('hover:hover') && css.includes('animation-play-state:paused'));
    }
  }

  // Count items rendered in HTML
  const livraisonCount = (html.match(/Livraison offerte/g) || []).length;
  console.log(`\nItem duplication check: "Livraison offerte" appears ${livraisonCount} times across set1 & set2 (expected: 4 for seamless desktop coverage).`);
}

verifyLiveMarquee().catch(console.error);
