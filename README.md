<img src="https://raw.githubusercontent.com/fabilab/cell_atlas_approximations/main/figures/figure_HI.png" width="150" height="150">

# Cell Atlas Approximations - Human Interface

<p align="center">
  <a href="https://www.youtube.com/watch?v=dpX5lGmDUVs&list=PLg5L12XyDFdxLOqmpwB2nsZS_kzt7CnkR&index=1"><img width="400" src="https://img.youtube.com/vi/dpX5lGmDUVs/0.jpg"></a>
</p>

Cell atlases are multi-organ single cell omics data sets describing entire organisms.

This project implements a web interface that enables biologists, doctors, and other researchers to browse and interact with cell atlases using natural language (initially, English).

**NOTE:** The web application is entirely client-side, i.e. it does not require any backend server to run.

This repo is a component of [Light and scalable statistical approximations of cell atlases](https://chanzuckerberg.com/science/programs-resources/single-cell-biology/data-insights/light-and-scalable-statistical-approximations-of-cell-atlases/), which also include:

- A repo to [approximate cell atlases statistically](https://github.com/fabilab/cell_atlas_approximations_compression)
- A repo to expose programmatic access to the approximations via an [API](https://github.com/fabilab/cell_atlas_approximations_API)
- A repo to process natural language prompts via a [chat bot](https://github.com/fabilab/cell_atlas_approximations_NLP)

## Design
The human interface is composed of two primary elements:
- A chat bot trained by machine learning to process requests and questions.
- An interactive chart via [CanvaXpress](https://canvasxpress.org/index.html) to visualise gene expression and other features of cell atlases.

## Authors
Proudly developed @ [fabilab](https://fabilab.org) by Ying Xu.
