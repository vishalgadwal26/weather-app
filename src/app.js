const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const request = require('request')

const port = process.env.PORT || 3000

const app = express()
//Define paths for express config

const publicDirectoryPath = path.join(__dirname, '../public')
const viewspath = path.join(__dirname, '../templates/views')
const partialspath = path.join(__dirname, '../templates/partials')


//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewspath)
hbs.registerPartials(partialspath)

//setup static directory to serve 
app.use(express.static(publicDirectoryPath))
//
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Vishal Gadwal'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Vishal Gadwal'
    })


})


app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Vishal Gadwal'
    })


})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
        error:'you must provide an address'
        })
    }

geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
    if (error) {
        return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
            return res.send({ error })
        }
        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
        })
    })
})
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search term'
        })

    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Vishal Gadwal',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Vishal Gadwal',
        errorMessage: 'Page not found'

    })

})

app.listen(port, () => {
    console.log('server is up on port 3000')
})

