import { useSelf } from "../flight-state/store";

export type Lang = "en" | "zh";

/**
 * Two languages, chosen per seat. Language belongs to SeatPrivate because it
 * is nobody else's business what you read the cabin in — the same reason the
 * screen you are on is private and the reading light above your head is not.
 */
const DICT = {
  seat: ["Seat", "座位"],
  flight: ["Flight", "航班"],
  business: ["Business", "公务舱"],
  economy: ["Economy", "经济舱"],
  businessClass: ["Business class", "公务舱"],
  economyClass: ["Economy class", "经济舱"],
  arriving: ["Arriving", "抵达"],
  welcome: [
    "Welcome aboard. Your screen is ready whenever you are.",
    "欢迎登机。屏幕随时可用。",
  ],
  touchToBegin: ["Touch anywhere to begin", "轻触屏幕开始"],
  localTime: ["local time", "当地时间"],
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
  publicDomain: ["Public domain · Prelinger Archives", "公有领域 · Prelinger 档案"],
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
  language: ["Language", "语言"],
  close: ["Close", "关闭"],
  photograph: ["Photograph", "照片"],
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
  modeListen: ["Listen to something", "听点什么"],
  modeLook: ["Look out of the window", "看看窗外"],
  modeLookSub: [
    "The flight on a globe, and everything else the receivers can hear",
    "地球上的这趟航班，以及接收机还能听到的一切",
  ],
  modeRest: ["Rest", "休息"],
  modeRestSub: [
    "The light goes off and the screen goes dark. One touch brings it back.",
    "关掉阅读灯，屏幕熄掉。碰一下就回来。",
  ],
  changeLater: [
    "You can change this at any point, and nothing else on this screen depends on it.",
    "随时可以改，这块屏幕上没有别的东西取决于它。",
  ],
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
  confirmed: ["confirmed", "已确认"],
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
  pickASeat: [
    "Messages go to a seat, not to a name — nobody in this cabin has one. A seat you write to does not have to answer, and an empty one never will.",
    "消息发给座位，不是发给名字——这个客舱里没有人有名字。你写给的座位不一定会回，空座位永远不会。",
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
  catShort: ["Under 15 min", "15 分钟内"],
  views: ["Views", "视角"],
  zoom: ["Zoom", "缩放"],
  viewForward: ["Forward", "前方"],
  viewLeft: ["Left window", "左舷"],
  viewRight: ["Right window", "右舷"],
  distanceFlown: ["Distance flown", "已飞距离"],
  knots: ["knots", "节"],
  feet: ["feet", "英尺"],
  verticalSpeed: ["V/S ft/min · derived", "垂直速度 ft/min · 推算"],
  horizon: ["HORIZON", "地平线"],
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

export function t(key: Key, lang: Lang): string {
  return DICT[key][lang === "zh" ? 1 : 0];
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

/** City and airport names carry their own pair. */
export function pick(pair: { en: string; zh: string }, lang: Lang) {
  return lang === "zh" && pair.zh ? pair.zh : pair.en;
}
