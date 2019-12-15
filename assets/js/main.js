/* News Feeds */

const TOP = 5; // User chooses to see the top n articles from each feed.

// #region MY Times

const apiKeyNYTimes = "RW27VlJmKlJGUazGiUKrvhygb5icwzCZ";

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

console.log("News sections in NY Times: ", sectionsNYT);

var sectionNYT = sectionsNYT[10]; // User will select the section of interest
var urlNYTimes = `https://api.nytimes.com/svc/topstories/v2/${sectionNYT}.json?api-key=${apiKeyNYTimes}`;
const articlesNYT = [];
$.when($.get(urlNYTimes)).then(processNYTArticles);

function processNYTArticles(response) {
  console.log("NYT Articles");
  for (let i = 0; i < TOP; i++) {
    const result = response.results[i];
    articlesNYT.push({ title: result.title, link: result.url });
  }
  console.log(articlesNYT);
}

// #endregion

// #region Guardian
const keyGuardian = "693e9564-56f1-487b-a996-d5c0199573ab";

const sectionsGuardian = [];
var urlGuardianSections = "https://content.guardianapis.com/sections?api-key=" + keyGuardian;
$.when($.get(urlGuardianSections)).then(processGuardianSections);
setTimeout(fetchGuardianArticles, 2000);

function processGuardianSections(response) {
  response.response.results.forEach(result => {
    sectionsGuardian.push(result.id);
  });
  console.log("News sections in Guardian: ", sectionsGuardian);
}

function fetchGuardianArticles() {
  var sectionGuardian = sectionsGuardian[10]; // User will select the section of interest
  var urlGuardianSearch = "https://content.guardianapis.com/search?api-key=" + keyGuardian + "&q=";
  urlGuardianSearch += "&section=" + sectionGuardian;
  const articlesGuardian = [];
  $.when($.get(urlGuardianSearch)).then(processGuardianArticles);

  function processGuardianArticles(response) {
    console.log("Guardian Articles");
    for (let i = 0; i < TOP; i++) {
      const result = response.response.results[i];
      articlesGuardian.push({ title: result.webTitle, link: result.webUrl });
    }
    console.log(articlesGuardian);
  }
}

// #endregion
