// https://introjs.com/docs/tour/examples/json-config

export const landingTourSteps = [
  {
    intro: 'Let\'s get you started! 👋 Want to skip? Just click the "x" in the corner.',
    title: 'Welcome to atlasapprox!'
  },
  {
    element: '#search-container',
    intro: 'You can type a question in this search bar - our chat bot 🤖 will try its very best to answer.',
    position: 'bottom',
    title: 'Search and query'
  },
  {
    element: '#example-query',
    intro: 'Not sure what to ask? Click any example sentence from here to try it out!',
    position: 'right',
    title: 'Example queries'
  },
  {
    element: '#search-container',
    intro: "After you are done typing, click the arrow or press Enter to submit.",
    position: 'bottom',
    title: 'Submit query',
    tooltipClass: 'custom-tooltip-class'
  },
];

export const resultTourSteps = [
  {
    element: '#chat-box',
    intro: 'Your conversation with the bot appears here. In addition to a reply to your query, the bot can suggest your next query.',
    position: 'bottom',
    title: 'Chat area'
  },
  {
    element: '#plot-box',
    intro: 'Data charts appear here. They are interactive - try clicking on them to download plots or data, or to look up genes.',
    position: 'left',
    title: 'Visualization'
  },
  {
    element: '#chat-box-input',
    intro: "Type you next question here to continue exploring.",
    position: 'right',
    title: 'Next query',
  },
  {
    element: '#navbar-resources',
    intro: 'Want to learn more? Check out our user guides, video tutorials, documentation, and code repositories. Or reach out to tell us what you think! Have fun exploring!',
    position: 'bottom',
    title: 'Other resources'
  }
];

