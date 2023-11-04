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
    width: fit-content;
    margin-top: 10px;
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
    margin-top: 10px;
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
                <el-avatar shape="square" :size="40"
                    src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" class="user-ava" />
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { ElMessage } from 'element-plus'
export default {
    props: {
        username: {
            type: String,
            default: 'admin'
        }
    },
    methods: {
        logout() {
            ElMessage.success('退出成功')
            this.$router.push('/login')
        }
    }
}
</script>