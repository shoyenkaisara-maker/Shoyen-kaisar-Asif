import type { PortfolioData } from '../types/portfolio.ts';

// High quality embedded SVG artwork for authentic 2D animation previews
export const HERO_ARTWORK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0e7490" />
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background Environment -->
  <rect width="800" height="600" rx="16" fill="url(#skyGrad)" />
  
  <!-- Stylized Distant Hills -->
  <path d="M0 420 Q180 340 380 410 T800 370 L800 600 L0 600 Z" fill="#0f2b38" opacity="0.6"/>
  <path d="M0 460 Q220 390 440 450 T800 420 L800 600 L0 600 Z" fill="#08202b" opacity="0.8"/>

  <!-- River / Water Reflection -->
  <path d="M0 500 Q400 480 800 520 L800 600 L0 600 Z" fill="#041620" />
  <ellipse cx="420" cy="530" rx="220" ry="8" fill="#38bdf8" opacity="0.25"/>
  <ellipse cx="360" cy="550" rx="160" ry="6" fill="#38bdf8" opacity="0.18"/>

  <!-- Palm / Coconut Trees Silhouettes on Bengali Riverbank -->
  <path d="M120 480 Q130 380 160 300" stroke="#041620" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M160 300 Q120 260 70 290" stroke="#041620" stroke-width="4" fill="none"/>
  <path d="M160 300 Q150 240 120 230" stroke="#041620" stroke-width="4" fill="none"/>
  <path d="M160 300 Q190 240 220 250" stroke="#041620" stroke-width="4" fill="none"/>
  <path d="M160 300 Q200 280 230 310" stroke="#041620" stroke-width="4" fill="none"/>

  <!-- Animation Workframe / Holographic Canvas Overlay -->
  <rect x="240" y="70" width="480" height="340" rx="12" fill="#0b1322" stroke="#38bdf8" stroke-width="2" opacity="0.95" filter="url(#glow)"/>
  
  <!-- Adobe Animate UI Inspired Top Bar -->
  <rect x="240" y="70" width="480" height="32" rx="12" fill="#1e293b"/>
  <circle cx="260" cy="86" r="5" fill="#ef4444"/>
  <circle cx="276" cy="86" r="5" fill="#eab308"/>
  <circle cx="292" cy="86" r="5" fill="#22c55e"/>
  <text x="320" y="91" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="bold">Adobe Animate CC — [Scene_01_RiverVillage.fla * 24fps]</text>

  <!-- Canvas Stage inside Animate -->
  <rect x="256" y="114" width="448" height="236" rx="6" fill="#132337"/>
  
  <!-- Animated Cartoon Character (Jumping Bengali Boy Mascot) -->
  <g transform="translate(420, 140)">
    <!-- Motion trails -->
    <path d="M-40 120 Q-20 80 0 60" stroke="#38bdf8" stroke-dasharray="4 4" stroke-width="3" fill="none"/>
    <path d="M-60 135 Q-40 100 -20 80" stroke="#fb923c" stroke-dasharray="4 4" stroke-width="2" fill="none"/>
    
    <!-- Torso -->
    <path d="M20 70 L45 70 L55 125 L10 125 Z" fill="url(#orangeGrad)" rx="8"/>
    <!-- Scarf / Gamcha -->
    <path d="M12 70 Q32 85 52 70 Q45 105 40 120 L30 115 Z" fill="#ef4444"/>
    <!-- Head -->
    <ellipse cx="32" cy="40" rx="24" ry="26" fill="#fbcfe8"/>
    <!-- Cute Cartoon Hair -->
    <path d="M10 35 Q15 12 32 12 Q50 12 55 35 Q45 22 32 24 Q18 22 10 35 Z" fill="#1e1b4b"/>
    <!-- Eyes -->
    <ellipse cx="25" cy="38" rx="4" ry="6" fill="#090d16"/>
    <circle cx="24" cy="36" r="1.5" fill="#ffffff"/>
    <ellipse cx="40" cy="38" rx="4" ry="6" fill="#090d16"/>
    <circle cx="39" cy="36" r="1.5" fill="#ffffff"/>
    <!-- Cheerful Big Smile -->
    <path d="M24 48 Q32 58 42 48" stroke="#090d16" stroke-width="2.5" stroke-linecap="round" fill="#e11d48"/>
    <!-- Arms reaching out happily -->
    <path d="M15 75 Q-15 50 -20 30" stroke="#fbcfe8" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M50 75 Q85 60 90 40" stroke="#fbcfe8" stroke-width="7" stroke-linecap="round" fill="none"/>
    <!-- Legs jumping in air -->
    <path d="M22 125 L10 165 L-5 160" stroke="#0284c7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M42 125 L55 160 L75 155" stroke="#0284c7" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>

  <!-- Onion Skinning / Animation Timeline Stacking Effect -->
  <rect x="256" y="360" width="448" height="36" rx="4" fill="#0f172a" stroke="#334155"/>
  <rect x="340" y="364" width="60" height="28" rx="3" fill="#0284c7" opacity="0.8"/>
  <line x1="370" y1="360" x2="370" y2="396" stroke="#f43f5e" stroke-width="2"/>
  <text x="268" y="382" fill="#38bdf8" font-family="monospace" font-size="10">Layer 1: Char Rig</text>
  <text x="640" y="382" fill="#fb923c" font-family="monospace" font-size="10">Keyframe 24</text>

  <!-- Glowing Stylus / Digital Pen in Foreground -->
  <g transform="translate(180, 260) rotate(-35)">
    <rect x="0" y="0" width="22" height="180" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
    <path d="M0 180 L11 215 L22 180 Z" fill="#06b6d4" filter="url(#glow)"/>
    <circle cx="11" cy="215" r="4" fill="#38bdf8" filter="url(#glow)"/>
  </g>

  <!-- Badge in Corner -->
  <g transform="translate(620, 520)">
    <rect width="150" height="42" rx="21" fill="#06b6d4" opacity="0.95"/>
    <text x="75" y="26" fill="#090d16" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">2D ANIMATION 24FPS</text>
  </g>
