import { carService } from '../services/car.service.js'
import carFilter from '../cmps/car-filter.cmp.js'
import carList from '../cmps/car-list.cmp.js'
import { showSuccessMsg } from '../services/event-bus.service.js'

export default {
  template: `
        <section class="car-app">
            <car-filter @filtered="setFilter" />
            <car-list :cars="cars" @remove="removeCar" />
            <router-link to="/car/edit">Add a new car!</router-link>
        </section>
    `,
  data() {
    return {
      cars: [],
      filterBy: {
        byVendor: '',
      }
    }
  },
  methods: {
    loadCars() {
      carService.query(this.filterBy).then((cars) => {
        this.cars = cars
      })
    },
    removeCar(carId) {
      carService.remove(carId).then(() => {
        showSuccessMsg('Car removed')
        const idx = this.cars.findIndex((car) => car._id === carId)
        this.cars.splice(idx, 1)
      })
    },
    setFilter(filterBy) {
      this.filterBy = { ...filterBy}
      this.loadCars()
    }
  },
  computed: {
    carsToShow() {
      if (!this.filterBy) return this.cars
      const searchStr = this.filterBy.byVendor.toLowerCase()
      const carsToShow = this.cars.filter((car) => {
        return car.vendor.toLowerCase().includes(searchStr)
      })
      return carsToShow
    },
  },
  created() {
    this.loadCars()
  },
  components: {
    carFilter,
    carList,
  },
}
