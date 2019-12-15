/* News Feeds */

// MY Times
const keyNYTimes = "RW27VlJmKlJGUazGiUKrvhygb5icwzCZ";

const sectionsNYT = [
  "arts",
  "automobiles",
  "books",
  "business",
  "fashion",
  "food",
  "health",
  "home",
  "magazine",
  "movies",
  "national",
  "politics",
  "realestate",
  "science",
  "sports",
  "technology",
  "travel",
  "world"
];

var sectionNYT = sectionsNYT[10];
var urlNYTimes = `https://api.nytimes.com/svc/topstories/v2/${sectionNYT}.json?api-key=${keyNYTimes}`;
$.when($.get(urlNYTimes)).then(response => {
  response.results.forEach(result => {
    console.log(result.title);
    console.log(result.url);
  });
});
