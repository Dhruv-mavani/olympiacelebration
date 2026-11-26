// Business details and photos. Edit this file to update the site.
// To swap a photo, either overwrite the file in /images (same name) or change the path here.
window.SITE = {
  phoneDisplay: "+91 96331 57651",
  phone: "+919633157651",
  whatsapp: "919633157651", // confirm this number is on WhatsApp
  instagram: "https://www.instagram.com/olympiacelebration_/",
  tourReel: "https://www.instagram.com/olympiacelebration_/reel/DdtmQo-tGYJ/",
  maps: "https://www.google.com/maps/search/?api=1&query=Olympia+celebration+KSB+Olympia+Pandesara+Surat",
  mapsEmbed: "https://maps.google.com/maps?q=21.1500193,72.8222372&z=17&output=embed",

  packages: [
    { id: "p1", price: 1299, hours: 1, guests: 10, features: ["decor", "sound", "ac", "cake", "projector"] },
    { id: "p2", price: 1999, hours: 2, guests: 12, features: ["decor", "sound", "ac", "cake", "led", "projector"] }
  ],

  occasions: ["birthday", "anniversary", "proposal", "surprise", "kitty", "other"],
  addons: ["cake500", "photos", "bubble", "smoke", "ledbox", "projectorHour", "popcorn"],

  // cat: room | decor | screen | outside
  gallery: [
    { src: "images/storefront.webp", cat: "outside", key: "g_storefront" },
    { src: "images/flower-ceiling.webp", cat: "room", key: "g_ceiling" },
    { src: "images/birthday-stage.webp", cat: "decor", key: "g_stage" },
    { src: "images/lounge.webp", cat: "room", key: "g_lounge" },
    { src: "images/floral-arch.webp", cat: "decor", key: "g_arch" },
    { src: "images/projector.webp", cat: "screen", key: "g_projector" },
    { src: "images/selfie-wall.webp", cat: "decor", key: "g_selfie" },
    { src: "images/umbrella-lounge.webp", cat: "room", key: "g_umbrella" },
    { src: "images/movie-night.webp", cat: "screen", key: "g_movie" },
    { src: "images/niche-corner.webp", cat: "room", key: "g_niche" },
    { src: "images/candle-table.webp", cat: "decor", key: "g_candle" },
    { src: "images/screen-corner.webp", cat: "screen", key: "g_corner" }
  ]
};
