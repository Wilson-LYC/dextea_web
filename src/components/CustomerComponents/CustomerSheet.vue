<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 搜索栏 -->
        <div>
            <el-form :inline="true" :model="search.form" :rules="search.rules">
                <el-form-item label="顾客ID" prop="id">
                    <el-input v-model="search.form.id" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="search.form.name" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="search.form.phone" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchSubmit" :loading="searchLoading">查询</el-button>
                    <el-button type="default" @click="searchReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 操作栏 -->
        <div class="btn-container" style="margin-bottom: 15px;">
            <el-button type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>

        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border height="550px" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="id" label="顾客ID" width="100" fixed="left" sortable />
            <el-table-column prop="name" label="昵称" :show-overflow-tooltip="true" />
            <el-table-column prop="phone" label="电话" :show-overflow-tooltip="true" />
            <el-table-column prop="createtime" label="注册时间" :show-overflow-tooltip="true" sortable width="300"/>
            <!-- 行内操作栏 -->
            <el-table-column fixed="right" label="操作" align="center" width="200">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="detail(scope.row)">详情</el-button>
                    <el-popconfirm width="100" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
                        icon-color="#626AEF" title="确定删除?" @confirm="del(scope.row, scope.$index)">
                        <template #reference>
                            <el-button type="danger" size="small">注销</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 对话框 -->
        <EditDialog v-model:visible="editDialogVisible" :customer="sel" />
    </div>
</template>

<script>
import EditDialog from '@/components/CustomerComponents/EditCustomerDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    components: {
        EditDialog
    },
    data() {
        return {
            //表格数据
            tabledata: [],
            //表格加载动画
            tableLoading: false,
            //刷新按钮加载动画
            refreshLoading: false,
            //搜索动画
            searchLoading: false,
            //被选中的行
            multipleSelection: [],
            //“新增”对话框可见性
            addDialogVisible: false,
            //编辑对话框可见性
            editDialogVisible: false,
            //搜索栏
            search: {
                form: {
                    "id": "",
                    "name": "",
                    "phone": "",
                },
                rules: {
                    id: [{
                        pattern: /^[-]?\d+(\.\d+)?$/,
                        trigger: ['blur', 'change'],
                        message: '请输入数字'
                    }],
                },
            }
        }
    },
    methods: {
        //搜索相关
        // 重置搜索数据
        searchReset() {
            this.search.form = {
                "id": "",
                "name": "",
                "phone": ""
            }
            this.getData()
        },
        //搜索
        searchSubmit() {
            this.searchLoading = true
            setTimeout(() => {
                this.$http.post("/v1/manage/customer/search", {
                    data: this.search.form
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    (response) => {
                        if (response.data.code != 200) {
                            ElMessage.error("查询失败")
                            return
                        }
                        this.tabledata = response.data.data.stores
                        ElMessage.success("查询成功")
                    }
                )
                this.searchLoading = false
            }, 500)
        },
        //表格相关
        //添加
        add() {
            this.addDialogVisible = true
        },
        //删除
        del(val) {
            //get请求
            this.$http.get("/v1/manage/customer/delete?id=" + val.id).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    ElMessage.success("删除成功")
                    this.getData()
                }
            )
        },
        //详情
        detail(data) {
            this.sel = data
            this.editDialogVisible = true
        },
        //刷新
        refresh() {
            this.refreshLoading = true
            //500ms后刷新
            setTimeout(() => {
                this.getData()
            }, 500)
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //更新营业状态
        updateOpenState(state) {
            if (this.multipleSelection.length == 0) {
                ElMessage.error("请至少选择一项")
                return
            }
            let idList = []
            this.multipleSelection.forEach(element => {
                idList.push(element.id)
            });
            let json = {
                "storeIdList": idList,
                "openState": state
            }
            //提交数据
            this.$http.post("/store/update/openstate/multiple", {
                data: json
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code !== 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    //成功
                    ElMessage.success("修改成功")
                    //刷新
                    this.getData()
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
                }
            )
        },
        //从服务器获取数据
        getData() {
            this.getCustomer()
        },
        //获取所有门店
        getCustomer() {
            this.$http.get("/v1/manage/customer/list").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        this.tableLoading = false
                        this.refreshLoading = false
                        return
                    }
                    this.tabledata = response.data.data.customers
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