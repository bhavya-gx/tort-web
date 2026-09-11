/* TORT. Drawn to match assets/reference/turtle.png.

   Contract the app relies on:
   - one inline <svg> string, viewBox="0 0 128 100" (turtle proportions, ~1.29:1)
   - the character faces LEFT, like the reference (the app mirrors it to face right)
   - it stands on the bottom edge of the viewBox
   - class="pet-eye" on both eye groups     -> blink and sleep
   - class="pet-head" on the head group     -> tucks into the shell when asleep
   - class="pet-leg front" / "pet-leg back" -> walk cycle, tuck when asleep
   Everything else rides along with the body.

   Layered and editable: shadow, far legs, dome, scutes, rim, head, near legs. */

export const sprite = `
<svg viewBox="0 0 128 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="tort-head-clip"><ellipse cx="26" cy="60" rx="25" ry="21"/></clipPath>
    <clipPath id="tort-dome-clip">
      <path d="M26 68 C26 34 50 10 78 10 C108 10 124 38 124 68 C96 76 54 76 26 68 Z"/>
    </clipPath>
  </defs>

  <!-- ground shadow -->
  <ellipse cx="68" cy="95" rx="54" ry="4.5" fill="#3A2E24" opacity="0.13"/>

  <!-- far legs, behind the body -->
  <g class="pet-leg back">
    <path d="M12 78 q0 -6 6 -6 h4 q6 0 6 6 v12 q0 7 -7 7 h-2 q-7 0 -7 -7 Z" fill="#8DBE58" stroke="#4E3A2B" stroke-width="2.2" stroke-linejoin="round"/>
    <ellipse cx="16.5" cy="95" rx="2.6" ry="1.7" fill="#5C4B3B"/>
    <ellipse cx="23.5" cy="95" rx="2.6" ry="1.7" fill="#5C4B3B"/>
  </g>
  <g class="pet-leg back">
    <path d="M97 74 q0 -6 6 -6 h3 q6 0 6 6 v13 q0 7 -7 7 h-1 q-7 0 -7 -7 Z" fill="#8DBE58" stroke="#4E3A2B" stroke-width="2.2" stroke-linejoin="round"/>
    <ellipse cx="102" cy="93.5" rx="2.5" ry="1.7" fill="#5C4B3B"/>
    <ellipse cx="108.5" cy="93.5" rx="2.5" ry="1.7" fill="#5C4B3B"/>
  </g>

  <!-- belly, peeks out between legs -->
  <path d="M30 80 C54 95 96 95 120 80 L120 84 C96 97 54 97 30 84 Z" fill="#E3CFA3" stroke="#4E3A2B" stroke-width="2"/>

  <!-- shell dome -->
  <path d="M26 68 C26 34 50 10 78 10 C108 10 124 38 124 68 C96 76 54 76 26 68 Z" fill="#A67D5E"/>
  <g clip-path="url(#tort-dome-clip)" stroke="#6B4C36" stroke-width="1.8" stroke-linejoin="round">
    <path d="M58 22 L84 18 L100 36 L94 60 L64 62 L50 42 Z" fill="#B48D6B"/>
    <path d="M40 26 C48 16 56 14 66 12 L58 22 L50 42 L32 44 Z" fill="#AC8462"/>
    <path d="M84 18 C96 16 106 22 112 30 L100 36 Z" fill="#A87F5F"/>
    <path d="M100 36 L112 30 C120 42 124 56 124 68 L108 70 L94 60 Z" fill="#9C7254"/>
    <path d="M32 44 L50 42 L64 62 L56 70 L26 68 Z" fill="#A47A5A"/>
    <path d="M64 62 L94 60 L108 70 C90 78 70 78 56 70 Z" fill="#A27858"/>
    <!-- gloss sweep, shown after a clean -->
    <path class="pet-shine" d="M34 40 C46 20 66 12 84 14 L78 24 C62 26 48 36 40 52 Z" fill="#fff" opacity="0" stroke="none"/>
    <!-- soft light on the top-left of the dome -->
    <path d="M38 30 C46 18 60 12 74 12 C64 20 54 34 50 52 Z" fill="#C4A07C" opacity="0.35" stroke="none"/>
  </g>
  <path d="M26 68 C26 34 50 10 78 10 C108 10 124 38 124 68 C96 76 54 76 26 68 Z" fill="none" stroke="#4E3A2B" stroke-width="2.4" stroke-linejoin="round"/>

  <!-- sparkles, shown when all three care tasks are done -->
  <g class="pet-sparkle" fill="#FFD84D" stroke="#4E3A2B" stroke-width="1" stroke-linejoin="round">
    <path d="M96 8 l2.2 5 5 2.2 -5 2.2 -2.2 5 -2.2 -5 -5 -2.2 5 -2.2 Z"/>
    <path d="M44 14 l1.6 3.6 3.6 1.6 -3.6 1.6 -1.6 3.6 -1.6 -3.6 -3.6 -1.6 3.6 -1.6 Z"/>
    <path d="M118 30 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z"/>
  </g>

  <!-- rim band -->
  <path d="M26 68 C54 78 96 78 124 68 L124 78 C96 93 54 93 26 78 Z" fill="#E9D7AE" stroke="#4E3A2B" stroke-width="2" stroke-linejoin="round"/>
  <path d="M31 71 C54 80 96 80 119 71" fill="none" stroke="#F5E9CA" stroke-width="2" opacity="0.8"/>
  <g stroke="#B99B6E" stroke-width="1.6" stroke-linecap="round">
    <path d="M42 72 v12"/>
    <path d="M60 75.5 v13"/>
    <path d="M78 76.5 v13"/>
    <path d="M96 75 v13"/>
    <path d="M112 71.5 v12"/>
  </g>

  <!-- head -->
  <g class="pet-head">
    <ellipse cx="26" cy="60" rx="25" ry="21" fill="#A6D26C"/>
    <path clip-path="url(#tort-head-clip)" d="M0 66 Q26 88 52 66 L52 88 L0 88 Z" fill="#8DBD57" opacity="0.55"/>
    <ellipse cx="17" cy="47" rx="9" ry="4.6" fill="#C8E896" opacity="0.7" transform="rotate(-18 17 47)"/>
    <ellipse cx="26" cy="60" rx="25" ry="21" fill="none" stroke="#4E3A2B" stroke-width="2.4"/>

    <g class="pet-eye">
      <ellipse cx="12" cy="60" rx="3.3" ry="4.2" fill="#2A2320"/>
      <circle cx="13.3" cy="58.3" r="1.2" fill="#fff"/>
      <ellipse class="pet-lid" cx="12" cy="53.6" rx="3.9" ry="4.2" fill="#A6D26C"/>
    </g>
    <g class="pet-eye">
      <ellipse cx="36" cy="59" rx="3.3" ry="4.2" fill="#2A2320"/>
      <circle cx="37.3" cy="57.3" r="1.2" fill="#fff"/>
      <ellipse class="pet-lid" cx="36" cy="52.6" rx="3.9" ry="4.2" fill="#A6D26C"/>
    </g>

    <ellipse cx="5.5" cy="67" rx="4.2" ry="2.8" fill="#F2B09A" opacity="0.85"/>
    <ellipse cx="43" cy="66" rx="4.2" ry="2.8" fill="#F2B09A" opacity="0.85"/>
    <path d="M20 66 q2 2.6 4 0 q2 2.6 4 0" fill="none" stroke="#3B302A" stroke-width="1.6" stroke-linecap="round"/>
  </g>

  <!-- near legs, in front -->
  <g class="pet-leg front">
    <path d="M52 76 q0 -7 7 -7 h10 q7 0 7 7 v12 q0 9 -9 9 h-6 q-9 0 -9 -9 Z" fill="#A6D26C" stroke="#4E3A2B" stroke-width="2.2" stroke-linejoin="round"/>
    <g fill="#93C25E" opacity="0.9">
      <circle cx="58" cy="80" r="1.5"/><circle cx="66" cy="78" r="1.5"/>
      <circle cx="62" cy="86" r="1.5"/><circle cx="70" cy="86" r="1.5"/>
      <circle cx="58" cy="91" r="1.3"/>
    </g>
    <ellipse cx="57" cy="96" rx="2.8" ry="1.8" fill="#5C4B3B"/>
    <ellipse cx="64" cy="96.5" rx="2.8" ry="1.8" fill="#5C4B3B"/>
    <ellipse cx="71" cy="96" rx="2.8" ry="1.8" fill="#5C4B3B"/>
  </g>
  <g class="pet-leg front">
    <path d="M104 77 q0 -7 7 -7 h4 q7 0 7 7 v10 q0 8 -8 8 h-2 q-8 0 -8 -8 Z" fill="#A6D26C" stroke="#4E3A2B" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="110" cy="80" r="1.4" fill="#93C25E" opacity="0.9"/>
    <circle cx="116" cy="85" r="1.4" fill="#93C25E" opacity="0.9"/>
    <ellipse cx="109" cy="94.5" rx="2.6" ry="1.7" fill="#5C4B3B"/>
    <ellipse cx="116.5" cy="94.5" rx="2.6" ry="1.7" fill="#5C4B3B"/>
  </g>
</svg>`


