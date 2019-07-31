const mongoose      = require('mongoose')
const campground    = require('./models/campground')
const Comment       = require('./models/comment')

var data = [
    {
        name: 'cloud Rest',
        img: "https://original.securityintelligence.com/wp-content/uploads/2018/04/its-time-to-bring-cloud-environments-out-of-the-shadows-630x330.jpg",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure dicta necessitatibus repudiandae molestias cupiditate quod enim nisi est, commodi et ipsum similique libero ex? Expedita magni facilis architecto. Dolor, alias."
    },
    {
        name: 'Scary Forest',
        img: "https://wallpaperplay.com/walls/full/3/0/a/61155.jpg",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure dicta necessitatibus repudiandae molestias cupiditate quod enim nisi est, commodi et ipsum similique libero ex? Expedita magni facilis architecto. Dolor, alias."
    },
    {
        name: 'Another Scary Forest',
        img: "https://forest.ambient-mixer.com/images_template/7/2/3/7236e90b1b23597c2e8d9346d1065779_full.jpg",
        description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure dicta necessitatibus repudiandae molestias cupiditate quod enim nisi est, commodi et ipsum similique libero ex? Expedita magni facilis architecto. Dolor, alias."
    }
]

function seedDB(){
    //Remove all Campgroudns
    campground.remove({}, (err)=>{
        if (err){
            console.log(err)
        }
        console.log('Removed Campgrounds!')
        //add a few campgrounds
        data.forEach((seed)=>{
            campground.create(seed, (err, campground)=>{
                if (err){
                    console.log(err)
                }
                else{
                    //console.log("added a campground")
                    //Create a Comment
                    Comment.create({
                        text: "This place is great, but i wish there was Internet",
                        author: "Homer"
                    }, (err, comment)=>{
                        if (err){
                            console.log(err)
                        }else{
                            campground.comments.push(comment)
                            campground.save()
                            //console.log("Created Comment")
                        }
                    })
                }
            })
        })
        console.log('Ready!!')
    })
    
}

module.exports = seedDB