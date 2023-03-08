const express = require('express')
const cookieParser = require('cookie-parser')

process.env.CRYP_KEY = 'secret-puk-1234'

const carService = require('./services/car.service')
const userService = require('./services/user.service')

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:

// LIST
app.get('/api/car', (req, res) => {
    const { byVendor, page } = req.query

    const filterBy = {
        byVendor: byVendor || '',
        page: +page || undefined,
    }
    carService
        .query(filterBy)
        .then((cars) => {
            res.send(cars)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot load cars')
        })
})

// READ
app.get('/api/car/:carId', (req, res) => {
    const { carId } = req.params
    carService
        .getById(carId)
        .then((car) => {
            res.send(car)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot load car')
        })
})

// ADD
app.post('/api/car/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const { vendor, speed } = req.body

    const car = {
        vendor,
        speed,
        owner: loggedinUser,
    }

    carService
        .save(car)
        .then((savedCar) => {
            res.send(savedCar)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot save car')
        })
})

// UPDATE
app.put('/api/car/:carId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const { vendor, speed, _id } = req.body

    const car = {
        _id,
        vendor,
        speed,
    }
    carService
        .save(car, loggedinUser)
        .then((savedCar) => {
            res.send(savedCar)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot save car')
        })
})

// DELETE
app.delete('/api/car/:carId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete car')

    const { carId } = req.params

    carService
        .remove(carId, loggedinUser)
        .then(() => {
            res.send('Removed!')
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Unknown car')
        })
})

// LOGIN
app.post('/api/auth/login', (req, res) => {
        userService.checkLogin(req.body).then((user) => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid login')
            }
        })
    })
    // SIGNUP
app.post('/api/auth/signup', (req, res) => {
    userService.save(req.body).then((user) => {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
    })
})

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})

const PORT = process.env.PORT || 3030

app.listen(PORT, () =>
    console.log(`Server listening on port http://127.0.0.1:${PORT}/`)
)