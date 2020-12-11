export default {
  props: {
    to: {
      type: String,
      default: '/'
    }
  },
  render () {
    return <a href={`#${this.to}`}>{this.$slots.default}</a>
  }
}
