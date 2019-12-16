let taskInput; let taskArr;

$(function () {
  // materialize init
  M.AutoInit();
  fillSavedTask();
  addTask();
  searchAmazon();
  grabMoment();
  $(".date").text(moment().format("ddd, MMM Do"));

  function addTask() {
    $("#taskInput").keyup(function (e) {
      if (e.keyCode === 13) {
        $("#addTaskButton").click();
      }
    });
    $("#addTaskButton").click(function (e) {
      e.preventDefault();
      let taskInput = $("#taskInput").val().toLowerCase();

      if (!taskInput) {
        return;
      }
      addToLocalStorage(taskInput);
      buildTask(taskInput);
    });
  }

  // moved from below
  function buildTask(word) {
    let newDiv = $('<div class="row valign-wrapper task">');
    let col1 = $('<div class="col center-align s2">');
    let icon = $(`<i class="material-icons check-icon">`);
    icon.text("panorama_fish_eye");

    col1.click(function (e) {
      e.preventDefault();
      icon.text("check_circle");
      if (icon.text() === 'check_circle') {
        // let help;
        // help = $(this).siblings().children().val();
        // console.log(help);
        // console.log(taskArr);
        removeTask($(this));
        removeFromLocal($(this));

      }
    });

    let col2 = $('<div class="col s10">');
    let input = $(`<input class=right-align type=text id=taskInput>`);
    input.val(word);
    $("#taskInput").val("");
    col1.append(icon);
    col2.append(input);
    newDiv.append(col1, col2);
    $("#add-task-here").prepend(newDiv);
  }

  function searchAmazon() {
    $("#search-amazon").keyup(function (e) {
      let searchItem = $("#search-amazon").val();
      if (e.keyCode === 13 && searchItem) {
        let url = `https://www.amazon.com/s?k=${searchItem}`;
        window.open(url, "_blank");
        $("#search-amazon").val("");
      }
    });
  }

  function grabMoment() {
    let momentBox = $('<div class="card z-depth-0" id=momentBox>');
    let innerMomentBox = $("<div class=card-body id=innerMomentBox>");
    let time = $('<div class="card-title center-align" id=time>');
    setInterval(() => {
      time.text(moment().format("h:mm"));
    }, 1000);
    momentBox.append(innerMomentBox.append(time));
    $("#moment").append(momentBox);
  }

  function removeTask(haha) {
    haha.parent().remove();
  }

  function removeFromLocal(haha) {
    let word = $(haha).siblings().children().val();
    let temp = JSON.parse(localStorage.getItem('taskData')) || [];

    let ind = temp.indexOf(word);
    if(ind > -1) {
      temp.splice(ind, 1);
      localStorage.setItem('taskData', JSON.stringify(temp));
    }
    console.log(ind);

  }

  function addToLocalStorage(word) {
    taskArr = JSON.parse(localStorage.getItem('taskData')) || [];
    taskArr.push(word);
    localStorage.setItem('taskData', JSON.stringify(taskArr));
  }

  function fillSavedTask() {
    let tempArr = [];
    tempArr = JSON.parse(localStorage.getItem('taskData'));
    console.log(tempArr);

    if (tempArr) {
      tempArr.forEach(element => {
        console.log(element);
        buildTask(element);
      })
    } else {
      return;
    }



  }

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
  else getUserData();

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
      weatherCity: "",
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
  }

  // this loads existing user data into the userData global variable and pulls the stock & weather info
  function getUserData() {
    var storedUserData = JSON.parse(localStorage.getItem("myDashUserData") || "[]");
    userData = storedUserData;
    getStockInfo(userData[0].stocks);
    getCurrWeather(userData[0].weatherCity);

    // todo - add the other functions for pulling quotes and news
  }

  // *** this pulls stock data based on the user selected symbols that are stored in local storage ***
  function getStockInfo(stocks) {
    // this checks if there are stocks to pull data on and returns if not
    if (!stocks) {
      return;
    }

    // this empties the stock info so the new info can be loaded.
    $("#stocks").html();

    // this creates the rows and columns for the stock info
    var stockTable = $("#stocks");
    var stockInfo = $("<div class=row>");

    var stockSymbolCol = $("<div class=col>");
    // todo - need to left align the txt in these columns.  Should we change the change box to red/green?
    var stockPriceCol = $("<div class=col right-align>");
    var stockChangeCol = $("<div class=col right-align>");

    stockTable.append(stockInfo);
    stockInfo.append(stockSymbolCol, stockPriceCol, stockChangeCol);

    // This loops through each stock symbol and adds the info to the above columns for each stock
    stocks.forEach(function (stock) {
      var settings = {
        async: true,
        crossDomain: true,
        url: "https://investors-exchange-iex-trading.p.rapidapi.com/stock/" + stock + "/book",
        method: "GET",
        headers: {
          "x-rapidapi-host": "investors-exchange-iex-trading.p.rapidapi.com",
          "x-rapidapi-key": "c0593c10a5mshb8e9442c232450cp1271e5jsnaee83b8acf7c"
        }
      };

      $.ajax(settings).done(function (response) {
        // console.log(response);

        var stockData = response.quote;

        var stockSymbol = stockData.symbol;
        var stockPrice = stockData.latestPrice;
        var stockChange = stockData.change;
        if (stockData.change === null) {
          stockChange = 0.0;
        }

        var stockSymbolEl = $("</p>").text(stockSymbol);
        var stockPriceEl = $("</p>").text(stockPrice);
        var stockChangeEl = $("</p>").text(stockChange);

        stockSymbolCol.append(stockSymbolEl);
        stockPriceCol.append(stockPriceEl);
        stockChangeCol.append(stockChangeEl);
      });
    });
  }

  // todo - getting weather data will be based on city name.  Other options include using the state,
  // zip code or user location
  // This pulls the weather data based on user saved location
  function getCurrWeather(location) {
    console.log("getting weather");

    // this checks if there is a location
    if (!location) {
      return;
    }

    var weatherApiKey = "bfd9c7ad0abc43cf8dad5c7ec01a1bad";
    var queryWeatherURL = "https://api.weatherbit.io/v2.0/current?city=" + location + "&units=I&key=" + weatherApiKey;

    $.ajax({
      url: queryWeatherURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      var currWeatherData = response.data[0];
      // // console.log(currWeatherData);
      // var wState = currWeatherData.state_code;
      // var wCity = currWeatherData.city_name;
      var wTemp = currWeatherData.temp;
      var wIcon = currWeatherData.weather.icon;
      var wDesc = currWeatherData.weather.description;

      // this is where we will either dynamically create elements or feed the weather data to fields in the HTML

      var wImage = $("<img>");
      var temp = $("<p>");
      wImage.attr("src", "assets/images/weatherIcons/" + wIcon + ".png");
      wImage.attr("style", "height: 25%; width: 25%;");
      temp.text(wTemp + " (F)");
      temp.attr("style", "color: white;");
      // this shows a description of the icon when you hover your mouse over the icon
      wImage.attr("title", wDesc);
      $("#weather-box")
        .append(wImage)
        .append(temp);
    });
  }

  // todo - need to determine how often we want to update stock and other pulled data
  // window.setInterval(getStockInfo, 60 * 1000);

  /* Inspirational Quote */

  var urlRandomQuote = "https://quote-garden.herokuapp.com/quotes/random";
  $.when($.get(urlRandomQuote)).then(randomQuote => {
    const quote = $("<q>").text(randomQuote.quoteText);
    const author = $("<cite>").text(" -" + (randomQuote.quoteAuthor || "Unknown"));
    $("#quote-div").append(quote, author);
  });

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
    const newsContainer = $("#news-container");
    console.log("NYT Articles");
    for (let i = 0; i < TOP; i++) {
      const result = response.results[i];
      const a = $("<a>");
      a.attr("target", "_blank");
      a.attr("href", result.url);
      a.text(result.title);
      newsContainer.append(a);
      newsContainer.append($("<hr>"));
      // articlesNYT.push({ title: result.title, link: result.url });
    }
  }
});
