import myRouterLink from './myRouterLink'
import myRouterView from './myRouterView'

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

  Vue.component('router-link', myRouterLink)

  Vue.component('router-view', myRouterView)
}

export default MyVueRouter
