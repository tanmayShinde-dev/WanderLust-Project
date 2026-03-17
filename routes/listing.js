const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware");
const ListingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
// const upload = multer({ dest: 'uploads/' });



router.route("/")
.get( wrapAsync(ListingController.index))
.post( isLoggedIn,  upload.single("listing[image]"), validateListing, wrapAsync(ListingController.createListing));

//New RouteRoute
router.get("/new", isLoggedIn, ListingController.renderNewForm );

router.get("/search", async (req, res) => {
  const { location } = req.query;

  const listings = await Listing.find({
    $or: [
      { location: { $regex: location, $options: "i" } },
      { country: { $regex: location, $options: "i" } },
      { title: { $regex: location, $options: "i" } }
    ]
  });

  if (listings.length === 0) {
    req.flash("error", "No listings found for this location");
    return res.redirect("/listings");
  }

  res.render("listings/index", { allListings: listings });
});

router.route("/:id")
.get( wrapAsync(ListingController.showListing))
.put( isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,
   wrapAsync(ListingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));




// //Index Route
// router.get("/", wrapAsync(ListingController.index));;

// //New RouteRoute
// router.get("/new", isLoggedIn, ListingController.renderNewForm );

// //Show Route
// router.get("/:id", wrapAsync(ListingController.showListing));;

// //Create Route
// router.post("/",validateListing, isLoggedIn, wrapAsync(ListingController.createListing));;

// //Edit Route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

// //Update Route
// router.put("/:id",
//   validateListing, isLoggedIn, isOwner,
//    wrapAsync(ListingController.updateListing));;

// //Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing));;

module.exports = router;