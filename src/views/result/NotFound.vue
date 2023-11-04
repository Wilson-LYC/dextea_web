<style scoped>
* {
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  user-select: none;
}

.window {
  width: 100vw;
  height: 100vh;
}

.container {
  margin: 0 auto;
  width: 1000px;
  height: 100%;
  /* background: #000000; */
}

.warp {
  position: relative;
  top: 40%;
  transform: translateY(-50%);
  width: 100%;
  text-align:center;
}

.copyright {
  position: absolute;
  width: 100vw;
  height: 80px;
  bottom: 0;
  background: #f5f5f7;
}

.cr-p {
  text-align: center;
  line-height: 80px;
  font-size: 14px;
  color: #999;
}
.tips-img{
    height:400px;
}
.tips{
    font-size: 24px;
    color: #000000;
    margin-bottom: 20px;
}
</style>

<template>
  <div class="window">
    <div class="container">
      <div class="warp">
        <img src="@/assets/img/404.png" class="tips-img">
        <p class="tips">你访问的页面不存在</p>
        <p class="tips">{{ second }} 秒后跳转……</p>
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
export default{
    data() {
      return {
        second:3,
      }
    },
    mounted() {
        setInterval(() => {
            this.second--;
            if(this.second == 0){
                this.$router.push({path:'/'});
            }
        }, 1000);
    }
}
</script>