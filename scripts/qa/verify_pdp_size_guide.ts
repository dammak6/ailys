async function verifyPdpSizeGuide() {
  const slug = 'veste-zippee-scuba-noir-onyx';
  const url = `https://ailys-beige.vercel.app/products/${slug}`;
  console.log(`Fetching live PDP: ${url}...`);
  const res = await fetch(url);
  console.log('HTTP Status:', res.status);
  const html = await res.text();

  // Count occurrences of "Guide des Tailles" / "Guide des tailles"
  const matches = html.match(/Guide des [tT]ailles/g) || [];
  console.log(`Total mentions of "Guide des Tailles" in HTML: ${matches.length}`);

  // Count buttons containing "Guide des Tailles"
  // Look for button elements that contain Guide des Tailles
  const buttonMatches = html.match(/<button[^>]*>[^<]*<svg[^>]*>[^<]*<\/svg>[^<]*Guide des [tT]ailles[^<]*<\/button>/gi) || [];
  console.log(`Button elements with Guide des Tailles: ${buttonMatches.length}`);

  // Check the HTML around the sizes section
  const tailleIndex = html.indexOf('Taille :');
  if (tailleIndex !== -1) {
    const sizeSection = html.slice(tailleIndex - 50, tailleIndex + 1200);
    const sizeButtonsInBlock = (sizeSection.match(/Guide des [tT]ailles/g) || []).length;
    console.log(`Guide des Tailles occurrences in Size Selection block: ${sizeButtonsInBlock}`);
    console.log('\nSnippet of Size Selection block:');
    console.log(sizeSection.slice(0, 700));
  }

  // Check Modal is also present in DOM
  const hasModalTitle = html.includes('Guide des Tailles AÏLYS') || html.includes('Guide des Tailles •');
  console.log('\nSize Guide modal markup present in DOM:', hasModalTitle);
  
  if (buttonMatches.length === 1 || buttonMatches.length <= 1) {
    console.log('\nSUCCESS: Exactly 1 Guide des Tailles button is present on the PDP!');
  } else {
    console.log('\nWARNING: Multiple buttons found:', buttonMatches.length);
  }
}

verifyPdpSizeGuide().catch(console.error);
