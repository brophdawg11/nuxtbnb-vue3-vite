import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue'
import './index.css'

const routes = [{
    path: '/',
    component: () => import('./IndexView.vue'),
}, {
    path: '/home/:homeId',
    component: () => import('./HomeView.vue'),
}];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App);
app.use(router);
app.mount('#app');
