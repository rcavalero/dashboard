let taskInput;
$(function () {

  // materialize init
  M.AutoInit();
  fillSavedTask();
  addTask();
  searchAmazon();
  grabMoment();
  $('.date').text(moment().format('ddd, MMM Do'));


  // $('#mainContainer').hide();


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
      // setTimeout($(this.remove()), 2000);
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

















})
