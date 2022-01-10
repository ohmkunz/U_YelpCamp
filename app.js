const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    })

const app = express()
app.set('views engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: "Backyard", description: 'cheap camping' });
    await camp.save()
    res.send(camp)
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})