</svg>
`)}`;

export const AVATAR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0891b2" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <circle cx="200" cy="200" r="190" fill="#0f172a" stroke="url(#bgGrad)" stroke-width="8"/>
  <circle cx="200" cy="200" r="170" fill="#1e293b" />
  
  <!-- Stylized Animator Avatar (Shoyen Kaiser Asif) -->
  <g transform="translate(110, 70)">
    <!-- Hair -->
    <path d="M30 70 Q50 15 90 20 Q140 15 155 70 Q130 35 90 40 Q50 40 30 70 Z" fill="#090d16"/>
    <!-- Head -->
    <ellipse cx="90" cy="110" rx="55" ry="60" fill="#fde047" opacity="0.9"/>
    <!-- Modern Specs/Glasses -->
    <rect x="48" y="90" width="36" height="26" rx="6" fill="none" stroke="#06b6d4" stroke-width="4"/>
    <rect x="96" y="90" width="36" height="26" rx="6" fill="none" stroke="#06b6d4" stroke-width="4"/>
    <line x1="84" y1="102" x2="96" y2="102" stroke="#06b6d4" stroke-width="4"/>
    <!-- Eyes -->
    <circle cx="66" cy="103" r="4" fill="#090d16"/>
    <circle cx="114" cy="103" r="4" fill="#090d16"/>
    <!-- Cheerful confident smile -->
    <path d="M72 135 Q90 150 108 135" stroke="#090d16" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <!-- Neck -->
    <rect x="75" y="165" width="30" height="25" fill="#facc15"/>
    <!-- Jacket / Studio Hoodie -->
    <path d="M20 190 Q90 180 160 190 L180 260 L0 260 Z" fill="#0f172a"/>
    <path d="M55 190 L90 230 L125 190" stroke="#06b6d4" stroke-width="3" fill="none"/>
    <!-- Stylus in pocket -->
    <rect x="135" y="195" width="6" height="35" rx="3" fill="#f97316"/>
  </g>
</svg>
`)}`;

