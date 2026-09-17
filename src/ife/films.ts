import type { Lang } from "./i18n";

/**
 * What this aircraft carries, and why it carries this.
 *
 * Every title here is a real film in the public domain, held by the Prelinger
 * Archives: amateur home movies and mid-century industrial and educational
 * shorts — what Rick Prelinger calls ephemeral film, made to sell something or
 * teach something and then thrown away. Nothing on this shelf is invented, and
 * nothing on it is a placeholder standing in for a licence we do not have.
 *
 * It is also the right shelf for this work rather than a convenient one. A
 * piece about who gets recorded from the sky and who does not should carry the
 * films nobody was supposed to keep — and two of them are the subject itself,
 * seen from 1956: a radar screen thrown over a continent, and an airline
 * selling its first jets.
 *
 * The metadata is the archive's own, read from its API and written down here
 * rather than fetched at runtime: a cabin knows its own manifest before
 * pushback, and a screen that has to ask the internet what it is carrying is
 * not a cabin.
 */
export type Film = {
  /** Internet Archive item identifier. */
  id: string;
  /** The MP4 derivative inside that item. */
  file: string;
  title: { en: string; zh: string };
  year: string;
  creator: string;
  seconds: number;
  /** Size of the file this seat would have to hold. */
  megabytes: number;
  synopsis: { en: string; zh: string };
};

