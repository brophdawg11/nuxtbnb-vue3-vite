import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import './index.css';
import { createStore, storeSymbol } from './store';

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
});

const app = createApp(App);
app.use(router);
app.store = createStore();
app.provide(storeSymbol, app.store);
app.mount('#app');

window.app = app;
