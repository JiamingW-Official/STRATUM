// Static ICAO → city name lookup — replaces broken adsbdb city-name enrichment.
// Covers ~500 major commercial airports worldwide.
const AIRPORTS = {
  // USA
  KATL:'Atlanta',KORD:'Chicago',KLAX:'Los Angeles',KDFW:'Dallas',KDEN:'Denver',
  KJFK:'New York',KSFO:'San Francisco',KSEA:'Seattle',KLAS:'Las Vegas',KMCO:'Orlando',
  KEWR:'Newark',KPHX:'Phoenix',KIAH:'Houston',KMIA:'Miami',KBOS:'Boston',
  KLGA:'New York',KDTW:'Detroit',KMSN:'Madison',KMSP:'Minneapolis',KPHL:'Philadelphia',
  KFLL:'Fort Lauderdale',KBWI:'Baltimore',KIAD:'Washington',KDCA:'Washington',
  KSLC:'Salt Lake City',KPDX:'Portland',KOAK:'Oakland',KSJC:'San Jose',KSNA:'Santa Ana',
  KHOU:'Houston',KMDW:'Chicago',KBNA:'Nashville',KCLT:'Charlotte',KMEM:'Memphis',
  KSTL:'St Louis',KRDU:'Raleigh',KSMF:'Sacramento',KTPA:'Tampa',KPBI:'Palm Beach',
  KABQ:'Albuquerque',KANC:'Anchorage',PHNL:'Honolulu',PHOG:'Maui',KOMA:'Omaha',
  KMCI:'Kansas City',KCVG:'Cincinnati',KCMH:'Columbus',KPIT:'Pittsburgh',KBUF:'Buffalo',
  KROC:'Rochester',KALB:'Albany',KBDL:'Hartford',KPVD:'Providence',KSYR:'Syracuse',
  KMHT:'Manchester',KBTV:'Burlington',KPWM:'Portland ME',KBGR:'Bangor',
  KRIC:'Richmond',KORF:'Norfolk',KCLT:'Charlotte',KGSO:'Greensboro',KCAE:'Columbia',
  KCHS:'Charleston',KSAV:'Savannah',KJAX:'Jacksonville',KPNS:'Pensacola',KMOB:'Mobile',
  KNEW:'New Orleans',KBTR:'Baton Rouge',KLIT:'Little Rock',KTUL:'Tulsa',KOKC:'Oklahoma City',
  KSAT:'San Antonio',KAUS:'Austin',KELP:'El Paso',KAMA:'Amarillo',KLBB:'Lubbock',
  KABI:'Abilene',KSJT:'San Angelo',KMAF:'Midland',KODQ:'Doha',KCOS:'Colorado Springs',
  KGJT:'Grand Junction',KBZN:'Bozeman',KBTM:'Butte',KGPI:'Kalispell',KFCA:'Kalispell',
  KSUN:'Sun Valley',KIDA:'Idaho Falls',KPSC:'Pasco',KYKM:'Yakima',KEAT:'Wenatchee',
  KBFI:'Seattle',KRNT:'Renton',KPAE:'Everett',KSFF:'Spokane',KGEG:'Spokane',
  KBOI:'Boise',KMFR:'Medford',KEUG:'Eugene',KRDM:'Redmond',KOTH:'North Bend',
  KCEC:'Crescent City',KRDD:'Redding',KFAT:'Fresno',KBFL:'Bakersfield',KSBP:'San Luis Obispo',
  KSMX:'Santa Maria',KSBA:'Santa Barbara',KONT:'Ontario',KPSP:'Palm Springs',KIPL:'El Centro',
  KSAN:'San Diego',KNKX:'San Diego',KMYF:'San Diego',KTOA:'Torrance',KBUR:'Burbank',
  KVNY:'Van Nuys',KLGB:'Long Beach',KFUL:'Fullerton',KSNA:'Orange County',
  KLAX:'Los Angeles',KHND:'Henderson',KVGT:'Las Vegas',KBAB:'Beale AFB',
  KRNO:'Reno',KTVL:'South Lake Tahoe',KMEV:'Minden',KMMH:'Mammoth Lakes',
  KSCK:'Stockton',KMOD:'Modesto',KMRY:'Monterey',KSNS:'Salinas',KWVI:'Watsonville',
  KSJC:'San Jose',KRHV:'San Jose',KNUQ:'Mountain View',KSQL:'San Carlos',KSFO:'San Francisco',
  KOAK:'Oakland',KCCR:'Concord',KLVK:'Livermore',KHWD:'Hayward',KAPC:'Napa',
  KSTS:'Santa Rosa',KUKI:'Ukiah',KACV:'Arcata',KMHS:'Auburn',KSAC:'Sacramento',KSMF:'Sacramento',
  KTRK:'Truckee',KTVL:'South Lake Tahoe',
  // Alaska
  PANC:'Anchorage',PAFA:'Fairbanks',PAJN:'Juneau',PAKT:'Ketchikan',PASN:'St Paul',PADQ:'Kodiak',
  // Hawaii
  PHNL:'Honolulu',PHOG:'Maui',PHKO:'Kailua-Kona',PHLI:'Lihue',PHHI:'Oahu',
  // Canada
  CYYZ:'Toronto',CYVR:'Vancouver',CYUL:'Montreal',CYEG:'Edmonton',CYYC:'Calgary',
  CYOW:'Ottawa',CYHZ:'Halifax',CYWG:'Winnipeg',CYYJ:'Victoria',CYLW:'Kelowna',
  CYXE:'Saskatoon',CYQR:'Regina',CYQT:'Thunder Bay',CYAM:'Sault Ste Marie',CYWH:'Victoria',
  // Mexico
  MMMX:'Mexico City',MMMY:'Monterrey',MMGL:'Guadalajara',MMTJ:'Tijuana',MMCU:'Chihuahua',
  MMCN:'Ciudad Obregon',MMMD:'Merida',MMUN:'Cancun',MMZT:'Mazatlan',MMPB:'Puebla',
  // Central America & Caribbean
  MROC:'San Jose',MGAS:'Tegucigalpa',MGGT:'Guatemala City',MNMG:'Managua',MPTO:'Panama City',
  MSSS:'San Salvador',TBPB:'Bridgetown',MKJP:'Kingston',MDSD:'Santo Domingo',TJSJ:'San Juan',
  MUVR:'Varadero',MUHA:'Havana',TNCM:'St Maarten',TFFR:'Pointe-a-Pitre',TFFF:'Fort-de-France',
  // South America
  SBGR:'São Paulo',SBGL:'Rio de Janeiro',SBSP:'São Paulo',SBCF:'Belo Horizonte',
  SBBE:'Belém',SBMO:'Maceio',SBREC:'Recife',SBSV:'Salvador',SBFZ:'Fortaleza',
  SBMN:'Manaus',SBBV:'Boa Vista',SBRF:'Recife',SBPA:'Porto Alegre',SBFL:'Florianopolis',
  SBCT:'Curitiba',SBCY:'Cuiaba',SBPV:'Porto Velho',SBBH:'Belo Horizonte',
  SAEZ:'Buenos Aires',SABE:'Buenos Aires',SACO:'Cordoba',SAMM:'Mendoza',SASJ:'Salta',
  SCFA:'Antofagasta',SCEL:'Santiago',SPIM:'Lima',SKBO:'Bogota',SEQM:'Quito',SEGU:'Guayaquil',
  SVMI:'Caracas',SMJP:'Paramaribo',SYCJ:'Georgetown',SUAA:'Montevideo',SLVR:'La Paz',
  SPTU:'Puerto Maldonado',SPZO:'Cusco',
  // UK & Ireland
  EGLL:'London Heathrow',EGKK:'London Gatwick',EGSS:'London Stansted',EGGW:'London Luton',
  EGCC:'Manchester',EGPH:'Edinburgh',EGPF:'Glasgow',EGBB:'Birmingham',EGGD:'Bristol',
  EGNX:'East Midlands',EGNT:'Newcastle',EGNJ:'Humberside',EGAA:'Belfast',EGAC:'Belfast City',
  EIDW:'Dublin',EICK:'Cork',EINN:'Shannon',
  // Western Europe
  LFPG:'Paris CDG',LFPO:'Paris Orly',LFLY:'Lyon',LFMN:'Nice',LFLL:'Lyon',LFML:'Marseille',
  LFBD:'Bordeaux',LFBO:'Toulouse',LFRS:'Nantes',LFRN:'Rennes',LFST:'Strasbourg',
  EDDF:'Frankfurt',EDDL:'Düsseldorf',EDDM:'Munich',EDDB:'Berlin',EDDI:'Berlin',
  EDDH:'Hamburg',EDDS:'Stuttgart',EDDV:'Hanover',EDDN:'Nuremberg',EDDP:'Leipzig',
  EHAM:'Amsterdam',EHBK:'Maastricht',EHGG:'Groningen',EHRD:'Rotterdam',
  EBBR:'Brussels',EBCI:'Charleroi',ELLX:'Luxembourg',
  LEMD:'Madrid',LEBL:'Barcelona',LEPA:'Palma',LEAL:'Alicante',LEMG:'Malaga',
  LEBB:'Bilbao',LESO:'San Sebastian',LEVT:'Vitoria',LEZL:'Seville',LEGR:'Granada',
  LPPT:'Lisbon',LPPR:'Porto',LPFR:'Faro',LPLA:'Azores',
  LIRF:'Rome Fiumicino',LIML:'Milan Linate',LIME:'Bergamo',LIMC:'Milan Malpensa',
  LIPZ:'Venice',LIRQ:'Florence',LIRN:'Naples',LICJ:'Palermo',LICC:'Catania',LICA:'Lamezia Terme',
  LSZH:'Zurich',LSGG:'Geneva',LSZA:'Lugano',LSZB:'Bern',
  LOWI:'Innsbruck',LOWW:'Vienna',LOWS:'Salzburg',LOWK:'Klagenfurt',
  LHBP:'Budapest',LKPR:'Prague',EPWA:'Warsaw',EPKK:'Krakow',EPGD:'Gdansk',
  OKBK:'Kuwait',LEAL:'Alicante',
  // Scandinavia & Baltic
  EKCH:'Copenhagen',ESGG:'Gothenburg',ESSA:'Stockholm',ESKN:'Stockholm Skavsta',
  EFHK:'Helsinki',EFTP:'Tampere',EFTU:'Turku',ENGM:'Oslo',ENBR:'Bergen',ENVA:'Trondheim',
  EVRA:'Riga',EYVI:'Vilnius',EETN:'Tallinn',
  // Eastern Europe
  UUEE:'Moscow Sheremetyevo',UUDD:'Moscow Domodedovo',UUBW:'Moscow Zhukovsky',
  UKBB:'Kyiv Boryspil',UKLL:'Lviv',LROP:'Bucharest',LWSK:'Skopje',LBSF:'Sofia',
  LDZA:'Zagreb',LJLJ:'Ljubljana',LYBE:'Belgrade',LYNI:'Nis',LWOH:'Ohrid',
  LGAV:'Athens',LGTS:'Thessaloniki',LGKR:'Corfu',LGRP:'Rhodes',LGIR:'Heraklion',
  LTBA:'Istanbul Ataturk',LTFM:'Istanbul',LTAI:'Antalya',LTBJ:'Izmir',LTAC:'Ankara',
  // Middle East
  OMDB:'Dubai',OMDW:'Dubai World Central',OMAA:'Abu Dhabi',OMSJ:'Sharjah',
  OERK:'Riyadh',OEDF:'Dammam',OEJN:'Jeddah',OEMD:'Madinah',OETF:'Taif',
  OKBK:'Kuwait City',OEAB:'Abha',OOMM:'Muscat',OIKB:'Bandar Abbas',OIII:'Tehran',
  OBBI:'Bahrain',OTHH:'Doha',OLBA:'Beirut',ORBI:'Baghdad',OSDI:'Damascus',HECA:'Cairo',
  LLBG:'Tel Aviv',OJAM:'Amman',
  // Africa
  HECA:'Cairo',HEAT:'Aswan',HELX:'Luxor',HESH:'Sharm el-Sheikh',HEAR:'El Arish',
  GMMN:'Casablanca',GMME:'Rabat',GMFM:'Marrakech',GMTT:'Tangier',DTTJ:'Djerba',
  DTTA:'Tunis',DAAG:'Algiers',DTMB:'Monastir',DTNH:'Enfidha',
  HAAB:'Addis Ababa',HKJK:'Nairobi',FMMI:'Antananarivo',FMCH:'Moroni',
  FAOR:'Johannesburg',FACT:'Cape Town',FALE:'Durban',FAGM:'Johannesburg Rand',
  FBSK:'Gaborone',FWKI:'Lilongwe',FQMA:'Maputo',FVHA:'Harare',FLLK:'Lusaka',
  FYWH:'Windhoek',FMCH:'Comoros',HLLT:'Tripoli',FSPP:'Mahé',
  DNMM:'Lagos',DNAS:'Abuja',DIKO:'Abidjan',DFFD:'Ouagadougou',DIAP:'Abidjan',
  GVNP:'Santiago (Cape Verde)',GOBD:'Dakar',GUCY:'Conakry',GBYD:'Banjul',
  // South & SE Asia
  VABB:'Mumbai',VIDP:'New Delhi',VOMM:'Chennai',VOHS:'Hyderabad',VOBL:'Bangalore',
  VECC:'Kolkata',VOMR:'Mumbai',VOCB:'Coimbatore',VOGO:'Goa',VIKN:'Lucknow',
  VOAT:'Pune',VIAR:'Amritsar',VIAI:'Ahmedabad',VIBR:'Bhopal',VEJH:'Jhansi',
  VNTC:'Kathmandu',VGHS:'Dhaka',VCBI:'Colombo',VRMM:'Malé',OPKC:'Karachi',
  OPLA:'Lahore',OPRN:'Islamabad',OPPS:'Peshawar',OPQT:'Quetta',
  VHHH:'Hong Kong',VMMC:'Macau',RCTP:'Taipei',RCSS:'Taipei Songshan',RCKH:'Kaohsiung',
  WSSS:'Singapore',WMKK:'Kuala Lumpur',VTBS:'Bangkok Suvarnabhumi',VTBD:'Bangkok Don Mueang',
  WMKP:'Penang',WMKD:'Kota Bahru',WBGG:'Kuching',WBKK:'Kota Kinabalu',WADD:'Bali',
  WIII:'Jakarta',WIDD:'Jakarta Halim',WRLL:'Balikpapan',WAMM:'Manado',WAPP:'Palu',
  RPLL:'Manila',RPLC:'Clark',RPMD:'Davao',RPMZ:'Zamboanga',RPLM:'Puerto Princesa',
  VDPP:'Phnom Penh',VVNB:'Hanoi',VVTS:'Ho Chi Minh City',VVDN:'Da Nang',VLVT:'Vientiane',
  VYYY:'Yangon',RKSI:'Seoul Incheon',RKSS:'Seoul Gimpo',RKPK:'Busan',RJTT:'Tokyo Haneda',
  RJAA:'Tokyo Narita',RJOO:'Osaka Itami',RJBB:'Osaka Kansai',RJCC:'Sapporo',RJFF:'Fukuoka',
  RJKK:'Jeju',RCBS:'Kinmen',
  // China
  ZBAA:'Beijing Capital',ZBAD:'Beijing Daxing',ZSPD:'Shanghai Pudong',ZSSS:'Shanghai Hongqiao',
  ZGGG:'Guangzhou',ZGSZ:'Shenzhen',ZUCK:'Chongqing',ZUUU:'Chengdu',ZLXY:'Xian',
  ZSNJ:'Nanjing',ZSHC:'Hangzhou',ZSFZ:'Fuzhou',ZSAM:'Xiamen',ZGHA:'Changsha',
  ZSQD:'Qingdao',ZYTX:'Shenyang',ZYHB:'Harbin',ZYCC:'Changchun',ZLLL:'Lanzhou',
  ZWWW:'Ürümqi',ZPPP:'Kunming',ZGNN:'Nanning',ZGOW:'Shantou',ZGZH:'Zhuhai',
  // Oceania
  YSSY:'Sydney',YMML:'Melbourne',YBBN:'Brisbane',YPPH:'Perth',YPAD:'Adelaide',
  YBCG:'Gold Coast',YMHB:'Hobart',YMEN:'Melbourne Essendon',YCBR:'Canberra',
  YBCS:'Cairns',YBMK:'Mackay',YBRK:'Rockhampton',YPDN:'Darwin',YBTL:'Townsville',
  NZAA:'Auckland',NZCH:'Christchurch',NZWN:'Wellington',NZQN:'Queenstown',
  NFNA:'Suva',NTAA:'Papeete',NWWW:'Nouméa',AGGH:'Honiara',ANYN:'Nauru',
  PGUM:'Guam',PGSN:'Saipan',PHTO:'Hilo',
};

