import { createRouter, createWebHistory } from 'vue-router';

const routes = [{
    path: '/',
    component: () => import('./IndexView.vue'),
}, {
    path: '/home/:homeId',
    component: () => import('./HomeView.vue'),
}, {
    path: '/search',
    component: () => import('./SearchView.vue'),
}];

export default function internalCreateRouter() {
    return createRouter({
        history: createWebHistory(),
        routes,
    });
}
