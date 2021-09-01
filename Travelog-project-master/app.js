var express = require("express"),
    app = express(),
    expressFlash = require('express-flash'),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Place = require("./models/places"),
    Bucket = require("./models/bucketlist"),
    passportLocalMongoose = require("passport-local-mongoose");
app.set("view engine", "ejs");
app.use(expressFlash());
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/publicstyles"));
mongoose.connect('mongodb+srv://Santhosh:santy_134@cluster0-rvthp.mongodb.net/sample?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "Passwords are the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;

    next();

});
app.get("/", function(req, res) {
    // req.flash("error", 'ERROR');
    // res.render("home", { error: req.slash('error') });
    res.render("home")

});
app.post("/register", function(req, res) {
    // res.send("Signing up");
    // var newUser = new User({ username: req.body.name });
    // User.register(newUser, req.body.password, function(err, user) {
    //     if (err) {
    //         console.log(err);
    //         return res.render("register");
    //     }
    //     passport.authenticate("local")(req, res, function() {
    //         res.redirect("/campgrounds");
    //     });
    // });
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "You created a new User Account " + user.username);
            res.redirect("/places");

        });
    });
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/",
    failureFlash: 'Incorrect username or password.'
}), function(req, res) {

});
// Place.create({
//     name: "Anna Djokovic",
//     image: "https://images.unsplash.com/photo-1528433556524-74e7e3bfa599?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
//         // description: "This is the most popular camground where you will feel alive."
// }, function(err, place) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("NEW PLACE");
//         console.log(place);
//     }
// });
app.get("/places", isLoggedIn, function(req, res) {
    // var places = [{ name: "SALM", image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg" }, { name: "kisa", image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg" }];
    // req.user
    Place.find({ user: req.user._id }, function(err, places) {
        if (err) {
            console.log(err);
        } else {
            res.render("places/index", { places: places, currentUser: req.user });
        }
    });
    // Bucket.find({}, function(err, allBucketlists) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render("places/index", { bucketlists: allBucketlists });
    //     }
    // });


});
app.get("/places/bucket", isLoggedIn, function(req, res) {
    Bucket.find({ user: req.user._id }, function(err, buckets) {
        if (err) {
            console.log(err);
        } else {
            res.render("places/index2", { buckets: buckets });
        }
    });
    // res.send("BUCKET");
});
app.post("/places", function(req, res) {
    //get data from form and add to cg array

    // console.log(req.body.visited);
    var value = false;
    var value1 = Boolean(req.body.visited);
    var value2 = Boolean(req.body.bucket);
    console.log(value1);
    console.log(value2);
    //console.log("VISITED");
    if (value1 == true) {
        var name = req.body.name;
        var image = req.body.image;
        var date = req.body.date;
        var desc = req.body.description;
        console.log("VISITED");
        var newPlaces = {
            name: name,
            image: image,
            date: date,
            description: desc,
            user: req.user._id
        };
        // , description: desc }
        Place.create(newPlaces, function(err, newlycreated) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/places");
            }
        });



    } else {
        var name = req.body.name;
        var image = req.body.image;
        // var date = req.body.date;
        var desc = req.body.description;
        console.log("BUCKET");
        var newbucketlists = { name: name, image: image, description: desc, user: req.user._id };
        // , description: desc }
        Bucket.create(newbucketlists, function(err, newlycreated) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/places/bucket");
            }
        });
    }


});


// app.post("/places/bucket", function(req, res) {
//     var value1 = Boolean(req.body.visited);
//     var value2 = Boolean(req.body.bucket);
//     console.log(value1);
//     console.log(value2);
//     console.log("BUCKETLIST");
//     // console.log(req.body.visited);
//     if (value2 == true) {
//         var name = req.body.name;
//         var image = req.body.image;
//         var desc = req.body.description;
//         var newbucketlists = { name: name, image: image, description: desc };
//         // , description: desc }
//         Bucket.create(newbucketlists, function(err, newlycreated) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.redirect("/places/bucket");
//             }
//         });



//     }
// });
app.get("/places/new", function(req, res) {
    res.render("places/new");
});
app.get("/places/:id", function(req, res) {
    var ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (ok) {
        Place.findById(req.params.id, function(err, place) {
            if (err) {
                console.log(err);
            } else {
                console.log(place);
                res.render("show", { place: place });
            }
        });
    }
});
app.get("/places/:id/edit", function(req, res) {
    var ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (ok) {
        Place.findById(req.params.id, function(err, place) {
            if (err) {
                console.log(err);
            } else {
                res.render("edit", { place: place });
            }
        });
    }
    // res.render("edit");
});
app.put("/places/:id", function(req, res) {
    // console.log(req.body);
    var update = req.body;
    var id = req.params.id;
    var ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (ok) {
        Place.findByIdAndUpdate(id, update, function(err, place) {
            if (err) {
                // res.redirect("/places");
                console.log(err);
            } else {
                console.log("UPDATED PLACE: " + place);
                res.redirect("/places/" + req.params.id);
            }
            console.log("UPDATED PLACE: " + place);
        });
    }
});
app.delete("/places/:id", function(req, res) {
    // res.send("DELETE");
    var ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (ok) {
        Place.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                console.log(err);
                res.redirect("/places");
            } else {
                res.redirect("/places");
            }
        });
    }
});
app.get("/places/bucket/:id", function(req, res) {
    var ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (ok) {
        Bucket.findById(req.params.id, function(err, bucket) {
            if (err) {
                console.log(err);
            } else {
                console.log(bucket);
                res.render("show2", { bucket: bucket });
            }
        });
    }
});

app.get("/places/bucket/:id/edit2", function(req, res) {
    var ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (ok) {
        Bucket.findById(req.params.id, function(err, bucket) {
            if (err) {
                console.log(err);
            } else {
                res.render("edit2", { bucket: bucket });
            }
        });
    }
    // res.send("edit");
});

app.put("/places/bucket/:id", function(req, res) {
    // console.log(req.body);
    var update = req.body;
    var id = req.params.id;
    var ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (ok) {
        Bucket.findByIdAndUpdate(id, update, function(err, bucket) {
            if (err) {
                // res.redirect("/places");
                // res.redirect("/places");
                console.log(err);
            } else {
                console.log("UPDATED PLACE: " + bucket);
                res.redirect("/places");
            }
            console.log("UPDATED PLACE: " + bucket);
        });
    }
});
app.delete("/places/bucket/:id", function(req, res) {
    // res.send("DELETE");
    var ok = mongoose.Types.ObjectId.isValid(req.params.id);
    if (ok) {
        Bucket.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                console.log(err);
                res.redirect("/places/bucket");
            } else {
                res.redirect("/places/bucket");
            }
        });
    }
});
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}
app.listen(process.env.PORT, function() {
    console.log("SERVER!!");
})
