/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/scss/all.scss';

createApp(App).use(store).use(router).mount('#app');
