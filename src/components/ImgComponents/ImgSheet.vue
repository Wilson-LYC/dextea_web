<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 操作栏 -->
        <div class="btn-container" style="margin-bottom: 15px;">
            <el-button type="primary" @click="add">上传</el-button>
            <el-button type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>

        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border height="550px" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="id" label="图片ID" width="100" fixed="left" sortable />
            <el-table-column label="图片">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-image :src="scope.row.url" style="height: 80px;" @click="detail(scope.row)" />
                    </div>
                </template>
            </el-table-column>
            <!-- 行内操作栏 -->
            <el-table-column fixed="right" label="操作" width="80" align="center">
                <template #default="scope">
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
        <EditDialog v-model:visible="editDialogVisible" :url="cimg" />
    </div>
</template>

<script>
import AddDialog from '@/components/ImgComponents/AddImgDialog.vue'
import EditDialog from '@/components/ImgComponents/EditImgDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    components: {
        AddDialog,
        EditDialog
    },
    data() {
        return {
            //表格数据
            tabledata: [],
            //加载动画
            tableLoading: false,
            //刷新按钮动画
            refreshLoading: false,
            //搜索动画
            searchLoading: false,
            //被选中的行
            multipleSelection: [],
            //“新增”对话框可见性
            addDialogVisible: false,
            //“编辑”对话框可见性
            editDialogVisible: false,
            cimg: ""
        }
    },
    methods: {
        //添加
        add() {
            this.addDialogVisible = true
        },
        //删除
        del(val) {
            let sData = {
                "url": val.url
            }
            this.$http.post("/v1/manage/img/delete", {
                data: sData
            }, {
                headers: {
                    "content-type": "application/json"
                }
            }).then(
                (response) => {
                    if (response.data.code !== 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    ElMessage.success("删除成功")
                    this.getData()
                }
            )
        },
        //详情
        detail(val) {
            this.cimg = val.url
            this.editDialogVisible = true
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        refresh() {
            this.refreshLoading = true
            setTimeout(() => {
                this.getData()
            }, 500)
        },
        //从服务器获取数据
        getData() {
            this.tableLoading = true
            this.getImgData()
        },
        getImgData() {
            this.$http.get("/v1/manage/img/list").then(
                (response) => {
                    if (response.data.code != 200) {
                        this.tableLoading = false
                        this.refreshLoading = false
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.tabledata = response.data.data.img
                    this.tableLoading = false
                    if (this.refreshLoading)
                        ElMessage.success("刷新成功")
                    this.refreshLoading = false
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