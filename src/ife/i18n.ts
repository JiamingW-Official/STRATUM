import { useSelf } from "../flight-state/store";
import TABLE from "./translations";
import type { Lang, Named } from "../flight-state/types";

/**
 * The languages this cabin is written in.
 *
 * Chosen per seat: language belongs to SeatPrivate because it is nobody
 * else's business what you read the cabin in — the same reason the screen you
 * are on is private and the reading light above your head is not.
 */
export type { Lang };

/** In the order the first screen offers them. */
export const LANGUAGES: Array<{ code: Lang; name: string }> = [
  { code: "en", name: "English" },
  { code: "zh", name: "简体中文" },
  { code: "zh-Hant", name: "繁體中文" },
  { code: "ja", name: "日本語" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "ru", name: "Русский" },
];
const DICT = {
  seat: ["Seat", "座位"],
  flight: ["Flight", "航班"],
  first: ["First", "头等舱"],
  business: ["Business", "公务舱"],
  premium: ["Premium", "超级经济舱"],
  economy: ["Economy", "经济舱"],
  firstClass: ["First class", "头等舱"],
  businessClass: ["Business class", "公务舱"],
  premiumClass: ["Premium Economy", "超级经济舱"],
  economyClass: ["Economy class", "经济舱"],
  arriving: ["Arriving", "抵达"],
  welcome: [
    "Welcome aboard. Your screen is ready whenever you are.",
    "欢迎登机。屏幕随时可用。",
  ],
  touchToBegin: ["Touch anywhere to begin", "轻触屏幕开始"],
  localTime: ["local time", "当地时间"],
  utc: ["UTC", "协调世界时"],
  // Written here rather than inline in the screens. Fifteen of these lived as
  // `lang === "zh" ? … : …` in the middle of JSX, which was fine while there
  // were two languages and is a dead end at seven: a string that is not in
  // the dictionary cannot be translated, only rewritten.
  nowShowing: ["Now showing", "正在放映"],
  filmsOnBoard: ["films on board", "部 · 机上片库"],
  tracksOnBoard: ["tracks on board", "首 · 机上曲库"],
  tracksShort: ["tracks", "首"],
  questionsCited: ["questions · each one cited", "题 · 每题标出处"],
  framesFrom: ["films on board", "部影片的画格"],
  toPlace: ["to", "到"],
  home: ["Home", "主页"],
  map: ["Map", "航图"],
  flightMap: ["Flight map", "航图"],
  flightInformation: ["Flight information", "航班信息"],
  destination: ["Destination", "目的地"],
  movies: ["Movies", "电影"],
  music: ["Music", "音乐"],
  games: ["Games", "游戏"],
  readingLight: ["Reading light", "阅读灯"],
  callAttendant: ["Call attendant", "呼叫乘务员"],
  cancelCall: ["Cancel call", "取消呼叫"],
  back: ["Back", "返回"],
  altitude: ["Altitude", "高度"],
  groundSpeed: ["Ground speed", "地速"],
  heading: ["Heading", "航向"],
  timeElapsed: ["Time elapsed", "已飞行"],
  timeRemaining: ["Time remaining", "剩余时间"],
  phase: ["Phase", "飞行阶段"],
  position: ["Position", "位置"],
  departed: ["departed", "起飞"],
  arrivingAt: ["arriving", "到达"],
  arrival: ["Arrival", "到达"],
  landingIn: ["Landing in", "还有"],
  arrived: ["Arrived", "已到达"],
  weather: ["Weather", "天气"],
  feelsLike: ["Feels like", "体感"],
  wind: ["Wind", "风"],
  later: ["Later", "稍后"],
  nothingLoaded: [
    "Nothing loaded on this aircraft yet.",
    "本机尚未装载此内容。",
  ],
  catalogueLater: [
    "The catalogue comes later, once there is a cabin to sit in.",
    "等机舱做出来，片库再装上。",
  ],
  backToHome: ["Back to home", "返回主页"],
  announcementInProgress: ["Cabin announcement in progress", "客舱广播中"],
  screenReturns: ["Your screen will return on its own", "广播结束后自动返回"],
  safetyKind: ["Safety demonstration", "安全演示"],
  captainKind: ["From the flight deck", "来自驾驶舱"],
  safetyTitle: [
    "Please direct your attention to the cabin crew",
    "请注意客舱乘务员的演示",
  ],
  safetyBody: [
    "Your seat belt fastens and unfastens like this. There are exits fore, aft and over the wings. In the unlikely event of a loss of cabin pressure, an oxygen mask will drop in front of you.",
    "安全带如此扣紧、如此解开。客舱前部、后部及机翼上方设有出口。万一客舱失压，氧气面罩会自动落下。",
  ],
  captainTitle: ["This is your captain speaking", "这里是机长广播"],
  captainBody: [
    "We have reached our cruising altitude and expect a smooth ride. I have switched off the seat belt sign, but please keep it fastened while you are seated.",
    "我们已到达巡航高度，预计航程平稳。安全带指示灯已关闭，但就座时请系好安全带。",
  ],
  nowPlaying: ["Now playing", "正在播放"],
  nextStop: ["Next stop", "下一站"],
  /**
   * Phrases that take a place name, as phrases rather than as a prefix.
   *
   * This was `timeTo: ["Time to", "还有"]` and the screen wrote
   * `t("timeTo") + " " + city`. In English that is "Time to London"; in
   * Chinese it came out "还有 伦敦" — "there is still London" — because the
   * place name goes in the middle, not the end. A word order is not a
   * translation.
   */
  timeToPlace: ["Time to {}", "距{}还有"],
  onBoard: ["On board", "机上"],
  browse: ["Browse", "浏览"],
  whereAreWe: ["Where are we?", "我们在哪？"],
  launchMap: ["Open the flight map", "打开航图"],
  aboutCity: ["About", "关于"],
  theSky: ["The sky", "天空"],
  liveAdsb: ["Live ADS-B overhead", "头顶的实时 ADS-B"],
  heardBaseline: [
    "Baseline solid where a receiver heard this aircraft",
    "底线实线处，是接收站真的听到了这架飞机",
  ],
  profile: ["Flight profile", "飞行剖面"],
  onThisAircraft: ["On this aircraft", "本机装载"],
  films: ["films", "部"],
  // Not "· Prelinger Archives": the creator is named directly above this
  // line, and it is Encyclopaedia Britannica Films or the U.S. Army Air
  // Forces as often as it is Prelinger.
  publicDomain: ["Public domain", "公有领域"],
  freeToShow: [
    "Free to show · Prelinger Archives",
    "可自由放映 · Prelinger 档案",
  ],
  playFilm: ["Play", "播放"],
  resume: ["Resume", "继续播放"],
  stop: ["Stop", "停止"],
  streamingNote: [
    "Streaming from the archive. A cabin carries its library; this bench borrows one.",
    "正在从档案库流式播放。真正的机舱自带片库，这个开发台是借来的。",
  ],
  noSynopsis: [
    "The archive holds no description for this film.",
    "档案库没有为这部影片留下简介。",
  ],
  back10: ["Back 10s", "后退 10 秒"],
  fwd30: ["Forward 30s", "前进 30 秒"],
  playPause: ["Play or pause", "播放/暂停"],
  seek: ["Seek", "进度"],
  remaining: ["remaining", "剩余"],
  loading: ["Loading", "载入中"],
  unavailable: ["This film did not load", "这部影片未能载入"],
  unavailableBody: [
    "The archive did not answer. Nothing is wrong with your screen.",
    "档案库没有响应。不是你的屏幕出了问题。",
  ],
  sudoku: ["Sudoku", "数独"],
  sudokuSub: ["Nine by nine, no guessing needed", "九宫格，不需要猜"],
  overhead: ["Overhead", "头顶之上"],
  overheadSub: [
    "What is actually above you, and who can see it",
    "你头顶上到底有什么，谁看得见",
  ],
  newGame: ["New game", "新开一局"],
  check: ["Check", "检查"],
  solved: ["Solved", "完成"],
  mistakes: ["Mistakes", "错误"],
  question: ["Question", "第"],
  ofN: ["of", "题，共"],
  correct: ["Correct", "答对了"],
  wrong: ["Not quite", "不对"],
  nextQuestion: ["Next", "下一题"],
  playAgain: ["Play again", "再来一次"],
  score: ["Score", "得分"],
  source: ["Source", "出处"],
  easy: ["Easy", "简单"],
  medium: ["Medium", "普通"],
  hard: ["Hard", "困难"],
  station: ["Station", "频道"],
  play: ["Play", "播放"],
  pause: ["Pause", "暂停"],
  next: ["Next", "下一首"],
  volume: ["Volume", "音量"],
  cabinSound: ["Cabin sound", "客舱环境音"],
  language: ["Language", "语言"],
  close: ["Close", "关闭"],
  photograph: ["Photograph", "照片"],
  booking: ["Booking", "订座"],
  checkedBags: ["Checked bags", "托运行李"],
  bagsCount: ["bags", "件"],
  card: ["Card", "会员"],
  yourConnection: ["Yours", "您的航班"],
  changingTo: ["Changing to", "转乘"],
  elapsed: ["elapsed", "已飞"],
  menu: ["Menu", "菜单"],
  screenOff: ["Screen off", "关闭屏幕"],
  distanceToGo: ["Distance to go", "剩余距离"],
  followAircraft: ["Follow aircraft", "跟随飞机"],
  wholeRoute: ["Whole route", "整条航线"],
  zoomIn: ["Zoom in", "放大"],
  zoomOut: ["Zoom out", "缩小"],
  viewGlobe: ["Globe", "地球"],
  best: ["Best", "最高"],
  previous: ["Previous", "上一首"],
  shuffle: ["Shuffle", "随机"],
  repeat: ["Repeat", "重复"],
  chooseLanguage: ["Choose a language", "选择语言"],
  continue: ["Continue", "继续"],
  startTitle: [
    "How would you like to spend the flight?",
    "这趟飞行你想怎么过？",
  ],
  modeWatch: ["Watch something", "看点什么"],
  // Counted, not remembered: the shelf runs 1940 to 2016, and only twenty of
  // the twenty-six dated films are in the three decades this line used to
  // claim. "Public-domain" stopped being true when the shelf took in the
  // Creative Commons material as well.
  modeWatchSub: ["From the archive, 1940 to 2016", "档案里的片子，1940 到 2016"],
  modeListenSub: ["Four records, playing now", "四张唱片，现在就在放"],
  modeDrink: ["A drink first", "先来一杯"],
  modeDrinkSub: [
    "Before the doors close, while you settle in",
    "舱门还没关，先坐下来喝点",
  ],
  modeListen: ["Listen to something", "听点什么"],
  modeLook: ["Look out of the window", "看看窗外"],
  // One line each, and each one carries the fact its card's picture does not.
  // The route is already drawn on this card; the traffic is not.
  modeLookSub: ["And who else is up there", "还有天上别的飞机"],
  modeRest: ["Rest", "休息"],
  // One clause. The second sentence explained how to undo the thing before
  // anybody had done it, which is a manual, not a choice.
  modeRestSub: ["Screen and reading light off", "屏幕和阅读灯一起关"],
  skip: ["Skip", "跳过"],
  overview: ["This flight", "本次飞行"],
  depart: ["Depart", "起飞"],
  arrive: ["Arrive", "到达"],
  inTheAir: ["In the air", "飞行中"],
  descentBegins: ["Descent begins", "开始下降"],
  within: ["within", "约"],
  elapsedSoFar: ["elapsed", "已飞"],
  connections: ["Connecting flights", "转机航班"],
  connectionsWhen: [
    "Shown as the aircraft comes down. Until the ground tells this cabin otherwise, every row is the schedule rather than the fact.",
    "在飞机开始下降时出现。在地面告知之前，每一行都是时刻表而不是事实。",
  ],
  noConnections: [
    "The cabin has not been given a departure board.",
    "客舱还没有收到出发时刻表。",
  ],
  colDestination: ["Destination", "目的地"],
  colDeparture: ["Departure", "起飞"],
  colFlight: ["Flight", "航班"],
  colGate: ["Gate", "登机口"],
  colTerminal: ["Terminal", "航站楼"],
  colStatus: ["Status", "状态"],
  onTime: ["On time", "准点"],
  delayed: ["Delayed", "延误"],
  cancelled: ["Cancelled", "取消"],
  scheduled: ["scheduled", "按计划"],
  heard: ["heard", "已听到"],
  notHeard: ["not heard", "未听到"],
  estimated: ["estimated", "推算"],
  chat: ["Seat messages", "座位消息"],
  threads: ["Messages", "会话"],
  newMessage: ["New message", "新消息"],
  noThreads: [
    "Nothing yet. Write to a seat and it will appear here.",
    "还没有。给某个座位写一条，就会出现在这里。",
  ],
  writeToSeat: ["Which seat?", "写给哪个座位？"],
  openThread: ["Write", "开始写"],
  noMessages: ["No messages", "还没有消息"],
  // One clause. The other two explained that a seat need not answer and an
  // empty one never will, which is the kind of thing a screen says when it
  // is nervous about being empty.
  pickASeat: [
    "Messages go to a seat, not to a name",
    "消息发给座位，不是发给名字",
  ],
  heldByAircraft: [
    "Held by the aircraft, not by your seat",
    "由飞机保存，不在你的座位上",
  ],
  seen: ["seen", "已读"],
  notSeen: ["not seen", "未读"],
  typeHere: ["Write a message", "写一条消息"],
  send: ["Send", "发送"],
  moves: ["Moves", "步数"],
  found: ["Found", "已找到"],
  noMovesLeft: ["No moves left", "无法再移动"],
  reached2048: ["2048 reached", "已达 2048"],
  swipeToMove: ["Swipe the board to move", "滑动棋盘来移动"],
  pairs: ["Pairs", "配对"],
  pairsSub: [
    "Sixteen frames from the films on board. Find the eight pairs.",
    "机上影片的十六个画格。找出八对。",
  ],
  allFound: ["All eight found", "八对全部找到"],
  pairsNote: [
    "Every face is a frame from a film this aircraft carries. Matching one names it.",
    "每一张都是本机所载影片里的一个画格。配对成功就会写出片名。",
  ],
  g2048Sub: [
    "Slide the tiles together. Two of a kind make the next one up.",
    "把方块滑到一起。两个相同的合成下一级。",
  ],
  catAll: ["Everything", "全部"],
  catAviation: ["Aviation", "航空"],
  catRadio: ["Radar & radio", "雷达与无线电"],
  catAtomic: ["The atomic age", "原子时代"],
  catTomorrow: ["Tomorrow", "明日世界"],
  catAmateur: ["Home movies", "家庭电影"],
  catTravel: ["Going somewhere", "在路上"],
  catCity: ["Cities", "城市"],
  catShort: ["Under 15 min", "15 分钟内"],
  ahead: ["AHEAD", "前方"],
  views: ["Views", "视角"],
  zoom: ["Zoom", "缩放"],
  viewForward: ["Forward", "前方"],
  viewLeft: ["Left window", "左舷"],
  viewRight: ["Right window", "右舷"],
  distanceFlown: ["Distance flown", "已飞距离"],
  knots: ["knots", "节"],
  feet: ["feet", "英尺"],
  verticalSpeed: ["V/S ft/min · derived", "垂直速度 ft/min · 推算"],
  dining: ["Dining", "餐食"],
  dutyFree: ["Duty free", "免税购物"],
  shopNote: [
    "List prices, in euros. Nothing is bought from this screen — the trolley comes through the cabin after the first service.",
    "欧元标价。这块屏幕不能下单——第一轮餐食之后手推车会过来。",
  ],
  drinks: ["Drinks", "饮品"],
  anyTime: ["Any time", "全程"],
  withTheMeal: ["With the meal", "随餐"],
  beforeDeparture: ["Before departure", "起飞前"],
  timetable: ["Timetable", "时刻安排"],
  planned: ["planned", "计划"],
  // One line. Two ran 13px past the foot of the Dining screen, and the second
  // sentence was the first one again: "a plan, marked as one" says nothing
  // that the dashed rules beside every time have not already said.
  plannedNote: [
    "Offsets from departure and arrival — nothing has told this seat the real times.",
    "从起飞和落地推算，没有系统告诉过这个座位真正的时刻。",
  ],
  served: ["Served", "供应"],
  onTheMenu: ["On the menu", "菜单"],
  groupFlight: ["Flight", "航班"],
  groupEntertainment: ["Entertainment", "娱乐"],
  groupCabin: ["Cabin", "客舱"],
  on: ["On", "开"],
  off: ["Off", "关"],
  called: ["Called", "已呼叫"],
  exploreDestination: ["Explore the destination", "了解目的地"],
  imageCredit: ["Image", "图片"],
  mapUnavailable: ["Map unavailable", "地图不可用"],
  mapUnavailableBody: [
    "The basemap did not load. The flight is still being tracked; only the ground under it is missing.",
    "底图未能加载。航班仍在追踪，缺的只是下面的地面。",
  ],
  noPhoto: ["No photograph on board for this city", "本机没有这座城市的图片"],
  phaseBoarding: ["Boarding", "登机"],
  phaseTaxi: ["Taxi", "滑行"],
  phaseTakeoff: ["Climb", "爬升"],
  phaseCruise: ["Cruise", "巡航"],
  phaseDescent: ["Descent", "下降"],
  phaseLanded: ["Landed", "已落地"],
} as const;