/* A leaf, for feeding. Dropped next to the mouth, then eaten. */
export const leaf = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 32 C6 14 18 6 34 6 C34 22 24 34 6 32 Z" fill="#7CC24A" stroke="#4E3A2B" stroke-width="2" stroke-linejoin="round"/>
  <path d="M8 30 C14 22 22 16 30 10" fill="none" stroke="#4E3A2B" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
  <path d="M14 26 l4 -1 M18 21 l4 -1 M22 16 l4 -1" fill="none" stroke="#4E3A2B" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
</svg>`


/* A glass of water, for the 30 minute reward. */
export const water = `
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 6 h20 l-3 28 h-14 Z" fill="#EAF6FF" stroke="#4E3A2B" stroke-width="2" stroke-linejoin="round"/>
  <path d="M12.6 16 h14.8 l-2 18 h-10.8 Z" fill="#7CC7FF"/>
  <path d="M13 17 h14" stroke="#B9E3FF" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="17" cy="24" rx="1.6" ry="3" fill="#fff" opacity="0.6"/>
</svg>`

/* A soap bubble, for the 2 hour clean. Several are spawned at once. */
export const bubble = `
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <circle cx="10" cy="10" r="8.5" fill="#CFEBFF" opacity="0.75" stroke="#8FD0FF" stroke-width="1.2"/>
  <circle cx="7" cy="7" r="2.2" fill="#fff" opacity="0.9"/>
</svg>`
