<style scoped>
*{
  margin: 0;
  padding: 0;
}
body{
  margin: 0;
  padding: 0;
}
.window {
  width: 100vw;
  height: 100vh;
}

.web-logo {
  position: absolute;
  top: 10px;
  left: 13px;
  height: 50px;
}

.container {
  margin: 0 auto;
  width: 1000px;
  height: 100%;
  /* background: #000000; */
}

.warp {
  position: relative;
  top: 45%;
  transform: translateY(-50%);
  width: 100%;
}

.login-card {
  overflow: hidden;
  border-radius: 48px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
  background-color: #fff;
  width: 500px;
  height: auto;
  margin: 0 auto;
  padding: 55px;
  text-align: center;
}

#login-logo {
  height: 80px;
  margin: 0 auto;
}

.login-title {
  margin: 20px 0;
  font-size: 32px;
  font-weight: bold;
}

.copyright {
  position: absolute;
  width: 100vw;
  height: 80px;
  bottom: 0;
}

.cr-p {
  text-align: center;
  line-height: 80px;
  font-size: 14px;
  color: #999;
  user-select: none;

}

.forget-p {
  float: right;
  margin-top: 15px;
}

a {
  color: #999;
  text-decoration: none;
}
.backpic{
  position: fixed;
  bottom: 0;
  right: 0;
  height: 800px;
}
</style>

<template>
  <div class="window">
    <img src="@/assets/img/logo.png" class="web-logo">
    <img src="@/assets/img/back.png" class="backpic">
    <div class="container">
      <div class="warp">
        <div class="login-card">
          <img src="@/assets/img/logo.png" id="login-logo">
          <p class="login-title">登录 DexTea 管理端</p>
          <el-form :model="loginData" ref="vForm" :rules="rules" label-position="top" label-width="150px" size="large">
            <el-form-item label="账号" prop="account" class="required label-right-align">
              <el-input v-model="loginData.account" type="text" clearable prefix-icon="UserFilled"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" class="required label-right-align">
              <el-input v-model="loginData.password" type="password" :show-password="true" clearable
                prefix-icon="Lock"></el-input>
            </el-form-item>
          </el-form>
          <el-button color="#B8701B" style="width: 100%;margin-top: 10px;font-size: 18px;" size="large" @click="login">登录</el-button>
          <div class="forget-p">
            <a href="#" @click="forpass">忘记密码</a>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <div class="container">
        <p class="cr-p">版权所有 © 2023 德贤茶庄有限公司 保留所有权利。</p>
      </div>
    </div>
  </div>
</template>
<script>
import { ElMessage } from 'element-plus'
export default {
  components: {},
  props: {},
  data() {
    return {
      loginData: {
        account: "",
        password: "",
      },
      rules: {
        account: [{
          required: true,
          message: '账号不能为空',
        }],
        password: [{
          required: true,
          message: '密码不能为空',
        }],
      },
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    forpass() {
      ElMessage.error('请联系直接上级重置密码')
    },
    login(){
      ElMessage.success('登录成功')
      this.$router.push('/company')
    }
  }
}
</script>