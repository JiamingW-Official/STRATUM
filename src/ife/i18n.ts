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
