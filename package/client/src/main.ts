import { createApp } from 'vue';
import router from './routers/index';
import App from './App.vue';

createApp(App)
    .use(router)
    .mount('#app')
