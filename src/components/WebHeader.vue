<style scoped>
* {
    margin: 0;
    padding: 0;
}

.container {
    width: 100%;
    height: 100%;
    background: #337ecc;
}

.hicon {
    height: 40px;
    margin-top: 10px;
    margin-left: 12px;
}

.htitle {
    font-size: 23px;
    color: #fff;
    line-height: 60px;
    font-weight: 500;
    margin-left: 10px;
}

.left {
    display: flex;
}

.right {
    position: relative;
    display: flex;
    flex-direction: row-reverse;
}

.user-name {
    outline: none;
    line-height: 60px;
    font-size: 16px;
    color: #fff;
}

.user-name:hover {
    cursor: pointer;
}

.user-ava {
    margin-top: 15px;
    margin-right: 10px;
}
</style>
<template>
    <div class="container">
        <el-row>
            <el-col :span="12" class="left">
                <img src="@/assets/img/logo1.png" class="hicon">
                <!-- <p class="htitle">线上点单系统</p> -->
            </el-col>
            <el-col :span="12" class="right">
                <el-dropdown style="margin-right: 20px;" size="large">
                    <span class="user-name">
                        {{ username }}
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu :hide-on-click="false">
                            <!-- <el-dropdown-item>个人设置</el-dropdown-item> -->
                            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                            <!-- <el-dropdown-item>
                                <el-popconfirm title="确定退出登录?">
                                    <template #reference>
                                        退出登录
                                    </template>
                                </el-popconfirm>
                            </el-dropdown-item> -->
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-avatar shape="square" :size="30"
                    src="https://img.js.design/assets/img/6562db565dc1da7c500d3c5a.png#41ed5c470241419c764d2f814a5b7692" class="user-ava" style="background: #337ecc;"/>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { ElMessage } from 'element-plus'
export default {
    data() {
        return {
            username: "admin"
        }
    },
    methods: {
        logout() {
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('role')
            sessionStorage.removeItem('storeId')
            ElMessage.success('退出成功')
            this.$router.push('/login')
        }
    },
    mounted() {
        this.username = sessionStorage.getItem('username')
    }
}
</script>