import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios';
import md5 from 'js-md5';
import cookie from './cookie/cookie.js';
axios.defaults.baseURL = 'http://127.0.0.1:6688';
const app = createApp(App)
app.use(router)
app.config.globalProperties.$http = axios;
app.config.globalProperties.$md5 = md5;
app.config.globalProperties.$cookie = cookie;
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
app.mount('#app')
