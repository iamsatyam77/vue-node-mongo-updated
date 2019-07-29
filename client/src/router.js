import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Employees from './components/Employees.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/employees',
      name: 'Employees',
      component: Employees
    },
    {
      path: '**',
      redirect: '/'
    }
  ]
})
