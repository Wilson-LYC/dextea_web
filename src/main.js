import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios';
import md5 from 'js-md5';
import { ElMessage } from 'element-plus'
//axios配置
axios.defaults.baseURL = 'http://127.0.0.1:6688';
axios.interceptors.request.use(
    res => {
        let token=sessionStorage.getItem("token");
        if(token){
            res.headers.Authorization=token;
        }else{
            res.headers.Authorization=null;
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
    ElMessage.error("服务器异常: "+err);
  }
)

const app = createApp(App)
app.use(router)
app.config.globalProperties.$http = axios;
app.config.globalProperties.$md5 = md5;
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount('#app')
