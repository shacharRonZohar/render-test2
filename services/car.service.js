const fs = require('fs')
const gCars = require('../data/car.json')

module.exports = {
  query,
  getById,
  remove,
  save,
}

const itemsPerPage = 100
function query(filterBy) {
  const { byVendor, page } = filterBy
  const regex = new RegExp(byVendor, 'i')
  let filteredCars = gCars.filter((car) => regex.test(car.vendor))

  if (page) {
    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredCars.length / itemsPerPage)
    filteredCars = filteredCars.slice(startIdx, startIdx + itemsPerPage)
  }
  return Promise.resolve(filteredCars)
}

function getById(carId) {
  const car = gCars.find((car) => car._id === carId)
  if (!car) return Promise.reject('Unknown car')
  return Promise.resolve(car)
}


function remove(carId, loggedinUser) {
  const idx = gCars.findIndex((car) => car._id === carId)
  if (idx < 0) return Promise.reject('Unknown car')
  if (gCars[idx].owner._id !== loggedinUser._id) return Promise.reject('Not your car')
  gCars.splice(idx, 1)
  return _saveCarsToFile()
}

function save(car, loggedinUser) {
  if (car._id) {
    const idx = gCars.findIndex((currCar) => currCar._id === car._id)
    if (gCars[idx].owner._id !== loggedinUser._id) return Promise.reject('Not your car')
    // Update only specific fields
    gCars[idx].vendor = car.vendor
    gCars[idx].speed = car.speed
  } else {
    car._id = _makeId()
    gCars.unshift(car)
  }
  return _saveCarsToFile().then(() => car)
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}
function _saveCarsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gCars, null, 2)

    fs.writeFile('data/car.json', data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}
