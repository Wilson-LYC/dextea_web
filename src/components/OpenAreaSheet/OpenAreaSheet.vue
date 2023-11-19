<style scoped></style>
<template>
  <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
    <!-- 操作栏 -->
    <div class="btn-container" style="margin-bottom: 15px;">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button type="default" @click="getOpenAreaData">刷新</el-button>
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
            @confirm="del(scope.row)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>
          <p v-else disable style="margin: 0;"></p>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增对话框 -->
    <AddDialog v-model:visible="addDialogVisible" :openArea="tabledata" />
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
      //加载动画
      loading: false
    }
  },
  methods: {
    //添加
    add() {
      //打开弹窗
      this.addDialogVisible = true
    },
    //删除
    del(data) {
      //计算删除后的数据
      let newData = JSON.parse(JSON.stringify(this.tabledata))
      let target = data.value
      for (let i = 0; i < newData.length; i++) {
        //判断是否是本节点
        if (newData[i].value == target) {
          //是的，删除本节点
          newData.splice(i, 1)
          break
        }
        //判断是否有子节点
        if (newData[i].children != null) {
          //有子节点，遍历子节点
          let child = newData[i].children
          for (let j = 0; j < child.length; j++) {
            //判断是否是本节点
            if (child[j].value == target) {
              //是的，删除本节点
              child.splice(j, 1)
              break
            }
          }
        }
      }
      //提交数据
      this.$http.post("/company/openarea/update", {
        newOpenArea: newData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(
        (response) => {
          //成功
          ElMessage.success("删除成功")
          //刷新数据
          this.getOpenAreaData()
        },
        (response) => {
          ElMessage.error("服务器连接失败")
        }
      )
    },
    //从服务器获取数据
    getOpenAreaData() {
      this.loading = true
      this.$http.get("/company/openarea/get").then(
        (response) => {
          if (response.data.code != 200) {
            ElMessage.error(response.data.msg)
          }
          this.tabledata = response.data.data.openArea
          //500ms后关闭加载动画
          setTimeout(() => {
            this.loading = false
          }, 500)
        },
        (response) => {
          ElMessage.error("服务器连接异常")
          this.loading = false
        }
      )
    }
  },
  watch: {
    addDialogVisible(val) {
      if (val == false)
        this.getOpenAreaData()
    }
  },
  mounted() {
    this.getOpenAreaData()
  }
}
</script>