<style scoped></style>
<template>
  <div style="background: #ffffff;border-radius: 8px; padding: 20px;">

    <!-- 操作栏 -->
    <div class="btn-container" style="margin-bottom: 15px;">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button type="default" @click="getOpenArea">刷新</el-button>
    </div>

    <!-- 表格主体 -->
    <el-table :data="tabledata" style="width: 100%" border height="600px" table-layout="auto" row-key="value"
      v-loading="loading">
      <template #empty>无数据</template>
      <!-- 数据部分 -->
      <el-table-column prop="value" label="区域" width="300" />
      <el-table-column prop="num" label="门店数量" />
      <!-- 行内操作栏 -->
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template #default="scope">
          <!-- 没有子节点才能删除 -->
          <el-popconfirm v-if="scope.row.children == null || scope.row.children.length < 1" width="220"
            confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled" icon-color="#626AEF" title="确定删除?"
            @confirm="del(scope.row, scope.$index)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
          <p v-else disable style="margin: 0;"></p>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增对话框 -->
    <AddDialog v-model:visible="addDialogVisible" :superior="tabledata" />
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import AddDialog from '@/components/OpenAreaSheet/AddOpenAreaDialog.vue'
export default {
  components: {
    AddDialog
  },
  data() {
    return {
      //表格数据
      tabledata: [],
      //“新增”对话框可见性
      addDialogVisible: false,
      loading: true
    }
  },
  methods: {
    //添加
    add() {
      this.addDialogVisible = true
    },
    //删除
    del(data, index) {
      ElMessage("删除" + index)
    },
    getOpenArea() {
      this.loading = true
      this.$http.get("/company/openarea/get").then(
        (response) => {
          if (response.data.code != 200) {
            ElMessage.error(response.data.msg)
          }
          this.tabledata = response.data.data.openArea
          this.loading = false
        },
        (response) => {
          ElMessage.error(response.message)
          this.tabledata = []
          this.loading = false
        }
      )
    }
  },
  watch: {
    addDialogVisible(val) {
      if (!val)
        ElMessage("请刷新数据")
    }
  },
  mounted() {
    this.getOpenArea()
  }
}
</script>