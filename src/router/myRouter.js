import myRouterLink from './myRouterLink'
import myRouterView from './myRouterView'

// 为了使用Vue中的响应式工具函数
let Vue = null

class MyVueRouter {
  constructor (options) {
    this.$options = options

    // 保存路由表配置，避免每次都去循环遍历
    this.routeMap = {}
    this.$options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })

    // 如果url中没有hash, 则设置hash为#/
    const initial = window.location.hash.slice(1) || '/'
    // vue源码中有相应的工具方法，只要在render中使用了响应式的数据，就会进行依赖收集
    // Vue.util.defineReactive(this, 'current', initial)
    this.current = initial
    Vue.util.defineReactive(this, 'matched', [])
    // match方法可以递归遍历路由表，获得匹配关系数组
    this.match()

    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }

  onHashChange () {
    this.current = window.location.hash.slice(1) || '/'
    this.matched = []
    this.match()
  }

  match (routes) {
    routes = routes || this.$options.routes

    // 递归遍历
    for (const route of routes) {
      if (route.path === '/' && this.current === '/') {
        this.matched.push(route)
        return
      }
      // 如果不是根路径，并且当前hash包含的path,都存入数组中
      if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
        this.matched.push(route)
        if (route.children) {
          this.match(route.children)
        }
      }
    }
  }
}

MyVueRouter.install = function (_vue) {
  Vue = _vue

  /**
   * 因为先Vue.use使用router插件,
   * 再创建根组件实例,
   * 所以通过mixin一个beforeCreate钩子来添加$router方法
   */
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
