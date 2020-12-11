export default {
  render (h) {
    const { current, routeMap } = this.$router
    const component = routeMap[current]
    return h(component)
  }
}
