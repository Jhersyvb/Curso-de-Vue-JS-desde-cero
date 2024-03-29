import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import VueTextareaAutosize from 'vue-textarea-autosize'
Vue.use(VueTextareaAutosize)

import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseConfig from '../firebase.config'

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()

Vue.config.productionTip = false

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
