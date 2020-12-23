import { createApp } from 'vue';

import App from './App.vue';
import './index.css';
import internalCreateRouter from './router';
import { createStore, storeSymbol } from './store';

const app = createApp(App);
app.use(internalCreateRouter());
app.store = createStore();
app.provide(storeSymbol, app.store);
app.mount('#app');

window.app = app;
