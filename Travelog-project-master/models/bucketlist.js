var mongoose = require("mongoose");

var bucketSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("Bucket", bucketSchema);