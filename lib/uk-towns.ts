// Curated list of UK towns for the programmatic SEO landing pages.
// Pick is biased toward (a) population centres with strong search volume
// and (b) smaller market towns in pet- and equine-rich regions where
// the directory has a realistic shot at ranking.
//
// Coordinates are pre-baked to avoid a geocoding round-trip on every
// page render.  Source: rough OS-grid-derived centres for each town.

export interface UkTown {
  slug: string;
  name: string;
  county: string;
  lat: number;
  lng: number;
}

export const UK_TOWNS: UkTown[] = [
  // England — major cities & metros
  { slug: "london", name: "London", county: "Greater London", lat: 51.5074, lng: -0.1278 },
  { slug: "birmingham", name: "Birmingham", county: "West Midlands", lat: 52.4862, lng: -1.8904 },
  { slug: "manchester", name: "Manchester", county: "Greater Manchester", lat: 53.4808, lng: -2.2426 },
  { slug: "leeds", name: "Leeds", county: "West Yorkshire", lat: 53.8008, lng: -1.5491 },
  { slug: "liverpool", name: "Liverpool", county: "Merseyside", lat: 53.4084, lng: -2.9916 },
  { slug: "sheffield", name: "Sheffield", county: "South Yorkshire", lat: 53.3811, lng: -1.4701 },
  { slug: "bristol", name: "Bristol", county: "Bristol", lat: 51.4545, lng: -2.5879 },
  { slug: "newcastle", name: "Newcastle upon Tyne", county: "Tyne and Wear", lat: 54.9783, lng: -1.6178 },
  { slug: "leicester", name: "Leicester", county: "Leicestershire", lat: 52.6369, lng: -1.1398 },
  { slug: "nottingham", name: "Nottingham", county: "Nottinghamshire", lat: 52.9548, lng: -1.1581 },
  { slug: "coventry", name: "Coventry", county: "West Midlands", lat: 52.4068, lng: -1.5197 },
  { slug: "southampton", name: "Southampton", county: "Hampshire", lat: 50.9097, lng: -1.4044 },
  { slug: "portsmouth", name: "Portsmouth", county: "Hampshire", lat: 50.8198, lng: -1.0880 },
  { slug: "plymouth", name: "Plymouth", county: "Devon", lat: 50.3755, lng: -4.1427 },
  { slug: "stoke-on-trent", name: "Stoke-on-Trent", county: "Staffordshire", lat: 53.0027, lng: -2.1794 },
  { slug: "derby", name: "Derby", county: "Derbyshire", lat: 52.9225, lng: -1.4746 },
  { slug: "wolverhampton", name: "Wolverhampton", county: "West Midlands", lat: 52.5862, lng: -2.1287 },
  { slug: "norwich", name: "Norwich", county: "Norfolk", lat: 52.6309, lng: 1.2974 },
  { slug: "ipswich", name: "Ipswich", county: "Suffolk", lat: 52.0567, lng: 1.1482 },
  { slug: "reading", name: "Reading", county: "Berkshire", lat: 51.4543, lng: -0.9781 },
  { slug: "oxford", name: "Oxford", county: "Oxfordshire", lat: 51.7520, lng: -1.2577 },
  { slug: "cambridge", name: "Cambridge", county: "Cambridgeshire", lat: 52.2053, lng: 0.1218 },
  { slug: "brighton", name: "Brighton", county: "East Sussex", lat: 50.8225, lng: -0.1372 },
  { slug: "bournemouth", name: "Bournemouth", county: "Dorset", lat: 50.7192, lng: -1.8808 },
  { slug: "york", name: "York", county: "North Yorkshire", lat: 53.9600, lng: -1.0873 },
  { slug: "exeter", name: "Exeter", county: "Devon", lat: 50.7184, lng: -3.5339 },
  { slug: "bath", name: "Bath", county: "Somerset", lat: 51.3811, lng: -2.3590 },
  { slug: "cheltenham", name: "Cheltenham", county: "Gloucestershire", lat: 51.9000, lng: -2.0700 },
  { slug: "gloucester", name: "Gloucester", county: "Gloucestershire", lat: 51.8642, lng: -2.2382 },
  { slug: "chester", name: "Chester", county: "Cheshire", lat: 53.1934, lng: -2.8931 },
  { slug: "lincoln", name: "Lincoln", county: "Lincolnshire", lat: 53.2307, lng: -0.5406 },
  { slug: "salisbury", name: "Salisbury", county: "Wiltshire", lat: 51.0688, lng: -1.7945 },
  { slug: "canterbury", name: "Canterbury", county: "Kent", lat: 51.2802, lng: 1.0789 },
  { slug: "winchester", name: "Winchester", county: "Hampshire", lat: 51.0632, lng: -1.3080 },
  { slug: "shrewsbury", name: "Shrewsbury", county: "Shropshire", lat: 52.7077, lng: -2.7540 },
  { slug: "hereford", name: "Hereford", county: "Herefordshire", lat: 52.0567, lng: -2.7160 },
  { slug: "worcester", name: "Worcester", county: "Worcestershire", lat: 52.1936, lng: -2.2215 },

  // Equestrian / pet-rich smaller towns
  { slug: "lutterworth", name: "Lutterworth", county: "Leicestershire", lat: 52.4577, lng: -1.2018 },
  { slug: "holmfirth", name: "Holmfirth", county: "West Yorkshire", lat: 53.5717, lng: -1.7869 },
  { slug: "harrogate", name: "Harrogate", county: "North Yorkshire", lat: 53.9919, lng: -1.5418 },
  { slug: "skipton", name: "Skipton", county: "North Yorkshire", lat: 53.9620, lng: -2.0179 },
  { slug: "kendal", name: "Kendal", county: "Cumbria", lat: 54.3287, lng: -2.7470 },
  { slug: "windermere", name: "Windermere", county: "Cumbria", lat: 54.3804, lng: -2.9050 },
  { slug: "buxton", name: "Buxton", county: "Derbyshire", lat: 53.2588, lng: -1.9134 },
  { slug: "bakewell", name: "Bakewell", county: "Derbyshire", lat: 53.2126, lng: -1.6753 },
  { slug: "matlock", name: "Matlock", county: "Derbyshire", lat: 53.1390, lng: -1.5570 },
  { slug: "newmarket", name: "Newmarket", county: "Suffolk", lat: 52.2425, lng: 0.4055 },
  { slug: "lambourn", name: "Lambourn", county: "Berkshire", lat: 51.5103, lng: -1.5380 },
  { slug: "cirencester", name: "Cirencester", county: "Gloucestershire", lat: 51.7163, lng: -1.9683 },
  { slug: "tetbury", name: "Tetbury", county: "Gloucestershire", lat: 51.6378, lng: -2.1604 },
  { slug: "chipping-norton", name: "Chipping Norton", county: "Oxfordshire", lat: 51.9410, lng: -1.5460 },
  { slug: "stow-on-the-wold", name: "Stow-on-the-Wold", county: "Gloucestershire", lat: 51.9286, lng: -1.7235 },
  { slug: "stratford-upon-avon", name: "Stratford-upon-Avon", county: "Warwickshire", lat: 52.1917, lng: -1.7083 },
  { slug: "leamington-spa", name: "Leamington Spa", county: "Warwickshire", lat: 52.2920, lng: -1.5350 },
  { slug: "warwick", name: "Warwick", county: "Warwickshire", lat: 52.2819, lng: -1.5849 },
  { slug: "rugby", name: "Rugby", county: "Warwickshire", lat: 52.3705, lng: -1.2660 },
  { slug: "market-harborough", name: "Market Harborough", county: "Leicestershire", lat: 52.4763, lng: -0.9201 },
  { slug: "melton-mowbray", name: "Melton Mowbray", county: "Leicestershire", lat: 52.7665, lng: -0.8865 },
  { slug: "grantham", name: "Grantham", county: "Lincolnshire", lat: 52.9117, lng: -0.6403 },
  { slug: "huddersfield", name: "Huddersfield", county: "West Yorkshire", lat: 53.6458, lng: -1.7850 },
  { slug: "halifax", name: "Halifax", county: "West Yorkshire", lat: 53.7252, lng: -1.8635 },
  { slug: "ilkley", name: "Ilkley", county: "West Yorkshire", lat: 53.9252, lng: -1.8237 },
  { slug: "ripon", name: "Ripon", county: "North Yorkshire", lat: 54.1349, lng: -1.5237 },
  { slug: "thirsk", name: "Thirsk", county: "North Yorkshire", lat: 54.2334, lng: -1.3438 },
  { slug: "richmond", name: "Richmond", county: "North Yorkshire", lat: 54.4030, lng: -1.7370 },
  { slug: "northallerton", name: "Northallerton", county: "North Yorkshire", lat: 54.3392, lng: -1.4350 },
  { slug: "penrith", name: "Penrith", county: "Cumbria", lat: 54.6638, lng: -2.7530 },
  { slug: "carlisle", name: "Carlisle", county: "Cumbria", lat: 54.8924, lng: -2.9326 },
  { slug: "kings-lynn", name: "King's Lynn", county: "Norfolk", lat: 52.7517, lng: 0.3996 },
  { slug: "bury-st-edmunds", name: "Bury St Edmunds", county: "Suffolk", lat: 52.2476, lng: 0.7184 },
  { slug: "tunbridge-wells", name: "Tunbridge Wells", county: "Kent", lat: 51.1325, lng: 0.2637 },
  { slug: "sevenoaks", name: "Sevenoaks", county: "Kent", lat: 51.2719, lng: 0.1908 },
  { slug: "horsham", name: "Horsham", county: "West Sussex", lat: 51.0628, lng: -0.3260 },
  { slug: "chichester", name: "Chichester", county: "West Sussex", lat: 50.8366, lng: -0.7792 },
  { slug: "guildford", name: "Guildford", county: "Surrey", lat: 51.2362, lng: -0.5704 },

  // Scotland
  { slug: "edinburgh", name: "Edinburgh", county: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { slug: "glasgow", name: "Glasgow", county: "Glasgow", lat: 55.8642, lng: -4.2518 },
  { slug: "aberdeen", name: "Aberdeen", county: "Aberdeenshire", lat: 57.1497, lng: -2.0943 },
  { slug: "dundee", name: "Dundee", county: "Dundee", lat: 56.4620, lng: -2.9707 },
  { slug: "stirling", name: "Stirling", county: "Stirlingshire", lat: 56.1165, lng: -3.9369 },
  { slug: "perth", name: "Perth", county: "Perthshire", lat: 56.3950, lng: -3.4308 },
  { slug: "inverness", name: "Inverness", county: "Highland", lat: 57.4778, lng: -4.2247 },

  // Wales
  { slug: "cardiff", name: "Cardiff", county: "Cardiff", lat: 51.4816, lng: -3.1791 },
  { slug: "swansea", name: "Swansea", county: "Swansea", lat: 51.6214, lng: -3.9436 },
  { slug: "newport", name: "Newport", county: "Newport", lat: 51.5842, lng: -2.9977 },
  { slug: "wrexham", name: "Wrexham", county: "Wrexham", lat: 53.0464, lng: -2.9925 },
  { slug: "aberystwyth", name: "Aberystwyth", county: "Ceredigion", lat: 52.4153, lng: -4.0829 },

  // Northern Ireland
  { slug: "belfast", name: "Belfast", county: "Belfast", lat: 54.5973, lng: -5.9301 },
  { slug: "derry", name: "Derry", county: "Londonderry", lat: 54.9966, lng: -7.3086 },
];

const BY_SLUG: Map<string, UkTown> = new Map(UK_TOWNS.map((t) => [t.slug, t]));

export function getTownBySlug(slug: string): UkTown | undefined {
  return BY_SLUG.get(slug);
}
