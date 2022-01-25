const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const { client_id } = require('./config')



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// call unsplash and return small image
async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: process.env.client_id,
                collections: 1114848,
                w: 1600,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '61f0217f400ba812fbf32c6f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
            images: [
                {
                    url: 'https://res.cloudinary.com/dbcdcszee/image/upload/v1643133979/YelpCamp/cup_a4eon9.jpg',
                    filename: 'YelpCamp/cup_a4eon9',
                },
                {
                    url: 'https://res.cloudinary.com/dbcdcszee/image/upload/v1643133979/YelpCamp/tent_vtu4ll.jpg',
                    filename: 'YelpCamp/tent_vtu4ll',
                },
                {
                    url: 'https://res.cloudinary.com/dbcdcszee/image/upload/v1643133979/YelpCamp/campfire_rkltpw.jpg',
                    filename: 'YelpCamp/campfire_rkltpw',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})