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
/**
 * What kind of film this is, which is also how the shelf is divided.
 *
 * These are not genres — an industrial short has no genre — they are what the
 * film is *about*, and four of the five are the subject of this whole work
 * seen from the middle of the last century: flying, being watched, the bomb,
 * and the future that was being sold at the same time.
 */
export type Subject = "aviation" | "radio" | "atomic" | "tomorrow" | "amateur";

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
  subject: Subject;
  synopsis: { en: string; zh: string };
};

export const FILMS: Film[] = [
  {
    id: "0317_Jet_Mainliner_Flight_803_18_21_09_20",
    subject: "aviation",
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
    subject: "radio",
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
    subject: "aviation",
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
    subject: "aviation",
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
    subject: "atomic",
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
    subject: "atomic",
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
    subject: "tomorrow",
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
    subject: "tomorrow",
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
  {
    // The film that is this work's own subject, filmed in 1956: a radar screen
    // thrown over a continent, sold to the public by the company that built
    // the computers for it.
    id: "0772_On_Guard_The_Story_of_SAGE_18_48_05_00",
    subject: "radio",
    file: "0772_On_Guard_The_Story_of_SAGE_18_48_05_00.mp4",
    title: { en: "On Guard! The Story of SAGE", zh: "警戒！SAGE 的故事" },
    year: "1956",
    creator: "IBM Corporation, Military Products Division",
    seconds: 738,
    megabytes: 77,
    synopsis: {
      en: "On Guard! introduces the SAGE (Semi-Automatic Ground Environment), a heavily computerized early warning system designed to guard against enemy aircraft. For its time, this was novel technology — room-sized computers and giant \"Displayscopes\" — and the film seeks to humanize it to a technologically unsophisticated public.",
      zh: "《警戒！》介绍 SAGE（半自动地面防空系统）——一套高度计算机化的早期预警系统，用来防备敌机。在当时这是全新的技术：房间大小的计算机和巨型「显示屏」，而影片想把它讲得让不懂技术的公众觉得亲切。",
    },
  },
  {
    id: "0575_DEW_Line_Story_20_01_02_00",
    subject: "radio",
    file: "0575_DEW_Line_Story_20_01_02_00.mp4",
    title: { en: "DEW Line Story", zh: "远程预警线的故事" },
    year: "1958",
    creator: "Audio Productions",
    seconds: 1643,
    megabytes: 171,
    synopsis: {
      en: "Why and how the Distant Early Warning (DEW Line) system of attack detection was devised. How radar principles and specially devised techniques were used by the Bell System. The logistics and construction in Arctic wastelands which are now open to further development.",
      zh: "远程预警线（DEW Line）这套袭击探测系统为何以及如何被设计出来。贝尔系统如何运用雷达原理和专门研发的技术。以及在北极荒原上的后勤与施工——那片地方如今已可进一步开发。",
    },
  },
  {
    id: "0220_Sentinel_in_the_Sky_00_36_15_00",
    subject: "radio",
    file: "0220_Sentinel_in_the_Sky_00_36_15_00.mp4",
    title: { en: "Sentinel in the Sky", zh: "空中哨兵" },
    year: "1955",
    creator: "Strauss (Henry) and Company, Inc.",
    seconds: 888,
    megabytes: 92,
    synopsis: {
      en: "Peacetime airborne radar installations perform several most useful functions. They are an aid to navigation, they provide early warning against storms, they detect nearby terrain, and they are capable of alerting the pilot to nearby aircraft. Many commercial airlines are now installing or plan to install this indispensable equipment.",
      zh: "和平时期的机载雷达有几项极为有用的功能：辅助导航、提前预警风暴、探测附近地形，并能提示飞行员附近有其他飞机。许多商业航空公司正在装或计划装这套不可或缺的设备。",
    },
  },
  {
    id: "TargetIn1945",
    subject: "radio",
    file: "TargetIn1945_512kb.mp4",
    title: { en: "Target Invisible", zh: "看不见的目标" },
    // The item carries no `year` field; this is its own `date`, "ca. 1945".
    year: "1945",
    creator: "U.S. Army Air Forces",
    seconds: 504,
    megabytes: 36,
    synopsis: {
      en: "Illustrates the use of radar on a dramatized mission over Japan.",
      zh: "以一次经过戏剧化处理的对日任务，说明雷达的用法。",
    },
  },
  {
    // Two girls fly TWA across the country. The archive holds a shot list for
    // it and no description, so this shelf says so rather than writing one.
    id: "0787_Skyline_New_York_01_00_56_00",
    subject: "aviation",
    file: "0787_Skyline_New_York_01_00_56_00_3mb.mp4",
    title: { en: "Skyline New York", zh: "纽约天际线" },
    year: "1956",
    creator: "Dudley Pictures Corporation",
    seconds: 1554,
    megabytes: 162,
    synopsis: { en: "", zh: "" },
  },
  {
    id: "6124_Wonderful_Jet_World_of_Pan_American_The_01_31_42_201",
    subject: "aviation",
    file: "6124_Wonderful_Jet_World_of_Pan_American_The_01_31_42_201.mp4",
    title: {
      en: "The Wonderful Jet World of Pan American",
      zh: "泛美的奇妙喷气世界",
    },
    year: "1959",
    creator: "Coleman Productions (New York City)",
    seconds: 1458,
    megabytes: 151,
    // The archive's entry for this one is an unfinished shot list that opens
    // "Large number of shots to be logged." That is not a description, so it
    // does not get presented as one.
    synopsis: { en: "", zh: "" },
  },
  {
    id: "PlaneTal1965",
    subject: "aviation",
    file: "PlaneTal1965_512kb.mp4",
    title: { en: "Plane Talk", zh: "飞机通话" },
    // No `year` field on the item; its `date` is 1965.
    year: "1965",
    creator: "Fairbanks (Jerry) Productions",
    seconds: 1288,
    megabytes: 91,
    synopsis: {
      en: "Shows the varied forms of communications used by commercial air carriers in confirming reservations, preparing aircraft for flight, monitoring aircraft in flight and maintaining air-to-ground contact. With good imagery of passenger airline operations at the moment when air travel was just becoming a mass phenomenon. Director: Leo Rosencrans.",
      zh: "展示商业航空公司在确认订座、备机、监视空中航班和保持空地联络时使用的各种通信方式。片中有大量航空客运作业的画面，正好拍在航空旅行刚刚成为大众现象的那一刻。导演：Leo Rosencrans。",
    },
  },
  {
    id: "MrBellPa1947",
    subject: "radio",
    file: "MrBellPa1947_512kb.mp4",
    title: { en: "Mr. Bell (Part I)", zh: "贝尔先生（上）" },
    // No `year` field on the item; its `date` is 1947.
    year: "1947",
    creator: "RKO-Pathe, Inc.",
    seconds: 828,
    megabytes: 58,
    synopsis: {
      en: "Dramatization of the invention of the telephone.",
      zh: "电话发明过程的戏剧化重演。",
    },
  },
  {
    // Somebody's own film of their own flight. The archive gives it no title
    // of its own — the brackets are the archive's — no creator, and a date
    // that is a range rather than a year.
    id: "0059_HM_Air_Travel_San_Francisco_Salt_Lake_City_New_York_City_11_00_52_17",
    subject: "amateur",
    file: "0059_HM_Air_Travel_San_Francisco_Salt_Lake_City_New_York_City_11_00_52_17.mp4",
    title: {
      en: "[Home Movies: Air Travel, San Francisco, Salt Lake City, New York City]",
      zh: "［家庭电影：航空旅行、旧金山、盐湖城、纽约］",
    },
    year: "1940s",
    creator: "",
    seconds: 565,
    megabytes: 59,
    synopsis: { en: "", zh: "" },
  },
  {
    // A warning network, filmed: the Weather Bureau telephone chain, a radar
    // screen drawn on in pencil, and a town going into its cellars.
    id: "0411_Tornado_06_00_36_00",
    subject: "radio",
    file: "0411_Tornado_06_00_36_00.mp4",
    title: { en: "Tornado", zh: "龙卷风" },
    year: "1955",
    creator: "Calvin Productions",
    seconds: 873,
    megabytes: 90,
    synopsis: { en: "", zh: "" },
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
