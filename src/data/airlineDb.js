// ---------------------------------------------------------------------------
// ICAO 3-letter airline designator -> airline name mapping
// Source: ICAO Doc 8585 / public airline databases
// ---------------------------------------------------------------------------

const AIRLINES = {
  // ── US Majors ─────────────────────────────────────────────────────────────
  UAL: 'United Airlines',
  AAL: 'American Airlines',
  DAL: 'Delta Air Lines',
  SWA: 'Southwest Airlines',
  JBU: 'JetBlue Airways',
  ASA: 'Alaska Airlines',
  NKS: 'Spirit Airlines',
  FFT: 'Frontier Airlines',
  AAY: 'Allegiant Air',
  HAL: 'Hawaiian Airlines',
  SCX: 'Sun Country Airlines',
  MXY: 'Breeze Airways',
  AVP: 'Avelo Airlines',

  // ── US Regionals ──────────────────────────────────────────────────────────
  SKW: 'SkyWest Airlines',
  RPA: 'Republic Airways',
  ENY: 'Envoy Air',
  JIA: 'PSA Airlines',
  PDT: 'Piedmont Airlines',
  ASH: 'Mesa Air Group',
  GJS: 'GoJet Airlines',
  AWI: 'Air Wisconsin',
  CMB: 'CommutAir',
  EDV: 'Endeavor Air',
  QXE: 'Horizon Air',
  CPZ: 'Compass Airlines',
  TRS: 'Trans States Airlines',

  // ── Canada ────────────────────────────────────────────────────────────────
  ACA: 'Air Canada',
  WJA: 'WestJet',
  POE: 'Porter Airlines',
  FLE: 'Flair Airlines',
  SWG: 'Sunwing Airlines',
  ROU: 'Air Canada Rouge',
  TSC: 'Air Transat',
  WEN: 'WestJet Encore',
  JZA: 'Jazz Aviation',

  // ── Mexico ────────────────────────────────────────────────────────────────
  AMX: 'Aeromexico',
  VOI: 'Volaris',
  VIV: 'VivaAerobus',
  SLI: 'Aeromexico Connect',
  MXA: 'Mexicana de Aviacion',

  // ── Central America & Caribbean ───────────────────────────────────────────
  CMP: 'Copa Airlines',
  AVA: 'Avianca',
  RPB: 'Aerorepublica',
  BWA: 'Caribbean Airlines',
  CAY: 'Cayman Airways',
  LRC: 'LACSA',

  // ── South America ─────────────────────────────────────────────────────────
  LAN: 'LATAM Airlines Chile',
  TAM: 'LATAM Airlines Brasil',
  GLO: 'Gol Transportes Aereos',
  AZU: 'Azul Brazilian Airlines',
  JAT: 'JetSMART',
  ARG: 'Aerolineas Argentinas',
  BOV: 'Boliviana de Aviacion',
  SKU: 'Sky Airline',
  VCV: 'Viva Air Colombia',
  LAP: 'LATAM Airlines Paraguay',
  LAW: 'LATAM Airlines Colombia',
  ONE: 'LATAM Airlines Peru',

  // ── United Kingdom & Ireland ──────────────────────────────────────────────
  BAW: 'British Airways',
  EZY: 'easyJet',
  VIR: 'Virgin Atlantic',
  TOM: 'TUI Airways',
  LOG: 'Loganair',
  SHT: 'British Airways Shuttle',
  EZS: 'easyJet Switzerland',
  EIN: 'Aer Lingus',
  RYR: 'Ryanair',
  RUK: 'Ryanair UK',
  BEE: 'Flybe',

  // ── Germany ───────────────────────────────────────────────────────────────
  DLH: 'Lufthansa',
  EWG: 'Eurowings',
  CFG: 'Condor',
  GWI: 'Germanwings',
  TUI: 'TUI fly Deutschland',
  BOX: 'Aerologic',

  // ── France ────────────────────────────────────────────────────────────────
  AFR: 'Air France',
  HOP: 'HOP!',
  CRL: 'Corsair International',
  FBU: 'French Bee',
  TVF: 'Transavia France',

  // ── Netherlands ───────────────────────────────────────────────────────────
  KLM: 'KLM Royal Dutch Airlines',
  TRA: 'Transavia',
  MPH: 'Martinair',

  // ── Scandinavia & Finland ─────────────────────────────────────────────────
  SAS: 'SAS Scandinavian Airlines',
  FIN: 'Finnair',
  NAX: 'Norwegian Air Shuttle',
  NSW: 'Norwegian Air Sweden',
  NOZ: 'Norwegian Air International',
  WIF: 'Wideroe',

  // ── Spain & Portugal ──────────────────────────────────────────────────────
  IBE: 'Iberia',
  IBS: 'Iberia Express',
  VLG: 'Vueling',
  ANE: 'Air Nostrum',
  TAP: 'TAP Air Portugal',
  PGA: 'Portugalia Airlines',

  // ── Italy ─────────────────────────────────────────────────────────────────
  ITY: 'ITA Airways',
  NOS: 'Neos',

  // ── Switzerland & Austria ─────────────────────────────────────────────────
  SWR: 'Swiss International Air Lines',
  AUA: 'Austrian Airlines',
  EDW: 'Edelweiss Air',

  // ── Central/Eastern Europe ────────────────────────────────────────────────
  LOT: 'LOT Polish Airlines',
  WZZ: 'Wizz Air',
  CSA: 'Czech Airlines',
  ROT: 'TAROM',
  BUC: 'Bulgaria Air',
  JAF: 'SmartWings',
  AEE: 'Aegean Airlines',

  // ── Turkey ────────────────────────────────────────────────────────────────
  THY: 'Turkish Airlines',
  PGT: 'Pegasus Airlines',
  SXS: 'SunExpress',
  AJA: 'AnadoluJet',

  // ── Russia & CIS ──────────────────────────────────────────────────────────
  AFL: 'Aeroflot',
  SDM: 'Rossiya Airlines',
  SVR: 'Ural Airlines',
  SBI: 'S7 Airlines',
  AZO: 'Azimuth Airlines',
  AHY: 'Azerbaijan Airlines',
  TSO: 'Transaero Airlines',
  GSW: 'Utair Aviation',
  KAR: 'Belavia',
  AUI: 'Ukraine International Airlines',

  // ── Iceland ───────────────────────────────────────────────────────────────
  ICE: 'Icelandair',
  FIA: 'PLAY',

  // ── Middle East ───────────────────────────────────────────────────────────
  UAE: 'Emirates',
  QTR: 'Qatar Airways',
  ETD: 'Etihad Airways',
  SVA: 'Saudia',
  GFA: 'Gulf Air',
  OMA: 'Oman Air',
  MEA: 'Middle East Airlines',
  RJA: 'Royal Jordanian',
  FDB: 'flydubai',
  ABY: 'Air Arabia',
  KAC: 'Kuwait Airways',
  IAW: 'Iraqi Airways',
  IRC: 'Iran Air',
  MSY: 'Air Cairo',
  NIA: 'Nile Air',
  FDY: 'Jazeera Airways',
  SAI: 'SalamAir',
  THD: 'flynas',

  // ── South Asia ────────────────────────────────────────────────────────────
  AIC: 'Air India',
  IGO: 'IndiGo',
  SEJ: 'SpiceJet',
  AXB: 'Air India Express',
  VTI: 'Vistara',
  AKJ: 'Akasa Air',
  ALK: 'SriLankan Airlines',
  BDB: 'Biman Bangladesh Airlines',
  PIA: 'Pakistan International Airlines',

  // ── China ─────────────────────────────────────────────────────────────────
  CCA: 'Air China',
  CES: 'China Eastern Airlines',
  CSN: 'China Southern Airlines',
  CHH: 'Hainan Airlines',
  CXA: 'Xiamen Airlines',
  CSZ: 'Shenzhen Airlines',
  CQH: 'Spring Airlines',
  CDG: 'Shandong Airlines',
  CSC: 'Sichuan Airlines',
  CUA: 'China United Airlines',
  DKH: 'Juneyao Airlines',
  GCR: 'Tianjin Airlines',
  HXA: 'China Express Airlines',
  CBJ: 'Beijing Capital Airlines',
  CDC: 'Chengdu Airlines',
  GDC: 'Grand China Air',

  // ── Japan ─────────────────────────────────────────────────────────────────
  ANA: 'All Nippon Airways',
  JAL: 'Japan Airlines',
  APJ: 'Peach Aviation',
  JJP: 'Jetstar Japan',
  SKY: 'Skymark Airlines',
  SFJ: 'StarFlyer',
  ADO: 'Air Do',
  SNJ: 'Solaseed Air',

  // ── South Korea ───────────────────────────────────────────────────────────
  KAL: 'Korean Air',
  AAR: 'Asiana Airlines',
  JNA: 'Jin Air',
  JJA: 'Jeju Air',
  TWB: 'T\'way Air',
  ABL: 'Air Busan',
  ESR: 'Eastar Jet',
  AIH: 'Air Premia',

  // ── Southeast Asia ────────────────────────────────────────────────────────
  SIA: 'Singapore Airlines',
  SLK: 'SilkAir',
  TGW: 'Scoot',
  MAS: 'Malaysia Airlines',
  AXM: 'AirAsia',
  XAX: 'AirAsia X',
  AIQ: 'AirAsia India',
  THA: 'Thai Airways',
  TLM: 'Thai Lion Air',
  VJC: 'VietJet Air',
  HVN: 'Vietnam Airlines',
  GIA: 'Garuda Indonesia',
  LNI: 'Lion Air',
  BTK: 'Batik Air',
  SJY: 'Sriwijaya Air',
  CEB: 'Cebu Pacific',
  PAL: 'Philippine Airlines',
  APG: 'Air Philippines',

  // ── Taiwan ────────────────────────────────────────────────────────────────
  EVA: 'EVA Air',
  CAL: 'China Airlines',
  SJX: 'Starlux Airlines',
  TNA: 'Tigerair Taiwan',
  MDA: 'Mandarin Airlines',

  // ── Hong Kong & Macau ─────────────────────────────────────────────────────
  CPA: 'Cathay Pacific',
  HKE: 'HK Express',
  CRK: 'Hong Kong Airlines',
  NMG: 'Air Macau',

  // ── Mongolia & Central Asia ───────────────────────────────────────────────
  MGL: 'MIAT Mongolian Airlines',
  KZR: 'Air Astana',
  FLY: 'FlyArystan',
  UZB: 'Uzbekistan Airways',

  // ── Australia & New Zealand ───────────────────────────────────────────────
  QFA: 'Qantas Airways',
  ANZ: 'Air New Zealand',
  VOZ: 'Virgin Australia',
  JST: 'Jetstar Airways',
  REX: 'Regional Express Airlines',
  NTL: 'National Jet Express',

  // ── Pacific Islands ───────────────────────────────────────────────────────
  FJI: 'Fiji Airways',
  TPC: 'Air Caledonie',
  AIP: 'Air Pacific',
  NZM: 'Air Nelson',

  // ── Africa ────────────────────────────────────────────────────────────────
  ETH: 'Ethiopian Airlines',
  SAA: 'South African Airways',
  KQA: 'Kenya Airways',
  MSR: 'EgyptAir',
  RAM: 'Royal Air Maroc',
  DTA: 'TAAG Angola Airlines',
  RWD: 'RwandAir',
  NGA: 'Air Nigeria',
  APK: 'Air Peace',
  MNO: 'Air Senegal',
  SWM: 'Arik Air',
  TUN: 'Tunisair Express',
  DAH: 'Air Algerie',
  LAM: 'LAM Mozambique Airlines',
  TCX: 'Fastjet',
  QTQ: 'ASKY Airlines',
  MWI: 'Malawian Airlines',
  UGA: 'Uganda Airlines',
  NMB: 'Air Namibia',

  // ── Cargo Airlines ────────────────────────────────────────────────────────
  FDX: 'FedEx Express',
  UPS: 'United Parcel Service',
  GTI: 'Atlas Air',
  PAC: 'Polar Air Cargo',
  CLX: 'Cargolux',
  CKS: 'Kalitta Air',
  WGN: 'Western Global Airlines',
  ABX: 'ABX Air',
  BCS: 'European Air Transport (DHL)',
  DHK: 'DHL Air',
  DAE: 'DHL Aviation',
  ABW: 'AirBridgeCargo Airlines',
  SQC: 'Singapore Airlines Cargo',
  CAO: 'Air China Cargo',
  CKK: 'China Cargo Airlines',
  KER: 'Air Hong Kong (DHL)',
  ICL: 'CAL Cargo Airlines',
  NCA: 'Nippon Cargo Airlines',
  GEC: 'Lufthansa Cargo',
  CLU: 'Cargolux Italia',
  SRN: 'Southern Air',
  ASI: 'Air Cargo Global',
  ATN: 'Air Transport International',
  TWY: 'Amerijet International',
  SQS: 'Silk Way West Airlines',

  // ── Charter / ACMI / Specialty ────────────────────────────────────────────
  OAE: 'Omni Air International',
  WAL: 'World Atlantic Airlines',
  NCR: 'National Airlines',
  TPD: 'iAero Airways',
  ART: 'SmartLynx Airlines',
  HFY: 'Hi Fly',
  MNB: 'MN Airlines',
  MAC: 'Maersk Air',
  AHK: 'Air Hong Kong',
  MPD: 'Air Plus Comet',
  XLA: 'XL Airways France',

  // ── Low-cost Europe (additional) ──────────────────────────────────────────
  TVS: 'SmartWings',
  BLA: 'Blue Air',
  VAS: 'SATA Azores Airlines',
  NAP: 'Norwegian Air Argentina',
  NOK: 'Nok Air',
  WAT: 'Wizz Air Abu Dhabi',
  WUK: 'Wizz Air UK',

  // ── Additional Global Airlines ────────────────────────────────────────────
  CYP: 'Cyprus Airways',
  AMC: 'Air Malta',
  BEL: 'Brussels Airlines',
  LGL: 'Luxair',
  TAR: 'Tunisair',
  SXR: 'SkyExpress',
  VOE: 'Volotea',
  LZB: 'Bulgaria Air',
  AEA: 'Air Europa',
  GAI: 'Georgian Airways',
  TUA: 'Turkmenistan Airlines',
  TJK: 'Tajik Air',
  AZS: 'Azores Airlines',
  HYS: 'HiSky',
  FWI: 'French West Indies Express',
  FPO: 'ASL Airlines France',

  // ── Business / Private Jet Operators ──────────────────────────────────────
  EJA: 'NetJets',
  LXJ: 'Flexjet',
  XOJ: 'XOJET',
  RNT: 'Wheels Up',
  JTL: 'Jet Linx Aviation',

  // ── More Asia & Middle East ───────────────────────────────────────────────
  RBA: 'Royal Brunei Airlines',
  DAR: 'Air Dolomiti',
  BTV: 'Druk Air',
  MXD: 'Malindo Air',
  AIZ: 'Arkia Israeli Airlines',
  ELY: 'El Al Israel Airlines',
  IRM: 'Mahan Air',
  QNZ: 'Air New Zealand Link',
  RAC: 'Ryukyu Air Commuter',
  AIR: 'Air Inter',

  // ── More Americas ─────────────────────────────────────────────────────────
  AMW: 'Air Midwest',
  BTA: 'TACA International Airlines',
  LPR: 'LAPA',
  WJT: 'Swoop',
  TPA: 'TAME',
  BHS: 'Bahamasair',
  CBE: 'Cobalt Air',

  // ── Additional well-known airlines ────────────────────────────────────────
  MON: 'Monarch Airlines',
  BCY: 'Cityjet',
  CLH: 'Lufthansa CityLine',
  ENT: 'Enter Air',
  SUS: 'Sun Air of Scandinavia',
  KLC: 'KLM Cityhopper',
  BAG: 'Binter Canarias',
  CND: 'Corendon Airlines',
  PBD: 'Pobeda',
  CAW: 'Comair',
  MNA: 'Merpati Nusantara Airlines',
  FCA: 'Freebird Airlines',
};

/**
 * Look up the airline name for a given ICAO 3-letter designator.
 * @param {string} icaoCode - The ICAO airline code (e.g. "UAL", "DAL").
 * @returns {string|null} The airline name, or null if not found.
 */
export function getAirlineName(icaoCode) {
  if (!icaoCode) return null;
  return AIRLINES[icaoCode.toUpperCase()] || null;
}
