import Vue from 'vue'
import Vuex from 'vuex'
import autheticate from './modules/authenticate'

Vue.use(Vuex)

// Create store
export default new Vuex.Store({
  modules: {
    autheticate
  }
});
