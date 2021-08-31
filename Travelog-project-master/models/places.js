var mongoose = require("mongoose");

var placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    date: String,
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Place", placeSchema);
// var mongoose = require("mongoose");

// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String,
//     comments: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Comment"
//     }]
// });

// module.exports = mongoose.model("Campground", campgroundSchema);