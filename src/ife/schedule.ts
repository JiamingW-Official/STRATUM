import type { Named } from "./i18n";
import type { CabinClass } from "../flight-state/types";
import type { Lang } from "./i18n";

/**
 * What is supposed to happen on this flight, and when.
 *
 * Everything in this file is a plan, and the screens that draw it say so in
 * the cabin's own language for saying so: brass and broken, the way every
 * other thing nobody has confirmed is drawn. That matters more here than
 * anywhere else in the piece, because a schedule is the most confident-looking
 * thing an interface can show — a row of times down a page reads as fact
 * whether or not anybody checked.
 *
 * Nothing on board has told this aircraft when the trays come out. The
 * overview screen used to leave the service off the strip for exactly that
 * reason, and leaving it off is one of the two honest options; the other is
 * to put it on and mark it, which is what the descent card next to it has
 * always done. This is the second option. The times are offsets from two
 * things that are real — the time it left, and the time it is expected — and
 * an offset from a real time is a guess with a shape, which is a different
 * object from an invention.
 *
 * The dishes are the fiction's own furniture, like the flight number and the
 * seat. STR 001 does not exist; neither does its lunch. What would not be
 * allowed is a *measurement* nobody took — a temperature, a position, a
 * receiver that heard something. A menu is a promise, and this one is
 * labelled as one.
 */

type Pair = Named;

export type Course = {
  name: Pair;
  /** The one line under a dish, where there is anything to say. */
  note?: Pair;
};

export type Service = {
  key: string;
  /**
   * Which end of the flight the time is measured from. Offsets from
   * departure are minutes after it; offsets from arrival are minutes before.
   */
  anchor: "departure" | "arrival";
  offsetMin: number;
  title: Pair;
  /** A meal has courses. A cabin event is just the event. */
  courses?: Course[];
  /** Shown on the timeline but not on the dining screen: it is not food. */
  cabin?: boolean;
};

/**
 * The two cabins eat differently, and that is most of what the difference
 * amounts to on a screen.
 *
 * Up front there is a starter, a choice of three and a cheese course, because
 * there is a trolley and the time to push it; down the back there is a choice
 * of two on one tray, because there are three hundred of them and one aisle.
 * Neither is a judgement — it is what fits in the galley — and the screen
 * names the cabin it is describing rather than pretending there is one menu
 * on the aeroplane.
 */
const FIRST_BUSINESS: Course[] = [
  {
    name: { en: "Cured trout, dill, rye", zh: "腌鳟鱼 · 莳萝 · 黑麦" },
    note: { en: "to start", zh: "前菜" },
  },
  { name: { en: "Braised short rib, celeriac", zh: "慢炖牛小排 · 根芹泥" } },
  { name: { en: "Sea bream, fennel, brown butter", zh: "鲷鱼 · 茴香 · 焦化黄油" } },
  {
    name: { en: "Barley and wild mushroom", zh: "大麦野菌" },
    note: { en: "no meat, no dairy", zh: "无肉无奶" },
  },
  {
    name: { en: "Cheddar, quince, oat biscuit", zh: "切达 · 榅桲 · 燕麦饼" },
    note: { en: "cheese", zh: "奶酪" },
  },
  {
    name: { en: "Dark chocolate tart", zh: "黑巧克力挞" },
    note: { en: "to finish", zh: "甜点" },
  },
];

const FIRST_ECONOMY: Course[] = [
  { name: { en: "Braised beef, mashed potato", zh: "炖牛肉 · 土豆泥" } },
  {
    name: { en: "Penne, tomato, basil", zh: "番茄罗勒通心粉" },
    note: { en: "no meat", zh: "无肉" },
  },
  {
    name: { en: "Roll, butter, side salad", zh: "面包 · 黄油 · 沙拉" },
    note: { en: "on the tray", zh: "同一托盘" },
  },
  { name: { en: "Chocolate brownie", zh: "巧克力布朗尼" } },
];

const SECOND_BUSINESS: Course[] = [
  { name: { en: "Warm sourdough, smoked ham", zh: "温酸面包 · 烟熏火腿" } },
  { name: { en: "Yoghurt, honey, walnut", zh: "酸奶 · 蜂蜜 · 核桃" } },
  { name: { en: "Seasonal fruit", zh: "时令水果" } },
];

const SECOND_ECONOMY: Course[] = [
  { name: { en: "Ham and cheese toastie", zh: "火腿芝士热三明治" } },
  { name: { en: "Seasonal fruit", zh: "时令水果" } },
];

