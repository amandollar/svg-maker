export type RegressionPrompt = {
  id: string;
  category: "icon" | "style" | "behavior";
  prompt: string;
};

export const regressionPromptSuite: RegressionPrompt[] = [
  {
    id: "heart-soft",
    category: "style",
    prompt:
      "A soft dreamy pink heart centered on a pale peach square background, 2.8 seconds, seamless loop, gentle glow, romantic pulse animation",
  },
  {
    id: "heart-bold",
    category: "style",
    prompt:
      "A bold red heart centered on a cream square background, 2.4 seconds, seamless loop, high-contrast social media like animation",
  },
  {
    id: "checkmark-clean",
    category: "icon",
    prompt:
      "A green success checkmark centered on a very light mint landscape background, 1.8 seconds, play once, clean SaaS completion animation with draw reveal and finish bounce",
  },
  {
    id: "checkmark-bold",
    category: "style",
    prompt:
      "A bold high-contrast blue verification checkmark centered on a white landscape background, 1.8 seconds, play once, fintech approval animation with finish bounce",
  },
  {
    id: "bell-neon",
    category: "style",
    prompt:
      "A neon gold notification bell centered on a deep navy vertical background, 2 seconds, seamless loop, glowing swing animation",
  },
  {
    id: "bell-premium",
    category: "style",
    prompt:
      "A premium gold notification bell centered on a dark navy vertical background, 2 seconds, seamless loop, elegant ringing motion",
  },
  {
    id: "arrow-cta",
    category: "icon",
    prompt:
      "A white upward arrow centered on a dark vertical background, 1.6 seconds, seamless loop, swipe up CTA animation",
  },
  {
    id: "star-burst",
    category: "behavior",
    prompt:
      "A premium gold star centered on a dark landscape background, 2.2 seconds, play once, rating reveal animation with burst sparkle",
  },
  {
    id: "pin-drop",
    category: "behavior",
    prompt:
      "A red location pin centered on a light map-style landscape background, 2.5 seconds, play once, energetic pin drop animation with landing ripple",
  },
  {
    id: "play-reveal",
    category: "icon",
    prompt:
      "A white play button centered on a dark landscape background, 2 seconds, play once, video intro reveal animation",
  },
  {
    id: "wifi-build",
    category: "icon",
    prompt:
      "A white wifi signal centered on a dark square background, 2.2 seconds, seamless loop, connectivity building animation",
  },
  {
    id: "lock-secure",
    category: "icon",
    prompt:
      "A white lock icon centered on a deep navy square background, 2 seconds, play once, security confirmation animation",
  },
  {
    id: "cart-add",
    category: "icon",
    prompt:
      "A white shopping cart icon centered on a dark landscape background, 2.3 seconds, play once, add to cart confirmation animation",
  },
  {
    id: "search-load",
    category: "icon",
    prompt:
      "A white search icon centered on a dark square background, 2.1 seconds, seamless loop, query loading animation",
  },
  {
    id: "coffee-steam",
    category: "icon",
    prompt:
      "A white coffee cup icon centered on a dark square background, 2.4 seconds, seamless loop, steam rising animation",
  },
  {
    id: "home-reveal",
    category: "icon",
    prompt:
      "A white home icon centered on a dark landscape background, 2 seconds, play once, real estate reveal animation",
  },
  {
    id: "battery-charge",
    category: "icon",
    prompt:
      "A white battery icon with green charge accent centered on a dark landscape background, 2.2 seconds, seamless loop, charging animation",
  },
  {
    id: "avatar-profile",
    category: "icon",
    prompt:
      "A white user avatar icon centered on a deep navy square background, 2 seconds, play once, profile reveal animation",
  },
  {
    id: "gear-settings",
    category: "icon",
    prompt:
      "A white settings gear icon centered on a dark square background, 2.3 seconds, seamless loop, processing animation",
  },
  {
    id: "plane-send",
    category: "icon",
    prompt:
      "A white paper plane icon centered on a dark landscape background, 2.1 seconds, play once, message sent animation",
  },
  {
    id: "mic-live",
    category: "icon",
    prompt:
      "A white microphone icon centered on a dark square background, 2.2 seconds, seamless loop, recording live animation",
  },
  {
    id: "download-save",
    category: "icon",
    prompt:
      "A white download icon centered on a dark landscape background, 2.2 seconds, play once, file saving animation",
  },
  {
    id: "calendar-date",
    category: "icon",
    prompt:
      "A white calendar icon centered on a deep navy square background, 2.1 seconds, play once, event countdown animation",
  },
  {
    id: "barchart-kpi",
    category: "icon",
    prompt:
      "A mini bar chart KPI icon centered on a dark navy landscape background, 3.5 seconds, play once, business dashboard animation",
  },
  {
    id: "trend-growth",
    category: "icon",
    prompt:
      "A green trending up line icon centered on a dark square background, 2.8 seconds, play once, stock growth animation",
  },
  {
    id: "wallet-open",
    category: "icon",
    prompt:
      "A white wallet icon centered on a deep navy square background, 3 seconds, play once, payment cashflow animation",
  },
  {
    id: "trophy-win",
    category: "icon",
    prompt:
      "A gold trophy icon centered on a dark landscape background, 3 seconds, play once, winner achievement animation",
  },
  {
    id: "pie-share",
    category: "icon",
    prompt:
      "A pie chart market share icon centered on a dark square background, 3 seconds, play once, business report animation",
  },
  {
    id: "phone-launch",
    category: "icon",
    prompt:
      "A white smartphone icon centered on a deep navy vertical background, 3 seconds, play once, app launch animation",
  },
  {
    id: "headphones-music",
    category: "icon",
    prompt:
      "A white headphones icon centered on a dark square background, 3 seconds, seamless loop, music podcast animation",
  },
  {
    id: "laptop-productivity",
    category: "icon",
    prompt:
      "A white laptop icon centered on a dark landscape background, 3 seconds, play once, productivity animation",
  },
  {
    id: "camera-photo",
    category: "icon",
    prompt:
      "A white camera icon centered on a dark square background, 3 seconds, play once, photography brand animation",
  },
  {
    id: "burger-food",
    category: "icon",
    prompt:
      "A burger food icon centered on a warm cream square background, 3.5 seconds, play once, restaurant delivery animation",
  },
  {
    id: "rocket-launch",
    category: "behavior",
    prompt:
      "Rocket launch on background #0B1120, 1920x1080 (16:9) landscape, 4.5 seconds, play once, stars fade in then rocket launches upward with flame flicker and particles, startup launch day animation",
  },
  {
    id: "plant-growing",
    category: "behavior",
    prompt:
      "Growing plant on background #ECFDF5, 1920x1080 (16:9) landscape, 5 seconds, play once, terracotta pot appears, roots draw, stem grows upward, leaves unfurl left and right, soil particles float, sun fades in with rays, gentle sway",
  },
  {
    id: "delivery-truck",
    category: "behavior",
    prompt:
      "Delivery truck on background #EFF6FF, 1920x1080 (16:9) landscape, 4 seconds, play once, truck drives in from left with speed lines and rotating wheels, road line scrolls, decelerates and brake rocks, lights flash twice, cargo door opens slightly, exhaust puff at the end",
  },
  {
    id: "doctor-medical",
    category: "behavior",
    prompt:
      "Doctor medical scene on background #F0FDF4, 1920x1080 (16:9) landscape, 4 seconds, play once, friendly doctor with clipboard and stethoscope, coat fills in, stethoscope draws, clipboard slides in and lines draw, pocket cross pulses, subtle nod",
  },
  {
    id: "solar-energy",
    category: "behavior",
    prompt:
      "Solar panel + sun clean energy scene on background #EFF6FF, 1920x1080 (16:9) landscape, 5 seconds, seamless loop, ground and house appear, solar panel reveals, cells fill in, sun fades in with rays, energy bolt flows from panel to house",
  },
  {
    id: "notification-stack",
    category: "behavior",
    prompt:
      "Notification stack on background #0F172A, 1080x1920 (9:16) vertical, 4 seconds, play once, four notification cards stacked, each slides in from the right with staggered icon/text/badge, accent bars pulse, badge numbers count up, first card shakes then highlights, subtle accent glow at the end",
  },
  {
    id: "globe-network",
    category: "behavior",
    prompt:
      "Globe network on background #030712, 1920x1080 (16:9) landscape, 5 seconds, seamless loop, stylized dark globe with blue grid lines, continents fade in, orbit rings draw, pins pop with ripples, connection arcs animate with dashed flow, subtle edge glow pulse",
  },
  {
    id: "desk-work",
    category: "behavior",
    prompt:
      "Person at desk productive work scene on background #FEF9EE, 1920x1080 (16:9) landscape, 5 seconds, seamless loop, warm cozy workspace: desk and chair spring in, person pops in, laptop/mug/plant stagger in, lamp appears and light cone extends, sticky notes drop, clock hands appear, then idle loop with head nod, steam rising, cursor blink, minute hand subtle advance",
  },
  {
    id: "rupee-badge",
    category: "icon",
    prompt:
      "Rupee symbol in a gold circular frame on background #FFFBEB, 1080x1080 (1:1) square, 3 seconds, play once: outer circle draws clockwise, inner dashed ring fades in, 4 diamond ornaments pop N/E/S/W, rupee strokes draw in sequence, then a confidence pulse and a diagonal shimmer sweep, subtle circle rotate at the end",
  },
  {
    id: "certificate-scroll",
    category: "behavior",
    prompt:
      "Certificate of completion on background #1C1917, 1920x1080 (16:9) landscape, 4.5 seconds, play once: certificate unfurls from a thin horizontal line, cream body fades in, outer gold border draws, inner decorative border draws, corner flourishes pop in, banner slides down and title appears, seal pops in and ring draws, star emblem appears, red ribbon strips slide in, three text lines appear with stagger, diagonal shimmer sweep across the certificate, seal pulses with warm glow, subtle breathe hold at the end",
  },
];
