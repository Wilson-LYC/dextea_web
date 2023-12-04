<style scoped>
body {
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
  margin: 0;
}

.forget-p {
  float: right;
  margin-top: 15px;
}

a {
  color: #999;
  text-decoration: none;
}

.backpic {
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
          <el-form :model="loginData" ref="vForm" :rules="rules" label-position="top" label-width="60px" size="large">
            <el-form-item label="账号" prop="account">
              <el-input v-model="loginData.account" type="text" clearable prefix-icon="UserFilled"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" class="required label-right-align">
              <el-input v-model="loginData.password" type="password" :show-password="true" clearable
                prefix-icon="Lock" @keydown.enter="login"></el-input>
            </el-form-item>
          </el-form>
          <el-button color="#B8701B" style="width: 100%;margin-top: 10px;font-size: 18px;" size="large" @click="login"
            :loading="loading">登录</el-button>
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
import bcrypt from 'bcryptjs'
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
      loading: false,
    }
  },
  methods: {
    forpass() {
      ElMessage.error('请联系其他职员或公司修改')
    },
    login() {
      this.loading = true
      //验证表单
      this.$refs.vForm.validate((valid) => {
        if (valid) {
          //验证成功
          let sData = JSON.parse(JSON.stringify(this.loginData))
          sData.password = this.$md5(sData.password)
          //提交数据
          this.$http.post("/login/staff", {
            data: sData
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(
            (response) => {
              //500ms后
              setTimeout(() => {
                this.loading = false
                if (response.data.code != 200) {
                  ElMessage.error(response.data.msg)
                  return
                }
                //获取数据
                let staff = response.data.data.staff
                let token = response.data.data.token
                //存储数据到缓存
                // sessionStorage.setItem("staff", JSON.stringify(staff))
                sessionStorage.setItem("token", token)
                sessionStorage.setItem("username", staff.name)
                sessionStorage.setItem("role", staff.role)
                sessionStorage.setItem("storeId", staff.storeId)
                ElMessage.success('欢迎您！'+staff.name)
                //根据role跳转
                if (staff.role == "0") {
                  this.$router.push('/company')
                } else if (staff.role == "1") {
                  this.$router.push('/company')
                } else if (staff.role == "2") {
                  this.$router.push('/store')
                } else {
                  ElMessage.error('账号异常')
                }
              }, 500)
            },
            (response) => {
              ElMessage.error("服务器连接失败")
              this.loading = false
            }
          )
        } else {
          //验证失败
          ElMessage.error('密码或账号不能为空')
          this.loading = false
        }
      })
    }
  }
}
</script>