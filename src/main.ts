/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './Index.vue';
import router from './router/index';
import store from './store';

import '@/assets/scss/all.scss';
import '@/assets/scss/helper/button.scss';

library.add(faMagnifyingGlass, faUser);
createApp(App)
  .use(VueAxios, axios)
  .use(store)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