export const BENGALI_VILLAGE_BG_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <defs>
    <linearGradient id="monsoonSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="45%" stop-color="#334155"/>
      <stop offset="85%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
    <linearGradient id="paddyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4d7c0f"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
    <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>

  <!-- Sky -->
  <rect width="1200" height="800" fill="url(#monsoonSky)"/>

  <!-- Golden Monsoon Sunset / Twilight Glow -->
  <circle cx="850" cy="380" r="140" fill="#fef08a" opacity="0.7" filter="blur(20px)"/>

  <!-- Distant Bengali Village Foliage / Horizon -->
  <path d="M0 450 Q300 410 600 440 T1200 420 L1200 800 L0 800 Z" fill="#1e3a1f"/>

  <!-- Lush Green Paddy Fields (Dhan Khet) -->
  <path d="M0 480 Q400 450 800 490 T1200 470 L1200 800 L0 800 Z" fill="url(#paddyGrad)"/>

  <!-- Traditional Earthen Courtyard (Uthan) with Mud Hut -->
  <path d="M0 580 Q350 540 700 580 T1200 570 L1200 800 L0 800 Z" fill="#854d0e"/>

  <!-- Rural Thatched Mud House (Makhir Ghor) -->
  <g transform="translate(180, 360)">
    <!-- Thatched Straw Roof (Chon/Tin) -->
    <polygon points="50,40 220,10 390,40 220,0" fill="#a16207"/>
    <polygon points="50,40 220,10 240,110 30,140" fill="#ca8a04"/>
    <polygon points="220,10 390,40 410,140 240,110" fill="#b45309"/>
    <!-- Mud Walls -->
    <rect x="55" y="110" width="330" height="130" fill="#78350f" rx="4"/>
    <rect x="70" y="125" width="295" height="105" fill="#92400e" rx="2"/>
    <!-- Wooden Door and Window -->
    <rect x="180" y="150" width="50" height="80" rx="3" fill="#451a03"/>
    <rect x="90" y="150" width="40" height="40" rx="2" fill="#451a03"/>
    <rect x="290" y="150" width="40" height="40" rx="2" fill="#451a03"/>
    <!-- Wooden veranda pillars -->
    <line x1="75" y1="110" x2="75" y2="235" stroke="#542407" stroke-width="8"/>
    <line x1="365" y1="110" x2="365" y2="235" stroke="#542407" stroke-width="8"/>
  </g>

  <!-- Big Banyan & Banana Trees (Kola Gachh) -->
  <g transform="translate(650, 280)">
    <!-- Banana Palm Leaves -->
    <path d="M120 280 Q100 160 50 120 Q80 140 120 280" fill="#65a30d"/>
    <path d="M120 280 Q140 140 200 90 Q170 130 120 280" fill="#4d7c0f"/>
    <path d="M120 280 Q70 180 20 170 Q60 190 120 280" fill="#84cc16"/>
    <path d="M120 280 Q160 180 230 180 Q180 200 120 280" fill="#65a30d"/>
    <path d="M110 280 L130 280 L125 380 L115 380 Z" fill="#3f6212"/>
  </g>

  <!-- Serene River Curve (Nodi) in Foreground with Traditional Wooden Boat (Nouka) -->
  <path d="M0 660 Q400 620 750 670 T1200 640 L1200 800 L0 800 Z" fill="url(#riverGrad)"/>

  <!-- Traditional Dingi Boat (Nouka) -->
  <g transform="translate(480, 640)">
    <!-- Wooden Hull -->
    <path d="M0 45 Q120 75 240 45 Q180 85 60 85 Z" fill="#292524"/>
    <!-- Bamboo Canopy (Chhoi) -->
    <path d="M70 50 Q120 15 170 50 Z" fill="#a16207"/>
    <!-- Oar / Boitha -->
    <line x1="180" y1="45" x2="230" y2="95" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
    <!-- Water ripples -->
    <ellipse cx="120" cy="85" rx="80" ry="6" fill="#38bdf8" opacity="0.4"/>
  </g>

  <!-- Flying Egrets / Birds in Evening Sky -->
  <path d="M720 220 Q735 210 750 220 Q765 210 780 220" stroke="#f8fafc" stroke-width="3" fill="none"/>
  <path d="M780 250 Q792 242 805 250 Q817 242 830 250" stroke="#f8fafc" stroke-width="2.5" fill="none"/>
  <path d="M830 225 Q840 218 850 225 Q860 218 870 225" stroke="#f8fafc" stroke-width="2.5" fill="none"/>
</svg>
`)}`;

