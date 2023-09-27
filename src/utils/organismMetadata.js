const organismMetadata = {
  "a_queenslandica": {
    bioName: "Amphimedon queenslandica",
    commonName: "Sponge",
    dataSource: "[Sebé-Pedrós et al 2018](Early metazoan cell type diversity and the evolution of multicellular gene regulation)",
    about: "Amphimedon queenslandica (formerly known as Reniera sp.) is a sponge native to the Great Barrier Reef. It is hermaphroditic, and reproduces via spermcast spawning, meaning it releases sperm into water but retains eggs, which are fertilised internally.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/a_queenslandica.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Amphimedon_queenslandica",
    paperHyperlink: "https://www.nature.com/articles/s41559-018-0575-6",
  },
  "c_elegans": {
    bioName: "Caenorhabditis qlegans",
    commonName: "Nematode",
    dataSource: "[Cao et al. 2017](Comprehensive single-cell transcriptional profiling of a multicellular organism)",
    about: "Caenorhabditis elegans is a free-living transparent nematode about 1 mm in length that lives in temperate soil environments. Caenorhabditis Elegans is an unsegmented pseudocoelomate and lacks respiratory or circulatory systems.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/c_elegans.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Caenorhabditis_elegans",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.aam8940"
  },
  "d_melanogaster": {
    bioName: "Drosophila melanogaster",
    commonName: "Fruit fly",
    dataSource: "Data source not available",
    about: "Drosophila Melanogaster is a species of fly. Drosophila Melanogaster is typically used in research owing to its rapid life cycle, relatively simple genetics with only four pairs of chromosomes, and large number of offspring per generation",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/d_melanogaster.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Drosophila_melanogaster",
  },
  "d_rerio": {
    bioName: "Danio rerio",
    commonName: "Zebrafish",
    dataSource: "[Wagner et al. 2018](Single-cell mapping of gene expression landscapes and lineage in the zebrafish embryo)",
    about: "The zebrafish (Danio rerio) is a freshwater fish belonging to the minnow family (Cyprinidae) of the order Cypriniformes. Native to India[2] and South Asia, it is a popular aquarium fish, frequently sold under the trade name zebra danio. The zebrafish is an important and widely used vertebrate model organism in scientific research, for example in drug development, in particular pre-clinical development.[4] It is also notable for its regenerative abilities,[5] and has been modified by researchers to produce many transgenic strains",
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
    dataSource: "Data source not available",
    about: "Acoels are marine worms that belong to the phylum Xenacoelomorpha, a deep-diverging bilaterian lineage. This makes acoels an attractive system for studying the evolution of major bilaterian traits.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/h_miamia.jpeg"),
    descriptionHyperlink: "https://pubmed.ncbi.nlm.nih.gov/34196362/",
  },
  "h_sapiens": {
    bioName: "Homo sapiens",
    commonName: "Human",
    dataSource: "RNA: [Tabula Sapiens](The Tabula Sapiens: A multiple-organ, single-cell transcriptomic atlas of humans)",
    about: "Homo sapiens, (Latin: “wise man”) the species to which all modern human beings belong. Humans are the most common and widespread species of primate. A great ape characterized by their hairlessness, bipedalism, and high intelligence, humans have a large brain and resulting cognitive skills that enable them to thrive in varied environments and develop complex societies and civilizations.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/h_sapiens.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Human",
    paperHyperlink:"https://www.science.org/doi/10.1126/science.abl4896"
    // anatomyImage: require("../asset/anatomy/h_sapiens.jpeg"),
  },
  "m_leidyi": {
    bioName: "Mnemiopsis leidyi",
    commonName: "Comb jelly",
    dataSource: "[Sebé-Pedrós et al 2018](Early metazoan cell type diversity and the evolution of multicellular gene regulation)",
    about: "Mnemiopsis leidyi, the warty comb jelly or sea walnut,[1] is a species of tentaculate ctenophore (comb jelly). It is native to western Atlantic coastal waters, but has become established as an invasive species in European and western Asian regions. Three species have been named in the genus Mnemiopsis, but they are now believed to be different ecological forms of a single species M. leidyi by most zoologists",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_leidyi.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Mnemiopsis",
    paperHyperlink: "https://www.nature.com/articles/s41559-018-0575-6",
  },
  "m_musculus": {
    bioName: "Mus musculus",
    commonName: "House mouse",
    dataSource: "[Tabula Muris Senis](A single-cell transcriptomic atlas characterizes ageing tissues in the mouse)",
    about: "The house mouse (Mus musculus) is a small mammal of the order Rodentia, characteristically having a pointed snout, large rounded ears, and a long and almost hairless tail. It is one of the most abundant species of the genus Mus. Although a wild animal, the house mouse has benefited significantly from associating with human habitation to the point that truly wild populations are significantly less common than the semi-tame populations near human activity.",
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
  "m_myoxinus": {
    bioName: "Microcebus myoxinus",
    commonName: "Mouse lemur",
    dataSource: "[Tabula Microcebus](Tabula Microcebus: A transcriptomic cell atlas of mouse lemur, an emerging primate model organism)",
    about: "The pygmy mouse lemur (Microcebus myoxinus), also known as Peters' mouse lemur or dormouse lemur;it is the second smallest of the mouse lemurs.Its dorsal side is a rufous-brown colour, and creamy-white ventrally. It lives in dry deciduous forests of western Madagascar.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/m_myoxinus.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Pygmy_mouse_lemur",
    paperHyperlink:"https://www.biorxiv.org/content/10.1101/2021.12.12.469460v2",
  },
  "s_lacustris": {
    bioName: "Spongilla lacustris",
    commonName: "Freshwater sponge",
    dataSource: "[Musser et al. 2021](Profiling cellular diversity in sponges informs animal cell type and nervous system evolution)",
    about: "Spongilla lacustris is a species of freshwater sponge from the family Spongillidae. It inhabits freshwater rivers and lakes, often growing under logs or rocks.The species ranges from North America to Europe and Asia. pongilla lacustris have the ability to reproduce both sexually and asexually. They become dormant during winter. The growth form ranges from encrusting, to digitate, to branched, depending upon the quality of the habitat.",
    imagePath: require("../asset/organisms/s_lacustris.jpeg"),
    descriptionHyperlink:"https://en.wikipedia.org/wiki/Spongilla_lacustris",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.abj2949",
  },
  "s_mansoni": {
    bioName: "Schistosoma mansoni",
    commonName: "Blood fluke",
    dataSource: "Data source not available",
    about: "Schistosoma mansoni is a water-borne parasite of humans, and belongs to the group of blood flukes. The adult lives in the blood vessels near the human intestine. It causes intestinal schistosomiasis. Clinical symptoms are caused by the eggs. As the leading cause of schistosomiasis in the world, it is the most prevalent parasite in humans. It is classified as a neglected tropical disease",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_mansoni.jpeg"),
    descriptionHyperlink: ""
  },
  "s_mediterranea": {
    bioName: "Schmidtea mediterranea",
    commonName: "Planarian worm",
    dataSource: "[Plass et al 2018](Cell type atlas and lineage tree of a whole complex animal by single-cell transcriptomics)",
    about: "",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/s_mediterranea.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/Schistosoma_mansoni",
    paperHyperlink: "https://www.science.org/doi/10.1126/science.aaq1723",
  },
  "t_adhaerens": {
    bioName: "Trichoplax adhaerens",
    commonName: "Placozoan",
    dataSource: "[Sebé-Pedrós et al 2018](Early metazoan cell type diversity and the evolution of multicellular gene regulation)",
    about: "Trichoplax adhaerens is one of the four named species in the phylum Placozoa. Placozoa is a basal group of multicellular animals, possible relatives of Cnidaria.[2] Trichoplax are very flat organisms commonly less than 4 mm in diameter,[3] lacking any organs or internal structures.They generally reproduce asexually, by dividing or budding, but can also reproduce sexually. Though Trichoplax has a small genome in comparison to other animals, nearly 87% of its 11,514 predicted protein-coding genes are identifiably similar to known genes in other animals.",
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
    about: "The African clawed frog (Xenopus laevis), also known as simply Xenopus, African clawed toad, African claw-toed frog or the Platanna) is a species of African aquatic frog of the family Pipidae.The species is found throughout much of Sub-Saharan Africa (Nigeria and Sudan to South Africa),[2] and in isolated, introduced populations in North America, South America, Europe, and Asia.",
    genesFromPaper: "",
    imagePath: require("../asset/organisms/x_laevis.jpeg"),
    descriptionHyperlink: "https://en.wikipedia.org/wiki/African_clawed_frog",
    organs: {
      "Liver-left": {
          coords: "530,158,519,162,509,173,502,188,500,198,487,220,477,248,477,266,482,272,496,267,520,249,532,233,539,208,537,179"
      },
      "Lung": {
          coords: "641,163,636,171,638,185,642,196,649,213,658,226,669,224,670,205,660,185,650,165"
      },
      "Pancreas": {
          coords: "570,264,587,261,601,263,609,273,614,296,614,321,604,331,570,329,558,315,556,297,567,281"
      },
      "Eye": {
        coords: "543,47,528,49,522,56,521,64,523,75"
      },
      "Liver-label": {
        coords: "214,231,170,231,170,212,214,212"
      }
    }
  }
};

export default organismMetadata;
