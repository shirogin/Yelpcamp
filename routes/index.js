var express = require('express')
var router = express.Router()
var passport = require('passport')
var User = require('../models/user')

router.get('/', (req, res) => {
    res.render('landing_v2')
})

// ==========================
// AUTHENTIFICATION ROUTES
// ==========================

//Show register Form
router.get('/register', (req, res)=>{
    res.render('register')
})
//Handle Register Logic
router.post('/register', (req, res)=>{
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user)=>{
        if (err){
            console.log(err)
            req.flash("error", err.message)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, ()=>{
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect('/campgrounds')
        })
    })
})


//Show Login Form
router.get('/login', (req, res)=>{
    res.render('login')
})
//Handle the Login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res)=>{
    req.flash("success", "Welcome to YelpCamp" + user.username)
})

//Logout
// logic Route
router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success', 'Logged Out')
    res.redirect('/campgrounds')
})
module.exports = router