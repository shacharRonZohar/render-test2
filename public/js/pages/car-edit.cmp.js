import { carService } from '../services/car.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export default {
    template: `
   <section v-if="carToEdit" class="car-edit app-main">
        <h3>{{title}}</h3>
        <form @submit.prevent="save">
            <input type="text" placeholder="Vendor" v-model="carToEdit.vendor">
            <input type="number" placeholder="Speed" v-model.number="carToEdit.speed">
            <button>Save</button>
        </form>
   </section>
    `,
    data() {
        return {
            carToEdit: null
        }
    },
    
    methods: {
        save() {
            carService.save(this.carToEdit)
                .then(car => {
                    console.log('Saved Car:', car)
                    showSuccessMsg('Car saved succesfully')
                    this.$router.push('/car-app')
                })
                .catch(err => {
                    console.log(err)
                    showErrorMsg('Error, please try again later')
                })
        }
    },
    computed: {
        title() {
            return this.carId ? 'Car Edit' : 'Car Add'
        },
        carId() {
            return this.$route.params.carId
        }
    },
    created() {
        if (this.carId) {
            carService.getById(this.carId).then(car => this.carToEdit = car)
        } else {
            this.carToEdit = carService.getEmptyCar()
        }
    }
   
}
