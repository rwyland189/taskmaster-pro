var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Edit a task's description
// Find the task text with this 
$(".list-group").on("click", "p", function() {
  // and convert to jquery method
  var text = $(this)
    .text()
    .trim();

  // create a new text area to edit the description
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);

  // swap out the elements
  $(this).replaceWith(textInput);
  
  // automatically focus on the new element when on click
  textInput.trigger("focus");
});

// When the user clicks outside the task text area
$(".list-group").on("blur", "textarea", function() {
  // get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  // get the parent's ul's id attribute b/c we want to make sure we are editing the right task
  var status = $(this)
    .closest(".list-group")
    // this attr (1 of 2 purposes) returns the id number. one argument gets an attribute
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // we don't know the values of the edited task yet so just use placeholders
  tasks[status][index].text = text;
  // save edited task to localStorage
  saveTasks();

  // recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  // replace text area with p element
  $(this).replaceWith(taskP);
});

// Due date was clicked - find the element that codes the due date
$(".list-group").on("click", "span", function() {
  // and conver to jquery
  var date = $(this)
    .text()
    .trim();

  // create new input element
  var dateInput = $("<input>")
    // 2nd of two purposes of attr is to set an attribute, like here. two arguments sets an attribute
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});

// When the user clicks outside the due date text area
$(".list-group").on("blur", "input[type='text']", function() {
  // get current text by converting to jquery method
  var date = $(this)
    .val()
    .trim();

  // get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
    .closest(".list-group-item")
    .index();

  // update task in array and re-save to localStorage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);
});
  



// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


