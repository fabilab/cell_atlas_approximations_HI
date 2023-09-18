const organismMetadata = {
  "a_queenslandica": {
    bioName: "Amphimedon Queenslandica",
    commonName: "Sponge",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/a_queenslandica.jpeg"),
  },
  "c_elegans": {
    bioName: "Caenorhabditis Elegans",
    commonName: "Nematode",
    dataSource: "[Cao et al. 2017](https://www.science.org/doi/10.1126/science.aam8940)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/c_elegans.jpeg"),
  },
  "d_melanogaster": {
    bioName: "Drosophila Melanogaster",
    commonName: "Fruit Fly",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/d_melanogaster.jpeg"),
  },
  "d_rerio": {
    bioName: "Danio Rerio",
    commonName: "Zebrafish",
    dataSource: "[Wagner et al. 2018](https://www.science.org/doi/10.1126/science.aar4362)",
    about: "Embryonic development is a transformative process where pluripotent cells evolve into varied, specialized entities. Employing single-cell RNA sequencing, eminent research teams, including Wagner, Farrell, and Briggs, have made groundbreaking contributions. Specifically, Wagner's team sequenced the transcriptomes of over 90,000 cells throughout zebrafish development, shedding profound light on cell differentiation. In parallel, Farrell's group elucidated a trajectory towards 25 unique zebrafish cell types, emphasizing the nuances of gene expression evolution. Briggs' study meticulously mapped cellular dynamics in frog embryos. Collectively, this research sets a robust framework for delving deeper into transcriptional landscapes in developmental biology.",
    genesFromPaper: "epcam, si, krt18, krt8, cldnb, elavl3, krt4, tfap2a, LOC100537766, cldnh, six1b, LOC100006216, myt1a, dlb, sox19a, actc1a, pfn1, cxcl12b, pax6b ",
    imagePath: require("../asset/organisms/d_rerio.jpeg"),
  },
  "h_miamia": {
    bioName: "Hofstenia Miamia",
    commonName: "Three-banded Panther Worm",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/h_miamia.jpeg"),
  },
  "h_sapiens": {
    bioName: "Homo Sapiens",
    commonName: "Human",
    dataSource: "RNA: [Tabula Sapiens](https://www.science.org/doi/10.1126/science.abl4896), ATAC: [Zhang et al. 2021](https://doi.org/10.1016/j.cell.2021.10.024)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/h_sapiens.jpeg"),
    // anatomyImage: require("../asset/anatomy/h_sapiens.jpeg"),
  },
  "m_leidyi": {
    bioName: "Mnemiopsis Leidyi",
    commonName: "Comb Jelly",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_leidyi.jpeg"),
  },
  "m_musculus": {
    bioName: "Mus Musculus",
    commonName: "House Mouse",
    dataSource: "[Tabula Muris Senis](https://www.nature.com/articles/s41586-020-2496-1)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_musculus.jpeg"),
  },
  "m_myoxinus": {
    bioName: "Microcebus Myoxinus",
    commonName: "Mouse Lemur",
    dataSource: "[Tabula Microcebus](https://www.biorxiv.org/content/10.1101/2021.12.12.469460v2)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_myoxinus.jpeg"),
  },
  "s_lacustris": {
    bioName: "Spongilla Lacustris",
    commonName: "Freshwater Sponge",
    dataSource: "[Musser et al. 2021](https://www.science.org/doi/10.1126/science.abj2949)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_lacustris.jpeg"),
  },
  "s_mansoni": {
    bioName: "Schistosoma Mansoni",
    commonName: "Blood Fluke",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_mansoni.jpeg"),
  },
  "s_mediterranea": {
    bioName: "Schmidtea Mediterranea",
    commonName: "Planarian Worm",
    dataSource: "[Plass et al 2018](https://www.science.org/doi/10.1126/science.aaq1723#sec-10)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_mediterranea.jpeg"),
  },
  "t_adhaerens": {
    bioName: "Trichoplax Adhaerens",
    commonName: "Placozoan",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/t_adhaerens.jpeg"),
  },
  "x_laevis": {
    bioName: "Xenopus Laevis",
    commonName: "African Clawed Frog",
    dataSource: "[Liao et al 2022](https://www.nature.com/articles/s41467-022-31949-2#ref-CR14)",
    about: "Xenopus laevis, commonly known as the African clawed frog, is a pivotal model organism in evolutionary biology. Leveraging advanced single-cell RNA sequencing technology, researchers have crafted an intricate Xenopus cell landscape, capturing the cellular heterogeneity across both larval and adult stages. This rich landscape offers unprecedented insights into the amphibian's metamorphic journey, bridging critical gaps in our understanding of vertebrate development and evolution. This comprehensive cellular atlas stands as a testament to the complex tapestry of life at the cellular level and serves as a beacon for future genetic and evolutionary studies.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/x_laevis.jpeg"),
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
    }
    }
  }
};

export default organismMetadata;
