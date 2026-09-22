import type { Lang, Named } from "./i18n";

/**
 * What this aircraft carries, and why it carries this.
 *
 * Every title here is a real film held by the Prelinger Archives, and every
 * one of them is free to show: most are in the public domain, and four are
 * Rick Prelinger's own later films under a Creative Commons licence, which
 * is named on the card the way the licence asks. Nothing on this shelf is
 * invented, and nothing on it is a placeholder standing in for a licence we
 * do not have.
 *
 * The shelf used to say "public domain" and mean it, which cost it the last
 * fifty years: the archive's newer material — the city films, the road-trip
 * films, the ones actually about going somewhere — is licensed rather than
 * released, and shutting them out to keep one word true on a caption was
 * the wrong trade. The caption changed instead.
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
export type Subject =
  | "travel"
  | "city"
  | "aviation"
  | "radio"
  | "atomic"
  | "tomorrow"
  | "amateur";

export type Film = {
  /** Internet Archive item identifier. */
  id: string;
  /** The MP4 derivative inside that item. */
  file: string;
  title: Named;
  year: string;
  creator: string;
  seconds: number;
  /** Size of the file this seat would have to hold. */
  megabytes: number;
  subject: Subject;
  /**
   * The archive's own licence, where the film carries one. Absent means
   * public domain, which is most of this shelf. A licence that asks to be
   * named is named, beside the creator, on the film's own card.
   */
  licence?: { label: string; url: string };
  synopsis: Named;
};

const BY_NC_SA_4 = {
  label: "CC BY-NC-SA 4.0",
  url: "creativecommons.org/licenses/by-nc-sa/4.0",
};
const BY_NC_SA_3 = {
  label: "CC BY-NC-SA 3.0",
  url: "creativecommons.org/licenses/by-nc-sa/3.0",
};
const BY_NC_3 = {
  label: "CC BY-NC 3.0",
  url: "creativecommons.org/licenses/by-nc/3.0",
};
const BY_NC_ND_4 = {
  label: "CC BY-NC-ND 4.0",
  url: "creativecommons.org/licenses/by-nc-nd/4.0",
};

