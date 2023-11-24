<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 搜索栏 -->
        <div>
            <el-form :inline="true" :model="search.data" :rules="search.rules">
                <el-form-item label="商品ID" prop="id">
                    <el-input v-model="search.data.id" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="search.data.name" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="销售状态">
                    <el-select v-model="search.data.role" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in sellOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品类">
                    <el-select v-model="search.data.category" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in cateOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchSubmit">查询</el-button>
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
            <el-table-column prop="id" label="商品ID" min-width="80" fixed="left" sortable />
            <el-table-column prop="name" label="名称" min-width="80" :show-overflow-tooltip="true" />
            <el-table-column label="销售状态" min-width="80" align="center">
                <template #default="scope">
                    <el-tag type="danger" effect="light" round v-if="scope.row.state == '0'">
                        不可售
                    </el-tag>
                    <el-tag type="success" effect="light" round v-else-if="scope.row.state === '1'">
                        可售
                    </el-tag>
                    <el-tag type="info" effect="light" round v-else>
                        未知
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="基础售价(元)" min-width="80" :show-overflow-tooltip="true" />
            <el-table-column prop="category" label="品类" min-width="80" :show-overflow-tooltip="true" />
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
        <EditDialog v-model:visible="editDialogVisible" :commId="sel" />
    </div>
</template>

<script>
import AddDialog from './AddCommodityDialog.vue'
import EditDialog from './EditCommodityDialog.vue'
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
            //被选中的行
            multipleSelection: [],
            //“新增”对话框可见性
            addDialogVisible: false,
            //“编辑”对话框可见性
            editDialogVisible: false,
            sel:"",
            //搜索栏
            search: {
                data: {
                    "id": "",
                    "name": "",
                    "role": "",
                    "storeName": ""
                },
                rules: {
                    id: [{
                        pattern: /^[-]?\d+(\.\d+)?$/,
                        trigger: ['blur', 'change'],
                        message: '请输入数字'
                    }],
                },
            },
            sellOptions: [{
                "value": "0",
                "label": "不可售"
            },
            {
                "value": "1",
                "label": "可售"
            }],
            cateOptions:[]
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
                "storeName": ""
            }
        },
        //搜索
        searchSubmit() {
            ElMessage("搜索")
            console.log(this.search.data)
        },
        //添加
        add() {
            this.addDialogVisible = true
        },
        //删除
        del(val, index) {
            //get请求
            this.$http.get("/company/staff/delete?id=" + val.id).then(
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
            this.sel=val.id
            this.editDialogVisible = true
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //从服务器获取数据
        getData() {
            this.loading = true
            this.$http.get("/company/commodity/commcate").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return false
                    }
                    this.tabledata = response.data.data.commodity
                    this.cateOptions = response.data.data.category
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
        refresh() {
            let res
            this.refreshLoading = true
            setTimeout(() => {
                res = this.getData()
                if (res == false) {
                    ElMessage.error("刷新失败")
                } else {
                    ElMessage.success("刷新成功")
                }
            }, 500)
        }
    },
    watch: {
        addDialogVisible(val) {
            if (val == false)
                this.getData()
        }
    },
    mounted() {
        this.getData()
    }
}
</script>