export const CHARACTER_SHEET_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <!-- Background Design Sheet -->
  <rect width="1200" height="800" fill="#0f172a"/>
  
  <!-- Grid Lines -->
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="800" fill="url(#grid)"/>

  <!-- Sheet Header -->
  <rect x="40" y="30" width="1120" height="60" rx="8" fill="#1e293b"/>
  <text x="70" y="68" fill="#38bdf8" font-family="'Outfit', sans-serif" font-size="22" font-weight="bold">CHARACTER TURNAROUND SHEET: "RAJU" (BENGALI VILLAGE BOY)</text>
  <text x="1050" y="66" fill="#94a3b8" font-family="monospace" font-size="14">Adobe Animate CC</text>

  <!-- Height Guidelines -->
  <line x1="60" y1="180" x2="1140" y2="180" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
  <text x="70" y="174" fill="#0ea5e9" font-family="monospace" font-size="11">HEAD TOP</text>
  <line x1="60" y1="310" x2="1140" y2="310" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4"/>
  <text x="70" y="304" fill="#0ea5e9" font-family="monospace" font-size="11">CHEST / ELBOW</text>
  <line x1="60" y1="430" x2="1140" y2="430" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4"/>
  <text x="70" y="424" fill="#0ea5e9" font-family="monospace" font-size="11">HIPS</text>
  <line x1="60" y1="560" x2="1140" y2="560" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
  <text x="70" y="554" fill="#0ea5e9" font-family="monospace" font-size="11">GROUND BASE</text>

  <!-- View 1: Front View -->
  <g transform="translate(140, 180)">
    <text x="50" y="420" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">FRONT VIEW</text>
    <!-- Character Figure -->
    <!-- Head -->
    <ellipse cx="50" cy="60" rx="35" ry="40" fill="#fde047"/>
    <!-- Hair -->
    <path d="M15 50 Q25 15 50 18 Q80 15 88 50 Q75 30 50 32 Q28 30 15 50 Z" fill="#0f172a"/>
    <!-- Eyes -->
    <ellipse cx="38" cy="60" rx="5" ry="8" fill="#090d16"/>
    <ellipse cx="62" cy="60" rx="5" ry="8" fill="#090d16"/>
    <!-- Smile -->
    <path d="M40 76 Q50 88 60 76" stroke="#090d16" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Kurta Shirt -->
    <path d="M25 100 L75 100 L85 240 L15 240 Z" fill="#f97316" rx="6"/>
    <!-- Traditional Gamcha / Scarf -->
    <path d="M30 100 Q50 120 70 100 L65 170 L40 170 Z" fill="#ef4444"/>
    <!-- Arms -->
    <rect x="5" y="110" width="18" height="110" rx="8" fill="#fde047"/>
    <rect x="77" y="110" width="18" height="110" rx="8" fill="#fde047"/>
    <!-- Lungi / Pants -->
    <rect x="25" y="240" width="50" height="100" fill="#0284c7" rx="4"/>
    <line x1="50" y1="240" x2="50" y2="340" stroke="#0369a1" stroke-width="3"/>
    <!-- Feet -->
    <ellipse cx="35" cy="360" rx="14" ry="8" fill="#ca8a04"/>
    <ellipse cx="65" cy="360" rx="14" ry="8" fill="#ca8a04"/>
  </g>

  <!-- View 2: 3/4 View -->
  <g transform="translate(380, 180)">
    <text x="50" y="420" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">THREE-QUARTER VIEW</text>
    <ellipse cx="50" cy="60" rx="34" ry="40" fill="#fde047"/>
    <path d="M18 50 Q30 15 55 18 Q82 20 86 52 Q68 32 48 34 Z" fill="#0f172a"/>
    <ellipse cx="45" cy="60" rx="5" ry="8" fill="#090d16"/>
    <ellipse cx="68" cy="60" rx="4" ry="7" fill="#090d16"/>
    <path d="M46 76 Q56 86 66 76" stroke="#090d16" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M28 100 L76 100 L88 240 L20 240 Z" fill="#f97316"/>
    <path d="M32 100 Q50 115 68 100 L62 165 L44 165 Z" fill="#ef4444"/>
    <rect x="15" y="110" width="18" height="110" rx="8" fill="#fde047" transform="rotate(-5, 24, 160)"/>
    <rect x="74" y="110" width="18" height="110" rx="8" fill="#fde047" transform="rotate(8, 80, 160)"/>
    <rect x="26" y="240" width="50" height="100" fill="#0284c7" rx="4"/>
    <ellipse cx="38" cy="360" rx="14" ry="8" fill="#ca8a04"/>
    <ellipse cx="68" cy="360" rx="14" ry="8" fill="#ca8a04"/>
  </g>

  <!-- View 3: Side Profile View -->
  <g transform="translate(620, 180)">
    <text x="40" y="420" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">SIDE PROFILE</text>
    <ellipse cx="40" cy="60" rx="30" ry="40" fill="#fde047"/>
    <path d="M12 55 Q20 18 50 20 Q70 25 72 45 Q55 35 40 35 Z" fill="#0f172a"/>
    <!-- Nose projection -->
    <path d="M68 55 L75 62 L67 68" stroke="#ca8a04" stroke-width="2.5" fill="none"/>
    <ellipse cx="60" cy="58" rx="4" ry="7" fill="#090d16"/>
    <path d="M58 75 Q65 80 60 83" stroke="#090d16" stroke-width="2.5" fill="none"/>
    <rect x="22" y="100" width="45" height="140" fill="#f97316" rx="4"/>
    <rect x="35" y="110" width="18" height="110" rx="8" fill="#fde047"/>
    <rect x="24" y="240" width="42" height="100" fill="#0284c7" rx="3"/>
    <ellipse cx="50" cy="360" rx="16" ry="8" fill="#ca8a04"/>
  </g>

  <!-- View 4: Back View -->
  <g transform="translate(850, 180)">
    <text x="50" y="420" fill="#f8fafc" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">BACK VIEW</text>
    <ellipse cx="50" cy="60" rx="35" ry="40" fill="#0f172a"/>
    <rect x="42" y="85" width="16" height="18" fill="#fde047"/>
    <path d="M25 100 L75 100 L85 240 L15 240 Z" fill="#f97316" rx="6"/>
    <!-- Back of Gamcha -->
    <rect x="35" y="100" width="30" height="85" fill="#ef4444" rx="2"/>
    <rect x="5" y="110" width="18" height="110" rx="8" fill="#fde047"/>
    <rect x="77" y="110" width="18" height="110" rx="8" fill="#fde047"/>
    <rect x="25" y="240" width="50" height="100" fill="#0284c7" rx="4"/>
    <ellipse cx="35" cy="360" rx="14" ry="8" fill="#ca8a04"/>
    <ellipse cx="65" cy="360" rx="14" ry="8" fill="#ca8a04"/>
  </g>

  <!-- Expression Sheet Panel below -->
  <rect x="40" y="630" width="1120" height="140" rx="8" fill="#1e293b"/>
  <text x="60" y="660" fill="#38bdf8" font-family="sans-serif" font-size="14" font-weight="bold">KEY ANIMATION EXPRESSIONS (MOUTH CHARTS &amp; PHONEMES)</text>
  
  <g transform="translate(180, 680)">
    <circle cx="30" cy="35" r="25" fill="#fde047"/>
    <circle cx="22" cy="30" r="3" fill="#090d16"/><circle cx="38" cy="30" r="3" fill="#090d16"/>
    <path d="M22 42 Q30 52 38 42" stroke="#090d16" stroke-width="2.5" fill="none"/>
    <text x="30" y="75" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">HAPPY / IDLE</text>
  </g>

  <g transform="translate(420, 680)">
    <circle cx="30" cy="35" r="25" fill="#fde047"/>
    <ellipse cx="22" cy="28" rx="4" ry="5" fill="#090d16"/><ellipse cx="38" cy="28" rx="4" ry="5" fill="#090d16"/>
    <ellipse cx="30" cy="45" rx="6" ry="8" fill="#e11d48"/>
    <text x="30" y="75" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">SURPRISE / 'O'</text>
  </g>

  <g transform="translate(660, 680)">
    <circle cx="30" cy="35" r="25" fill="#fde047"/>
    <circle cx="22" cy="30" r="3" fill="#090d16"/><circle cx="38" cy="30" r="3" fill="#090d16"/>
    <path d="M20 48 Q30 38 40 48" stroke="#090d16" stroke-width="2.5" fill="none"/>
    <text x="30" y="75" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">CONCERN</text>
  </g>

  <g transform="translate(900, 680)">
    <circle cx="30" cy="35" r="25" fill="#fde047"/>
    <path d="M18 28 L28 32" stroke="#090d16" stroke-width="2.5"/><path d="M42 32 L32 28" stroke="#090d16" stroke-width="2.5"/>
    <rect x="22" y="42" width="16" height="8" rx="2" fill="#090d16"/>
    <text x="30" y="75" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">TALKING / 'E'</text>
  </g>
