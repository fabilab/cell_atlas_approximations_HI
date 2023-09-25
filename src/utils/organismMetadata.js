const organismMetadata = {
  "a_queenslandica": {
    bioName: "Amphimedon queenslandica",
    commonName: "Sponge",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/a_queenslandica.jpeg"),
  },
  "c_elegans": {
    bioName: "Caenorhabditis qlegans",
    commonName: "Nematode",
    dataSource: "[Cao et al. 2017](https://www.science.org/doi/10.1126/science.aam8940)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/c_elegans.jpeg"),
  },
  "d_melanogaster": {
    bioName: "Drosophila melanogaster",
    commonName: "Fruit fly",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/d_melanogaster.jpeg"),
  },
  "d_rerio": {
    bioName: "Danio rerio",
    commonName: "Zebrafish",
    dataSource: "[Wagner et al. 2018](https://www.science.org/doi/10.1126/science.aar4362)",
    about: "Embryonic development is a transformative process where pluripotent cells evolve into varied, specialized entities. Employing single-cell RNA sequencing, eminent research teams, including Wagner, Farrell, and Briggs, have made groundbreaking contributions. Specifically, Wagner's team sequenced the transcriptomes of over 90,000 cells throughout zebrafish development, shedding profound light on cell differentiation. In parallel, Farrell's group elucidated a trajectory towards 25 unique zebrafish cell types, emphasizing the nuances of gene expression evolution. Briggs' study meticulously mapped cellular dynamics in frog embryos. Collectively, this research sets a robust framework for delving deeper into transcriptional landscapes in developmental biology.",
    genesFromPaper: "epcam, si, krt18, krt8, cldnb, elavl3, krt4, tfap2a, LOC100537766, cldnh, six1b, LOC100006216, myt1a, dlb, sox19a, actc1a, pfn1, cxcl12b, pax6b ",
    imagePath: require("../asset/organisms/d_rerio.jpeg"),
    organs: {
      "Whole": {
          coords: "247,35,203,70,177,131,175,159,162,228,173,300,199,370,228,422,342,426,408,415,412,346,395,264,358,176,310,109,287,67"
      },
    },
  },
  "h_miamia": {
    bioName: "Hofstenia miamia",
    commonName: "Three-banded panther worm",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/h_miamia.jpeg"),
  },
  "h_sapiens": {
    bioName: "Homo sapiens",
    commonName: "Human",
    dataSource: "RNA: [Tabula Sapiens](https://www.science.org/doi/10.1126/science.abl4896), ATAC: [Zhang et al. 2021](https://doi.org/10.1016/j.cell.2021.10.024)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/h_sapiens.jpeg"),
    // anatomyImage: require("../asset/anatomy/h_sapiens.jpeg"),
  },
  "m_leidyi": {
    bioName: "Mnemiopsis leidyi",
    commonName: "Comb jelly",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_leidyi.jpeg"),
  },
  "m_musculus": {
    bioName: "Mus musculus",
    commonName: "House mouse",
    dataSource: "[Tabula Muris Senis](https://www.nature.com/articles/s41586-020-2496-1)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_musculus.jpeg"),
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
  "m_myoxinus": {
    bioName: "Microcebus myoxinus",
    commonName: "Mouse lemur",
    dataSource: "[Tabula Microcebus](https://www.biorxiv.org/content/10.1101/2021.12.12.469460v2)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_myoxinus.jpeg"),
  },
  "s_lacustris": {
    bioName: "Spongilla lacustris",
    commonName: "Freshwater sponge",
    dataSource: "[Musser et al. 2021](https://www.science.org/doi/10.1126/science.abj2949)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_lacustris.jpeg"),
  },
  "s_mansoni": {
    bioName: "Schistosoma mansoni",
    commonName: "Blood fluke",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_mansoni.jpeg"),
  },
  "s_mediterranea": {
    bioName: "Schmidtea mediterranea",
    commonName: "Planarian worm",
    dataSource: "[Plass et al 2018](https://www.science.org/doi/10.1126/science.aaq1723#sec-10)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_mediterranea.jpeg"),
  },
  "t_adhaerens": {
    bioName: "Trichoplax adhaerens",
    commonName: "Placozoan",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/t_adhaerens.jpeg"),
  },
  "x_laevis": {
    bioName: "Xenopus laevis",
    commonName: "African clawed frog",
    dataSource: "[Liao et al 2022](Cell landscape of larval and adult Xenopus laevis at single-cell resolution)",
    paperHyperlink: "https://www.nature.com/articles/s41467-022-31949-2",
    about: "The African clawed frog (Xenopus laevis), also known as simply Xenopus, African clawed toad, African claw-toed frog or the Platanna) is a species of African aquatic frog of the family Pipidae. Its name is derived from the short black claws on its feet. The word Xenopus means 'strange foot' and laevis means 'smooth'. The species is found throughout much of Sub-Saharan Africa (Nigeria and Sudan to South Africa),[2] and in isolated, introduced populations in North America, South America, Europe, and Asia.[1] All species of the family Pipidae are tongueless, toothless and completely aquatic. They use their hands to shove food in their mouths and down their throats and a hyobranchial pump to draw or suck things in their mouth. Pipidae have powerful legs for swimming and lunging after food. They also use the claws on their feet to tear pieces of large food. They have no external eardrums, but instead subcutaneous cartilaginous disks that serve the same function.[3] They use their sensitive fingers and sense of smell to find food. Pipidae are scavengers and will eat almost anything living, dying, or dead and any type of organic waste.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/x_laevis.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/African_clawed_frog",
    organs: {
      "Brain": {
          coords: "383,83,371,91,364,101,359,114,358,125,358,132,360,142,367,145,375,147,383,152,394,150,402,145,406,137,416,141,429,127,430,111,420,96,402,83"
      },
      "Liver-left": {
          coords: "317,229,303,241,293,259,286,286,273,301,262,326,252,354,250,382,255,394,268,395,297,375,317,357,334,337,341,316,343,284,340,251,335,233,327,226"
      },
      "Liver-right": {
          coords: "430,267,415,273,412,293,418,337,430,365,453,384,475,391,509,392,519,384,522,369,504,334,497,315,471,287,447,277"
      },
      "Kidney": {
          coords: "343,369,322,381,310,403,302,426,302,442,308,455,325,462,348,461,367,453,364,477,383,503,414,508,444,505,453,495,454,466,444,418,430,404,407,401,384,404,374,379,379,367,379,355,361,349,348,353"
      },
      "Heart": {
          coords: "365,222,356,231,363,247,345,269,342,297,346,323,362,339,384,335,397,322,407,306,410,286,408,268,397,252,408,244,401,230,380,251"
      },
      "Eye": {
        coords: "350,64,332,81,319,91,318,97,319,107,329,100"
      },
      "Muscle-left": {
        coords: "226,517,173,549,111,601,84,637,56,667,95,678,139,671,192,658,261,638,296,613,319,610,270,574"
      },
      "Muscle-right": {
        coords: "455,625,504,666,559,693,636,714,692,712,671,657,632,603,590,566,563,532,524,581"
      }
    }
  }
};

export default organismMetadata;
