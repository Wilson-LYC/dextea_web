<style scoped>
.container {
    background: #ffffff;
    border-radius: 8px;
    padding: 20px;
    height:calc(100% - 40px);
}
.mytable{
    height: calc(100% - 50px);
}
</style>
<template>
    <div class="container">
        <!-- 操作栏 -->
        <div class="btn-container" style="height: 50px;">
            <el-button :size="size" type="primary" @click="add">新增</el-button>
            <el-button :size="size" type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>
        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading" :size="size" class="mytable">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="id" label="员工ID" min-width="80" fixed="left" sortable />
            <el-table-column prop="name" label="昵称" min-width="150" :show-overflow-tooltip="true" />
            <el-table-column prop="account" label="账号" min-width="80" :show-overflow-tooltip="true" />
            <!-- 行内操作栏 -->
            <el-table-column label="操作" min-width="200" align="center">
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
        <AddDialog v-model:visible="addDialogVisible" :sid="sid" />
        <EditDialog v-model:visible="editDialogVisible" :staff="cStaff" />
    </div>
</template>

<script>
import AddDialog from '@/components/StaffComponents/AddStaffDialogForStore.vue'
import EditDialog from '@/components/StaffComponents/EditStaffDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    props: {
        size: {
            type: String,
            default: 'default'
        }
    },
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
                    account: "",
                    role: "",
                    storeId: [],
                    storeName: ""
                }
            ],
            //加载动画
            tableLoading: false,
            //刷新按钮动画
            refreshLoading: false,
            //被选中的行
            multipleSelection: [],
            //“新增”对话框可见性
            addDialogVisible: false,
            //“编辑”对话框可见性
            editDialogVisible: false,
            //选择查看的员工
            cStaff: {},
            //选项
            //营业区域
            areaOptions: [],
            //营业状态
            roleOptions: [{
                "value": "0",
                "label": "超级管理员"
            },
            {
                "value": "1",
                "label": "公司账号"
            },
            {
                "value": "2",
                "label": "门店账号"
            }],
            sid: ""
        }
    },
    methods: {
        //添加
        add() {
            this.sid = sessionStorage.getItem("storeId")
            this.addDialogVisible = true
        },
        //删除
        del(val, index) {
            //get请求
            this.$http.get("/v1/manage/staff/delete?id=" + val.id).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    //成功
                    ElMessage.success("删除成功")
                    //刷新
                    this.getStaffData()
                }
            )
        },
        //详情
        detail(val) {
            this.cStaff = JSON.parse(JSON.stringify(val))
            this.cStaff.password = ""
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
            this.getStaffData()
        },
        getStaffData() {
            this.$http.get("/v1/manage/staff/samestore?id=" + this.sid).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        this.tableLoading = false
                        this.refreshLoading = false
                        return
                    }
                    this.tabledata = response.data.data.staff
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
                this.getStaffData()
        },
        editDialogVisible(val) {
            if (val == false)
                this.getStaffData()
        },
    },
    mounted() {
        this.sid = sessionStorage.getItem("storeId")
        this.getStaffData()
    }
}
</script>