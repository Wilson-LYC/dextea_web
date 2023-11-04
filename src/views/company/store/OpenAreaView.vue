<style scoped></style>
<template>
  <!-- 操作栏 -->
  <div class="btn-container" style="margin-bottom: 15px;">
    <el-button type="primary" @click="add" :icon="icons.Plus">新增</el-button>
    <el-button type="danger" :icon="icons.Delete">批量删除</el-button>
    <el-button type="primary" :icon="icons.Refresh">刷新</el-button>
  </div>
  <!-- 表格主体 -->
  <el-table :data="tabledata" style="width: 100%" border height="600px" table-layout="auto"
    @selection-change="handleSelectionChange" row-key="value">
    <template #empty>无数据</template>
    <!-- 数据部分 -->
    <el-table-column prop="value" label="区域" width="300" />
    <el-table-column prop="num" label="门店数量" />
    <!-- 行内操作栏 -->
    <el-table-column fixed="right" label="操作" width="100" align="center">
      <template #default="scope">
        <!-- <el-button type="danger" size="small" @click="del(scope.row, scope.$index)">删除</el-button> -->
        <!-- 没有子节点才能删除 -->
        <el-button type="danger" size="small" @click="add(scope.row, scope.$index)"
          v-if="scope.row.children.length == 0" :icon="icons.Delete">删除</el-button>
        <p v-else disable style="margin: 0;">无操作</p>
      </template>
    </el-table-column>
  </el-table>
  <!-- 新增对话框 -->
  <AddDialog v-model:visible="dialog.add" :superior="tabledata" v-model:isChange="isChange" />
</template>

<script>
import { ElMessage } from 'element-plus'
import AddDialog from '@/components/company/store/area/addDialog.vue'
import { Plus,Delete,Refresh } from '@element-plus/icons-vue'
export default {
  components: {
    AddDialog
  },
  data() {
    return {
      //图标
      icons: {
        Plus,
        Delete,
        Refresh
      },
      //表格数据
      tabledata: [
        {
          "label": "浙江省",
          "value": "浙江省",
          "num": 6,
          children: [
            {
              "label": "杭州市",
              "value": "杭州市",
              "num": 3,
              children: []
            },
            {
              "label": "宁波市",
              "value": "宁波市",
              "num": 2,
              children: []
            },
            {
              "label": "温州市",
              "value": "温州市",
              "num": 1,
              children: []
            }
          ]
        },
        {
          "label": "广东省",
          "value": "广东省",
          "num": 18,
          children: [
            {
              "label": "广州市",
              "value": "广州市",
              "num": 3,
              children: []
            },
            {
              "label": "深圳市",
              "value": "深圳市",
              "num": 10,
              children: []
            },
            {
              "label": "东莞市",
              "value": "东莞市",
              "num": 3,
              children: []
            },
            {
              "label": "韶关市",
              "value": "韶关市",
              "num": 2,
              children: []
            },
          ]
        },
        {
          "label": "北京市",
          "value": "北京市",
          "num": 0,
          children: []
        }
      ],
      //对话框参数
      dialog: {
        add: false,
      },
      //被选中的数据
      multipleSelection: [
      ],
      isChange: false,
    }
  },
  methods: {
    //添加
    add() {
      this.dialog.add = true
    },
    //删除
    del(data, index) {
      //console.log(data)
      //console.log(index)
      this.tabledata.splice(index, 1);//删除当前索引指定的行
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection)
    },
    //编辑
    edit(data) {
      this.dialog.edit.data = data
      this.dialog.edit.see = true
    },
  },
  watch: {
    isChange() {
      ElMessage("数据更新")
    }
  }
}
</script>