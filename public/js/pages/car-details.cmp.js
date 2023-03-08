import { carService } from "../services/car.service.js"

export default {
    template: `
    <section v-if="car" class="car-details app-main">
        <h2>{{car.vendor}}</h2>
        <p>Speed: {{car.speed.toLocaleString()}}</p>
        <hr />
        <h6>Details</h6>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic sint, ut praesentium consequatur a doloremque facere eligendi libero. Sit delectus iste dolores sed culpa in illo tempora quo officiis labore?</p>
        <router-link to="/car-app">Back</router-link>
    </section>
    `,
    data() {
        return {
            car: null,
        }
    },
    created() {
        this.loadCar()
    },
    computed: {
        
    },
    methods: {
        loadCar() {
            const id = this.$route.params.carId
            carService.getById(id)
                .then(car => {
                    this.car = car
                })

        }
    },
    watch: {
        '$route.params.carId'(id) {
            console.log('Changed to', id)
            this.loadCar()
        }
    }
}
