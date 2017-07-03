// Grab the articles as a json

$(document).ready(function () {
  if (window.location.href.indexOf("saved") < 0) {
    getListings(function (data) {});
  }
})

// getListings(function (data) {});


function getListings(cb) {
  $.getJSON("/listings", function (data) {
    // For each one
    var numberSaved = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].saved) {numberSaved++}
    }

    if (data.length > numberSaved) {
      for (var i = 0; i < data.length; i++) {
        {
          console.log(data[i].link)
        }
        // Display the apropos information on the page
        if (!data[i].saved) {
          $("#listings").append('<div class="col s6 m3">' +
          '<div class="card blue-grey darken-1">' +
          '<div class="card-content white-text">' +
          '<span class="card-title">' + data[i].date + '</span>' +
          '<p>' + data[i].title + '</p>' +
          '<hr><p>' + data[i].price + data[i].location + '</p>' +
          '</div>' +
          '<div class="card-action">' +
          '<a href="' + data[i].link + '">Link</a>' +
          '<form method="POST" action="/saved/' + data[i]._id + '?_method=PUT">' +
          '<button class="btn waves-effect waves-light save-button" type="submit">Save' +
          '<i class="material-icons right">polymer</i>' +
          '</button>' +
          '</form>' +
          '</div>' +
          '</div>' +
          '</div>');
        } else {
          $("#listings").append('<div class="col s6 m3">' +
          '<div class="card blue-grey darken-1">' +
          '<div class="card-content white-text">' +
          '<span class="card-title">' + data[i].date + '</span>' +
          '<p>' + data[i].title + '</p>' +
          '<hr><p>' + data[i].price + data[i].location + '</p>' +
          '</div>' +
          '<div class="card-action">' +
          '<a href="' + data[i].link + '">Link</a>' +
          '</button>' +
          '</form>' +
          '</div>' +
          '</div>' +
          '</div>');
        }
      }

      console.log(data);
      return cb(data);

    } else {
      getListings(cb)
      
    }
  });
}

function getSaved(cb) {
  $.getJSON("/saved", function (data) {
    // For each one
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        {
          console.log(data[i].link)
        }
        // Display the apropos information on the page
        $("#listings").append('<div class="col s6 m3">' +
          '<div class="card blue-grey darken-1">' +
          '<div class="card-content white-text">' +
          '<span class="card-title">' + data[i].date + '</span>' +
          '<p>' + data[i].title + '</p>' +
          '<hr><p>' + data[i].price + data[i].location + '</p>' +
          '</div>' +
          '<div class="card-action">' +
          '<a href="' + data[i].link + '">Link</a>' +
          '<form method="POST" action="/saved/' + data[i]._id + '?_method=PUT">' +
          '<button class="btn waves-effect waves-light save-button" type="submit">Save' +
          '<i class="material-icons right">polymer</i>' +
          '</button>' +
          '</form>' +
          '</div>' +
          '</div>' +
          '</div>');
      }

      console.log(data);
      return cb(data);

    } else {
      getSaved(cb)
    }
  });
}

$("#scrapeButton").on("click", function (event) {
  event.preventDefault();
  $.get("/scrape");
  window.location.href = '/'
})

$("#deleteButton").on("click", function (event) {
  event.preventDefault();
  $.ajax({
    url: '/delete_unsaved',
    type: 'DELETE',
    success: function (result) {
      // Do something with the result
  window.location.href = '/'
      
    }
  });
  // window.location.href = '/'
})

$(".save-button").on("click", function (event) {
  // event.preventDefault();
  //  window.location.href = '/'
})

$(".unsave-button").on("click", function (event) {
  // event.preventDefault();
  window.location.href = '/saved'
})

// When you click the savenote button
$(document).on("click", ".savenote", function () {
  // Grab the id associated with the article from the submit button
  // event.preventDefault();

  console.log($(this));
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  var titleInput = "#titleinput" + thisId
  var bodyInput = "#bodyinput" + thisId

  console.log($("#titleinput").val());

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $(titleInput).val(),
        // Value taken from note textarea
        body: $(bodyInput).val()
      }
    })
    // With that done
    .done(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
    });

  // Also, remove the values entered in the input and textarea for note entry
})

$(document).on("click", ".modal-note", function () {
  var modalNumber = $(this)[0].hash;
  var thisId = modalNumber.replace("#", "");
  var noteAppendId = modalNumber + "Notes";
  $(modalNumber).modal('open');
  // $(modalNumber).modal('close');

  $.getJSON("/articles/" + thisId, function (data) {
    console.log(data.note);
    $(noteAppendId).html("<h5>" + data.note.title + "</h5><p>" + data.note.body + "</p>")
  });
  // $.ajax({
  //   method: "GET",
  //   url: "/articles/" + thisId,
  //   data: {
  //     // Value taken from title input
  //     title: $("#titleinput").val(),
  //     // Value taken from note textarea
  //     body: $("#bodyinput").val()
  //   }
  // })
  // // With that done
  // .done(function (data) {
  //   // Log the response
  //   console.log(data);
  //   // Empty the notes section
  //   $("#notes").empty();
  // });
});