const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movieApp')
    .then(() => {
        console.log("connected")
    })
    .catch((err) => {
        console.log("ERROR")
        console.log(err)
    })

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log('Connected')
// })
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
})
const Movie = mongoose.model('Movie', movieSchema)
// const amadeus = new Movie({ title: "Amadeus", year: 1986, score: 9.2, rating: 'R' })

// Movie.insertMany([
//     { title: "A", year: 1, score: 1, rating: "R" },
//     { title: "B", year: 2, score: 2, rating: "R" },
//     { title: "C", year: 3, score: 3, rating: "PG" },
//     { title: "D", year: 4, score: 4, rating: "R" },
//     { title: "E", year: 5, score: 5, rating: "PG-13" },
// ])
//     .then((data) => {
//         console.log("worked")
//         console.log(data)
//     })