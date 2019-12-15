let taskInput;
$(function () {

  // materialize init
  M.AutoInit();

  addTask();

  function addTask() {
    $('#addTaskButton').click(function (e) {
      e.preventDefault();
      let taskInput = $('#taskInput').val();
      addToLocalStorage(taskInput);
      if (!taskInput) {
        console.log('whoops');
        return;
      }

      let newDiv = $('<div class="row valign-wrapper task">');
      let col1 = $('<div class="col center-align s2">');
      let icon = $('<i class=material-icons>');
      icon.text('panorama_fish_eye');

      col1.click(function (e) {
        e.preventDefault();
        icon.text('check_circle');
        // not working
        // setTimeout(removeTask(newDiv), 5000);
      });

      let col2 = $('<div class="col s10">');
      let input = $('<input class=center-align type=text>');
      input.val(taskInput);
      $('#taskInput').val('');
      col1.append(icon);
      col2.append(input);
      newDiv.append(col1, col2);
      $('#add-task-here').prepend(newDiv);
    })
  }

  function addToLocalStorage(word) {
    localStorage.setItem(localStorage.length, word);
  }

















})