</svg>
`)}`;

export const STORYBOARD_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <rect width="1200" height="800" fill="#0b0f17"/>
  <!-- Header -->
  <rect x="40" y="30" width="1120" height="50" rx="6" fill="#1e293b"/>
  <text x="60" y="62" fill="#38bdf8" font-family="'Outfit', sans-serif" font-size="18" font-weight="bold">STORYBOARD SEQUENCE: "THE MORNING CATCH" — SCENE 03 (PANELS 01 - 04)</text>
  
  <!-- Panel 1 -->
  <g transform="translate(50, 110)">
    <rect width="520" height="260" rx="6" fill="#182234" stroke="#38bdf8" stroke-width="2"/>
    <!-- Sketch art inside Panel 1: Wide establishing shot -->
    <path d="M20 180 Q250 150 500 190 L500 240 L20 240 Z" fill="#24344d"/>
    <ellipse cx="260" cy="180" rx="60" ry="10" fill="#0284c7" opacity="0.6"/>
    <polygon points="240,175 280,175 270,150 250,150" fill="#38bdf8"/>
    <!-- Camera direction arrows -->
    <path d="M40 50 L100 50 M90 40 L100 50 L90 60" stroke="#f97316" stroke-width="3" fill="none"/>
    <text x="110" y="55" fill="#f97316" font-family="monospace" font-size="12" font-weight="bold">SLOW PAN RIGHT</text>
    <rect x="0" y="266" width="520" height="50" fill="#0f172a" rx="4"/>
    <text x="15" y="286" fill="#f8fafc" font-family="sans-serif" font-size="12" font-weight="bold">PANEL 1.1 | WIDE SHOT (ESTABLISHING)</text>
    <text x="15" y="304" fill="#94a3b8" font-family="sans-serif" font-size="11">Dawn breaks over the Padma river. Gentle mist rises as fishermen prepare their nets.</text>
  </g>

  <!-- Panel 2 -->
  <g transform="translate(630, 110)">
    <rect width="520" height="260" rx="6" fill="#182234" stroke="#334155" stroke-width="1.5"/>
    <!-- Mid shot fisherman pulling net -->
    <ellipse cx="260" cy="120" rx="35" ry="40" fill="#38bdf8"/>
    <path d="M220 160 L300 160 L320 250 L200 250 Z" fill="#2563eb"/>
    <line x1="260" y1="180" x2="380" y2="230" stroke="#f97316" stroke-width="4" stroke-dasharray="4 4"/>
    <text x="350" y="50" fill="#38bdf8" font-family="monospace" font-size="12">ACTION: TUG</text>
    <rect x="0" y="266" width="520" height="50" fill="#0f172a" rx="4"/>
    <text x="15" y="286" fill="#f8fafc" font-family="sans-serif" font-size="12" font-weight="bold">PANEL 1.2 | MEDIUM SHOT</text>
    <text x="15" y="304" fill="#94a3b8" font-family="sans-serif" font-size="11">Uncle Rahim grips the net tightly. A sudden jerk signals an unexpected catch.</text>
  </g>

  <!-- Panel 3 -->
  <g transform="translate(50, 450)">
    <rect width="520" height="260" rx="6" fill="#182234" stroke="#334155" stroke-width="1.5"/>
    <!-- Close-up of eyes wide -->
    <ellipse cx="200" cy="130" rx="30" ry="20" fill="#ffffff"/>
    <circle cx="200" cy="130" r="10" fill="#090d16"/>
    <ellipse cx="320" cy="130" rx="30" ry="20" fill="#ffffff"/>
    <circle cx="320" cy="130" r="10" fill="#090d16"/>
    <path d="M220 190 Q260 215 300 190" stroke="#ffffff" stroke-width="4" fill="none"/>
    <rect x="0" y="266" width="520" height="50" fill="#0f172a" rx="4"/>
    <text x="15" y="286" fill="#f8fafc" font-family="sans-serif" font-size="12" font-weight="bold">PANEL 1.3 | CLOSE UP</text>
    <text x="15" y="304" fill="#94a3b8" font-family="sans-serif" font-size="11">Raju's eyes widen as sunlight catches the golden scales of the mythical Hilsa fish.</text>
  </g>

  <!-- Panel 4 -->
  <g transform="translate(630, 450)">
    <rect width="520" height="260" rx="6" fill="#182234" stroke="#38bdf8" stroke-width="2"/>
    <!-- Dynamic low angle jump -->
    <polygon points="260,80 340,180 180,180" fill="#fb923c"/>
    <path d="M120 220 Q260 140 400 220" stroke="#06b6d4" stroke-width="4" fill="none"/>
    <rect x="0" y="266" width="520" height="50" fill="#0f172a" rx="4"/>
    <text x="15" y="286" fill="#f8fafc" font-family="sans-serif" font-size="12" font-weight="bold">PANEL 1.4 | LOW ANGLE (CLIMAX)</text>
    <text x="15" y="304" fill="#94a3b8" font-family="sans-serif" font-size="11">Cut to wide dynamic angle as the fish leaps into the air with animated water droplets.</text>
  </g>
