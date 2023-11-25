<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 操作栏 -->
        <div class="btn-container" style="margin-bottom: 15px;">
            <el-button type="primary" @click="add">新增</el-button>
            <el-button type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>

        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border height="550px" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column prop="name" label="品类" min-width="80" :show-overflow-tooltip="true" />
            <el-table-column prop="num" label="商品数量" min-width="80" :show-overflow-tooltip="true" />
            <!-- 行内操作栏 -->
            <el-table-column fixed="right" label="操作" min-width="200" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="detail(scope.row)">详情</el-button>
                    <el-popconfirm width="100" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
                        icon-color="#626AEF" title="确定删除?" @confirm="del(scope.row, scope.$index)">
                        <template #reference>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 对话框 -->
        <!-- 新增对话框 -->
        <AddDialog v-model:visible="addDialogVisible" />
        <EditDialog v-model:visible="editDialogVisible" :category="editSelect" />
    </div>
</template>

<script>
import AddDialog from './AddCategoryDialog.vue'
import EditDialog from './EditCategoryDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    components: {
        AddDialog,
        EditDialog
    },
    data() {
        return {
            //表格数据
            tabledata: [
                {
                    id: "",
                    name: "新品上市",
                    num: "1"
                }
            ],
            //表格加载动画
            tableLoading: false,
            //刷新按钮动画
            refreshLoading: false,
            //“新增”对话框可见性
            addDialogVisible: false,
            //“编辑”对话框可见性
            editDialogVisible: false,
            editSelect: {}
        }
    },
    methods: {
        //添加
        add() {
            this.addDialogVisible = true
        },
        //删除
        del(val, index) {
        },
        //详情
        detail(val) {
            this.editSelect = val
            this.editDialogVisible = true
        },
        refresh() {
            this.refreshLoading = true
            setTimeout(() => {
                this.getData()
            }, 500)
        },
        //从服务器获取数据
        getData() {
            this.getCategoryData()
        },
        //获取品类数据
        getCategoryData() {
            this.loading = true
            this.$http.get("/company/category/get/all").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return false
                    }
                    this.tabledata = response.data.data.category
                    this.tableLoading = false
                    this.refreshLoading = false
                    return true

                },
                (response) => {
                    setTimeout(() => {
                        this.tableLoading = false
                        this.refreshLoading = false
                        ElMessage.error("服务器连接异常")
                        return false
                    }, 1000)
                }
            )
        }
    },
    watch: {
        addDialogVisible(val) {
            if (val == false)
                this.getData()
        },
        editDialogVisible(val) {
            if (val == false)
                this.getData()
        }
    },
    mounted() {
        this.getData()
    }
}
</script>