import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios';
import md5 from 'js-md5';
import { ElMessage } from 'element-plus'
import websocket from 'vue-native-websocket';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
let url="http://"+window.location.hostname+":6688";
//axios配置
axios.defaults.baseURL = url;
axios.interceptors.request.use(
  res => {
    let token = sessionStorage.getItem("token");
    if (token) {
      res.headers.Authorization = token;
    }
    return res;
  },
  err => {
  }
)
axios.interceptors.response.use(
  res => {
    if (res.data.code == 300) {
      sessionStorage.clear();
      router.push("/login");
    }
    return res;
  },
  err => {
    ElMessage.error("服务器异常: " + err);
  }
)

const app = createApp(App)
app.use(router)
app.config.globalProperties.$http = axios;
app.config.globalProperties.$md5 = md5;
app.use(ElementPlus, {
  locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount('#app')
