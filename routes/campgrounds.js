var express = require('express')
var router = express.Router()
var campground = require('../models/campground')
var middleware = require('../middlewate')
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//==============
//INDEX ROUTE
//==============

router.get('/campgrounds', (req, res) => {
    campground.find({}, (err, allcampgroudns)=>{
        if (err){
            console.log(err)
        }else {
            // res.send(allcampgroudns)
            res.render('campgrounds/index', {campgrounds: allcampgroudns, currentUser: req.user})
        }
    })
    
})

//CREATE - add new campground to DB 
router.post('/campgrounds', middleware.isLoggedin, (req, res) => {
    var newname = req.body.name
    var newPrice = req.body.price
    var newimage = req.body.image
    var newDescription = req.body.description
    var newAuthor = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, (err, data)=>{
        if (err || !data.length){
            req.flash('error', 'Invalid address')
            return res.redirect('back')
        }
        var lat = data[0].latitude
        var lng = data[0].longitude
        var location = data[0].formattedAddress
        var newCampground = {name: newname, price: newPrice, img: newimage, description: newDescription, author: newAuthor, location: location, lat: lat, lng: lng}
        campground.create(newCampground, (err, camp)=>{
            if (err){
                console.log(err)
            }else{
                console.log(camp)
                res.redirect("/campgrounds")
            }
        })
    })

})

//NEW - show for to create new camground
router.get('/campgrounds/new', middleware.isLoggedin, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/campgrounds/:id', (req, res)=>{
    campground.findById(req.params.id).populate('comments').exec((err, foundcamp)=>{
        if (err){
            console.log(err)
        }else{
            //console.log(foundcamp)
            res.render('campgrounds/show', {campground: foundcamp})
        }
    })
})

//EDIT CAMPGROUND ROUTE
router.get('/campgrounds/:id/edit', middleware.checkCamgroundOwnership, (req, res)=>{
    campground.findById(req.params.id, (err, foundCampground)=>{
        if (err){
            res.redirect('/campgrounds')
        }else{
            res.render('campgrounds/edit', {campground: foundCampground})
        }
    })
})

//UPDATE CAMPGROUND ROUTE
router.put('/campgrounds/:id', middleware.checkCamgroundOwnership, (req, res)=>{
    geocoder.geocode(req.body.location, (err, data)=>{
        if (err || !data.length){
            req.flash('error', 'Invalid address')
            return res.redirect('back')
        }
        req.body.campground.lat = data[0].latitude
        req.body.campground.lng = data[0].longitude
        req.body.campground.location = data[0].formattedAddress

        //find and update the correct campground
        campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp)=>{
            if (err){
                req.flash('error', 'err.message')
                res.redirect('/campgrounds')
            }else{
                req.flash('success', 'Successfully Updated!')
                res.redirect('/campgrounds/' + req.params.id)
            }
        })
    })
})

//DESTROY CAMPGROUND ROUTE
router.delete('/campgrounds/:id', middleware.checkCamgroundOwnership, (req, res)=>{
    campground.findByIdAndRemove(req.params.id, (err)=>{
        if (err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds')
        }
    })
})

module.exports = router