// The four stations, and the tracks actually sitting in public/radio.
//
// A record has a title and a genre, and they are not the same word. The first
// set of names were four aviation puns with the effort showing; the second set
// were the genres themselves, which is honest but is a label on a shelf rather
// than a name on a sleeve. So each station has both now: a title for the cover
// and a genre underneath it, which is how a record has always been described.
//
// `lengths` is every track's real duration in seconds, measured off the files
// in public/radio with ffprobe rather than estimated. A player that cannot say
// how long a track is has not been told, and this one has.
//
// Lifted out of ui/radio.js so the cabin and the sky play the same music from
// one list rather than two that drift. Nothing about the data changed.
export const STATIONS = [
  {
    id: "electronic",
    name: "Night Shift",
    shortName: "NIGHT SHIFT",
    genre: "Electronic",
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
    /** Seconds, measured from the files with ffprobe. */
    lengths: [163, 123, 150, 148, 121, 173, 167, 111, 155],
  },
  {
    id: "indie",
    name: "First Light",
    shortName: "FIRST LIGHT",
    genre: "Indie",
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
    /** Seconds, measured from the files with ffprobe. */
    lengths: [175, 141, 169, 218, 227, 136, 176, 152, 193, 194, 178, 155],
  },
  {
    id: "relax",
    name: "Low Cloud",
    shortName: "LOW CLOUD",
    genre: "Ambient",
    color: "#5ab8e8",
    folder: "Relax_Ambiance",
    tracks: [
      "Assaf Ayalon - Locked in Silence",
      "Aves - Sunshine",
      "Ian Locke - Once Interlude",
      "MAIKY - Above the Clouds",
      "Master Minded - Strings of Soul",
    ],
    /** Seconds, measured from the files with ffprobe. */
    lengths: [343, 157, 81, 208, 205],
  },
  {
    id: "soul",
    name: "After Hours",
    shortName: "AFTER HOURS",
    genre: "Soul & R&B",
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
    /** Seconds, measured from the files with ffprobe. */
    lengths: [189, 157, 154, 183, 220, 135, 202, 85, 171],
  },
];
