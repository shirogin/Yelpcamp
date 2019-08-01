var express = require('express')
var router = express.Router()
var campground = require('../models/campground')
var middleware = require('../middlewate')

//==============
//INDEX ROUTE
//==============

router.get('/campgrounds', middleware.isLoggedin, (req, res) => {
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
    campground.create({
        name: newname,
        price: newPrice,
        img: newimage,
        description: newDescription,
        author: newAuthor
    }, (err, camp)=>{
        if (err){
            console.log(err)
        }else{
            console.log(camp)
            res.redirect("/campgrounds")
        }
    })
})

//NEW - show for to create new camground
router.get('/campgrounds/new', middleware.isLoggedin, (req, res) => {
    res.render('campgrounds/new')
})

router.get('/campgrounds/:id', middleware.isLoggedin, (req, res)=>{
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
    //find and update the correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp)=>{
        if (err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds/' + req.params.id)
        }
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