<style scoped>
.aside {
    height: calc(100vh - 60px);
    border-right: 1px solid #ebeef5;
}

.main-container {
    margin: auto;
    width: 100%;
    height: calc(100vh - 60px);
}

.nav {
    border: 0;
}

span {
    font-size: 16px;
}
.mymain{
    height: calc(100% - 20px);
    width: calc(100% - 20px);
    padding: 10px;
}
</style>

<template>
    <el-container class="container">
        <el-aside class="aside" :width="asideWidth">
            <!-- 左侧菜单栏 -->
            <el-scrollbar>
                <el-menu :collapse="isCollapse" class="nav" :unique-opened="true" :router="true" :default-active="nowurl">
                    <el-menu-item @click="CollapseMenu">
                        <el-icon>
                            <Menu />
                        </el-icon>
                        <template #title>
                            <span>菜单</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/store/setting/store">
                        <el-icon>
                            <Shop />
                        </el-icon>
                        <span>门店管理</span>
                    </el-menu-item>
                    <el-menu-item index="/store/setting/staff">
                        <el-icon>
                            <Postcard />
                        </el-icon>
                        <span>员工管理</span>
                    </el-menu-item>
                    <el-menu-item index="/store/setting/commodity">
                        <el-icon>
                            <MilkTea />
                        </el-icon>
                        <span>商品管理</span>
                    </el-menu-item>
                    <el-menu-item index="/store/setting/order">
                        <el-icon>
                            <Tickets />
                        </el-icon>
                        <span>订单</span>
                    </el-menu-item>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <el-container style="background:  #eeeeee;">
            <div class="mymain">
                <router-view />
            </div>
        </el-container>
    </el-container>
</template>
<script>
import WebFoo from '@/components/WebFooter.vue'
import { ElMessage } from 'element-plus'
import { ElNotification } from 'element-plus'
export default {
    data() {
        return {
            msg: 'company',
            isCollapse: false,
            asideWidth: '200px',
        }
    },
    components: {
        WebFoo,
    },
    methods: {
        CollapseMenu() {
            this.isCollapse = !this.isCollapse
            if (this.isCollapse) {
                this.asideWidth = 'auto';
            } else {
                //缓慢增加到200px
                for (let i = 64; i < 200; i++) {
                    setTimeout(() => {
                        this.asideWidth = i + 'px';
                    }, i * 1.5);
                }
            }
        }
    },
    computed: {
        nowurl: {
            get() {
                return this.$route.path
            }
        }
    },
    mounted() {
        let role = sessionStorage.getItem('role')
        if (role == '2') {
            //允许2门店员工访问
        } else {
            if (role == '0' || role == '1') {
                this.$router.push('/company')
            } else {
                ElMessage.error('权限错误，请重新登录')
                sessionStorage.clear()
                this.$router.push('/login')
            }
        }
    }
}
</script>