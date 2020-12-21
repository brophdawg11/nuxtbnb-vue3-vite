import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import './index.css';
import { provideStore } from './store';

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
provideStore(app);
app.use(router);
app.mount('#app');
