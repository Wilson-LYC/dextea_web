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
                            <span>菜单管理</span>
                        </template>
                    </el-menu-item>
                    <el-sub-menu index="/company/store">
                        <template #title>
                            <el-icon>
                                <Shop />
                            </el-icon>
                            <span>门店管理</span>
                        </template>
                        <el-menu-item index="/company/store/all"><span>所有门店</span></el-menu-item>
                        <el-menu-item index="/company/store/openarea"><span>开放区域</span></el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="/company/commodity">
                        <template #title>
                            <el-icon>
                                <MilkTea />
                            </el-icon>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item index="/company/commodity/class"><span>品类管理</span></el-menu-item>
                        <el-menu-item index="/company/commodity/all"><span>全部商品</span></el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="/company/order">
                        <el-icon>
                            <Tickets />
                        </el-icon>
                        <span>订单</span>
                    </el-menu-item>
                    <el-sub-menu index="/company/comment">
                        <template #title>
                            <el-icon>
                                <ChatLineSquare />
                            </el-icon>
                            <span>评论管理</span>
                        </template>
                        <el-menu-item index="/company/comment/order"><span>订单评价</span></el-menu-item>
                        <el-menu-item index="/company/comment/commodity"><span>商品评价</span></el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="/company/customer">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>顾客管理</span>
                    </el-menu-item>
                    <el-sub-menu index="/company/data">
                        <template #title>
                            <el-icon>
                                <PieChart />
                            </el-icon>
                            <span>数据统计</span>
                        </template>
                        <el-menu-item index="/company/data/order"><span>营业额</span></el-menu-item>
                        <el-menu-item index="/company/data/commodity"><span>商品销量</span></el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="/company/setting">
                        <el-icon>
                            <Setting />
                        </el-icon>
                        <span>系统设置</span>
                    </el-menu-item>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <el-container style="background:  #eeeeee;">
            <el-scrollbar class="main-container">
                <!-- 正文 -->
                <el-main>
                    <router-view />
                </el-main>
                <!-- 页脚 -->
                <el-footer style="margin: 0;height: 0;padding: 0;">
                    <WebFoo />
                </el-footer>
            </el-scrollbar>
        </el-container>
    </el-container>
</template>
<script>
import WebFoo from '@/components/WebFooter.vue'
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
                this.asideWidth = '200px';
            }
        }
    },
    computed: {
        nowurl: {
            get() {
                return this.$route.path
            }
        }
    }
}
</script>