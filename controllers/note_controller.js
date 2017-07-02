const Note = require('../models/Note');
const Listing = require('../models/Listing.js');

exports.saveNote = (_id, post, callback) => {
  const note = new Note(post);

  // And save the new note the db
  note.save((err, doc) => {
    // Log any errors
    if (err) return console.log(`Error saving note for ${_id}: ${err}`);
    // Use the article id to find and update it's note
    Listing.findOneAndUpdate({
        _id,
      }, {
        note: doc._id,
      })
      // Execute the above query
      .exec((err, doc) => {
        // Log any errors
        if (err) return console.log(`Error creating note for ${_id}: ${err}`);
        // return a success message
        return callback('success');
      });
  });
};

exports.deleteNote = (_id, callback) => {
  Listing.findOne({_id})
    .exec((err, doc) => {
      if (err) return console.log(`Error finding ${_id}: ${err}`);
      // console.log(doc);
      Note.findByIdAndRemove(doc.note)
        .exec((err, doc) => {
          if (err) return console.log(`Error deleting post ${_id}: ${err}`);
          return callback('success');
        });
    });
};
