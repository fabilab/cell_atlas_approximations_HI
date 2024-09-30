// https://introjs.com/docs/tour/examples/json-config
// Define the new user tour setting here:
export const landingTourSteps = [
  {
    intro: 'Welcome to AtlasApprox! 👋 Let me guide you through a quick tour to help you get started.',
    title: 'Welcome'
  },
  {
    element: '#user-guide-link',
    intro: 'Check out the user guide here for detailed instructions on how to use AtlasApprox.',
    position: 'bottom',
    title: 'User guide'
  },
  {
    element: '#example-query',
    intro: 'Here are some example queries you can try. Simply click on one to start exploring!',
    position: 'right',
    title: 'Example queries'
  },
  {
    element: '#query-input',
    intro: 'You can type your own question or choose from the example queries. Press Enter to submit.',
    position: 'bottom',
    title: 'Submit your query'
  },
];

export const resultTourSteps = [
  {
    element: '#chat-box',
    intro: 'This is the chat area where you interact with the bot. Your questions and responses will appear here.',
    position: 'bottom',
    title: 'Chat with the bot'
  },
  {
    element: '#plot-box',
    intro: 'Here you will see the visual output (plots) based on the query you submitted.',
    position: 'left',
    title: 'Visualise results'
  },
  {
    element: '#hover-plot',
    intro: 'Some plots are interactive! Hover over data points to get detailed information.',
    position: 'left',
    title: 'Interact with plots'
  },
];

