<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 搜索栏 -->
        <div>
            <el-form :inline="true" :model="search.data" :rules="search.rules">
                <el-form-item label="员工ID" prop="id">
                    <el-input v-model="search.data.id" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="search.data.account" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="search.data.name" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="账号类型">
                    <el-select v-model="search.data.role" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属门店">
                    <el-select v-model="search.data.storeId" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in storeOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchSubmit" :loading="searchLoading">查询</el-button>
                    <el-button type="default" @click="searchReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

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
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="id" label="员工ID" min-width="80" fixed="left" sortable />
            <el-table-column prop="name" label="昵称" min-width="80" :show-overflow-tooltip="true" />
            <el-table-column prop="account" label="账号" min-width="80" :show-overflow-tooltip="true" />
            <el-table-column label="账号类型" width="80" align="center">
                <template #default="scope">
                    <el-tag type="danger" effect="light" round v-if="scope.row.role === '0'">
                        超级管理员
                    </el-tag>
                    <el-tag type="success" effect="light" round v-else-if="scope.row.role === '1'">
                        公司账号
                    </el-tag>
                    <el-tag type="" effect="light" round v-else-if="scope.row.role === '2'">
                        门店账号
                    </el-tag>
                    <el-tag type="info" effect="light" round v-else>
                        未指定
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="所属门店" min-width="150" :show-overflow-tooltip="true" />
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
        <EditDialog v-model:visible="editDialogVisible" :staff="cStaff" />
    </div>
</template>

<script>
import AddDialog from './AddStaffDialog.vue'
import EditDialog from './EditStaffDialog.vue'
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
            //选择查看的员工
            cStaff: {},
            //搜索栏
            search: {
                data: {
                    "id": "",
                    "name": "",
                    "role": "",
                    "storeId": "",
                    "account": ""
                },
                rules: {
                    id: [{
                        pattern: /^[-]?\d+(\.\d+)?$/,
                        trigger: ['blur', 'change'],
                        message: '请输入数字'
                    }],
                },
            },
            //选项
            //账号类别
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
            //门店
            storeOptions: [],
        }
    },
    methods: {
        //搜索相关
        // 重置搜索数据
        searchReset() {
            this.search.data = {
                "id": "",
                "name": "",
                "role": "",
                "storeId": "",
                "account": ""
            }
            this.getStaffData()
        },
        //搜索
        searchSubmit() {
            this.searchLoading = true
            setTimeout(() => {
                this.$http.post("/staff/search", {
                    data: this.search.data
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': sessionStorage.getItem('token')
                    }
                }).then(
                    (response) => {
                        if (response.data.code != 200) {
                            ElMessage.error("查询失败")
                            return
                        }
                        this.tabledata = response.data.data.staff
                        ElMessage.success("查询成功")
                    },
                    (response) => {
                        ElMessage.error("服务器连接失败")
                    }
                )
                this.searchLoading = false
            }, 500)
        },
        //添加
        add() {
            this.addDialogVisible = true
        },
        //删除
        del(val, index) {
            //get请求
            this.$http.get("/staff/delete?id=" + val.id,{
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    //成功
                    ElMessage.success("删除成功")
                    //刷新
                    this.getStaffData()
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
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
            this.getStaffData()
            this.getStoreOption()
        },
        getStaffData() {
            this.loading = true
            this.$http.get("/staff/get/all",{
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return false
                    }
                    this.tabledata = response.data.data.staff
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
        },
        getStoreOption() {
            //get请求
            this.$http.get("/store/get/option/select",{
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.storeOptions = response.data.data.stores
                },
                (response) => {
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