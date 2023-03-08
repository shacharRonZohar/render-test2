export default {
    props:['car'],
    template:`
    <section class="car-preview">
        <h3>⛐</h3>
        <h2>{{car.vendor}}</h2>
        <p>Speed: {{car.speed}}</p>
    </section>
    `,

}

