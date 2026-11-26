// Business details and photos. Edit this file to update the site.
// To swap a photo, either overwrite the file in /images (same name) or change the path here.
window.SITE = {
  phone: "+919633157651",
  whatsapp: "919633157651", // confirm this number is on WhatsApp
  instagram: "https://www.instagram.com/olympiacelebration_/",
  tourReel: "https://www.instagram.com/olympiacelebration_/reel/DdtmQo-tGYJ/",
  maps: "https://www.google.com/maps/search/?api=1&query=Olympia+celebration+KSB+Olympia+Pandesara+Surat",

  // If you change prices, also update the fallback text in index.html and "hero_hint" in i18n.js.
  packages: [
    { id: "p1", price: 1299, hours: 1, guests: 10, features: ["decor", "cake", "sound", "projector", "ac"] },
    { id: "p2", price: 1999, hours: 2, guests: 12, features: ["decor", "cake", "sound", "projector", "ac", "led"] }
  ],

  // sign = what the neon says (kept in English, like a real sign). color = glow colour.
  occasions: [
    { id: "birthday", sign: "Happy Birthday", color: "#ff7eb0" },
    { id: "anniversary", sign: "Happy Anniversary", color: "#ff5d6c" },
    { id: "proposal", sign: "Will You Marry Me?", color: "#bd93ff" },
    { id: "surprise", sign: "Surprise!", color: "#53e3c2" },
    { id: "kitty", sign: "Kitty Party", color: "#ffb23e" },
    { id: "other", sign: "Let’s Celebrate", color: "#ffe29a" }
  ],
  addons: ["cake500", "photos", "bubble", "smoke", "ledbox", "projectorHour", "popcorn"],

  // The "lights on" photo spots, as fractions of images/flower-ceiling.webp: [x, y, radius ÷ image width].
  // If you replace that photo, update these and the s1–s5 captions.
  spots: [[0.21, 0.51, 0.46], [0.58, 0.17, 0.74], [0.40, 0.78, 0.62], [0.91, 0.58, 0.46]],

  gallery: [
    { src: "images/floral-arch.webp", key: "g_arch" },
    { src: "images/selfie-wall.webp", key: "g_selfie" },
    { src: "images/birthday-stage.webp", key: "g_stage" },
    { src: "images/umbrella-lounge.webp", key: "g_umbrella" },
    { src: "images/projector.webp", key: "g_projector" },
    { src: "images/movie-night.webp", key: "g_movie" },
    { src: "images/lounge.webp", key: "g_lounge" },
    { src: "images/candle-table.webp", key: "g_candle" },
    { src: "images/niche-corner.webp", key: "g_niche" },
    { src: "images/screen-corner.webp", key: "g_corner" },
    { src: "images/storefront.webp", key: "g_storefront" }
  ]
};
