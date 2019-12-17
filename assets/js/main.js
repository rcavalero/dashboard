let taskInput; let taskArr;

$(function () {
  // materialize init
  M.AutoInit();
  fillSavedTask();
  addTask();
  searchAmazon();
  grabMoment();
  $(".date").text(moment().format("ddd, MMM Do"));

  let main = $('#mainContainer');
  let admin = $('#prompt-container');
  admin.hide();

  // main.hide();

  function startUp() {
    main.hide();
    admin.show();
  }

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
        var self = this;
        setTimeout(function () {

          removeTask($(self));
        }, 750)
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
    let momentBox = $('<div class=" z-depth-0" id=momentBox>');
    let innerMomentBox = $("<div class=card-body id=innerMomentBox>");
    let time = $('<div class="card-title center-align" id=time style="background: none">');
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
    if (ind > -1) {
      temp.splice(ind, 1);
      localStorage.setItem('taskData', JSON.stringify(temp));
    }
  }

  function addToLocalStorage(word) {
    taskArr = JSON.parse(localStorage.getItem('taskData')) || [];
    taskArr.push(word);
    localStorage.setItem('taskData', JSON.stringify(taskArr));
  }

  function fillSavedTask() {
    let tempArr = [];
    tempArr = JSON.parse(localStorage.getItem("taskData"));
    // console.log(tempArr);

    if (tempArr) {
      tempArr.forEach(element => {
        console.log(element);
        buildTask(element);
      });
    } else {
      return;
    }



  };

  // this is a global variable for tracking user data
  var userData = [];

  // these are the categories for the NY Times articles
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

  const sectionsGuardian = [
    "sports", "cooking"
  ];



// this is the function that fills the news category checkbox on the user screen.
  function fillNewsCat(source){
    var newsCat = $("#userNewsCat"); 
    newsCat.empty();
   

    let newsCategories = [];
    if (source === "NY Times") {
      newsCategories = sectionsNYT;
    }
    else if (source = "Guardian") {
      newsCategories = sectionsGuardian;
    };


    newsCategories.forEach(function(category) {
      newsCat.append($("<option>").attr("value",category).text(category));

    })
    $("#userNewsCat").formSelect()
  };


  // this will run when the app opens to see if data exists in local storage
  // if there is no data in local storage, the user is directed to the Setup page
  if (!localStorage.getItem("myDashUserData")) {

    startUp();
  }
  // if there is data in local storage it feeds to the userData global variable and fills in the user input form
  else {
    getUserData();
    $("#userName").val(userData[0].name),

    $("#userCity").val(userData[0].weatherCity),
    $("#userStocks").val(userData[0].stocks.join()),
    $("#userNewsSource").val(userData[0].newsSource),
    $("#userNewsSource").formSelect();
    fillNewsCat($("#userNewsSource").val());
    $("#userNewsCat").val(userData[0].newsCat);
    $("#userNewsCat").formSelect();

  };

  // this runs the function that updates local storage from user input screen
  $("#userSaveBtn").on("click", function (event) {
    event.preventDefault();
    console.log('clicked');
    main.show();
    admin.hide();
    updateUserData();
  });


  $("#userNewsSource").change(function(event){
    console.log("changed news source");
    
    $("#userNewsSource").formSelect();
    $("#news").empty();
    $("#userNewsCat").empty()

    // $(this).find(':selected').attr('selected', 'selected') ;
    fillNewsCat($("#userNewsSource").val());
  });


  // $("#userNewsCat").change(function(event){
  //   console.log(this);
  //   console.log("changed userNewsCat");
  //   $("#news").empty();
  //   getNewsArticles($("#userNewsSource").val(),$("#userNewsCat").val());
  // });


  // this will save user data in local storage from the setup page when the save button is clicked
  function updateUserData() {
    userData = [];

    // this grabs data from the user setup screen and feeds it to local storage
    var data = {
      name: $("#userName").val(),
      weatherCity: $("#userCity").val(),
      stocks: $("#userStocks").val().split(","),
      newsSource: $("#userNewsSource").val(),
      newsCat: $("#userNewsCat").val()
    };
    // this loads user setup data into the userData global variable and stores it to local storage
    userData.push(data);
    localStorage.setItem("myDashUserData", JSON.stringify(userData));

    // this pulls the stock & weather info after the user screen has been updated
    getStockInfo(userData[0].stocks);
    getCurrWeather(userData[0].weatherCity);
    getNewsArticles(userData[0].newsSource, userData[0].newsCat);
  }


  // this loads existing user data into the userData global variable and pulls the stock, weather & news
  function getUserData() {
    var storedUserData = JSON.parse(localStorage.getItem("myDashUserData") || "[]");
    userData = storedUserData;
    getStockInfo(userData[0].stocks);
    getCurrWeather(userData[0].weatherCity);
    getNewsArticles(userData[0].newsSource, userData[0].newsCat);
  }

  // *** this pulls stock data based on the user selected symbols that are stored in local storage ***
  function getStockInfo(stocks) {
    // this checks if there are stocks to pull data on and returns if not

    if (!stocks) {
      return;
    }

    // this empties the stock info so the new info can be loaded.
    $("#stocks").empty();

    // this creates the rows and columns for the stock info
    var stockTable = $("#stocks");
    var stockInfo = $("<div class='row center-align'>");

    var stockSymbolCol = $("<div class=col>");
    // todo - need to left align the txt in these columns.  Should we change the change box to red/green?
    var stockPriceCol = $("<div class='col right-align'>");
    var stockChangeCol = $("<div class='col right-align'>");

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

        var stockData = response.quote;

        var stockSymbol = stockData.symbol;
        var stockPrice = stockData.latestPrice;
        stockChange = stockData.latestPrice - stockData.previousClose;

        var stockSymbolEl = $("</p>").text(stockSymbol);
        var stockPriceEl = $("</p>").text(stockPrice.toFixed(2));
        var stockChangeEl = $("</p>").text(stockChange.toFixed(2));

        if(stockChange < 0) {
          stockChangeEl.css('color', 'red');
        }
        if(stockChange > 0) {
          stockChangeEl.css('color', 'green');
        }

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
    // console.log("getting weather");

    // this checks if there is a location
    if (!location) {
      return;
    }

    const weatherApiKey = "bfd9c7ad0abc43cf8dad5c7ec01a1bad";
    var queryWeatherURL = "https://api.weatherbit.io/v2.0/current?city=" + location + "&units=I&key=" + weatherApiKey;

    $.ajax({
      url: queryWeatherURL,
      method: "GET"
    }).then(function (response) {
      // console.log("weather data");

      // console.log(response);

      var currWeatherData = response.data[0];
      // console.log(currWeatherData);
      // var wState = currWeatherData.state_code;
      var wCity = currWeatherData.city_name;
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

      // this creates the header box with city and state
      $("#weather-box").append("<div class=row>").append("<div class=col>").append("<p>").text(wCity);

      // // this creates the 2nd row with icon and temp
      $("#weather-box").append("<div class=row id=wRow2>").append("<div class=col s4>").append(wImage)
      // .append(temp);
// console.log(temp);

       $("#wRow2").append("<div class=col s4>").append(temp);
    });
  }

  /* Inspirational Quote */

  var urlRandomQuote = "https://quote-garden.herokuapp.com/quotes/random";
  $.when($.get(urlRandomQuote)).then(randomQuote => {
    const quote = $("<q>").text(randomQuote.quoteText);
    const author = $("<cite>").text(" -" + (randomQuote.quoteAuthor || "Unknown"));
    $("#quote-div").append(quote, author);
  });

  /* News Feeds */

  const TOP = 3; // User chooses to see the top n articles from each feed.

  // #region MY Times

  function getNewsArticles(source, category) {
    if (source === "Guardian")
      return;

    const apiKeyNYTimes = "RW27VlJmKlJGUazGiUKrvhygb5icwzCZ";

    console.log("News sections in NY Times: ", sectionsNYT);

    // var sectionNYT = sectionsNYT[10]; // User will select the section of interest
    // var urlNYTimes = `https://api.nytimes.com/svc/topstories/v2/${sectionNYT}.json?api-key=${apiKeyNYTimes}`;
    var urlNYTimes = `https://api.nytimes.com/svc/topstories/v2/` + category + `.json?api-key=${apiKeyNYTimes}`;
    const articlesNYT = [];
    $.when($.get(urlNYTimes)).then(processNYTArticles);

    function processNYTArticles(response) {
      const newsContainer = $("#news");
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
  }

  // these are the timers that refresh the weather & stock data
  // weather = 1 hour; stocks = 15 minutes
  // window.setInterval(getCurrWeather, 60 * 60 * 1000);
  // window.setInterval(getStockInfo, 15 * 60 * 1000);

  // this is the end of the file.  All code should be input before this line.
});
