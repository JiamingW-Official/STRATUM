import type { CabinClass, Named } from "../flight-state/types";

/**
 * The trolley, written down.
 *
 * Every other list in this cabin is a measurement or a quotation — the films
 * are real files with real runtimes, the tracks are real files, the weather
 * is a reading. This one is neither, and it says so the same way the menu
 * does: it is the airline's own offer, a thing an airline decides rather than
 * observes, and nothing here pretends otherwise. The pictures are found
 * photographs of real goods, licence and photographer recorded in
 * src/wares/CREDITS.md; Ware.tsx holds the argument about what may be in
 * one. Where a photograph disagreed with the copy below, the copy moved —
 * a caption that its own picture contradicts is the one thing this screen
 * cannot carry.
 *
 * What makes it honest is the marking, not the disclaiming. A price on a
 * seat-back screen is a price until the trolley reaches you and it is a
 * different one; so the price is the *list* price, the row says so once at
 * the foot of the screen, and the only thing that changes by cabin is what
 * is offered, which is what actually changes by cabin.
 *
 * Currency: one, and it is the one printed on a trolley card — euros on this
 * route, because it is the currency both ends of a transatlantic bar cart
 * quote in and a screen that converts is a screen that is wrong by the time
 * you read it.
 */
export type Item = {
  id: string;
  name: Named;
  /** What it is, in three words. The thing a trolley card has room for. */
  note: Named;
  /** Euros, list. */
  price: number;
  /** Size, volume, count — whatever the thing is sold by. */
  measure?: string;
  /** Which silhouette draws it. There is no photograph; see Ware.tsx. */
  shape:
    | "bottle"
    | "flask"
    | "phial"
    | "tube"
    | "watch"
    | "square"
    | "glasses"
    | "plane"
    | "cards"
    | "sock";
  /** Not on every cart. */
  cabins?: CabinClass[];
};

export type Aisle = {
  key: string;
  title: Named;
  items: Item[];
};

const SPIRITS: Item[] = [
  {
    id: "gin-london",
    shape: "bottle",
    name: {
      en: "London dry gin",
      zh: "伦敦干金酒",
      "zh-Hant": "倫敦乾琴酒",
      ja: "ロンドン・ドライジン",
      es: "Ginebra London dry",
      fr: "Gin London dry",
      ru: "Джин London dry",
    },
    note: {
      en: "Juniper, citrus peel",
      zh: "杜松、柑橘皮",
      "zh-Hant": "杜松、柑橘皮",
      ja: "ジュニパーと柑橘の皮",
      es: "Enebro y piel de cítrico",
      fr: "Genièvre, zeste d'agrume",
      ru: "Можжевельник, цедра",
    },
    price: 28,
    measure: "1 L",
  },
  {
    id: "whisky-speyside",
    shape: "flask",
    name: {
      en: "Speyside single malt",
      zh: "斯佩塞单一麦芽",
      "zh-Hant": "斯佩賽單一麥芽",
      ja: "スペイサイド・シングルモルト",
      es: "Single malt de Speyside",
      fr: "Single malt du Speyside",
      ru: "Спейсайд, односолодовый",
    },
    note: {
      en: "Twelve years",
      zh: "十二年",
      "zh-Hant": "十二年",
      ja: "12年",
      es: "Doce años",
      fr: "Douze ans",
      ru: "Двенадцать лет",
    },
    price: 52,
    measure: "700 ml",
  },
  {
    id: "cognac-vsop",
    shape: "flask",
    name: {
      en: "Cognac VSOP",
      zh: "干邑 VSOP",
      "zh-Hant": "干邑 VSOP",
      ja: "コニャック VSOP",
      es: "Coñac VSOP",
      fr: "Cognac VSOP",
      ru: "Коньяк VSOP",
    },
    note: {
      en: "Four years in oak",
      zh: "橡木桶四年",
      "zh-Hant": "橡木桶四年",
      ja: "オーク樽で4年",
      es: "Cuatro años en roble",
      fr: "Quatre ans sous bois",
      ru: "Четыре года в дубе",
    },
    price: 64,
    measure: "700 ml",
    cabins: ["first", "business"],
  },
];

