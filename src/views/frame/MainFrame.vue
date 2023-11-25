<style scoped>

</style>

<template>
  <el-container>
    <el-header style="margin: 0;padding: 0;">
      <WebHead />
    </el-header>
    <router-view/>
  </el-container>
</template>
<script>
import WebHead from '@/components/WebHeader.vue'
export default {
  components: {
    WebHead
  },
}
</script>