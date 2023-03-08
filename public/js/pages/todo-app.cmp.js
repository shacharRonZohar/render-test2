import { todoService } from '../services/todo.service.js'

export default {
    template: `
        <section class="todo-app">
            <ul>
                <li v-for="todo in todos" :key="todo._id" >
                    <span @click="toggleTodo(todo)" :class="{completed : todo.completed}">
                        {{todo.txt}}
                    </span>
                    <button @click="removeTodo(todo._id)">X</button>
                </li>
            </ul>
            <form @submit.prevent="addTodo()">
                <input type="text" placeholder="What Todo?" v-model="todoToEdit.txt" />
                <button>Save</button>
            </form>
        </section>
    `,
    data() {
        return {
            todos: [],
            todoToEdit: todoService.getEmptyTodo()
        }
    },
    created() {
        this.loadTodos()
    },
    methods: {
        loadTodos() {
            todoService.query()
                .then(todos => this.todos = todos)
        },
        toggleTodo(todo) {
            const todoToSave = {...todo, completed: !todo.completed}
            this.saveTodo(todoToSave)
            .then(()=>{
                console.log('Saved your toggle')
            })
        },
        addTodo() {
            this.saveTodo({...this.todoToEdit})
            .then(()=>{
                this.todoToEdit = todoService.getEmptyTodo()
            })
        },
        removeTodo(todoId) {
            todoService.remove(todoId)
                .then(() => {
                    const idx = this.todos.findIndex(todo => todo._id === todoId)
                    this.todos.splice(idx, 1)
                })
        },
        saveTodo(todo) {
            return todoService.save({ ...todo })
                .then((savedTodo) => {
                    if (todo._id) {
                        const idx = this.todos.findIndex(currTodo => currTodo._id === todo._id)
                        this.todos.splice(idx, 1, savedTodo)
                    } else {
                        this.todos.unshift(savedTodo)
                    }
                })
        },
        setFilter(filterBy) {
            this.filterBy = filterBy
        }
    }
}