export type Key = keyof typeof DICT;

/**
 * The languages added after the first two, as overlays.
 *
 * The two-entry tuples above are the cabin's own record of what it says in
 * the language it was written in and the one it was written alongside; they
 * are not touched. Everything since is a partial dictionary laid over them,
 * so a language is one object, a string that has not been translated falls
 * back to English rather than to a key or an empty box, and adding a
 * language cannot break the two that exist.
 *
 * English rather than the nearest relative on purpose: a passenger who has
 * chosen Français and meets a line of English knows it has not been
 * translated. One who meets Spanish does not.
 */
const OVERLAY: Partial<Record<Lang, Partial<Record<Key, string>>>> = TABLE;

/**
 * Where a language looks when it has no word of its own.
 *
 * English for everything except Traditional Chinese, which looks at
 * Simplified first: they are one language in two scripts, and a reader of
 * one can read the other. Falling back to English there would hand somebody
 * who has just chosen 繁體中文 a screen of English while the Chinese for it
 * was sitting in the next column.
 */
const FALLBACK: Partial<Record<Lang, Lang>> = { "zh-Hant": "zh" };

export function t(key: Key, lang: Lang): string {
  const own = OVERLAY[lang]?.[key];
  if (own) return own;
  const near = FALLBACK[lang];
  if (near) return t(key, near);
  return DICT[key][lang === "zh" ? 1 : 0] || DICT[key][0];
}

/** The translator for this seat, and the language it is set to. */
export function useT() {
  const lang = useSelf((s) => s.lang);
  return { lang, t: (key: Key) => t(key, lang) } as const;
}

/** Fills the {} in a phrase like timeToPlace. */
export function phrase(key: Key, lang: Lang, value: string) {
  return t(key, lang).replace("{}", value);
}

/**
 * A name that carries its own translations: a city, an airport, a dish.
 *
 * Same rule as the dictionary — whatever the pair has for this language, or
 * English. These are content rather than interface, and a dish nobody has
 * written in Russian is better read in English than guessed at.
 */
export type { Named };

export function pick(pair: Named, lang: Lang) {
  const near = FALLBACK[lang];
  return pair[lang] || (near && pair[near]) || pair.en;
}