/**
 * A transatlantic day flight, in the order it happens.
 *
 * The offsets are the ones a seven-hour eastbound crossing actually uses:
 * the first service goes out once the seat-belt sign is off and the galley
 * has had time, the lights go down for the middle of it, and the second one
 * comes round far enough before the descent that the trays are collected
 * before the cabin is secured.
 */
export const SERVICES: Service[] = [
  {
    key: "doors",
    anchor: "departure",
    offsetMin: 0,
    title: { en: "Doors closed", zh: "关舱门" },
    cabin: true,
  },
  {
    key: "service1",
    anchor: "departure",
    offsetMin: 75,
    title: { en: "First service", zh: "第一次餐食" },
    courses: FIRST_ECONOMY,
  },
  {
    key: "galley",
    anchor: "departure",
    offsetMin: 165,
    title: { en: "Galley open", zh: "备餐间开放" },
    courses: [
      { name: { en: "Sandwiches", zh: "三明治" } },
      { name: { en: "Fruit and biscuits", zh: "水果与饼干" } },
      {
        name: { en: "Tea, coffee, the bar", zh: "茶 · 咖啡 · 酒水" },
        note: { en: "help yourself, both aisles", zh: "两侧过道自取" },
      },
    ],
  },
  {
    key: "lights",
    anchor: "departure",
    offsetMin: 210,
    title: { en: "Cabin lights dimmed", zh: "客舱灯光调暗" },
    cabin: true,
  },
  {
    key: "service2",
    anchor: "arrival",
    offsetMin: 105,
    title: { en: "Second service", zh: "第二次餐食" },
    courses: SECOND_ECONOMY,
  },
  {
    key: "descent",
    anchor: "arrival",
    offsetMin: 30,
    title: { en: "Descent begins", zh: "开始下降" },
    cabin: true,
  },
  {
    key: "secure",
    anchor: "arrival",
    offsetMin: 20,
    title: { en: "Cabin secured for landing", zh: "客舱准备落地" },
    cabin: true,
  },
];

/** The same seven events, with the cabin's own courses in the two meals. */
export function servicesFor(cabinClass: CabinClass): Service[] {
  if (cabinClass !== "business" && cabinClass !== "first") return SERVICES;
  return SERVICES.map((s) =>
    s.key === "service1"
      ? { ...s, courses: FIRST_BUSINESS }
      : s.key === "service2"
        ? { ...s, courses: SECOND_BUSINESS }
        : s,
  );
}

/**
 * The drinks, which are not on the timetable because they are not an event.
 *
 * The trolley comes round twice, the galley is open in between, and there is
 * water for the whole flight — a list with no clock on it is the honest shape
 * for that. Up front there is a glass before the doors close, which is the
 * one thing in either cabin that happens on the ground.
 */
export type DrinkList = {
  key: string;
  title: Pair;
  /** When it is poured, where that is not "whenever you ask". */
  when?: Pair;
  items: Pair[];
};

/**
 * By kind, and named.
 *
 * "Soft drinks, juice" is not a drinks list, it is the word for one — a
 * passenger reading it still has to ask what there is, which is the job the
 * card was supposed to do. So every line is a thing you could point at.
 *
 * The beers are a New York lager and a London pale ale, which is the route.
 * Nothing here carries a brand: the films are named because they are real
 * films this cabin actually streams, and a lager this aeroplane has no
 * relationship with would be a logo rather than a fact. A kind and an origin
 * is what a printed menu gives you anyway.
 */
const SOFT: Pair[] = [
  { en: "Cola", zh: "可乐" },
  { en: "Diet cola", zh: "无糖可乐" },
  { en: "Lemonade", zh: "柠檬汽水" },
  { en: "Ginger ale", zh: "姜汁汽水" },
  { en: "Tonic water", zh: "汤力水" },
  { en: "Soda water", zh: "苏打水" },
  // Water is a soft drink, and it was under the hot ones only so the column
  // heading could say "Tea, coffee, water" — which is three words, which is
  // two lines, which is why that one column's list started lower than the
  // other four.
  { en: "Still or sparkling water", zh: "无气水 · 气泡水" },
];

const JUICE: Pair[] = [
  { en: "Orange", zh: "橙汁" },
  { en: "Apple", zh: "苹果汁" },
  { en: "Tomato", zh: "番茄汁" },
  { en: "Cranberry", zh: "蔓越莓汁" },
];

const BEER: Pair[] = [
  { en: "New York lager, 330ml", zh: "纽约拉格 330ml" },
  { en: "London pale ale, 330ml", zh: "伦敦淡色艾尔 330ml" },
];

