// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Listing = require("../models/Listing.js");
var listingController = require("../controllers/listings_controller.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");


var express = require("express");
var router = express.Router();


module.exports = function (app) {

    // A GET request to scrape the echojs website
    app.get("/scrape", function (req, res) {
        // listingController.deleteUnsaved(function (data) {
        listingController.scrape(function (data) {
            return callback(data);
        })
        // })

        // Tell the browser that we finished scraping the text
        res.send("Scrape Complete");
    });

    // This will get the articles we scraped from the mongoDB
    app.get("/listings", function (req, res) {
        // Grab every doc in the Articles array
        listingController.findAll(res, function (data) {
            return callback(data);
        });
    });

    // Grab an article by it's ObjectId
    app.get("/listings/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        listingController.findOne(req.params.id, function (data) {
            return callback(data);
        })
    });


    // Create a new note or replace an existing note
    app.post("/listings/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        var newNote = new Note(req.body);

        // And save the new note the db
        newNote.save(function (error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise
            else {
                // Use the article id to find and update it's note
                Listing.findOneAndUpdate({
                        "_id": req.params.id
                    }, {
                        "note": doc._id
                    })
                    // Execute the above query
                    .exec(function (err, doc) {
                        // Log any errors
                        if (err) {
                            console.log(err);
                        } else {
                            // Or send the document to the browser
                            res.send(doc);
                        }
                    });
            }
        });
    });

    app.get("/saved", function (req, res) {
        listingController.findSaved(res, function (data) {})
    });

    app.put("/saved/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        // And save the new note the db
        listingController.save(req.params.id, function (data) {})
    });
    
    app.put("/unsave/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        // And save the new note the db
        listingController.unsave(req.params.id, function (data) {})
    });
};