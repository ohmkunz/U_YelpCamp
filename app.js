const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./schemas')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const morgan = require('morgan')
const Review = require('./models/review')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    })

const app = express()

app.engine('ejs', ejsMate)
app.set('views engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home.ejs')
})




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error.ejs', { err })

})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})