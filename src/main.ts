/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faMagnifyingGlass, faUser, faTrashCan, faExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import JsonCSV from 'vue-json-csv';
import axios from 'axios';
import { ConfigProvider, NumberKeyboard, Field } from 'vant';
import VueAxios from 'vue-axios';
import App from './Index.vue';
import router from './router/index';
import store from './store';
import '@vant/touch-emulator';
import 'vant/lib/index.css';
import '@/assets/scss/helper/button.scss';
import '@/assets/scss/all.scss';

library.add(faMagnifyingGlass, faUser, faTrashCan, faExclamation);
createApp(App)
  .use(VueAxios, axios)
  .use(store)
  .use(router)
  .use(NumberKeyboard)
  .use(ConfigProvider)
  .use(Field)
  .component('downloadCsv', JsonCSV)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