const SCENT: Item[] = [
  {
    id: "edp-neroli",
    shape: "phial",
    name: {
      en: "Neroli eau de parfum",
      zh: "橙花香水",
      "zh-Hant": "橙花香水",
      ja: "ネロリ オードパルファム",
      es: "Eau de parfum de neroli",
      fr: "Eau de parfum néroli",
      ru: "Парфюмерная вода нероли",
    },
    note: {
      en: "Orange blossom, cedar",
      zh: "橙花、雪松",
      "zh-Hant": "橙花、雪松",
      ja: "オレンジフラワーと杉",
      es: "Azahar y cedro",
      fr: "Fleur d'oranger, cèdre",
      ru: "Апельсиновый цвет, кедр",
    },
    price: 96,
    measure: "50 ml",
  },
  {
    id: "edt-vetiver",
    shape: "phial",
    name: {
      en: "Vetiver eau de toilette",
      zh: "岩兰草淡香水",
      "zh-Hant": "岩蘭草淡香水",
      ja: "ベチバー オードトワレ",
      es: "Eau de toilette de vetiver",
      fr: "Eau de toilette vétiver",
      ru: "Туалетная вода ветивер",
    },
    note: {
      en: "Smoke, dry grass",
      zh: "烟熏、干草",
      "zh-Hant": "煙燻、乾草",
      ja: "煙と乾いた草",
      es: "Humo y hierba seca",
      fr: "Fumée, herbe sèche",
      ru: "Дым, сухая трава",
    },
    price: 74,
    measure: "100 ml",
  },
  {
    id: "hand-cream",
    shape: "tube",
    name: {
      en: "Hand cream",
      zh: "护手霜",
      "zh-Hant": "護手霜",
      ja: "ハンドクリーム",
      es: "Crema de manos",
      fr: "Crème pour les mains",
      ru: "Крем для рук",
    },
    note: {
      en: "For cabin air",
      zh: "为客舱干燥空气",
      "zh-Hant": "為客艙乾燥空氣",
      ja: "機内の乾燥に",
      es: "Para el aire de cabina",
      fr: "Pour l'air de la cabine",
      ru: "Для сухого воздуха салона",
    },
    price: 18,
    measure: "75 ml",
  },
];

const WORN: Item[] = [
  {
    id: "watch-field",
    shape: "watch",
    name: {
      en: "Field watch",
      zh: "军表",
      "zh-Hant": "軍錶",
      ja: "フィールドウォッチ",
      es: "Reloj de campaña",
      fr: "Montre de campagne",
      ru: "Полевые часы",
    },
    note: {
      en: "Steel, 38 mm",
      zh: "钢壳 38 毫米",
      "zh-Hant": "鋼殼 38 毫米",
      ja: "スチール 38mm",
      es: "Acero, 38 mm",
      fr: "Acier, 38 mm",
      ru: "Сталь, 38 мм",
    },
    price: 240,
  },
  {
    id: "silk-square",
    shape: "square",
    name: {
      en: "Silk square",
      zh: "真丝方巾",
      "zh-Hant": "真絲方巾",
      ja: "シルクスカーフ",
      es: "Pañuelo de seda",
      fr: "Carré de soie",
      ru: "Шёлковый платок",
    },
    note: {
      en: "Linked rings, on black",
      zh: "黑底连环",
      "zh-Hant": "黑底連環",
      ja: "黒地に輪つなぎ",
      es: "Anillas enlazadas, en negro",
      fr: "Anneaux enlacés, sur noir",
      ru: "Кольца на чёрном",
    },
    price: 88,
  },
  {
    id: "sunglasses",
    shape: "glasses",
    name: {
      en: "Oval sunglasses",
      zh: "椭圆墨镜",
      "zh-Hant": "橢圓墨鏡",
      ja: "オーバル サングラス",
      es: "Gafas ovaladas",
      fr: "Lunettes ovales",
      ru: "Овальные очки",
    },
    note: {
      en: "Glass lenses",
      zh: "玻璃镜片",
      "zh-Hant": "玻璃鏡片",
      ja: "ガラスレンズ",
      es: "Lentes de cristal",
      fr: "Verres minéraux",
      ru: "Стеклянные линзы",
    },
    price: 145,
  },
];

