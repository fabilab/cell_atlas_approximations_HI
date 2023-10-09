const organismMetadata = {
  "a_queenslandica": {
    bioName: "Amphimedon queenslandica",
    commonName: "Sponge",
    dataSource: "[Sebé-Pedrós et al. 2018](Early metazoan cell type diversity and the evolution of multicellular gene regulation)",
    about: "Amphimedon queenslandica is a sponge native to the Great Barrier Reef in Australia. It is a model organism for metazoan development and evolution.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/a_queenslandica.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Amphimedon_queenslandica",
    paperHyperlink: "https://www.nature.com/articles/s41559-018-0575-6",
  },
  "c_elegans": {
    bioName: "Caenorhabditis elegans",
    commonName: "Nematode",
    dataSource: "[Cao et al. 2017](Comprehensive single-cell transcriptional profiling of a multicellular organism)",
    about: "Caenorhabditis elegans is a free-living transparent nematode (roundworm) that lives in temperate soil environments. It is a model organism for development and neuroscience, with a fixed cell type ontology.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/c_elegans.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Caenorhabditis_elegans",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.aam8940"
  },
  "d_melanogaster": {
    bioName: "Drosophila melanogaster",
    commonName: "Fruit fly",
    dataSource: "[Li et al. 2022](Fly Cell Atlas: A single-nucleus transcriptomic atlas of the adult fruit fly)",
    about: "Drosophila Melanogaster or fruit fly is a flying insect that inhabits all continents. It is a model organism for genetics and development.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/d_melanogaster.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Drosophila_melanogaster",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.abk2432"
  },
  "d_rerio": {
    bioName: "Danio rerio",
    commonName: "Zebrafish",
    dataSource: "[Wagner et al. 2018](Single-cell mapping of gene expression landscapes and lineage in the zebrafish embryo)",
    about: "Danio rerio or zebrafish is a freshwater fish that originates from South Asia and is a model organism for vertebrate development, genetics, and evolution.",
    genesFromPaper: "epcam, si, krt18, krt8, cldnb, elavl3, krt4, tfap2a, LOC100537766, cldnh, six1b, LOC100006216, myt1a, dlb, sox19a, actc1a, pfn1, cxcl12b, pax6b ",
    imagePath: require("../asset/organisms/d_rerio.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Zebrafish",
    organs: {
      "Whole": {
          coords: "247,35,203,70,177,131,175,159,162,228,173,300,199,370,228,422,342,426,408,415,412,346,395,264,358,176,310,109,287,67"
      },
    },
  },
  "h_miamia": {
    bioName: "Hofstenia miamia",
    commonName: "Three-banded panther worm",
    dataSource: "[Hulett et al. 2023](Aciel single-cell atlas reveals expression dynamics and heterogeneity of adult pluripotent stem cells)",
    about: "Hofstenia miamia is an acoel (related to flatworms), a deep-diverging bilaterian lineage. It is an emerging model system to study bilaterian evolution.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/h_miamia.jpeg"),
    descriptionHyperlink: "https://pubmed.ncbi.nlm.nih.gov/34196362/",
    paperHyperlink: "https://www.nature.com/articles/s41467-023-38016-4"
  },
  "h_sapiens": {
    bioName: "Homo sapiens",
    commonName: "Human",
    dataSource: "RNA: [Tabula Sapiens 2022](The Tabula Sapiens: A multiple-organ, single-cell transcriptomic atlas of humans)",
    about: "Homo sapiens or human is a primate that inhabits all continents. But you know that.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/h_sapiens.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Human",
    paperHyperlink:"https://www.science.org/doi/10.1126/science.abl4896"
    // anatomyImage: require("../asset/anatomy/h_sapiens.jpeg"),
  },
  "i_pulchra": {
    bioName: " Isodiametra pulchra",
    commonName: "Acoel",
    dataSource: "[Duruz et al. 2020](Acoel Single-Cell Transcriptomics: Cell Type Analysis of a Deep Branching Bilaterian)",
    about: "Acoela, or the acoels, is an order of small and simple invertebrates in the subphylum Acoelomorpha of phylum Xenacoelomorpha, a deep branching bilaterian group of animals, which resemble flatworms. Historically they were treated as an order of turbellarian flatworms.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/i_pulchra.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Acoela",
    paperHyperlink:"https://academic.oup.com/mbe/article/38/5/1888/6045962"
    // anatomyImage: require("../asset/anatomy/h_sapiens.jpeg"),
  },
  "l_minuta": {
    bioName: "Lemna minuta",
    commonName: "Least duckweed",
    dataSource: "[Abramson et al. 2021](The genome and preliminary single-nuclei transcriptome of Lemna minuta reveals mechanisms of invasiveness)",
    about: "Lemna minuta is a species of duckweed native to parts of the Americas. It is studied as an example of an invasive plant species in genetics and ecology.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/l_minuta.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Lemna_minuta",
    paperHyperlink:"https://academic.oup.com/plphys/article/188/2/879/6454113"
    // anatomyImage: require("../asset/anatomy/h_sapiens.jpeg"),
  },
  "m_leidyi": {
    bioName: "Mnemiopsis leidyi",
    commonName: "Comb jelly",
    dataSource: "[Sebé-Pedrós et al 2018](Early metazoan cell type diversity and the evolution of multicellular gene regulation)",
    about: "Mnemiopsis leidyi is a species of tentaculate ctenophore (comb jelly) native to western Atlantic coastal waters. It is studied as an example of a marine invasive species.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_leidyi.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Mnemiopsis",
    paperHyperlink: "https://www.nature.com/articles/s41559-018-0575-6",
  },
  "m_musculus": {
    bioName: "Mus musculus",
    commonName: "House mouse",
    dataSource: "[Tabula Muris Senis 2020](A single-cell transcriptomic atlas characterizes ageing tissues in the mouse)",
    about: "Mus musculis or house mouse is a small rodent that lives both in wild temperate climates and in close proximity to humans (e.g. cities). It is a very widely used model organism to study disease, development, genetics, evolution, and other topics.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_musculus.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/House_mouse",
    paperHyperlink: "https://www.nature.com/articles/s41586-020-2496-1",
    organs: {
      "Heart": {
          coords: "132,173,128,179,130,187,131,200,137,213,148,218,155,213,156,199,148,183"
      },
      "Lung": {
          coords: "162,194,179,195,195,184,201,172,204,149,212,134,203,130,179,138,157,147,142,154,133,164,136,173"
      },
      "Tongue": {
        coords: "63,180,44,194,34,205,26,215,27,221,47,216,65,210,78,201,84,193,75,185"
      },
    },
  },
  "m_murinus": {
    bioName: "Microcebus murinus",
    commonName: "Mouse lemur",
    dataSource: "[Tabula Microcebus 2023](Tabula Microcebus: A transcriptomic cell atlas of mouse lemur, an emerging primate model organism)",
    about: "Microbebus murinus or mouse lemur is a primate that lives in Madagascar. Is is a model organism for comparative genetics and cell biology and to study primate evolution.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_murinus.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Gray_mouse_lemur",
    paperHyperlink:"https://www.biorxiv.org/content/10.1101/2021.12.12.469460v2",
  },
  "n_vectensis": {
    bioName: "Nematostella vectensis",
    commonName: "Starlet sea anemone",
    dataSource: "[Steger et al 2022](Single-cell transcriptomics identifies conserved regulators of neuroglandular lineages)",
    about: "The starlet sea anemone is a species of small sea anemone in the family Edwardsiidae native to the east coast of the United States, with introduced populations along the coast of southeast England and the west coast of the United States. Populations have also been located in Nova Scotia, Canada",
    imagePath: require("../asset/organisms/n_vectensis.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Starlet_sea_anemone",
    paperHyperlink: "https://www.sciencedirect.com/science/article/pii/S2211124722012025?via%3Dihub",
  },
  "s_lacustris": {
    bioName: "Spongilla lacustris",
    commonName: "Freshwater sponge",
    dataSource: "[Musser et al. 2021](Profiling cellular diversity in sponges informs animal cell type and nervous system evolution)",
    about: "Spongilla lacustris is a freshwater sponge that is common in Europe. It is studies in ecology and evolutionary biology.",
    imagePath: require("../asset/organisms/s_lacustris.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Spongilla_lacustris",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.abj2949",
  },
  "s_mansoni": {
    bioName: "Schistosoma mansoni",
    commonName: "Blood fluke",
    dataSource: "[Li et al. 2021](Single-cell analysis of Schistosoma mansoni identifies a conserved genetic program controlling germline stem cell fate)",
    about: "Schistosoma mansoni is a water-borne parasite of humans. It is studied as the etiological cause of schistosomiasis.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_mansoni.jpeg"),
    descriptionHyperlink: "",
    paperHyperlink: "https://www.nature.com/articles/s41467-020-20794-w",

  },
  "s_mediterranea": {
    bioName: "Schmidtea mediterranea",
    commonName: "Planarian worm",
    dataSource: "[Plass et al 2018](Cell type atlas and lineage tree of a whole complex animal by single-cell transcriptomics)",
    about: "Schmidtea mediterranea is a planarian found in Europe. It is studied because of its ability to regenerate lost body parts thanks to a large reservoir of stem-like cells.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_mediterranea.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Schistosoma_mansoni",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.aaq1723",
  },
  "t_adhaerens": {
    bioName: "Trichoplax adhaerens",
    commonName: "Placozoan",
    dataSource: "[Sebé-Pedrós et al 2018](Early metazoan cell type diversity and the evolution of multicellular gene regulation)",
    about: "Trichoplax adhaerens is an organism in the phylum Placozoa, a basal group of multicellular animals, possible relatives of Cnidaria. They are studied as a comparative outgroup for multicellular organismal evolution, cell biology, and genetics.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/t_adhaerens.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Trichoplax",
    paperHyperlink: "https://www.nature.com/articles/s41559-018-0575-6",
  },
  "x_laevis": {
    bioName: "Xenopus laevis",
    commonName: "African clawed frog",
    dataSource: "[Liao et al 2022](Cell landscape of larval and adult Xenopus laevis at single-cell resolution)",
    paperHyperlink: "https://www.nature.com/articles/s41467-022-31949-2",
    about: "Xenopus laevis is a species of African aquatic frog. It is a model organism for cell biology and development.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/x_laevis.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/African_clawed_frog",
    organs: {
      "heart": {
        coords: "531,263,520,273,527,285,527,291,512,309,506,332,509,352,513,369,528,381,544,381,556,374,570,358,574,342,577,324,573,305,563,297,574,288,571,274,559,277,544,294"
      },
      "liver": {
        coords: "491,267,480,269,469,280,455,302,449,326,435,345,421,373,413,402,411,424,416,438,421,442,439,434,455,423,469,411,485,396,498,378,505,356,506,327,505,294,501,273"
      },
      "lung": {
        coords: "670,273,661,282,658,303,665,320,675,332,679,354,688,367,699,371,710,364,710,342,704,322,687,295,680,279"
      },
      "muscle": {
        coords: "768,762,712,764,628,808,547,859,587,891,634,873,697,863,755,846,799,820,829,804,855,790,867,770"
      },
      "skin": {
        coords: "237,1036,247,1054,244,1071,235,1089,224,1101,241,1099,255,1091,265,1091,275,1103,285,1088,297,1076,311,1071,351,1023,316,1049,305,1040,300,1026,269,1035"
      },
      "pancreas": {
        coords: "559,426,582,421,604,426,615,438,621,465,627,502,625,523,611,531,579,534,557,529,542,518,533,499,539,479,544,447,559,436"
      },
      "brain": {
        coords: "555,119,536,125,526,144,523,162,525,181,540,186,556,192,570,180,593,169,597,150,580,125"
      },
      "eye": {
        coords: "516,91,491,97,481,116,483,138"
      },
      "kidney": {
        coords: "549,419,542,396,522,384,499,393,478,416,467,450,472,478,491,486,515,485,538,475,542,446,526,444,518,431,528,419"
      },
      "testis": {
        coords: "569,383,560,388,553,400,555,413,558,421,570,422,582,419,588,405,581,389"
      },
      "spleen": {
        coords: "537,418,526,423,519,431,523,439,529,443,541,445,552,440,557,430,549,422"
      },
      "gut": {
        coords: "717, 480, 703, 498, 692, 492, 678, 490, 689, 473, 675, 453, 654, 439, 641, 439, 631, 454, 628, 468, 636, 479, 651, 488, 640, 496, 632, 504, 641, 513, 655, 518, 650, 526, 659, 534, 651, 541, 634, 551, 626, 564, 635, 604, 682, 576, 704, 554, 704, 537, 678, 526, 697, 524, 714, 519, 730, 502, 727, 477",
      },
      "bladder": {
        coords: "625, 525, 618, 557, 604, 574, 593, 595, 587, 619, 579, 660, 574, 679, 584, 680, 595, 670, 618, 665, 634, 656, 642, 634, 636, 605, 626, 556",
      },
      "ovary": {
        coords: "473, 482, 489, 501, 504, 507, 513, 521, 536, 531, 559, 533, 567, 539, 576, 543, 580, 556, 566, 577, 573, 593, 575, 605, 549, 609, 555, 620, 566, 635, 550, 644, 519, 627, 499, 615, 481, 595, 460, 585, 451, 565, 455, 551, 440, 517, 456, 508",
      },
      "oviduct": {
        coords: "390, 501, 377, 515, 382, 529, 405, 519, 417, 519, 415, 539, 410, 568, 419, 591, 443, 612, 478, 627, 503, 639, 534, 657, 543, 651, 475, 611, 448, 563, 436, 539, 440, 508, 423, 498, 396, 511",
      },
      "bone_Marrow": {
        coords: "431, 629, 361, 665, 278, 699, 234, 730, 255, 761, 283, 782, 332, 808, 391, 875, 425, 907, 449, 883, 376, 820, 322, 787, 272, 730, 327, 699, 397, 668, 458, 648",
      },
      "stomach": {
        "coords": "678,382,691,393,705,408,718,437,727,476,720,479,705,463,688,448,672,437,649,421,641,412,643,397,650,386,664,381",
      }
    }  
  }
};

export default organismMetadata;
