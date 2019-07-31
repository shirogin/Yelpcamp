require('dotenv').config()
const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        campground      = require('./models/campground'),
        seedDB          = require('./seeds'),
        methodOverride  = require('method-override'),
        User            = require('./models/user'),
        Comment         = require('./models/comment'),
        flash           = require('connect-flash')

const   commentRoutes       = require('./routes/comments'),
        campgroundsRoutes   = require('./routes/campgrounds'),
        indexRoutes         = require('./routes/index')

const port = 8888

// mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// })
mongoose.connect("mongodb+srv://xenomshox:0561182132salma@xenomshox-q63xb.mongodb.net/yelp_camp_final?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
})
//mongodb+srv://xenomshox:0561182132salma@xenomshox-q63xb.mongodb.net/test?retryWrites=true&w=majority

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride('_method'))
app.use(flash())

// seedDB()     //seed the database

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'Once again Rusty wins cutest dog <3 !!',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
    res.locals.currentUser = req.user
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
})


app.use(commentRoutes)
app.use(campgroundsRoutes)
app.use(indexRoutes)

app.listen(process.env.PORT || port, process.env.IP, () => {
	console.log('Connected to YelpCamp PORT : ' + port)
})