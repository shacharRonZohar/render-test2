export default {
  template: `
    <section class="car-filter">
        <label> Search a car: </label>    
        <input ref="vendorInput" type="text" @input="setFilter" placeholder="Search...." v-model="filterBy.byVendor">
    </section>
    `,
  data() {
    return {
      filterBy: {
        byVendor: '',
      },
    }
  },
  methods: {
    setFilter() {
      this.$emit('filtered', this.filterBy)
    },
  },
  created() {
    // console.log('created')
  },
  mounted() {
    // console.log('mounted')
    this.$refs.vendorInput.focus()
  },
}