</svg>
`)}`;

export const HERITAGE_INTERIOR_BG_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <defs>
    <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <linearGradient id="lightBeam" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#fde047" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <!-- Indoor Room Wall -->
  <rect width="1200" height="800" fill="url(#wallGrad)"/>

  <!-- Earthen Floor with Clay Texture -->
  <rect x="0" y="550" width="1200" height="250" fill="#3f1d0b"/>
  <line x1="0" y1="550" x2="1200" y2="550" stroke="#271105" stroke-width="4"/>

  <!-- Traditional Wooden Window with sunlight pouring in -->
  <g transform="translate(180, 120)">
    <rect width="240" height="320" rx="6" fill="#0284c7" stroke="#291206" stroke-width="12"/>
    <line x1="120" y1="0" x2="120" y2="320" stroke="#291206" stroke-width="8"/>
    <line x1="0" y1="160" x2="240" y2="160" stroke="#291206" stroke-width="8"/>
    <!-- Window shutter panels -->
    <rect x="-60" y="0" width="60" height="320" fill="#542407" stroke="#291206" stroke-width="6"/>
    <rect x="240" y="0" width="60" height="320" fill="#542407" stroke="#291206" stroke-width="6"/>
  </g>

  <!-- Volumetric Sunlight Beam -->
  <polygon points="190,130 420,130 920,800 350,800" fill="url(#lightBeam)"/>

  <!-- Clay Oven (Makhir Chula) and Terracotta Pots (Matir Hari) -->
  <g transform="translate(680, 480)">
    <!-- Mud Stove -->
    <ellipse cx="140" cy="140" rx="120" ry="60" fill="#78350f"/>
    <ellipse cx="140" cy="120" rx="90" ry="40" fill="#451a03"/>
    <ellipse cx="140" cy="115" rx="60" ry="25" fill="#1c0b02"/>
    <!-- Stack of Traditional Clay Pots -->
    <g transform="translate(240, -40)">
      <ellipse cx="60" cy="120" rx="55" ry="45" fill="#b45309"/>
      <ellipse cx="60" cy="80" rx="42" ry="34" fill="#d97706"/>
      <ellipse cx="60" cy="48" rx="30" ry="24" fill="#b45309"/>
      <ellipse cx="60" cy="30" rx="20" ry="8" fill="#78350f"/>
    </g>
    <!-- Kerosene Lantern (Hariken) on Wooden Shelf -->
    <g transform="translate(-180, -220)">
      <rect x="-20" y="100" width="160" height="14" fill="#3e1b07" rx="3"/>
      <!-- Hariken Glass & Brass Base -->
      <ellipse cx="60" cy="90" rx="25" ry="12" fill="#ca8a04"/>
      <path d="M45 85 Q35 45 60 25 Q85 45 75 85 Z" fill="#fef08a" opacity="0.8"/>
      <circle cx="60" cy="55" r="8" fill="#ea580c"/>
      <path d="M35 85 Q20 20 60 5 Q100 20 85 85" stroke="#713f12" stroke-width="3" fill="none"/>
    </g>
  </g>