// IATA 3-letter → city name lookup (built from CITIES array at runtime)
let _iataMap = null;

/**
 * Initialize IATA lookup from CITIES array (call once during app init)
 */
export function initAirportCities(cities) {
  _iataMap = {};
  for (const c of cities) {
    if (c.code && c.name) _iataMap[c.code.toUpperCase()] = c.name;
  }
}

/**
 * Returns the city name for an airport code, or null if unknown.
 * Accepts ICAO 4-letter codes (KLAX), IATA 3-letter codes (LAX), or mixed.
 */
export function getAirportCity(code) {
  if (!code) return null;
  const uc = code.toUpperCase();

  // 1. Direct ICAO lookup
  const icaoHit = AIRPORTS[uc];
  if (icaoHit) return icaoHit;

  // 2. IATA lookup (from CITIES array)
  if (_iataMap && _iataMap[uc]) return _iataMap[uc];

  // 3. Try ICAO prefix heuristics for IATA codes:
  //    US: K + code, Canada: C + code (CY__), etc.
  if (uc.length === 3) {
    const kPrefix = AIRPORTS['K' + uc];
    if (kPrefix) return kPrefix;
    // Hawaii/Alaska
    const pPrefix = AIRPORTS['P' + uc];
    if (pPrefix) return pPrefix;
  }

  return null;
}
