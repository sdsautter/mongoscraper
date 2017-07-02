// Grab the articles as a json

$(document).ready(function () {
    if(window.location.href.indexOf("saved") < 0) {
      getListings(function (data) {});
    }
})

// getListings(function (data) {});


function getListings(cb) {
  $.getJSON("/listings", function (data) {
    // For each one
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        {console.log(data[i].link)}
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
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>');
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
        {console.log(data[i].link)}
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
              '</form>'+
            '</div>'+
          '</div>'+
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

$(".save-button").on("click", function (event) {
  // event.preventDefault();
//  window.location.href = '/'
})

$(".unsave-button").on("click", function (event) {
  // event.preventDefault();
 window.location.href = '/saved'
})

// Whenever someone clicks a p tag
// $(document).on("click", "p", function () {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//       method: "GET",
//       url: "/listings/" + thisId
//     })
//     // With that done, add the note information to the page
//     .done(function (data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .done(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
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