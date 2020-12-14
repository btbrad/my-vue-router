# my-vue-router
> 手写vue-router

### 1. 创建VueRouter类并实现install方法
```js
class MyVueRouter {
  constructor (options) {
    this.$options = options
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
}

export default MyVueRouter
```
### 2. 实现route-link组件
```js
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
```

### 3. 实现一个响应式属性current,监听hashchange事件, 缓存路由表
```js
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
    Vue.util.defineReactive(this, 'current', initial)

    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }

  onHashChange () {
    this.current = window.location.hash.slice(1) || '/'
  }
}
```
### 4. 添加route-view全局组件
```js
Vue.component('router-view', {
  render (h) {
    const { current, routeMap } = this.$router
    const component = routeMap[current]
    return h(component)
  }
})
```
### 5. 处理嵌套路由
- router-view深度标记
- 路由匹配时获取代表深度层级的matched数组