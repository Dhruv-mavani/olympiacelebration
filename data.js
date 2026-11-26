// Business details and photos. Edit this file to update the site.
// To swap a photo, either overwrite the file in /images (same name) or change the path here.
window.SITE = {
  phone: "+919633157651",
  whatsapp: "919633157651", // confirm this number is on WhatsApp
  instagram: "https://www.instagram.com/olympiacelebration_/",
  tourReel: "https://www.instagram.com/olympiacelebration_/reel/DdtmQo-tGYJ/",
  maps: "https://www.google.com/maps/search/?api=1&query=Olympia+celebration+KSB+Olympia+Pandesara+Surat",

  // Opens the Reviews tab of the Google Maps listing.
  reviews: "https://www.google.com/maps/place/Olympia+celebration/@21.1500193,72.8222372,17z/data=!4m8!3m7!1s0x3be05105df74c5eb:0x20e22550361e4ede!8m2!3d21.1500193!4d72.8222372!9m1!1b1!16s%2Fg%2F11ntfryf_v",

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

  // The neon room tour, drawn over images/flower-ceiling.webp. All numbers are pixels on that 1036 × 1844 photo.
  // Each stop (captions s1–s4): cam = [centre x, centre y, visible width], "to" pans there while drawing,
  // paths = the shapes the neon traces, in order (SVG path syntax). A new photo needs new shapes.
  tour: [
    { cam: [270, 900, 640], paths: [
      "M2 668 C40 622 100 598 165 600 C322 610 434 745 436 905 L436 1172",
      "M0 735 C30 672 110 646 205 652 C312 664 390 735 402 826 Q368 806 340 822 Q306 796 270 810 Q238 788 205 800 Q165 778 130 788 Q95 762 62 772 Q34 750 0 756",
      "M217 806 L211 1062",
      "M0 1115 Q45 1062 100 1078 Q130 1042 190 1058 Q245 1040 282 1070 Q345 1062 360 1095 Q410 1100 412 1126 Q360 1175 280 1180 Q180 1215 90 1200 Q30 1205 0 1182",
      "M537 862 L537 755 C538 710 579 710 581 755 L581 862 Z",
      "M537 1143 L537 1035 C538 988 580 988 582 1035 L582 1143 Z"
    ] },
    { cam: [340, 370, 680], to: [700, 530, 680], paths: [
      "M170 12 C242 12 296 70 296 142 C296 214 242 272 170 272 C98 272 44 214 44 142 C44 70 98 12 170 12",
      "M0 500 Q60 470 95 520 Q150 480 205 575 Q262 520 300 600 Q345 560 405 615 Q470 585 520 665 Q575 640 625 735 Q690 665 735 750 Q790 690 842 718",
      "M806 678 C797 642 880 608 955 606 C1018 604 1040 626 1030 644 C1018 678 940 696 884 696 C838 698 812 692 806 678",
      "M843 628 C830 600 882 562 940 551 C990 542 1012 558 996 578 C975 606 925 626 883 632 C860 638 848 636 843 628"
    ] },
    { cam: [410, 1480, 780], paths: [
      "M0 1262 C120 1236 320 1198 495 1170 C510 1190 540 1210 590 1228 C640 1245 676 1255 674 1290 L668 1378 C662 1395 650 1400 640 1404",
      "M0 1482 L165 1425 L365 1352 L497 1304 C560 1312 640 1340 668 1372",
      "M312 1612 C306 1592 320 1578 345 1564 L598 1428 C628 1412 664 1410 695 1420 L770 1446 C798 1458 797 1484 776 1500 L505 1688 C478 1706 446 1712 415 1700 L335 1652 C318 1642 310 1628 312 1612",
      "M313 1620 L310 1735 C330 1790 400 1830 450 1840 L495 1822 L788 1608 L791 1478",
      "M690 1350 C672 1338 681 1318 691 1302 C701 1318 710 1338 690 1350",
      "M420 1492 C400 1478 410 1458 421 1440 C432 1458 440 1478 420 1492"
    ] },
    { cam: [790, 1130, 600], paths: [
      "M912 1262 C868 1215 842 1175 846 1125 C826 1075 835 1030 858 1000 C852 955 885 938 905 925 C910 885 950 880 965 878 C985 848 1015 850 1036 846",
      "M1036 1128 L945 1130 C925 1134 920 1142 924 1148 L924 1392 C945 1420 990 1432 1036 1430",
      "M948 1124 L948 1072 M948 1068 C938 1060 944 1050 948 1042 C953 1050 959 1060 948 1068"
    ] }
  ],

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
