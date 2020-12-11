let Vue = null

class MyVueRouter {
  constructor (options) {
    this.$options = options

    this.routeMap = {}
    this.$options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })

    Vue.util.defineReactive(this, 'current', '/')

    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }

  onHashChange () {
    this.current = window.location.hash.slice(1)
  }
}

MyVueRouter.install = function (_vue) {
  Vue = _vue

  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        default: '/'
      }
    },
    render () {
      return <a href={`#${this.to}`}>{this.$slots.default}</a>
    }
  })

  Vue.component('router-view', {
    render (h) {
      const { current, routeMap } = this.$router
      const component = routeMap[current]
      return h(component)
    }
  })
}

export default MyVueRouter
