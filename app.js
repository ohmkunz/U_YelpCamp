const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const morgan = require('morgan')

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
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
app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})

app.post('/campgrounds', catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show.ejs', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit.ejs', { campground })
}))
app.patch('/campgrounds/:id', catchAsync(async (req, res) => {
    //const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground) // {...req.body.campground}
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds/`)
}))

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