const HOT: Pair[] = [
  { en: "English breakfast tea", zh: "英式早餐茶" },
  { en: "Green tea", zh: "绿茶" },
  { en: "Coffee, filter", zh: "滤泡咖啡" },
  { en: "Coffee, decaffeinated", zh: "低因咖啡" },
];

const BAR_BUSINESS: DrinkList[] = [
  {
    key: "before",
    title: { en: "While boarding", zh: "登机时" },
    when: { en: "poured at the seat", zh: "在座位上斟" },
    items: [
      { en: "Champagne", zh: "香槟" },
      { en: "Orange juice", zh: "橙汁" },
      { en: "Sparkling water", zh: "气泡水" },
    ],
  },
  {
    key: "wine",
    title: { en: "Wine", zh: "葡萄酒" },
    when: { en: "with the meal", zh: "随餐" },
    items: [
      { en: "Côtes du Rhône, red", zh: "罗讷河谷 红" },
      { en: "Chablis, white", zh: "夏布利 白" },
      { en: "Port, with the cheese", zh: "波特 配奶酪" },
    ],
  },
  {
    key: "spirits",
    title: { en: "Spirits", zh: "烈酒" },
    items: [
      { en: "London dry gin", zh: "伦敦干金酒" },
      { en: "Scotch whisky", zh: "苏格兰威士忌" },
      { en: "Vodka", zh: "伏特加" },
      { en: "Cognac", zh: "干邑" },
    ],
  },
  { key: "beer", title: { en: "Beer", zh: "啤酒" }, items: BEER },
  { key: "soft", title: { en: "Soft drinks", zh: "汽水" }, items: SOFT },
  { key: "juice", title: { en: "Juice", zh: "果汁" }, items: JUICE },
  { key: "hot", title: { en: "Tea and coffee", zh: "茶与咖啡" }, items: HOT },
];

const BAR_ECONOMY: DrinkList[] = [
  {
    key: "wine",
    title: { en: "Wine", zh: "葡萄酒" },
    when: { en: "with the meal", zh: "随餐" },
    items: [
      { en: "Rioja, red", zh: "里奥哈 红" },
      { en: "Sauvignon blanc, white", zh: "长相思 白" },
    ],
  },
  { key: "beer", title: { en: "Beer", zh: "啤酒" }, items: BEER },
  { key: "soft", title: { en: "Soft drinks", zh: "汽水" }, items: SOFT },
  { key: "juice", title: { en: "Juice", zh: "果汁" }, items: JUICE },
  { key: "hot", title: { en: "Tea and coffee", zh: "茶与咖啡" }, items: HOT },
];

export function drinksFor(cabinClass: CabinClass): DrinkList[] {
  return cabinClass === "business" || cabinClass === "first"
    ? BAR_BUSINESS
    : BAR_ECONOMY;
}

export type Planned = Service & {
  /** When it is planned for, in epoch ms. */
  at: number;
  /** Whether that moment has gone by. Still a plan either way. */
  past: boolean;
};

/**
 * The plan against this flight's own clock.
 *
 * Events that would fall outside the block are dropped rather than clamped:
 * on a short hop the second service and the first would land on top of each
 * other, and two meals at the same minute is a worse lie than one meal fewer.
 * Ten minutes of clearance at each end, because nothing happens in the cabin
 * while the aircraft is still on the runway.
 */
export function plan(
  departureUtc: string,
  etaUtc: string,
  cabinClass: CabinClass = "economy",
): Planned[] {
  const dep = Date.parse(departureUtc);
  const eta = Date.parse(etaUtc);
  const now = Date.now();
  if (!isFinite(dep) || !isFinite(eta) || eta <= dep) return [];
  const edge = 10 * 60_000;
  return servicesFor(cabinClass).map((s) => ({
    ...s,
    at:
      s.anchor === "departure"
        ? dep + s.offsetMin * 60_000
        : eta - s.offsetMin * 60_000,
    past: false,
  }))
    .filter((s) => s.at >= dep && s.at <= eta - edge)
    .map((s) => ({ ...s, past: s.at <= now }))
    .sort((a, b) => a.at - b.at);
}

/** The meals, which is what the dining screen is a list of. */
export function meals(
  departureUtc: string,
  etaUtc: string,
  cabinClass: CabinClass = "economy",
): Planned[] {
  return plan(departureUtc, etaUtc, cabinClass).filter(
    (s) => !s.cabin && s.courses,
  );
}

export function pickPair(p: Pair, lang: Lang) {
  return p[lang] || p.en;
}
