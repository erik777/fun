import Vue from 'nativescript-vue'
import RadSideDrawer from 'nativescript-ui-sidedrawer/vue'

Vue.use(RadSideDrawer)

import HomeFlix from './components/HomeFlix.vue'
import App from './components/App.vue'
import GettingStarted from './components/GettingStarted.vue'

declare let __DEV__: boolean;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__

new Vue({
  render: (h) => h('frame', [h(App)]),
}).$start()

//  render: (h) => h('frame', [h(Home)]),