export const FILMS: Film[] = [
  {
    id: "0317_Jet_Mainliner_Flight_803_18_21_09_20",
    file: "0317_Jet_Mainliner_Flight_803_18_21_09_20.mp4",
    title: { en: "Jet Mainliner Flight 803", zh: "喷气客机 803 航班" },
    year: "1956",
    creator: "Cate & McGlone",
    seconds: 1478,
    megabytes: 154,
    synopsis: {
      en: "",
      zh: "",
    },
  },
  {
    id: "Sciencei1956_6",
    file: "50504B_512kb.mp4",
    title: { en: "Science in Action: Radar Defense Screen (Part II)", zh: "行动中的科学：雷达防空网" },
    year: "1956",
    creator: "California Academy of Sciences",
    seconds: 683,
    megabytes: 48,
    synopsis: {
      en: "Kinescope of Fifties science TV program featuring discussions and demonstrations. In this episode, host Earl Herald interviews Brigadeer General James W. Andrew of the U.S. Air Force, about the uses and technology of radar as an air defense tool.",
      zh: "五十年代科学电视节目的电幕录像，有讨论也有演示。本集主持人 Earl Herald 访问美国空军准将 James W. Andrew，谈雷达作为防空手段的用途与技术。",
    },
  },
  {
    id: "AirportT1948",
    file: "AirportT1948_512kb.mp4",
    title: { en: "The Airport", zh: "机场" },
    year: "1948",
    creator: "Encyclopaedia Britannica Films",
    seconds: 631,
    megabytes: 45,
    synopsis: {
      en: "Functions of the modern airport, showing all aspects of airline passenger service.",
      zh: "现代机场的运作，展示航空旅客服务的各个环节。",
    },
  },
  {
    id: "AirportA1954",
    file: "AirportA1954_512kb.mp4",
    title: { en: "Airport America", zh: "美国机场" },
    year: "1954",
    creator: "Film Originals",
    seconds: 839,
    megabytes: 60,
    synopsis: {
      en: "Advocates increased airport construction, especially in rural America. Describes the centrality of general aviation to the U.S. economy. With many images of American townscapes, especially in rural areas; small-town airports; and businesspeople using small airplanes to expedite their activities. Tec",
      zh: "主张多建机场，尤其是在美国乡村地区。讲通用航空对美国经济的中心地位。片中有大量美国小镇风貌、乡村机场，以及商务人士用小飞机赶行程的画面。",
    },
  },
  {
    id: "0771_Duck_and_Cover_12_33_20_12",
    file: "0771_Duck_and_Cover_12_33_20_12.mp4",
    title: { en: "Duck and Cover", zh: "卧倒与掩护" },
    year: "1951",
    creator: "Archer Productions, Inc.",
    seconds: 556,
    megabytes: 58,
    synopsis: {
      en: "This film, a combination of animated cartoon and live action, shows young children what to do in case of an atomic attack. The film opens with \"Bert the Turtle\" wobbling down the street and singing a song, \"Duck and Cover.\" When there is a bright flash, Bert immediately ducks into his shell covering",
      zh: "这部动画与真人结合的影片，教孩子在原子弹袭击时该怎么做。开场是乌龟 Bert 一边摇摇晃晃走在街上一边唱《卧倒与掩护》。强光一闪，Bert 立刻缩进壳里。",
    },
  },
  {
    id: "isforAto1953",
    file: "isforAto1953_512kb.mp4",
    title: { en: "A is for Atom", zh: "A 代表原子" },
    year: "1953",
    creator: "Sutherland (John) Productions",
    seconds: 883,
    megabytes: 63,
    synopsis: {
      en: "Animated classic presenting what an atom is, how energy is released from certain kinds of atoms, the peacetime uses of atomic energy and the byproducts of nuclear fission.",
      zh: "动画经典：什么是原子，能量如何从某些原子中释放，原子能的和平用途，以及核裂变的副产物。",
    },
  },
  {
    id: "Century21964",
    file: "Century21964_512kb.mp4",
    title: { en: "Century 21 Calling", zh: "21 世纪来电" },
    year: "1964",
    creator: "Fairbanks (Jerry) Productions",
    seconds: 837,
    megabytes: 59,
    synopsis: {
      en: "Romp through the futuristic landscape of the Seattle World's Fair, centered in the Bell System pavilion.",
      zh: "在西雅图世界博览会的未来景观里游荡一圈，中心是贝尔系统展馆。",
    },
  },
  {
    id: "2306_Design_for_Dreaming_21_26_14_00",
    file: "2306_Design_for_Dreaming_21_26_14_00.mp4",
    title: { en: "Design for Dreaming", zh: "为梦想设计" },
    year: "1956",
    creator: "MPO Productions",
    seconds: 562,
    megabytes: 58,
    synopsis: {
      en: "Produced to bring the 1956 G.M. Motorama to audiences unable to see it in major cities, this fim introduces the new 1956 cars, Frigidaire's \"Kitchen of Tomorrow,\" and the electronic highways of the future. G.M.'s \"dream cars\" of the 1950s, including the Oldsmobile Golden Rocket and the turbine-power",
      zh: "为让无法亲临大城市的观众看到 1956 年通用汽车 Motorama 车展而拍摄，介绍 1956 年的新车、Frigidaire 的「明日厨房」和未来的电子高速公路，以及通用五十年代的「梦想之车」，包括 Oldsmobile Golden Rocket 和涡轮动力车型。",
    },
  },
];

/**
 * The stream. Note what this is not: a real seat-back system plays from a
 * server in the ceiling, loaded on the ground. This one reaches the network,
 * which is a bench affordance and not how the cabin will work — the cabin will
 * carry the files. The manifest above is already written as if it did.
 */
export const streamUrl = (f: Film) =>
  `https://archive.org/download/${f.id}/${f.file}`;

/** The archive's own still for the item. */
export const stillUrl = (f: Film) =>
  `https://archive.org/services/img/${f.id}`;

export const itemUrl = (f: Film) => `https://archive.org/details/${f.id}`;

/**
 * The archive's own description, or an honest blank. One item on this shelf
 * has none, and the first draft of this file filled the hole with a sentence
 * about an airline the archive never names.
 */
export function synopsis(f: Film, lang: Lang): string | null {
  const t = lang === "zh" ? f.synopsis.zh : f.synopsis.en;
  return t.trim() ? t : null;
}

export function runtime(f: Film, lang: Lang) {
  const m = Math.round(f.seconds / 60);
  return lang === "zh" ? `${m} 分钟` : `${m} min`;
}
