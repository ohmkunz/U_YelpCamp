const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')

const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs', { campgrounds })
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save()
    req.flash('success', 'successfully create a new campground')
    res.redirect(`/campgrounds/${campground._id}`)

}))


router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show.ejs', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit.ejs', { campground })
}))
router.patch('/:id', validateCampground, catchAsync(async (req, res) => {
    //const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground) // {...req.body.campground}
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully delete a campground')
    res.redirect(`/campgrounds/`)
}))

module.exports = router;