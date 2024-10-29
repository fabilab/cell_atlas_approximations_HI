// https://introjs.com/docs/tour/examples/json-config

export const landingTourSteps = [
  {
    intro: 'Welcome to Atlasapprox! 👋 Let\'s walk through the main features to help you get started.',
    title: 'Welcome'
  },
  {
    element: '#search-container',
    intro: 'Use the search bar here to ask questions about the cell atlases - our chat bot will guide you',
    position: 'bottom',
    title: 'Search and query'
  },
  {
    element: '#example-query',
    intro: 'Not sure what to ask? Click any example query from here to try it out!',
    position: 'right',
    title: 'Example queries'
  },
  {
    element: '#search-container',
    intro: "Once the query is ready, press Enter to submit this it and see the results!",
    position: 'bottom',
    title: 'Submit query',
    tooltipClass: 'custom-tooltip-class'
  },
];

export const resultTourSteps = [
  {
    element: '#chat-box',
    intro: 'Your conversation with the bot appears here. Follow its suggestion to explore the data further',
    position: 'bottom',
    title: 'Chat area'
  },
  {
    element: '#plot-box',
    intro: 'Interactive plots will appear here based on your queries.',
    position: 'left',
    title: 'Visualization'
  },
  {
    element: '#chat-box-input',
    intro: "Type you next question here to continue exploring",
    position: 'right',
    title: 'Next query',
  },
  {
    element: '#navbar-resources',
    intro: 'Check out our nav bar for user guide, video tutorials and code repository if you need more information',
    position: 'bottom',
    title: 'Other resources'
  }
];

