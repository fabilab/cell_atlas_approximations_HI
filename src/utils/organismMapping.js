const organismMapping = {
  "a_queenslandica": {
    biologicalName: "Amphimedon Queenslandica",
    commonName: "Sponge",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
  },
  "c_elegans": {
    biologicalName: "Caenorhabditis Elegans",
    commonName: "Nematode",
    dataSource: "[Cao et al. 2017](https://www.science.org/doi/10.1126/science.aam8940)",
    about: "",
    genesFromPaper: "",
  },
  "d_melanogaster": {
    biologicalName: "Drosophila Melanogaster",
    commonName: "Fruit Fly",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
  },
  "d_rerio": {
    biologicalName: "Danio Rerio",
    commonName: "Zebrafish",
    dataSource: "[Wagner et al. 2018](https://www.science.org/doi/10.1126/science.aar4362)",
    about: "Embryonic development is a transformative process where pluripotent cells evolve into varied, specialized entities. Employing single-cell RNA sequencing, eminent research teams, including Wagner, Farrell, and Briggs, have made groundbreaking contributions. Specifically, Wagner's team sequenced the transcriptomes of over 90,000 cells throughout zebrafish development, shedding profound light on cell differentiation. In parallel, Farrell's group elucidated a trajectory towards 25 unique zebrafish cell types, emphasizing the nuances of gene expression evolution. Briggs' study meticulously mapped cellular dynamics in frog embryos. Collectively, this research sets a robust framework for delving deeper into transcriptional landscapes in developmental biology.",
    genesFromPaper: "epcam, si, krt18, krt8, cldnb, elavl3, krt4, tfap2a, LOC100537766, cldnh, six1b, LOC100006216, myt1a, dlb, sox19a, actc1a, pfn1, cxcl12b, pax6b ",
  },
  "h_miamia": {
    biologicalName: "Hofstenia Miamia",
    commonName: "Three-banded Panther Worm",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
  },
  "h_sapiens": {
    biologicalName: "Homo Sapiens",
    commonName: "Human",
    dataSource: "RNA: [Tabula Sapiens](https://www.science.org/doi/10.1126/science.abl4896), ATAC: [Zhang et al. 2021](https://doi.org/10.1016/j.cell.2021.10.024)",
    about: "",
    genesFromPaper: "",
  },
  "m_leidyi": {
    biologicalName: "Mnemiopsis Leidyi",
    commonName: "Comb Jelly",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
  },
  "m_musculus": {
    biologicalName: "Mus Musculus",
    commonName: "House Mouse",
    dataSource: "[Tabula Muris Senis](https://www.nature.com/articles/s41586-020-2496-1)",
    about: "",
    genesFromPaper: "",
  },
  "m_myoxinus": {
    biologicalName: "Microcebus Myoxinus",
    commonName: "Mouse Lemur",
    dataSource: "[Tabula Microcebus](https://www.biorxiv.org/content/10.1101/2021.12.12.469460v2)",
    about: "",
    genesFromPaper: "",
  },
  "s_lacustris": {
    biologicalName: "Spongilla Lacustris",
    commonName: "Freshwater Sponge",
    dataSource: "[Musser et al. 2021](https://www.science.org/doi/10.1126/science.abj2949)",
    about: "",
    genesFromPaper: "",
  },
  "s_mansoni": {
    biologicalName: "Schistosoma Mansoni",
    commonName: "Blood Fluke",
    dataSource: "Data source not available",
    about: "",
    genesFromPaper: "",
  },
  "s_mediterranea": {
    biologicalName: "Schmidtea Mediterranea",
    commonName: "Planarian Worm",
    dataSource: "[Plass et al 2018](https://www.science.org/doi/10.1126/science.aaq1723#sec-10)",
    about: "",
    genesFromPaper: "",
  },
  "t_adhaerens": {
    biologicalName: "Trichoplax Adhaerens",
    commonName: "Placozoan",
    dataSource: "[Sebé-Pedrós et al 2018](https://www.nature.com/articles/s41559-018-0575-6)",
    about: "",
    genesFromPaper: "",
  },
  "x_laevis": {
    biologicalName: "Xenopus Laevis",
    commonName: "African Clawed Frog",
    dataSource: "[Liao et al 2022](https://www.nature.com/articles/s41467-022-31949-2#ref-CR14)",
    about: "",
    genesFromPaper: "",
    organs : {
      "Liver-left": {
          coords: "537,249,530,253,525,259,519,265,514,271,510,281,506,293,505,301,498,310,490,321,480,344,475,362,473,372,473,383,474,392,477,400,484,401,493,396,501,391,508,387,514,382,521,377,527,372,533,366,539,359,545,351,549,343,552,334,554,323,554,314,553,302,554,292,553,278,552,266,550,258,546,250"
      },
      "Liver-right": {
          coords: "637,288,627,288,620,294,618,302,618,313,619,320,623,345,626,356,633,370,642,381,652,389,664,394,673,396,684,397,693,397,707,398,712,393,715,385,713,374,709,365,702,353,698,343,695,333,688,321,676,311,665,302,652,295"
      },
      "Heart": {
          coords: "589,271,577,245,567,250,572,260,574,269,562,282,555,294,554,310,557,331,562,342,570,348,581,350,591,346,597,343,605,335,610,326,613,315,613,306,614,295,612,284,604,273,614,266,611,253,600,260"
      },
      "Brain": {
          coords: "591,121,581,128,575,136,570,149,569,159,568,165,572,174,577,176,583,178,588,180,596,182,603,179,607,174,613,170,622,172,628,163,633,155,632,144,625,135,619,128,609,123,600,120"
      },
      "Lung-left": {
          coords: "500,265,489,273,478,283,474,293,466,306,464,320,462,335,461,346,465,353,471,343,477,323,485,309,493,298,500,286,502,276"
      },
      "Lung-right": {
          coords: "697,255,690,258,686,265,686,273,688,281,691,288,695,298,698,304,701,312,704,322,708,329,714,335,719,338,724,342,729,339,731,328,731,316,730,306,724,292,717,281,710,269,704,258"
      },
      "Kidney": {
          coords: "597,412,609,407,624,407,634,409,646,418,650,434,653,453,655,468,655,490,645,501,625,504,606,501,587,495,578,483,574,468,577,456,564,459,552,460,537,460,523,455,517,443,517,431,520,419,525,408,530,400,535,391,540,385,547,381,553,379,556,368,567,361,577,361,584,363,589,372,585,384,584,394,588,406"
      },
      "Muscle-left": {
          coords: "451,512,418,531,383,556,357,579,337,602,323,617,308,634,297,650,338,655,402,642,438,634,457,628,480,621,500,609,519,598,532,594,485,556"
      },
      "Muscle-right": {
          coords: "758,523,773,547,787,560,802,574,816,589,833,607,847,629,861,656,868,685,862,702,835,691,794,683,763,674,736,664,715,654,694,640,676,627,655,609,714,575"
      }
    }
  }
};

export default organismMapping;
