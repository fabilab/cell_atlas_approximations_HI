const organismMetadata = {
  "a_queenslandica": {
    bioName: "Amphimedon queenslandica",
    commonName: "Sponge",
    dataSource: `Sebé-Pedrós, et al. (2018). "Early Metazoan Cell Type Diversity and the Evolution of Multicellular Gene Regulation."`,
    about: "Amphimedon queenslandica is a sponge native to the Great Barrier Reef in Australia. It is a model organism for metazoan development and evolution.",
    imagePath: require("../asset/organisms/a_queenslandica.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Amphimedon_queenslandica",
    paperHyperlink: "https://www.nature.com/articles/s41559-018-0575-6",
    category: "Animal",
  },
  "a_thaliana": {
    bioName: "Arabidopsis thaliana",
    commonName: "Thale cress",
    dataSource: [
      `[root]: Shahan et al 2022 "A single-cell Arabidopsis root atlas reveals developmental trajectories in wild-type and cell identity mutants"`,
      `[shoot]: Xu et al 2024 "Large-scale single-cell profiling of stem cells uncovers redundant regulators of shoot development and yield trait variation"`
    ],
    about: "Arabidopsis thaliana is a small flowering plant widely used as a model organism in plant biology.",
    imagePath: require("../asset/organisms/a_thaliana.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Arabidopsis_thaliana",
    paperHyperlink: [
      "https://www.sciencedirect.com/science/article/pii/S1534580722000338",
      "https://www.biorxiv.org/content/10.1101/2024.03.04.583414v1"
    ],
    category: "Plant",
    organs: {
      "shoot": { coords: "251,6,249,11,242,15,238,24,235,33,234,49,230,55,237,61,232,81,240,85,246,76,255,70,264,69,272,66,273,57,264,58,255,62,264,49,267,39,266,28,258,23,262,15,260,8", shape: "poly" },
      "root": { coords: "198,439,192,453,186,476,183,501,172,520,159,536,184,516,196,492,206,461,215,451,218,457,195,510,172,538,193,519,207,500,226,467,242,472,243,486,234,504,217,529,212,550,215,564,229,588,220,558,225,533,237,515,261,476,264,496,257,525,263,538,279,553,266,524,274,509,279,477,269,463,288,473,293,488,307,502,325,505,353,502,324,500,310,492,291,463,265,452,249,439,241,419,225,436,212,455", shape: "poly" },
      "shoot-label": { coords: "424,42,465,61", shape: "rect" },
      "root-label": { coords: "490,485,531,504", shape: "rect" }
    }
  },
  "c_elegans": {
    bioName: "Caenorhabditis elegans",
    commonName: "Nematode",
    dataSource: `Cao et al. 2017 "Comprehensive single-cell transcriptional profiling of a multicellular organism"`,
    about: "Caenorhabditis elegans is a free-living transparent nematode (roundworm) that lives in temperate soil environments. It is a model organism for development and neuroscience, with a fixed cell type ontology.",
    imagePath: require("../asset/organisms/c_elegans.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Caenorhabditis_elegans",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.aam8940",
    category: "Animal",
  },
  "c_gigas": {
    bioName: "Crassostrea gigas",
    commonName: "Pacific oyster (larva)",
    dataSource: `Piovani et al 2023 "Single-cell atlases of two lophotrochozoan larvae highlight their complex evolutionary histories"`,
    about: "Crassostrea gigas is a species of oyster native to the Pacific coast of Asia.",
    imagePath: require("../asset/organisms/c_gigas.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Pacific_oyster",
    paperHyperlink: "https://doi.org/10.1126/sciadv.adg6034",
    category: "Animal",
  },
  "c_hemisphaerica": {
    bioName: "Clytia hemisphaerica",
    commonName: "Marine jellyfish",
    dataSource:  `Chari et al. 2021 "Whole-animal multiplexed single-cell RNA-seq reveals transcriptional shifts across Clytia medusa cell types"`,
    about: "Clytia hemisphaerica is a species of jellyfish found in the Mediterranean Sea and the Atlantic Ocean.",
    imagePath: require("../asset/organisms/c_hemisphaerica.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Clytia_hemisphaerica",
    paperHyperlink: "https://www.science.org/doi/10.1126/sciadv.abh1683#sec-4",
    category: "Animal",
  },
  "d_melanogaster": {
    bioName: "Drosophila melanogaster",
    commonName: "Fruit fly",
    dataSource: `Li et al. 2022, "Fly Cell Atlas: A single-nucleus transcriptomic atlas of the adult fruit fly"`,    
    about: "Drosophila Melanogaster or fruit fly is a flying insect that inhabits all continents. It is a model organism for genetics and development.",
    imagePath: require("../asset/organisms/d_melanogaster.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Drosophila_melanogaster",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.abk2432",
    intrinsicDimensions: { width: 925, height: 817 },
    category: "Animal",
    organs: {
      "antenna": {coords: "344,80,400,160,424,153"},
      "oenocyte": {coords: "444,276,434,280,430,305,435,327,446,333"},
      "leg": {coords: "356,375,278,334,259,335,263,367,285,435,301,437,290,406,273,356,305,372,365,416"},
      "haltere": {coords: "369,421,359,430,337,438,315,440,305,453,307,469,321,473,335,468,349,456,358,447,371,446"},
      "testis": {coords: "404,510,407,496,397,483,386,481,376,490,375,505,382,512,389,520,400,524"},
      "wing": {coords: "195,553,185,604,179,653,186,699,206,713,230,716,271,698,299,677,340,634,381,559,376,531,370,504,325,552"},
      "wall": {coords: "372,448,355,464,326,490,302,521,300,546,317,548,336,526,355,514,370,498"},
      "male_reproductive": {coords: "420,620,485,619,485,650,421,650"},
      "proboscis": {coords: "411,121,497,121,497,155,411,155"},
      "trachea": {coords: "439,247,465,247,469,258,464,265,461,277,459,339,447,338,456,309,445,277,437,263,436,256"},
      "fat": {coords: "500,297,536,297,536,332,501,332"},
      "gut": {coords: "436,433,432,446,433,460,435,469,434,481,440,495,447,487,454,486,460,488,466,494,472,483,471,472,473,461,475,447,469,433"},
      "heart": {coords: "453,487,446,488,441,495,440,503,443,511,454,514,464,510,468,500,464,489"},
      "malpighian": {coords: "470,509,475,497,481,498,486,511,487,524,487,540,479,542,473,552,465,567,466,544"},
      "ovary": {coords: "484,588,504,588,504,617,483,617"},
      "antenna-label": {coords: "10,145,143,174", shape: "rect"},
      "oenocyte-label": {coords: "3,284,145,316", shape: "rect"},
      "leg-label": {coords: "51,348,145,377", shape: "rect"},
      "haltere-label": {coords: "16,440,143,471", shape: "rect"},
      "testis-label": {coords: "32,495,144,523", shape: "rect"},
      "wall-label": {coords: "46,531,144,558", shape: "rect"},
      "wing-label": {coords: "32,647,136,679", shape: "rect"},
      "male_reproductive-label": {coords: "22,732,193,794", shape: "rect"},
      "proboscis-label": {coords: "764,128,914,161", shape: "rect"},
      "trachea-label": {coords: "763,255,898,285", shape: "rect"},
      "fat-label": {coords: "763,298,861,328", shape: "rect"},
      "gut-label": {coords: "762,439,859,469", shape: "rect"},
      "heart-label": {coords: "761,480,875,512", shape: "rect"},
      "malpighian-label": {coords: "762,529,922,559", shape: "rect"},
      "ovary-label": {coords: "762,602,877,633", shape: "rect"},
    },
  },
  "d_rerio": {
    bioName: "Danio rerio",
    commonName: "Zebrafish",
    dataSource: `Wagner et al. 2018 "Single-cell mapping of gene expression landscapes and lineage in the zebrafish embryo"`,    
    about: "Danio rerio or zebrafish is a freshwater fish that originates from South Asia and is a model organism for vertebrate development, genetics, and evolution.",
    imagePath: require("../asset/organisms/d_rerio.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Zebrafish",
    category: "Animal",
  },
  "f_vesca": {
    bioName: "Fragaria vesca",
    commonName: "Wildland strawberry",
    dataSource: `Bai et al 2022 "Development of a single-cell atlas for woodland strawberry (Fragaria vesca) leaves during early Botrytis cinerea infection using single-cell RNA-seq"`,
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Fragaria_vesca",
    about: "Fragaria vesca, commonly called the wild strawberry, woodland strawberry, is a perennial herbaceous plant in the rose family that grows naturally throughout much of the Northern Hemisphere, and that produces edible fruits",
    paperHyperlink: "https://doi.org/10.1093/hr/uhab055",
    imagePath: require("../asset/organisms/f_vesca.jpeg"),
    category: "Plant",
  },
  "h_miamia": {
    bioName: "Hofstenia miamia",
    commonName: "Three-banded panther worm",
    dataSource: `Hulett et al. 2023 "Aciel single-cell atlas reveals expression dynamics and heterogeneity of adult pluripotent stem cells"`,    
    about: "Hofstenia miamia is an acoel (related to flatworms), a deep-diverging bilaterian lineage. It is an emerging model system to study bilaterian evolution.",
    imagePath: require("../asset/organisms/h_miamia.jpeg"),
    descriptionHyperlink: "https://pubmed.ncbi.nlm.nih.gov/34196362/",
    paperHyperlink: "https://www.nature.com/articles/s41467-023-38016-4",
    category: "Animal",
  },
  "h_sapiens": {
    bioName: "Homo sapiens",
    commonName: "Human",
    dataSource: `RNA: Tabula Sapiens 2022 "The Tabula Sapiens: A multiple-organ, single-cell transcriptomic atlas of humans"`,    
    about: "Homo sapiens or human is a primate that inhabits all continents. But you know that.",
    imagePath: require("../asset/organisms/h_sapiens.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Human",
    paperHyperlink:"https://www.science.org/doi/10.1126/science.abl4896",
    category: "Animal",
    intrinsicDimensions: { width: 1361, height: 1361 },
    organs: {
      "brain": {coords: "682,38,668,32,656,38,647,49,644,61,649,85,656,95,668,97,681,107,689,107,701,99,712,91,715,79,719,65,712,47,701,36,690,32"},
      "brain-label": {coords: "865,39,1036,87", shape: "rect"},
      "bladder": {coords: "649,806,649,832,670,832,670,807"},
      "bladder-label": {coords: "44,779,243,834", shape: "rect"},
      "blood": {coords: "555,1083,563,1157,576,1154,570,1096"},
      "blood-label": {coords: "55,1078,244,1124", shape: "rect"},
      "colon": {coords: "718,677,707,648,719,626,740,615,762,621,752,662,756,696,758,736,741,779,722,760,725,736,723,700"},
      "colon-label": {coords: "1089,645,1309,689", shape: "rect"},
      "eye": {coords: "629,131,647,124,662,135,652,139,638,137"},
      "eye-label": {coords: "381,150,245,107", shape: "rect"},
      "fat": {coords: "549,956,539,1022,551,1072,575,1095,590,1058,581,1005"},
      "fat-label": {coords: "55,1013,244,1057", shape: "rect"},
      "gut": {coords: "626,676,626,758,717,759,715,676"},
      "gut-label": {coords: "1089,703,1259,748", shape: "rect"},
      "heart": {coords: "662,434,664,463,676,465,673,456,694,465,713,471,732,468,739,452,732,422,727,405,697,398"},
      "heart-label": {coords: "1091,427,1312,474", shape: "rect"},
      "kidney": {coords: "634,587,619,586,606,595,601,612,601,628,608,638,618,643,630,638,635,616,642,599"},
      "kidney-label": {coords: "52,580,244,628", shape: "rect"},
      "liver": {coords: "594,575,588,540,592,518,605,504,628,503,646,492,689,498,711,508,703,521,674,542,644,551,624,555,607,573"},
      "liver-label": {coords: "50,506,243,552", shape: "rect"},
      "lung": {coords: "666,364,660,330,642,319,617,337,589,377,577,419,571,457,584,491,605,504,626,503,647,491,666,466,655,431,655,396"},
      "lung-label": {coords: "46,338,243,384", shape: "rect"},
      "lymphnode": {coords: "683,254,697,254,700,281,685,283"},
      "lymphnode-label": {coords: "1091,239,1359,288", shape: "rect"},
      "mammary": {coords: "578,441,624,441,624,483,580,483"},
      "mammary-label": {coords: "7,424,243,476", shape: "rect"},
      "marrow": {coords: "600,1256,605,1350,618,1350,614,1256"},
      "marrow-label": {coords: "39,1269,242,1321", shape: "rect"},
      "muscle": {coords: "826,721,753,791,701,866,688,911,688,994,703,1080,700,1157,719,1235,810,1234,809,1170,818,1109,834,1057,845,956,842,852"},
      "muscle-label": {coords: "1092,1011,1306,1059", shape: "rect"},
      "pancreas": {coords: "744,607,711,618,690,622,673,628,656,618,660,602,673,595,697,593,731,599"},
      "pancreas-label": {coords: "6,668,243,717", shape: "rect"},
      "prostate": {coords: "670,814,694,814,694,839,670,839"},
      "prostate-label": {coords: "1090,821,1310,864", shape: "rect"},
      "salivary": {coords: "673,183,688,183,688,191,673,191"},
      "salivary-label": {coords: "1091,162,1315,211", shape: "rect"},
      "skin": {coords: "536,885,576,946,601,1009,611,1069,602,1107,582,1123,577,1096,592,1059,582,1003,551,956,543,986,537,1023,555,1082,546,1099,531,1053,521,956"},
      "skin-label": {coords: "54,936,243,984", shape: "rect"},
      "stomach": {coords: "712,519,714,510,730,503,747,503,759,508,768,521,769,537,766,551,760,562,745,573,727,579,705,577,690,566,678,561,674,570,681,577,694,578,689,584,681,584,668,578,661,569,665,558,674,548,694,545,714,546,730,540,731,526,725,516"},
      "stomach-label": {coords: "1089,498,1309,548", shape: "rect"},
      "spleen": {coords: "726,589,739,580,753,578,765,589,766,606,751,612,739,600"},
      "spleen-label": {coords: "1090,570,1311,617", shape: "rect"},
      "thymus": {coords: "681,356,666,353,655,396,656,435,671,427,691,408,694,398,727,403,711,372,696,351"},
      "thymus-label": {coords: "1091,344,1312,392", shape: "rect"},
      "tongue": {coords: "662,197,682,194,701,197,694,209,682,215,670,208"},
      "tongue-label": {coords: "243,230,46,176", shape: "rect"},
      "trachea": {coords: "671,240,672,347,693,343,690,282,684,270,684,252,691,252,690,240"},
      "trachea-label": {coords: "44,251,242,301", shape: "rect"},
      "uterus": {coords: "628,766,729,765,730,804,628,806"},
      "uterus-label": {coords: "1089,756,1311,799", shape: "rect"},
      "nerve": {coords: "608,71,647,115", shape: "rect"},
      "nerve-label": {coords: "71,64,240,114", shape: "rect"},
      "esophagus": {coords: "674,236,674,296,684,301,691,292,687,271,685,256,690,236"},
      "esophagus-label": {coords: "6,223,245,276", shape: "rect"},
      "thyroid": {coords: "683,303,672,296,665,280,655,292,659,310,667,322,683,313,696,321,705,309,709,295,702,278,694,292"},
      "thyroid-label": {coords: "1086,274,1282,325", shape: "rect"},
      "adrenal": {coords: "634,587,619,586,606,595,601,612,601,628,608,638,618,643,630,638,635,616,642,599"},
      "adrenal-label": {coords: "249,626,48,578", shape: "rect"},
      "islet": {coords: "715,634,720,619,729,615,741,622,751,622,767,628,775,637,766,646,750,641,733,639,720,641"},
      "islet-label": {coords: "1088,570,1268,619", shape: "rect"},
      "ovary": {coords: "659,785,646,785,629,794,628,803,636,808,646,809,656,804,664,794"},
      "ovary-label": {coords: "72,773,245,821", shape: "rect"},
      "vagina": {coords: "684,837,665,862,683,890,700,863"},
      "vagina-label": {coords: "57,846,246,896", shape: "rect"}
    }
  },
  "i_pulchra": {
    bioName: "Isodiametra pulchra",
    commonName: "Acoel",
    dataSource: `Duruz et al. 2020 "Acoel Single-Cell Transcriptomics: Cell Type Analysis of a Deep Branching Bilaterian"`,    
    about: "Acoela, or the acoels, is an order of small and simple invertebrates in the subphylum Acoelomorpha of phylum Xenacoelomorpha, a deep branching bilaterian group of animals, which resemble flatworms. Historically they were treated as an order of turbellarian flatworms.",
    imagePath: require("../asset/organisms/i_pulchra.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Acoela",
    paperHyperlink:"https://academic.oup.com/mbe/article/38/5/1888/6045962",
    category: "Animal",
  },
  "l_minuta": {
    bioName: "Lemna minuta",
    commonName: "Least duckweed",
    dataSource: `Abramson et al. 2021 "The genome and preliminary single-nuclei transcriptome of Lemna minuta reveals mechanisms of invasiveness"`,    
    about: "Lemna minuta is a species of duckweed native to parts of the Americas. It is studied as an example of an invasive plant species in genetics and ecology.",
    imagePath: require("../asset/organisms/l_minuta.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Lemna_minuta",
    paperHyperlink:"https://academic.oup.com/plphys/article/188/2/879/6454113",
    category: "Plant",
  },
  "m_leidyi": {
    bioName: "Mnemiopsis leidyi",
    commonName: "Comb jelly",
    dataSource: `Sebé-Pedrós et al 2018 "Early metazoan cell type diversity and the evolution of multicellular gene regulation"`,    
    about: "Mnemiopsis leidyi is a species of tentaculate ctenophore (comb jelly) native to western Atlantic coastal waters. It is studied as an example of a marine invasive species.",
    imagePath: require("../asset/organisms/m_leidyi.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Mnemiopsis",
    paperHyperlink: "https://www.nature.com/articles/s41559-018-0575-6",
    category: "Animal",
  },
  "m_musculus": {
    bioName: "Mus musculus",
    commonName: "House mouse",
    dataSource: `Tabula Muris Senis 2020 "A single-cell transcriptomic atlas characterizes ageing tissues in the mouse"`,    
    about: "Mus musculis or house mouse is a small rodent that lives both in wild temperate climates and in close proximity to humans (e.g. cities). It is a very widely used model organism to study disease, development, genetics, evolution, and other topics.",
    imagePath: require("../asset/organisms/m_musculus.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/House_mouse",
    paperHyperlink: "https://www.nature.com/articles/s41586-020-2496-1",
    intrinsicDimensions: { width: 1134, height: 1227 },
    category: "Animal",
    organs: {
      "skin": {coords: "454,249,436,301,434,328,456,328,483,321,466,287"},
      "fat": {coords: "456,369,442,372,429,380,428,393,428,402,431,413,439,416,451,419,465,418,482,414,492,398,488,378,473,369"},
      "mammary": {coords: "490,478,473,457,477,441,495,447,498,473"},
      "thymus": {coords: "489,484,495,475,506,471,517,479,517,491,511,499,501,501,491,496"},
      "liver": {coords: "445,577,448,555,455,537,476,524,505,528,525,543,527,571,507,579,470,583,452,593"},
      "pancreas": {coords: "465,597,495,584,517,580,547,579,567,574,592,571,615,555,618,572,600,597,579,611,559,622,530,623,500,623,473,612"},
      "marrow": {coords: "368,911,364,958,358,1054,375,1053,378,1015,391,926"},
      "tongue": {coords: "562,100,575,95,586,101,593,118,589,134,577,143,562,133,558,117"},
      "trachea": {coords: "569,256,585,256,587,324,566,324"},
      "heart": {coords: "578,326,548,334,542,357,547,382,561,390,575,402,601,388,609,369,605,335"},
      "lung": {coords: "606,329,625,345,636,373,650,406,661,442,638,456,609,462,600,435,584,413,591,398,611,380"},
      "kidney": {coords: "636,564,646,548,674,550,683,572,680,603,661,613,644,607"},
      "colon": {coords: "500,776,500,726,498,653,537,669,578,673,625,676,667,667,677,699,667,750,655,779,652,802,681,788,696,763,703,728,708,687,705,656,697,630,673,623,644,640,592,652,547,645,505,626,479,623,458,633,453,662,452,696,453,729,459,760,472,790,488,792"},
      "spleen": {coords: "592,710,615,701,640,709,655,725,654,744,633,752,606,746,593,731"},
      "muscle": {coords: "732,836,776,874,808,916,815,960,809,1027,791,1038,769,1047,752,1032,739,1010,708,977,684,960,659,963,702,903"},
      "bladder": {coords: "569,913,562,923,562,936,570,949,553,952,542,967,547,981,563,973,570,965,574,986,586,985,586,962,594,972,604,979,611,976,614,967,605,954,585,947,592,936,590,922,582,910,583,899,569,899"},
      "skin-label": {coords: "221,318,86,277", shape: "rect"},
      "fat-label": {coords: "93,381,219,419", shape: "rect"},
      "mammary-label": {coords: "14,430,220,474", shape: "rect"},
      "thymus-label": {coords: "37,488,218,528", shape: "rect"},
      "liver-label": {coords: "74,543,218,585", shape: "rect"},
      "pancreas-label": {coords: "23,608,219,651", shape: "rect"},
      "marrow-label": {coords: "38,935,220,981", shape: "rect"},
      "tongue-label": {coords: "940,92,1118,140", shape: "rect"},
      "trachea-label": {coords: "936,266,1118,311", shape: "rect"},
      "heart-label": {coords: "936,332,1101,376", shape: "rect"},
      "lung-label": {coords: "936,390,1098,432", shape: "rect"},
      "kidney-label": {coords: "937,554,1106,602", shape: "rect"},
      "colon-label": {coords: "936,636,1099,678", shape: "rect"},
      "spleen-label": {coords: "937,703,1107,748", shape: "rect"},
      "muscle-label": {coords: "940,853,1113,898", shape: "rect"},
      "bladder-label": {coords: "940,941,1123,983", shape: "rect"}
    },
  },
  "m_murinus": {
    bioName: "Microcebus murinus",
    commonName: "Mouse lemur",
    dataSource: `Tabula Microcebus 2023 "Tabula Microcebus: A transcriptomic cell atlas of mouse lemur, an emerging primate model organism"`,    
    about: "Microbebus murinus or mouse lemur is a primate that lives in Madagascar. Is is a model organism for comparative genetics and cell biology and to study primate evolution.",
    imagePath: require("../asset/organisms/m_murinus.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Gray_mouse_lemur",
    paperHyperlink:"https://www.biorxiv.org/content/10.1101/2021.12.12.469460v2",
    category: "Animal",
    intrinsicDimensions: { width: 1126, height: 1046 },
    organs: {
      "eye": {coords: "528,70,486,130,480,112,487,93,505,75"},
      "skin": {coords: "357,183,429,323,405,312,385,293,371,260"},
      "fat": {coords: "496,276,467,289,450,306,447,323,461,330,476,323,486,313,494,292"},
      "blood": {coords: "459,337,455,350,453,360,457,368,466,367,473,369,482,365,487,356,483,347,467,356"},
      "mammary": {coords: "506,407,497,395,490,385,491,375,501,372,509,380,514,397"},
      "thymus": {coords: "518,399,507,407,507,417,512,422,520,425,528,421,533,414,528,401"},
      "liver": {coords: "477,512,463,491,463,464,476,443,498,439,518,440,530,453,535,469,515,486,489,498"},
      "pancreas": {coords: "499,501,509,493,544,485,560,488,572,488,592,487,601,489,626,474,629,481,621,499,599,514,582,522,570,523,548,522,520,517"},
      "gut": {coords: "592,654,519,569", shape: "rect"},
      "uterus": {coords: "543,717,621,782", shape: "rect"},
      "bladder": {coords: "581,785,572,797,570,809,576,818,560,826,554,838,562,849,578,832,581,853,590,854,592,831,607,846,615,844,616,834,607,822,596,818,589,821,598,810,599,798,590,785"},
      "marrow": {coords: "388,795,380,918,396,921,402,865,410,806"},
      "tongue": {coords: "576,27,590,27,597,35,598,46,596,59,590,65,584,68,575,63,569,54,569,37"},
      "brain": {coords: "543,122,551,95,564,78,575,73,593,73,606,77,614,82,622,92,633,104,637,113,636,128,620,146,608,147,598,145,601,153,580,163,568,157,556,154,548,153,542,139"},
      "trachea": {coords: "577,175,591,174,595,230,575,231"},
      "heart": {coords: "565,233,583,229,600,235,608,239,612,265,609,284,584,302,576,298,564,289,556,284,552,269,553,248"},
      "lung": {coords: "607,236,616,236,625,245,633,263,644,286,652,308,647,313,656,325,660,337,657,344,624,356,611,353,608,339,601,326,591,317,591,298,611,284,615,261"},
      "diaphragm": {coords: "502,362,524,357,550,360,587,365,623,361,656,360,677,364,672,370,630,379,588,381,554,381,514,373,499,367,502,362"},
      "kidney": {coords: "633,493,651,482,666,467,679,468,689,475,691,490,682,509,658,522,639,513"},
      "colon": {coords: "514,670,496,664,490,671,480,676,468,671,460,659,454,640,449,618,446,590,449,562,454,534,457,524,474,516,495,516,511,522,531,526,549,533,574,541,597,540,623,538,652,535,683,518,702,517,716,522,729,532,733,551,732,580,733,601,726,630,718,652,704,669,692,676,672,682,659,685,648,680,652,663,672,662,682,662,686,645,699,588,692,554,664,564,644,567,603,565,565,565,529,557,503,553,506,574,503,594,502,616,502,644"},
      "spleen": {coords: "627,592,622,605,628,621,643,633,661,637,673,634,682,623,678,609,664,595,644,587"},
      "testis": {coords: "669,731,658,726,635,732,629,746,630,761,632,787,635,809,648,816,660,819,675,815,681,800,675,794,677,766,668,748"},
      "muscle": {coords: "730,680,766,724,799,766,810,798,800,899,783,911,756,912,721,862,688,835,662,837,722,744"},
      "bone": {coords: "573,843,571,874,561,914,544,941,522,960,478,986,487,1007,513,995,536,982,562,961,580,939,592,899,596,858,583,856"},
      "eye-label": {coords: "93,69,210,109", shape: "rect"},
      "skin-label": {coords: "94,220,212,258", shape: "rect"},
      "fat-label": {coords: "100,274,213,314", shape: "rect"},
      "blood-label": {coords: "77,330,213,368", shape: "rect"},
      "mammary-label": {coords: "22,375,214,411", shape: "rect"},
      "thymus-label": {coords: "45,421,215,458", shape: "rect"},
      "liver-label": {coords: "83,469,214,506", shape: "rect"},
      "pancreas-label": {coords: "45,529,214,570", shape: "rect"},
      "gut-label": {coords: "98,620,213,657", shape: "rect"},
      "uterus-label": {coords: "22,701,175,740", shape: "rect"},
      "bladder-label": {coords: "9,788,175,829", shape: "rect"},
      "marrow-label": {coords: "12,845,178,884", shape: "rect"},
      "tongue-label": {coords: "914,24,1073,66", shape: "rect"},
      "brain-label": {coords: "914,98,1070,140", shape: "rect"},
      "trachea-label": {coords: "916,183,1086,222", shape: "rect"},
      "heart-label": {coords: "916,246,1067,286", shape: "rect"},
      "lung-label": {coords: "916,300,1061,338", shape: "rect"},
      "diaphragm-label": {coords: "915,347,1120,383", shape: "rect"},
      "kidney-label": {coords: "916,466,1072,508", shape: "rect"},
      "colon-label": {coords: "916,539,1067,578", shape: "rect"},
      "spleen-label": {coords: "916,603,1075,645", shape: "rect"},
      "testis-label": {coords: "917,715,1070,754", shape: "rect"},
      "muscle-label": {coords: "917,789,1078,831", shape: "rect"},
      "bone-label": {coords: "651,986,789,1028", shape: "rect"}
    }
  },
  "n_vectensis": {
    bioName: "Nematostella vectensis",
    commonName: "Starlet sea anemone",
    dataSource: `Steger et al 2022 "Single-cell transcriptomics identifies conserved regulators of neuroglandular lineages"`,    
    about: "The starlet sea anemone is a species of small sea anemone in the family Edwardsiidae native to the east coast of the United States, with introduced populations along the coast of southeast England and the west coast of the United States. Populations have also been located in Nova Scotia, Canada",
    imagePath: require("../asset/organisms/n_vectensis.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Starlet_sea_anemone",
    paperHyperlink: "https://www.sciencedirect.com/science/article/pii/S2211124722012025?via%3Dihub",
    category: "Animal",
  },
  "o_sativa": {
    bioName:"Oryza sativa",
    commonName: "Rice root",
    dataSource: `Zhang et al 2021 "Single-cell transcriptome atlas and chromatin accessibility landscape reveal differentiation trajectories in the rice root"`,
    about: "Oryza sativa is the most common of the two rice species cultivated as a cereal, the other species being O. glaberrima, African rice. It was first domesticated in the Yangtze River basin in China 13,500 to 8,200 years ago.",
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Oryza_sativa",
    paperHyperlink:"https://doi.org/10.1038/s41467-021-22352-4",
    imagePath: require("../asset/organisms/o_sativa.jpeg"),
    category: "Plant",
  },
  "p_crozieri": {
    bioName: "Prostheceraeus crozieri",
    commonName: "Müller's larva",
    dataSource: `Piovani et al 2023 "Single-cell atlases of two lophotrochozoan larvae highlight their complex evolutionary histories"`,
    about: "Prostheceraeus crozieri is a species of polyclad flatworm found in the Caribbean Sea.",
    imagePath: require("../asset/organisms/p_crozieri.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Prostheceraeus_crozieri",
    paperHyperlink: "https://doi.org/10.1126/sciadv.adg6034",
    category: "Animal",
  },
  "p_dumerilii": {
    bioName: "Platynereis dumerilii",
    commonName: "Annelid worm (larva)",
    dataSource: `Achim et al 2017 "Whole-Body Single-Cell Sequencing Reveals Transcriptional Domains in the Annelid Larval Body"`,
    about: "Platynereis dumerilii is a species of annelid worm used as a model organism in developmental biology.",
    imagePath: require("../asset/organisms/p_dumerilii.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Platynereis_dumerilii",
    paperHyperlink: "https://academic.oup.com/mbe/article/35/5/1047/4823215",
    category: "Animal",
  },
  "s_lacustris": {
    bioName: "Spongilla lacustris",
    commonName: "Freshwater sponge",
    dataSource: `Musser et al. 2021 "Profiling cellular diversity in sponges informs animal cell type and nervous system evolution"`,    
    about: "Spongilla lacustris is a freshwater sponge that is common in Europe. It is studies in ecology and evolutionary biology.",
    imagePath: require("../asset/organisms/s_lacustris.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Spongilla_lacustris",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.abj2949",
    category: "Animal",
  },
  "s_mansoni": {
    bioName: "Schistosoma mansoni",
    commonName: "Blood fluke",
    dataSource: `Li et al. 2021 "Single-cell analysis of Schistosoma mansoni identifies a conserved genetic program controlling germline stem cell fate"`,    
    about: "Schistosoma mansoni is a water-borne parasite of humans. It is studied as the etiological cause of schistosomiasis.",
    imagePath: require("../asset/organisms/s_mansoni.jpeg"),
    descriptionHyperlink: "",
    paperHyperlink: "https://www.nature.com/articles/s41467-020-20794-w",
    category: "Animal",
  },
  "s_mediterranea": {
    bioName: "Schmidtea mediterranea",
    commonName: "Planarian worm",
    dataSource: `Plass et al 2018 "Cell type atlas and lineage tree of a whole complex animal by single-cell transcriptomics"`,    
    about: "Schmidtea mediterranea is a planarian found in Europe. It is studied because of its ability to regenerate lost body parts thanks to a large reservoir of stem-like cells.",
    imagePath: require("../asset/organisms/s_mediterranea.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Schistosoma_mansoni",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.aaq1723",
    category: "Animal",
  },
  "s_pistillata": {
    bioName: "Stylophora pistillata",
    commonName: "Stony coral",
    dataSource: `Levi et al. 2021 "A stony coral cell atlas illuminates the molecular and cellular basis of coral symbiosis, calcification, and immunity"`,    
    about: "",
    imagePath: require("../asset/organisms/s_pistillata.jpeg"),
    descriptionHyperlink: "",
    paperHyperlink: "https://www.sciencedirect.com/science/article/pii/S0092867421004402",
    category: "Animal",
  },
  "s_purpuratus": {
    bioName: "Strongylocentrotus purpuratus",
    commonName: "Purple sea urchin",
    dataSource: `Paganos et al 2021 Single-cell RNA sequencing of the Strongylocentrotus purpuratus larva reveals the blueprint of major cell types and nervous system of a non-chordate deuterostome`,
    about: "Strongylocentrotus purpuratus is a species of sea urchin found along the west coast of North America.",
    imagePath: require("../asset/organisms/s_purpuratus.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Strongylocentrotus_purpuratus",
    paperHyperlink: "https://doi.org/10.7554/eLife.70416",
    category: "Animal",
  },
  "t_adhaerens": {
    bioName: "Trichoplax adhaerens",
    commonName: "Placozoan",
    dataSource: `Sebé-Pedrós et al 2018 "Early metazoan cell type diversity and the evolution of multicellular gene regulation"`,    
    about: "Trichoplax adhaerens is an organism in the phylum Placozoa, a basal group of multicellular animals, possible relatives of Cnidaria. They are studied as a comparative outgroup for multicellular organismal evolution, cell biology, and genetics.",
    imagePath: require("../asset/organisms/t_adhaerens.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Trichoplax",
    paperHyperlink: "https://www.nature.com/articles/s41559-018-0575-6",
    category: "Animal",
  },
  "t_aestivum": {
    bioName: "Triticum aestivum",
    commonName: "Bread wheat",
    dataSource: `Zhang et al 2023 "Asymmetric gene expression and cell-type-specific regulatory networks in the root of bread wheat revealed by single-cell multiomics analysis"`,
    about: "Triticum aestivum is a species of wheat widely cultivated for its seed, a cereal grain which is a worldwide staple food.",
    imagePath: require("../asset/organisms/t_aestivum.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Triticum_aestivum",
    paperHyperlink: "https://genomebiology.biomedcentral.com/articles/10.1186/s13059-023-02908-x",
    category: "Plant",
  },
  "x_laevis": {
    bioName: "Xenopus laevis",
    commonName: "African clawed frog",
    dataSource: `Liao et al 2022 "Cell landscape of larval and adult Xenopus laevis at single-cell resolution"`,
    paperHyperlink: "https://www.nature.com/articles/s41467-022-31949-2",
    about: "Xenopus laevis is a species of African aquatic frog. It is a model organism for cell biology and development.",
    imagePath: require("../asset/organisms/x_laevis.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/African_clawed_frog",
    intrinsicDimensions: { width: 1110, height: 1115 },
    category: "Animal",
    organs: {
      "heart": {coords: "531,263,520,273,527,285,527,291,512,309,506,332,509,352,513,369,528,381,544,381,556,374,570,358,574,342,577,324,573,305,563,297,574,288,571,274,559,277,544,294"},
      "liver": {coords: "491,267,480,269,469,280,455,302,449,326,435,345,421,373,413,402,411,424,416,438,421,442,439,434,455,423,469,411,485,396,498,378,505,356,506,327,505,294,501,273"},
      "lung": {coords: "670,273,661,282,658,303,665,320,675,332,679,354,688,367,699,371,710,364,710,342,704,322,687,295,680,279"},
      "muscle": {coords: "768,762,712,764,628,808,547,859,587,891,634,873,697,863,755,846,799,820,829,804,855,790,867,770"},
      "skin": {coords: "237,1036,247,1054,244,1071,235,1089,224,1101,241,1099,255,1091,265,1091,275,1103,285,1088,297,1076,311,1071,351,1023,316,1049,305,1040,300,1026,269,1035"},
      "pancreas": {coords: "559,426,582,421,604,426,615,438,621,465,627,502,625,523,611,531,579,534,557,529,542,518,533,499,539,479,544,447,559,436"},
      "brain": {coords: "555,119,536,125,526,144,523,162,525,181,540,186,556,192,570,180,593,169,597,150,580,125"},
      "eye": {coords: "516,91,491,97,481,116,483,138"},
      "kidney": {coords: "549,419,542,396,522,384,499,393,478,416,467,450,472,478,491,486,515,485,538,475,542,446,526,444,518,431,528,419"},
      "testis": {coords: "569,383,560,388,553,400,555,413,558,421,570,422,582,419,588,405,581,389"},
      "spleen": {coords: "537,418,526,423,519,431,523,439,529,443,541,445,552,440,557,430,549,422"},
      "gut": {coords: "717, 480, 703, 498, 692, 492, 678, 490, 689, 473, 675, 453, 654, 439, 641, 439, 631, 454, 628, 468, 636, 479, 651, 488, 640, 496, 632, 504, 641, 513, 655, 518, 650, 526, 659, 534, 651, 541, 634, 551, 626, 564, 635, 604, 682, 576, 704, 554, 704, 537, 678, 526, 697, 524, 714, 519, 730, 502, 727, 477",},
      "bladder": {coords: "625, 525, 618, 557, 604, 574, 593, 595, 587, 619, 579, 660, 574, 679, 584, 680, 595, 670, 618, 665, 634, 656, 642, 634, 636, 605, 626, 556",},
      "ovary": {coords: "473, 482, 489, 501, 504, 507, 513, 521, 536, 531, 559, 533, 567, 539, 576, 543, 580, 556, 566, 577, 573, 593, 575, 605, 549, 609, 555, 620, 566, 635, 550, 644, 519, 627, 499, 615, 481, 595, 460, 585, 451, 565, 455, 551, 440, 517, 456, 508",},
      "oviduct": {coords: "390, 501, 377, 515, 382, 529, 405, 519, 417, 519, 415, 539, 410, 568, 419, 591, 443, 612, 478, 627, 503, 639, 534, 657, 543, 651, 475, 611, 448, 563, 436, 539, 440, 508, 423, 498, 396, 511",},
      "marrow": {coords: "431, 629, 361, 665, 278, 699, 234, 730, 255, 761, 283, 782, 332, 808, 391, 875, 425, 907, 449, 883, 376, 820, 322, 787, 272, 730, 327, 699, 397, 668, 458, 648"},
      "stomach": {coords: "678,382,691,393,705,408,718,437,727,476,720,479,705,463,688,448,672,437,649,421,641,412,643,397,650,386,664,381"},
      "eye-label": {coords: "157,6,289,52", "shape": "rect"},
      "heart-label": {coords: "35,173,181,219", "shape": "rect"},
      "liver-label": {coords: "38,325,179,368", "shape": "rect"},
      "kidney-label": {coords: "14,387,180,430", "shape": "rect"},
      "spleen-label": {coords: "15,435,179,482", "shape": "rect"},
      "oviduct-label": {coords: "8,515,178,557", "shape": "rect"},
      "ovary-label": {coords: "31,588,178,635", "shape": "rect"},
      "marrow-label": {coords: "8,750,179,821", "shape": "rect"},
      "skin-label": {coords: "23,1024,154,1070", "shape": "rect"},
      "brain-label": {coords: "914,127,1054,165", "shape": "rect"},
      "lung-label": {coords: "914,178,1055,217", "shape": "rect"},
      "testis-label": {coords: "914,369,1064,411", "shape": "rect"},
      "stomach-label": {coords: "914,428,1098,470", "shape": "rect"},
      "pancreas-label": {coords: "914,493,1100,533", "shape": "rect"},
      "gut-label": {coords: "915,550,1039,588", "shape": "rect"},
      "bladder-label": {coords: "915,604,1091,645", "shape": "rect"},
      "muscle-label": {coords: "914,820,1079,865", "shape": "rect"}
    }
  },
  "z_mays": {
    bioName: "Zea mays",
    commonName: "corn",
    dataSource: `Marand  et al 2021 "A cis-regulatory atlas in maize at single-cell resolution"`,
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Maize",
    about: "Maize (Zea mays), also known as corn, is a tall grass domesticated in southern Mexico 9,000 years ago, known for its cereal grain produced on leafy stalks, commonly found in yellow or white varieties.",
    paperHyperlink: "https://doi.org/10.1016/j.cell.2021.04.014",
    imagePath: require("../asset/organisms/z_mays.jpeg"),
    category: "Plant",
  },
};

export default organismMetadata;