const ONBOARD: Item[] = [
  {
    id: "model-aircraft",
    shape: "plane",
    name: {
      en: "Airliner model, cutaway",
      zh: "客机剖面模型",
      "zh-Hant": "客機剖面模型",
      ja: "旅客機カットモデル",
      es: "Maqueta de avión, en corte",
      fr: "Maquette d'avion, en coupe",
      ru: "Модель лайнера в разрезе",
    },
    note: {
      en: "The cabin, seen through",
      zh: "看得见客舱",
      "zh-Hant": "看得見客艙",
      ja: "客室が見える",
      es: "Con la cabina a la vista",
      fr: "Cabine apparente",
      ru: "Салон виден насквозь",
    },
    price: 34,
  },
  {
    id: "playing-cards",
    shape: "cards",
    name: {
      en: "Playing cards",
      zh: "扑克牌",
      "zh-Hant": "撲克牌",
      ja: "トランプ",
      es: "Baraja",
      fr: "Jeu de cartes",
      ru: "Игральные карты",
    },
    note: {
      en: "One airport per card",
      zh: "每张一个机场",
      "zh-Hant": "每張一個機場",
      ja: "1枚に空港ひとつ",
      es: "Un aeropuerto por carta",
      fr: "Un aéroport par carte",
      ru: "По аэропорту на карту",
    },
    price: 9,
  },
  {
    id: "travel-socks",
    shape: "sock",
    name: {
      en: "Compression socks",
      zh: "压力袜",
      "zh-Hant": "壓力襪",
      ja: "着圧ソックス",
      es: "Calcetines de compresión",
      fr: "Chaussettes de contention",
      ru: "Компрессионные носки",
    },
    note: {
      en: "For a long leg",
      zh: "为长航段",
      "zh-Hant": "為長航段",
      ja: "長距離区間に",
      es: "Para un tramo largo",
      fr: "Pour un long tronçon",
      ru: "Для длинного участка",
    },
    price: 22,
  },
];

export const AISLES: Aisle[] = [
  {
    key: "shopSpirits",
    title: {
      en: "Spirits",
      zh: "烈酒",
      "zh-Hant": "烈酒",
      ja: "スピリッツ",
      es: "Licores",
      fr: "Spiritueux",
      ru: "Крепкие напитки",
    },
    items: SPIRITS,
  },
  {
    key: "shopScent",
    title: {
      en: "Scent and skin",
      zh: "香水与护肤",
      "zh-Hant": "香水與護膚",
      ja: "香りとスキンケア",
      es: "Perfume y piel",
      fr: "Parfum et soins",
      ru: "Ароматы и уход",
    },
    items: SCENT,
  },
  {
    key: "shopWorn",
    title: {
      en: "Worn",
      zh: "配饰",
      "zh-Hant": "配飾",
      ja: "身につけるもの",
      es: "Complementos",
      fr: "À porter",
      ru: "Аксессуары",
    },
    items: WORN,
  },
  {
    key: "shopOnboard",
    title: {
      en: "Only on board",
      zh: "机上限定",
      "zh-Hant": "機上限定",
      ja: "機内限定",
      es: "Sólo a bordo",
      fr: "Uniquement à bord",
      ru: "Только на борту",
    },
    items: ONBOARD,
  },
];

/** What this cabin is offered. */
export function aislesFor(cabin: CabinClass): Aisle[] {
  return AISLES.map((a) => ({
    ...a,
    items: a.items.filter((i) => !i.cabins || i.cabins.includes(cabin)),
  })).filter((a) => a.items.length > 0);
}

/** One currency, printed the way a trolley card prints it. */
export const price = (euros: number) => `€${euros}`;
