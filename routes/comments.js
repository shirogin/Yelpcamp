var express = require('express')
var router = express.Router()
var campground = require('../models/campground')
var Comment = require('../models/comment')
var middleware = require('../middlewate')

// ===================
// COMMENTS ROUTES
// ===================

router.get('/campgrounds/:id/comments/new', middleware.isLoggedin, (req, res)=>{
    campground.findById(req.params.id, (err, campground)=>{
        if (err){
            console.log(err)
        }else{
            res.render('comments/new', {campground: campground})
        }
    })
})

router.post('/campgrounds/:id/comments', (req, res)=>{
    //lookup campground using ID
    campground.findById(req.params.id, (err, campground)=>{
        if (err){
            console.log(err)
            res.redirect('/campgrounds')
        }else{
            Comment.create(req.body.comment, (err, comment)=>{
                if (err){
                    req.flash('error', 'Whoops something went wrong...')
                    console.log(err)
                }else{
                    //Add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    //save comment
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    // console.log(comment)
                    req.flash('success', 'Succesfully added comment...')
                    res.redirect('/campgrounds/'+ campground._id)
                }
            })
        }
    })
})

//EDIT ROUTE
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req ,res)=>{ 
    campground.findById(req.params.id, (err, foundCampground)=>{
        if (err){
            console.log(err)
        }else{
            Comment.findById(req.params.comment_id, (err, foundComment)=>{
                if (err){
                    res.redirect('back')
                }else{
                    res.render('comments/edit', {campground: foundCampground, comment: foundComment})
                }
            })
        }
    })
})

//UPDATE COMMENT
router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if (err){
            res.redirect('back')
        }else{
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

//DELETE COMMENT
router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if (err){
            req.flash("error", "Comment not found!")
            res.redirect('/campgrounds/' + req.params.id)
        }else{
            req.flash("success", "Comment deleted")
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

module.exports = router