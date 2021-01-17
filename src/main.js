import { createApp } from 'vue';

import App from './App.vue';
import './index.css';
import internalCreateRouter from './router';

const app = createApp(App);
app.use(internalCreateRouter());
app.mount('#app');

window.app = app;
