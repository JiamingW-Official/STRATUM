import type { Lang, Named } from "../i18n";

/**
 * A quiz about the sky the aircraft is in.
 *
 * The brief for this work asks for a cabin where passengers learn something
 * together, and the thing this work knows about is what is overhead and who
 * can see it. So the questions are its own subject, and each one carries where
 * the answer comes from — an IFE trivia round that cites its sources is an
 * odd object, which is rather the point.
 *
 * The last question is the argument rather than a fact, and it says so.
 */
export type Question = {
  q: Named;
  options: Named[];
  answer: number;
  why: Named;
  source: string;
};

export const QUESTIONS: Question[] = [
  {
    q: {
      en: "An aircraft broadcasting ADS-B is transmitting on which frequency?",
      zh: "一架广播 ADS-B 的飞机，用的是哪个频率？",
    },
    options: [
      { en: "1090 MHz", zh: "1090 MHz" },
      { en: "121.5 MHz", zh: "121.5 MHz" },
      { en: "2.4 GHz", zh: "2.4 GHz" },
    ],
    answer: 0,
    why: {
      en: "1090 MHz Extended Squitter is the worldwide link. In the United States lighter aircraft below 18,000 ft may use 978 MHz UAT instead.",
      zh: "全球通用的是 1090 MHz 扩展间歇信标。在美国，18,000 英尺以下的轻型飞机也可以改用 978 MHz UAT。",
    },
    source: "ICAO Annex 10 · FAA AC 20-165",
  },
  {
    q: {
      en: "Who receives most of the positions that flight-tracking sites show?",
      zh: "航班追踪网站上那些位置，多数是谁收到的？",
    },
    options: [
      { en: "Air traffic control", zh: "空管" },
      { en: "Volunteers with their own antennas", zh: "自己架天线的志愿者" },
      { en: "The airlines", zh: "航空公司" },
    ],
    answer: 1,
    why: {
      en: "The signal is unencrypted and anyone may listen. The public map of the sky is built by a volunteer receiver network, not by an authority — which is why it thins out where nobody lives.",
      zh: "信号不加密，谁都可以收。公开的天空地图是志愿者接收站网络拼出来的，不是哪个机构给的——所以没人住的地方它就稀了。",
    },
    source: "ADS-B Exchange · adsb.fi · airplanes.live",
  },
  {
    q: {
      en: "An aircraft is flying under a Privacy ICAO Address. What is hidden?",
      zh: "一架飞机使用隐私 ICAO 地址飞行。被藏起来的是什么？",
    },
    options: [
      { en: "Its position", zh: "它的位置" },
      { en: "Its identity", zh: "它的身份" },
      { en: "Both", zh: "两样都藏" },
    ],
    answer: 1,
    why: {
      en: "The aircraft keeps broadcasting where it is. What changes is the address it broadcasts under, so the position cannot be tied back to an owner. Present, positioned, unnamed.",
      zh: "飞机照常广播自己在哪。变的是它用什么地址广播，于是这个位置对不上任何一个所有者。在场、有坐标、没有名字。",
    },
    source: "FAA Privacy ICAO Address (PIA) programme",
  },
  {
    q: {
      en: "A track on the map breaks into a dashed line. What does that usually mean?",
      zh: "地图上一条航迹断成虚线，通常意味着什么？",
    },
    options: [
      { en: "The aircraft turned off its transponder", zh: "飞机关掉了应答机" },
      { en: "Nobody was listening there", zh: "那段路上没人在听" },
      { en: "The aircraft was descending", zh: "飞机在下降" },
    ],
    answer: 1,
    why: {
      en: "Over an ocean or an empty stretch of land there may be no receiver in range. The aircraft is still broadcasting; the hole is in the listening, not in the flying. Every dashed line in this cabin means the same thing.",
      zh: "在大洋上或者没人的地方，可能根本没有接收站在范围内。飞机照常在广播，缺的是「听」，不是「飞」。这个机舱里每一条虚线都是这个意思。",
    },
    source: "STRATUM · evidence notation",
  },
  {
    q: {
      en: "Roughly how far can a well-sited ground receiver hear an airliner at cruise?",
      zh: "一个位置好的地面接收站，大概能听到多远处巡航的客机？",
    },
    options: [
      { en: "About 50 km", zh: "大约 50 公里" },
      { en: "About 400 km", zh: "大约 400 公里" },
      { en: "About 2,000 km", zh: "大约 2000 公里" },
    ],
    answer: 1,
    why: {
      en: "1090 MHz is line of sight, so the limit is the horizon. From good ground to an aircraft at 11 km, that horizon is a few hundred kilometres — which is why coverage is a map of where people put antennas.",
      zh: "1090 MHz 走视距，所以极限就是地平线。从一个好的地面点到 11 公里高的飞机，这个地平线是几百公里——所以覆盖图其实是一张「人把天线架在哪」的地图。",
    },
    source: "Radio horizon, √(2Rh)",
  },
  {
    q: {
      en: "This work's own claim: where is it easier to be anonymous?",
      zh: "这件作品自己的论点：在哪里更容易做一个无名的人？",
    },
    options: [
      { en: "In the terminal", zh: "在航站楼里" },
      { en: "In the airspace above it", zh: "在它上方的空域里" },
    ],
    answer: 0,
    why: {
      en: "On the ground anonymity is free and ordinary — nobody asks a passenger for a reason. Overhead it has to be applied for, it is granted case by case, and the channel to apply barely exists outside the United States. That asymmetry is the argument of this piece, not a measurement.",
      zh: "在地面上，匿名是免费而且普遍的——没有人会问一个旅客为什么。在头顶上，匿名要申请、逐个批，而且美国以外几乎没有申请渠道。这个不对称是这件作品的论点，不是一个测量结果。",
    },
    source: "STRATUM · thesis",
  },
];

export const pickQ = (q: Named, lang: Lang) =>
  q[lang] || q.en;
