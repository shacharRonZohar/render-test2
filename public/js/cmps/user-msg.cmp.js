import { eventBusService } from "../services/event-bus.service.js"

export default {
    template: `
        <section v-if="msg" class="user-msg" :class="msg.type">
            <button @click="msg=null">x</button>
            <p>{{msg.txt}}</p>
        </section>
    `,
    data() {
        return {
            msg: null
        }
    },
    methods: {
        setMsg(msg) {
            this.msg = msg
            setTimeout(() => {
                this.msg = null
            }, 3000)
        }
    },
    created() {
        eventBusService.on('show-msg', this.setMsg)
    },
    destroyed(){
        eventBusService.off('show-msg', this.setMsg)
    }
}