export const FILMS: Film[] = [
  /**
   * The four this shelf could not carry while its caption said public
   * domain, and the reason the caption changed.
   *
   * They are Rick Prelinger's own films, made out of the same archive the
   * rest of this shelf comes from, and they are the only recent things in it
   * — 2004 to 2016, against a shelf that otherwise stops in 1985. They are
   * also the closest any of this gets to what the passenger watching them is
   * doing: a road trip assembled from nine thousand home movies, a city
   * remembered by the people who lived in it, and the ordinary afternoons
   * that survive only because somebody had a camera.
   */
  {
    id: "NMRT201306256Mbps",
    subject: "travel",
    file: "NMRT_20130625_6Mbps.mp4",
    title: { en: "No More Road Trips?", zh: "再没有公路旅行了吗？" },
    year: "2013",
    creator: "Rick Prelinger",
    seconds: 4763,
    megabytes: 396,
    licence: BY_NC_SA_3,
    synopsis: {
      en: "A dream ride through 20th-century America made entirely from home movies, asking whether we have come to the end of the open road. Have we reached peak travel? Are we nomads or stay-at-homes? A journey from the Atlantic coast to California, assembled from a collection of nine thousand home movies.",
      zh: "一场穿过二十世纪美国的梦游式旅程，全部由家庭电影剪成，问的是：开阔的公路是不是已经走到头了。我们到达「旅行的顶点」了吗？我们是游牧的人，还是待在家里的人？这是一段从大西洋岸到加州的旅途，取自九千卷家庭电影。",
    },
  },
  {
    id: "AllIsWellH264",
    subject: "amateur",
    file: "All_Is-Well_h264.mp4",
    title: { en: "All-Is-Well", zh: "一切安好" },
    year: "2016",
    creator: "Rick Prelinger",
    seconds: 853,
    megabytes: 83,
    licence: BY_NC_ND_4,
    synopsis: {
      en: "Ordinary adventures remembered only because they survive in home movies. Against a backdrop of distant news events, kids stampede for Easter eggs; horses run together; families read pulps and shoot craps; cooks fry; tin-can tourists work hard at leisure; people pose, clown and drink, pull back the husks of sweet corn.",
      zh: "一些平常的小事，只因为被家庭电影拍下来才留了下来。远处是新闻里的大事，这边孩子们冲去抢复活节彩蛋；马群一起奔跑；一家人读廉价小说、掷骰子；厨子在煎东西；开着房车的人努力地休闲；人们摆姿势、扮鬼脸、喝酒，把玉米的苞叶一层层剥开。",
    },
  },
  {
    id: "panorama_ephemera2004",
    subject: "travel",
    file: "panorama_ephemera2004_512kb.mp4",
    title: { en: "Panorama Ephemera", zh: "浮世全景" },
    year: "2004",
    creator: "Rick Prelinger",
    seconds: 5375,
    megabytes: 372,
    licence: BY_NC_SA_4,
    synopsis: {
      en: "A collage of sequences drawn from a wide variety of ephemeral films — industrial, advertising, educational and amateur — touring the conflicted landscapes of twentieth-century America. The films' often-skewed visions construct an American history filled with horror and hope, unreeling in familiar and unexpected ways.",
      zh: "一部拼贴：素材取自各种「用完就扔」的影片——工业片、广告片、教育片、业余片——巡游二十世纪美国那些自相矛盾的风景。这些片子常常偏斜的目光拼出一段美国史，既有恐怖也有希望，以熟悉又意外的方式放映出来。",
    },
  },
  {
    id: "LostLandscapesOfDetroitYear32012",
    subject: "city",
    file: "LLDetroit2012_20120922.ia.mp4",
    title: { en: "Lost Landscapes of Detroit", zh: "底特律失落的风景" },
    year: "2012",
    creator: "Rick Prelinger",
    seconds: 4175,
    megabytes: 365,
    licence: BY_NC_3,
    synopsis: {
      en: "The third annual Lost Landscapes of Detroit compilation, premiered in Detroit's Eastern Market. The film is mostly silent: it is designed to be screened before a live audience whose comments, questions and conversation become the soundtrack.",
      zh: "第三届《底特律失落的风景》合集，在底特律东部市场首映。影片大部分没有声音——它本来就是放给现场观众看的，观众的评论、提问和交谈就是它的配乐。",
    },
  },
  /**
   * Six the shelf was missing, and what they are here for.
   *
   * This aeroplane is going from one city to another, and until now the
   * shelf was almost entirely about the aeroplane: radar, the bomb, an
   * airline selling its first jets. These are the other half of what a
   * flight is — leaving somewhere, arriving somewhere, and the hours in
   * between when what you are actually thinking about is the place. Three
   * of them are somebody's own footage of a trip, which is the closest
   * thing the archive has to what a passenger is doing while they watch.
   *
   * They also bring the shelf forward. It ran 1945 to 1965; the Hudson
   * River excursion is 1985. That is as recent as this shelf can honestly
   * go — Prelinger's own later city films are CC BY-NC-SA rather than
   * public domain, and this shelf says public domain.
   */
  {
    id: "0405_HM_Postwar_London_Paris_Washington_00_00_52_00",
    subject: "travel",
    file: "0405_HM_Postwar_London_Paris_Washington_00_00_52_00_3mb.mp4",
    title: {
      en: "Postwar London, Paris, Washington",
      zh: "战后的伦敦、巴黎、华盛顿",
    },
    year: "1940s",
    creator: "Unattributed",
    seconds: 935,
    megabytes: 362,
    synopsis: {
      en: "Kodachrome and black and white, alternating. Piccadilly Circus; post-bombing London scenes; Nelson's Pillar; war memorials; Big Ben; a military parade; a car driving past the camera with, possibly, George VI in the back seat saluting; Paris street scenes; American MPs on a Paris pavement; soldiers sitting in a sidewalk cafe; Cafe de la Paix; Galeries Lafayette.",
      zh: "柯达彩色与黑白交替。皮卡迪利广场；轰炸后的伦敦街景；纳尔逊纪念柱；战争纪念碑；大本钟；阅兵；一辆车从镜头前驶过，后座敬礼的可能是乔治六世；巴黎街景；站在人行道上的美国宪兵；坐在露天咖啡座的士兵；和平咖啡馆；老佛爷百货。",
    },
  },
  {
    id: "6263_HM_1971_San_Francisco_Vacation_01_23_17_26",
    subject: "travel",
    file: "6263_HM_1971_San_Francisco_Vacation_01_23_17_26.mp4",
    title: { en: "1971 San Francisco Vacation", zh: "1971 年的旧金山假期" },
    year: "1971",
    creator: "Unattributed",
    seconds: 1411,
    megabytes: 139,
    synopsis: {
      en: "A pan around the State Line Hotel and Casino at West Wendover, Nevada; an unfocused shot of \"Wendover Will\", the hand-waving cowboy billed as the world's largest mechanised man; a Greyhound Scenicruiser; a shaky pan of a western town along the highway past the Mobil, Conoco and Husky stations; the Conservatory of Flowers in Golden Gate Park, inside and out.",
      zh: "内华达西温多弗州界酒店赌场的横摇；失焦的「温多弗威尔」——那个招手的牛仔，号称世界上最大的机械人；一辆灰狗 Scenicruiser；沿公路一座西部小镇的晃动横摇，经过美孚、康菲和 Husky 加油站；金门公园花房的内外。",
    },
  },
  {
    id: "6335HMHudsonRiverStreamliner01481526",
    subject: "travel",
    file: "6335_HM_Hudson_River_Streamliner_01_48_15_26.mp4",
    title: { en: "Hudson River Streamliner", zh: "哈德逊河快车" },
    year: "1985",
    creator: "Fleischer, Henry Charles",
    seconds: 790,
    megabytes: 78,
    synopsis: {
      en: "A railway excursion in 1985, organised by the Tri-State Railway Historical Society with New Jersey Transit and Conrail. It leaves Newark and crosses Hell Gate Bridge with Queens and Manhattan behind it; much of it is shot out of the window.",
      zh: "1985 年的一次铁路远足，由三州铁路历史学会与新泽西运输、康瑞尔铁路合办。列车驶离纽瓦克，跨过地狱门大桥，身后是皇后区和曼哈顿；大半镜头是从车窗里拍的。",
    },
  },
  {
    id: "6313_My_City_01_15_27_00",
    subject: "city",
    file: "6313_My_City_01_15_27_00_3mb.mp4",
    title: { en: "My City", zh: "我的城市" },
    year: "1968",
    creator: "Artemis Films Inc.",
    seconds: 1025,
    megabytes: 101,
    synopsis: {
      en: "Children talk about their cities — Atlanta, New York, Detroit.",
      zh: "孩子们讲自己的城市——亚特兰大、纽约、底特律。",
    },
  },
  {
    id: "201768_The_Green_City",
    subject: "city",
    file: "201768_The_Green_City_master.intros.mp4",
    title: { en: "The Green City", zh: "绿色城市" },
    year: "1963",
    creator: "Stuart Finley",
    seconds: 1393,
    megabytes: 127,
    synopsis: {
      en: "\"Shows how green space and open space is being thoughtlessly gobbled up by the urbanizing process. Demonstrates how development can take place without excessive destruction and illustrates various situations in different parts of the country.\" — Library of Congress",
      zh: "「展示城市化如何不假思索地吞掉绿地与开阔地，说明开发未必要伴随过度破坏，并列举全国各地的不同情形。」——美国国会图书馆",
    },
  },
  {
    id: "Farewell1940",
    subject: "tomorrow",
    file: "Farewell1940.mp4",
    title: { en: "Farewell to Treasure Island", zh: "再见，宝岛" },
    year: "1940",
    creator: "Allen (Ken)",
    seconds: 174,
    megabytes: 17,
    synopsis: {
      en: "The conclusion of the Golden Gate International Exposition on Treasure Island in San Francisco Bay.",
      zh: "旧金山湾宝岛上的金门国际博览会闭幕。",
    },
  },
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
/**
 * The frame on the cover, carried rather than fetched.
 *
 * The shelf used to ask archive.org for twenty-eight thumbnails the moment
 * you opened Movies. Measured: the median request took 8.6 seconds and the
 * slowest 10.8, the first poster landed 5.2 seconds in and the last at 9.3 —
 * for 180px pictures. The endpoint is a redirect to a thumbnailer and it is
 * simply slow, and no amount of lazy-loading fixes a slow first screen.
 *
 * So they are on board: one WebP per film in src/posters, found by a glob
 * the same way the sleeves and the marks are, 166KB for the whole shelf. A
 * film with no file falls back to the archive, so dropping the folder costs
 * nothing but the wait. This is also what the rest of this file says a cabin
 * does — it knows its own manifest before pushback.
 */
const FRAMES = import.meta.glob("../posters/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const stillUrl = (f: Film) => {
  const key = Object.keys(FRAMES).find((k) => k.endsWith(`/${f.id}.webp`));
  return key ? FRAMES[key] : `https://archive.org/services/img/${f.id}`;
};

export const itemUrl = (f: Film) => `https://archive.org/details/${f.id}`;

/**
 * The archive's own description, or an honest blank. One item on this shelf
 * has none, and the first draft of this file filled the hole with a sentence
 * about an airline the archive never names.
 */
export function synopsis(f: Film, lang: Lang): string | null {
  // The archive's own words, quoted. A language with no translation of a
  // quotation reads the quotation.
  const t = f.synopsis[lang] || f.synopsis.en;
  return t.trim() ? t : null;
}

export function runtime(f: Film, lang: Lang) {
  const m = Math.round(f.seconds / 60);
  return `${m}${lang === "zh" || lang === "zh-Hant" ? " 分钟" : lang === "ja" ? "分" : " min"}`;
}