</svg>
`)}`;

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'Shoyen Kaiser Asif',
    title: '2D Animator | Cartoon Designer | Background Artist',
    experience: '2+ Years of Experience',
    training: '2D Animation Training at Twenty One Academy',
    primarySoftware: 'Adobe Animate CC',
    heroHeadline: 'I Bring Stories to Life Through 2D Animation.',
    heroBio:
      "I'm a 2D Animator and Cartoon Designer with 2+ years of experience creating cartoon characters, beautiful backgrounds, and engaging visual stories using Adobe Animate CC.",
    heroSubBio:
      'I turn creative ideas into engaging visual experiences through character design, background art, and 2D animation.',
    heroFeaturedImage: HERO_ARTWORK_SVG,
    avatarImage: AVATAR_SVG,
    logoImage: '',
    logoType: 'icon',
    brandSubtitle: '2D Animator & Cartoon Designer',
    aboutBio1:
      "I'm Shoyen Kaiser Asif, a 2D Animator and Cartoon Designer with over two years of experience in the animation field. I received my 2D animation training at Twenty One Academy and primarily use Adobe Animate CC to create cartoon animations and animation-ready visual assets.",
    aboutBio2:
      'My work includes character design, 2D background illustration, storyboarding, and visual storytelling. I enjoy creating appealing cartoon worlds and helping creative ideas become engaging visual experiences.',
    aboutBio3:
      "I'm always interested in collaborating with clients, creators, and animation teams on exciting new projects.",
    tools: [
      'Adobe Animate CC',
      'Adobe Photoshop',
      'Adobe Premiere Pro',
      'Adobe After Effects',
      'AI-assisted creative tools',
    ],
  },
  socials: {
    email: 'shoyenasif@gmail.com',
    whatsapp: '+880 1XXXXXXXXX [Add WhatsApp]',
    facebook: 'https://facebook.com/shoyenkaiserasif [Add Facebook]',
    linkedin: 'https://linkedin.com/in/shoyenkaiserasif [Add LinkedIn]',
    youtube: 'https://youtube.com/@shoyenasif [Add YouTube Channel]',
    behance: 'https://behance.net/shoyenasif [Add Behance]',
    artstation: 'https://artstation.com/shoyenasif [Add ArtStation]',
  },
  categories: [
    {
      id: 'cat-1',
      name: '2D Animation Videos',
      slug: '2d-animation',
      description: 'Animated short clips, character actions, and scene reels',
    },
    {
      id: 'cat-2',
      name: 'Character Design',
      slug: 'character-design',
      description: 'Original cartoon character turnarounds and expression sheets',
    },
    {
      id: 'cat-3',
      name: 'Background Art',
      slug: 'background-art',
      description: 'Rural Bengali environments, courtyard scenes, and interiors',
    },
    {
      id: 'cat-4',
      name: 'Storyboards & VisDev',
      slug: 'storyboards',
      description: 'Scene planning, story sheets, and pre-production visual development',
    },
    {
      id: 'cat-5',
      name: 'Other Creative Works',
      slug: 'other',
      description: 'Experimental cartoon assets, props, and concept sketches',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Riverside Village: 2D Cartoon Animation Sequence',
      category: '2d-animation',
      shortDescription:
        'A lively 2D animated sequence featuring dynamic character movement along a scenic riverbank, animated frame-by-frame in Adobe Animate CC.',
      coverImage: HERO_ARTWORK_SVG,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Demo video link easily replaceable in admin
      galleryImages: [HERO_ARTWORK_SVG, BENGALI_VILLAGE_BG_SVG],
      softwareUsed: ['Adobe Animate CC', 'Adobe Premiere Pro'],
      productionNotes:
        'Created at 24fps in Adobe Animate CC. Rigged character symbols with squash-and-stretch principles for fluid cartoon movement.',
      featured: true,
      order: 1,
      isDemo: true,
      createdAt: '2026-02-10T10:00:00Z',
    },
    {
      id: 'proj-2',
      title: 'Raju: Bengali Village Boy Character Turnaround',
      category: 'character-design',
      shortDescription:
        'Full 4-angle character turnaround (front, 3/4, side, back) and facial expression phoneme chart for animation production.',
      coverImage: CHARACTER_SHEET_SVG,
      galleryImages: [CHARACTER_SHEET_SVG],
      softwareUsed: ['Adobe Animate CC', 'Adobe Photoshop'],
      productionNotes:
        'Designed as a modular vector symbol puppet ready for tweening and frame-by-frame lip sync.',
      featured: true,
      order: 2,
      isDemo: true,
      createdAt: '2026-02-15T11:00:00Z',
    },
    {
      id: 'proj-3',
      title: 'Monsoon Paddy Fields & Earthen Courtyard',
      category: 'background-art',
      shortDescription:
        'Atmospheric 2D cartoon background illustration depicting a rural Bengali village during twilight with traditional earthen mud houses and river curve.',
      coverImage: BENGALI_VILLAGE_BG_SVG,
      galleryImages: [BENGALI_VILLAGE_BG_SVG, HERITAGE_INTERIOR_BG_SVG],
      softwareUsed: ['Adobe Animate CC', 'Adobe Photoshop'],
      productionNotes:
        'Separated into multiple parallax layers (sky, distant foliage, courtyard foreground) for multiplane camera animation in Adobe Animate.',
      featured: true,
      order: 3,
      isDemo: true,
      createdAt: '2026-03-01T09:30:00Z',
    },
    {
      id: 'proj-4',
      title: 'The Morning Catch: 4-Panel Storyboard Sequence',
      category: 'storyboards',
      shortDescription:
        'Pre-production storyboard panels outlining camera staging, pacing, and visual storytelling for an animated children’s adventure cartoon.',
      coverImage: STORYBOARD_SVG,
      galleryImages: [STORYBOARD_SVG],
      softwareUsed: ['Adobe Photoshop', 'Adobe Animate CC'],
      productionNotes:
        'Detailed camera directions, character poses, and scene pacing timings for the animation team.',
      featured: false,
      order: 4,
      isDemo: true,
      createdAt: '2026-03-12T14:20:00Z',
    },
    {
      id: 'proj-5',
      title: 'Traditional Heritage Kitchen & Interior',
      category: 'background-art',
      shortDescription:
        'Detailed indoor cartoon background illustrating an authentic rural earthen kitchen, clay oven, brass lantern, and sunlight beam.',
      coverImage: HERITAGE_INTERIOR_BG_SVG,
      galleryImages: [HERITAGE_INTERIOR_BG_SVG],
      softwareUsed: ['Adobe Animate CC'],
      productionNotes:
        'Designed with lighting guides and volumetric sunlight rays to enhance emotional atmosphere.',
      featured: false,
      order: 5,
      isDemo: true,
      createdAt: '2026-03-20T16:00:00Z',
    },
  ],
};
