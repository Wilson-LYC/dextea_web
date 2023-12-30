import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios';
import md5 from 'js-md5';
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
app.use(router)

//md5加密
app.config.globalProperties.$md5 = md5;

/* 访问域名 */
// let hostname="dexapi.ycwisdom.cn";//域名地址
let hostname="127.0.0.1:6688";//域名地址
let httpurl="http://"+hostname;//http请求
let wsurl="ws://"+hostname;//websocket请求
app.config.globalProperties.$httpurl = httpurl;
app.config.globalProperties.$wsurl = wsurl;

/* ElementPlus UI库 */
app.use(ElementPlus, {
  locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app')

/* axios配置 */
app.config.globalProperties.$http = axios;
//请求地址
axios.defaults.baseURL = httpurl;
//请求拦截器
axios.interceptors.request.use(
  res => {
    let token = sessionStorage.getItem("token");
    if (token) {
      res.headers.Authorization = token;
    }
    return res;
  },
  err => {
    ElMessage.error("请求错误："+err);
  }
)
//响应拦截器
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
