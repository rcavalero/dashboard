let taskInput;
$(function () {

  // materialize init
  M.AutoInit();
  fillSavedTask();
  addTask();
  searchAmazon();
  grabMoment();
  $('.date').text(moment().format('ddd, MMM Do'));



  // this is a global variable for tracking user data
  // it has the following fields:
  // name
  // weatherCity
  // stocks
  // news
  // quotes
  var userData = [];

  // this will run when the app opens to see if data exists in local storage
  // if there is no data in local storage, the user is directed to the Setup page
  if (!localStorage.getItem("myDashUserData")) {
    // todo - add code to direct user to the setup page

    // once the setup page is setup and has a save button, we need to delete the following line and 
    // update the save button click function below
    updateUserData();
  }

  // if there is data in local storage it feeds to the userData global variable
  else (getUserData());

  // todo - update function based on save button info on user setup screen
  // $("save button").on("click", function(event) {
  //     event.preventDefault;
  //     updateUserData();
  // });

  // this will save user data in local storage from the setup page
  function updateUserData() {

    // this grabs data from the user setup screen
    // todo - need to update from HTML
    var setupData = $("setupDiv");

    var data = {
      name: "Robert",
      weatherCity: "seattle, wa",
      stocks: ["intc", "msft", "sbux"]

      // name: setupData.setupName.val(),
      // weatherCity: setupData.setupCity.val(),
      // stocks: setupData.setupStocks.val().split(","),
      // news: setupData.setupNews.val(),
      // quotes: setupData.setupQuotes.val()

    };
    // this loads user setup data into the userData global variable stores it to local storage
    // and pulls the stock & weather info
    userData.push(data);
    localStorage.setItem("myDashUserData", JSON.stringify(userData));
    getStockInfo(userData[0].stocks);
    getCurrWeather(userData[0].weatherCity);
    // todo - add the other functions for pulling quotes and news

  };

  // this loads existing user data into the userData global variable and pulls the stock & weather info
  function getUserData() {
    var storedUserData = JSON.parse(localStorage.getItem("myDashUserData") || "[]");
    userData = storedUserData;
    getStockInfo(userData[0].stocks);
    getCurrWeather(userData[0].weatherCity);
    // todo - add the other functions for pulling quotes and news
  };

  // *** this pulls stock data based on the user selected symbols that are stored in local storage ***
  // This loops through each stock symbol and currently stores the data in the stockInfo array for testing purposes
  function getStockInfo(stocks) {

    // this checks if there are stocks to pull data on and returns if not
    if (!stocks) {
      return;
    }

    // todo - this is the array that will be created by pulling from the API 
    // it can be deleted once we have HTML or element creation setup
    var stockInfo = [];

    stocks.forEach(function (stock) {

      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://investors-exchange-iex-trading.p.rapidapi.com/stock/" + stock + "/book",
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "investors-exchange-iex-trading.p.rapidapi.com",
          "x-rapidapi-key": "c0593c10a5mshb8e9442c232450cp1271e5jsnaee83b8acf7c"
        }
      }

      $.ajax(settings).done(function (response) {
        // console.log(response);

        // todo - this is where we will push data to the HTML or create elements with the new data
        // in lieu of pushing to array
        var stockData = response.quote;

        // todo - determine what additional details we want and add here
        // var stockSymbol = stockData.symbol;
        // var stockName = stockData.companyName;
        // var stockPrice = stockData.latestPrice;


        var stock = {
          symbol: stockData.symbol,
          name: stockData.companyName,
          price: stockData.latestPrice
        };
        stockInfo.push(stock);
      });
    });
  };

  // todo - getting weather data will be based on city name.  Other options include using the state, 
  // zip code or user location
  // This pulls the weather data based on user saved location
  function getCurrWeather(location) {

    // this checks if there is a location
    if (!location) {
      return;
    }

    var weatherApiKey = "bfd9c7ad0abc43cf8dad5c7ec01a1bad";
    var queryWeatherURL = "https://api.weatherbit.io/v2.0/current?city=" + location + "&units=I&key=" + weatherApiKey;

    $.ajax({
      url: queryWeatherURL,
      method: "GET"
    })
      .then(function (response) {
        var currWeatherData = response.data[0]
        console.log(currWeatherData);

        var wState = currWeatherData.state_code;
        var wCity = currWeatherData.city_name;
        var wTemp = currWeatherData.temp;
        var wIcon = currWeatherData.weather.icon;
        var wDesc = currWeatherData.weather.description;

        // this is where we will either dynamically create elements or feed the weather data to fields in the HTML

        var wImage = $("<img>");
        wImage.attr("src", "assets/images/weatherIcons/" + wIcon + ".png");
        wImage.attr("style", "height: 3%; width: 3%;");
        // this shows a description of the icon when you hover your mouse over the icon
        wImage.attr("title", wDesc);
        $("body").append(wImage);

      });
  };

  // todo - need to determine how often we want to update stock and other pulled data 
  // window.setInterval(getStockInfo, 60 * 1000);

  /* Inspirational Quote */

  var urlRandomQuote = "https://quote-garden.herokuapp.com/quotes/random";
  $.when($.get(urlRandomQuote)).then(randomQuote => {
    console.log("Quote: ", randomQuote.quoteText);
    console.log("Author: ", randomQuote.quoteAuthor || "Unknown");

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
  });

  // af add all below //
  function addTask() {
    $('#taskInput').keyup(function (e) {
      if (e.keyCode === 13) {
        $('#addTaskButton').click();
      }
    })
    $('#addTaskButton').click(function (e) {
      e.preventDefault();
      let taskInput = $('#taskInput').val().toLowerCase();

      if (!taskInput) {
        return;
      }

      buildTask(taskInput);
      addToLocalStorage(taskInput);

    })
  }

  function buildTask(word) {
    let newDiv = $('<div class="row valign-wrapper task">');
    let col1 = $('<div class="col center-align s2">');
    let icon = $(`<i class="material-icons check-icon">`);
    icon.text('panorama_fish_eye');

    col1.click(function (e) {
      e.preventDefault();
      icon.text('check_circle');
      // not working
      console.log($(this).attr('id'));
      // localStorage.removeItem(e.attr('id'));
      // setTimeout($(this).remove()), 2000);
    });

    let col2 = $('<div class="col s10">');
    let input = $(`<input class=right-align type=text>`);
    input.val(word);
    $('#taskInput').val('');
    col1.append(icon);
    col2.append(input);
    newDiv.append(col1, col2);
    $('#add-task-here').prepend(newDiv);
  }

  function addToLocalStorage(word) {
    localStorage.setItem(localStorage.length, word);
  }

  function fillSavedTask() {
    for (let i = 0; i < localStorage.length; i++) {
      let item = localStorage.getItem(i);
      buildTask(item);
      $(`#${i}`).val(item);
    }
  }

  function searchAmazon() {
    $('#search-amazon').keyup(function (e) {
      let searchItem = $('#search-amazon').val();
      if (e.keyCode === 13 && searchItem) {
        let url = `https://www.amazon.com/s?k=${searchItem}`
        window.open(url, '_blank');
        $('#search-amazon').val('');
      }
    })
  }

  function grabMoment() {
    let momentBox = $('<div class="card z-depth-0" id=momentBox>');
    let innerMomentBox = $('<div class=card-body id=innerMomentBox>');
    let time = $('<div class="card-title center-align" id=time>');
    time.text(moment().format('h:mm'));
    momentBox.append(innerMomentBox.append(time));
    $('#moment').append(momentBox);
  }
  // af add all above //







})

