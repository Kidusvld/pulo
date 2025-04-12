
// Collection of motivational fitness quotes
export const motivationalQuotes = [
  {
    quote: "Don't wish for it, work for it.",
    source: "Daily Motivation"
  },
  {
    quote: "The only bad workout is the one that didn't happen.",
    source: "Daily Motivation"
  },
  {
    quote: "Your body can stand almost anything. It's your mind you have to convince.",
    source: "Daily Motivation"
  },
  {
    quote: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    source: "Daily Motivation"
  },
  {
    quote: "The harder you work for something, the greater you'll feel when you achieve it.",
    source: "Daily Motivation"
  },
  {
    quote: "Your health is an investment, not an expense.",
    source: "Daily Motivation"
  },
  {
    quote: "The only place where success comes before work is in the dictionary.",
    source: "Daily Motivation"
  },
  {
    quote: "Fall in love with taking care of your body.",
    source: "Daily Motivation"
  },
  {
    quote: "Rome wasn't built in a day, and neither was your body.",
    source: "Daily Motivation"
  },
  {
    quote: "The difference between try and triumph is a little umph.",
    source: "Daily Motivation"
  }
];

// Function to get a random quote from the collection
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};
