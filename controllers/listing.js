const Listing = require("../models/listing.js");





module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
   let { id } = req.params;
   const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
   if(!listing) {
     req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
   };
   console.log(listing);
   res.render("listings/show.ejs", { listing , 
  mapToken: process.env.MAPTILER_KEY});
 }


  module.exports.createListing = async (req, res, next) => {
    console.log("MAPTILER KEY FROM BACKEND:", process.env.MAPTILER_KEY);
    try {
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        // 🔹 Call MapTiler Geocoding API
        const geoRes = await fetch(
            `https://api.maptiler.com/geocoding/${encodeURIComponent(req.body.listing.location)}.json?key=${process.env.MAPTILER_KEY}`
        );

        const data = await geoRes.json();

        console.log("Geocoding API response received");

        // 🔹 If valid location found
        if (data.features && data.features.length > 0) {
            const firstResult = data.features[0];

            console.log("Using real coordinates:", firstResult.geometry.coordinates);

            newListing.geometry = {
                type: "Point",
                coordinates: firstResult.geometry.coordinates
            };

            // Optional: save clean place name from API
            newListing.location = firstResult.place_name;

        } else {
            console.log("Invalid location — using fallback (New Delhi)");

            newListing.geometry = {
                type: "Point",
                coordinates: [77.2090, 28.6139]
            };

            newListing.location = "New Delhi";
            newListing.country = "India";
        }

        await newListing.save();

        req.flash("success", "New listing created!");
        res.redirect("/listings");

    } catch (err) {
        console.log("Error during geocoding:", err);

        // Safe fallback
        const fallbackListing = new Listing(req.body.listing);
        fallbackListing.owner = req.user._id;
        fallbackListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };

        fallbackListing.geometry = {
            type: "Point",
            coordinates: [77.2090, 28.6139]
        };

        fallbackListing.location = "New Delhi";
        fallbackListing.country = "India";

        await fallbackListing.save();

        req.flash("success", "New listing created with default location.");
        res.redirect("/listings");
    }
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file!=="undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {filename, url};
      await listing.save();
    }
    
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  }

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  console.log(deletedListing);
  res.redirect("/listings");
}  