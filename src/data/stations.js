// The four stations, and the tracks actually sitting in public/radio.
//
// They are named after what is on them. The first set were called NEON
// APPROACH, GOLDEN HOUR, FLIGHT LEVEL and VELVET TAXI — four aviation puns
// with the effort showing, which is the sound of a machine trying to have a
// voice. A cabin names its channels after the music.
//
// Lifted out of ui/radio.js so the cabin and the sky play the same music from
// one list rather than two that drift. Nothing about the data changed.
export const STATIONS = [
  {
    id: "electronic",
    name: "ELECTRONIC",
    shortName: "ELECTRONIC",
    color: "#c06cf0",
    folder: "Electronic",
    tracks: [
      "Daniel Brown - SENSATION",
      "Giorgio Vitté - Ataca",
      "LaFaye - Hidden",
      "NUEQ - Tiramisu",
      "Out of Flux - Sunnydance",
      "Rynn - Heart Beat - Instrumental version",
      "Yarin Primak - DREEEAAAMS",
      "ZISO - Gonna Freak",
      "Ziskoe - SIREN - Ziskoe Remix",
    ],
  },
  {
    id: "indie",
    name: "INDIE",
    shortName: "INDIE",
    color: "#e8a44c",
    folder: "Indie",
    tracks: [
      "Ben Juliet - Still Bloom",
      "Danger Roberts - Hard Reset",
      "Emma-Rose - Clouds",
      "IamDayLight - Hold On",
      "Lia Dsau - Grow",
      "Neska Rose - GROW",
      "Neska Rose - Rolling Through Da Night",
      "SOURWAH - Mandalas",
      "Southern Call - Smoke Show",
      "Tal Tamari - Love Her So - Instrumental version",
      "Tiko Tiko - Baby Lets Go - Stripped Version",
      "messwave - maybe its over",
    ],
  },
  {
    id: "relax",
    name: "AMBIENT",
    shortName: "AMBIENT",
    color: "#5ab8e8",
    folder: "Relax_Ambiance",
    tracks: [
      "Assaf Ayalon - Locked in Silence",
      "Aves - Sunshine",
      "Ian Locke - Once Interlude",
      "MAIKY - Above the Clouds",
      "Master Minded - Strings of Soul",
    ],
  },
  {
    id: "soul",
    name: "SOUL",
    shortName: "SOUL",
    color: "#e85a8a",
    folder: "Soul_R&B",
    tracks: [
      "Aves - Summer Breakup Song",
      "Aves - Sunshine",
      "Aves - Velvet",
      "Honey G - More than Words",
      "Michael Shynes - Extra Extra - Instrumental version",
      "NOA - Made to Love You",
      "Skipp Whitman - Lush - Instrumental version",
      "Skipp Whitman - Vegas - Instrumental version",
      "Ziv Moran - Dance",
    ],
  },
];
