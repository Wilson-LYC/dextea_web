<style scoped>
.aside {
    height: calc(100vh - 80px);
    width: 350px;
    background: #ffffff;
    margin: 10px;
    border-radius: 8px;
    padding: 10px;
}
.main{
  background: #ffffff;
  margin: 10px 0;
  margin-right: 10px;
  border-radius: 8px;
  padding: 0;
}
.main-container{
  margin: 0;
  padding: 10px;
  height: calc(100vh - 100px);
}
</style>
<template>
    <el-container style="background:#eeeeee;">
      <el-aside class="aside">
        <OrderNav/>
      </el-aside>
      <el-main class="main">
        <el-scrollbar class="main-container">
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
</template>
<script>
import OrderNav from '@/components/StoreServiceComponents/OrderNav.vue'
export default{
  components:{
    OrderNav
  }
}
</script>