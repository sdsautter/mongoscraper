var Listing = require("../models/Listing.js");
var request = require("request");
var cheerio = require("cheerio");


exports.findAll = (res, callback) => {
    Listing.find({}, function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            return res.json(doc);
        }
    });
}

exports.deleteUnsaved = (callback) => {
    Listing.deleteMany({
        "saved": false
    });
}

exports.findOne = (id, res, callback) => {
    Listing.findOne({
            "_id": id
        })
        // ..and populate all of the notes associated with it
        .populate("note")
        // now, execute our query
        .exec(function (error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
}

exports.scrape = (callback) => {
    request("https://raleigh.craigslist.org/search/sss?sort=rel&query=pinball", function (error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // Now, we grab every h2 within an article tag, and do the following:
        $(".result-info").each(function (i, element) {

            if ($(this).find(".result-price").text() !== "") {
                // Save an empty result object
                var result = {};


                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).find(".result-title").text();
                result.price = $(this).find(".result-price").text();
                result.link = $(this).children("a").attr("href");
                result.date = $(this).find(".result-date").text();
                result.location = $(this).find(".result-hood").text();

                if (result.link.indexOf("http") < 0) {
                    result.link = "https://raleigh.craigslist.org" + result.link;
                }
                // Using our Article model, create a new entry
                // This effectively passes the result object to the entry (and the title and link)
                var entry = new Listing(result);

                // Now, save that entry to the db
                entry.save(function (err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
                });
            }
        });
    });
}

exports.findSaved = (res, callback) => {
    // Grab every doc in the Articles array
    Listing.find({
        "saved": true
    }, function (error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
            var listings = {
                listings: doc
            }
            res.render("index", listings);
        }
    });
}

exports.save = (id, callback) => {
    Listing.findOneAndUpdate({
            "_id": id
        }, {
            "saved": true
        })
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            console.log("hello")
        });
}

exports.unsave = (id, callback) => {
    Listing.findOneAndUpdate({
            "_id": id
        }, {
            "saved": false
        })
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            console.log("goodbye")
        });
}

exports.findNote = (noteId, callback) => {
    Listing.findOne({"note": noteId}, function (error, doc) {

    })
}