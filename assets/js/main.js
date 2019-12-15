/* Inspirational Quote */

var urlRandomQuote = "https://quote-garden.herokuapp.com/quotes/random";
$.when($.get(urlRandomQuote)).then(randomQuote => {
  console.log("Quote: ", randomQuote.quoteText);
  console.log("Author: ", randomQuote.quoteAuthor || "Unknown");
});
