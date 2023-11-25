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
                    <el-select v-model="search.data.state" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in sellOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品类">
                    <el-select v-model="search.data.cateId" placeholder="请选择" clearable style="width: 150px;">
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
            <el-button type="success" @click="updateSellState('1')">可售</el-button>
            <el-button type="danger" @click="updateSellState('0')">不可售</el-button>
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
            sel: "",
            //搜索栏
            search: {
                data: {
                    "id": "",
                    "name": "",
                    "state": "",
                    "cateId": ""
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
            cateOptions: []
        }
    },
    methods: {
        //搜索相关
        // 重置搜索数据
        searchReset() {
            this.search.data = {
                "id": "",
                "name": "",
                "state": "",
                "cateId": ""
            }
            this.getData()
        },
        //搜索
        searchSubmit() {
            let sData = JSON.parse(JSON.stringify(this.search.data))
            this.$http.post("/commodity/search", {
                data: sData
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }

            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.tabledata = response.data.data.commodity
                    ElMessage.success("查询成功")
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
                }
            )
        },
        //添加
        add() {
            this.addDialogVisible = true
        },
        //删除
        del(val, index) {
            //get请求
            this.$http.get("/commodity/delete?id=" + val.id).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    //成功
                    ElMessage.success("删除成功")
                    //刷新
                    this.getData()
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
                }
            )
        },
        //详情
        detail(val) {
            this.sel = val.id
            this.editDialogVisible = true
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //修改销售状态
        updateSellState(state) {
            let sData
            if (this.multipleSelection.length == 0) {
                ElMessage.error("请至少选择一项")
                return
            }
            let idList = []
            this.multipleSelection.forEach(element => {
                idList.push(element.id)
            });
            sData = {
                "idList": idList,
                "state": state
            }
            this.$http.post("/commodity/update/state", {
                data: sData
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
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
        //刷新
        refresh() {
            this.refreshLoading = true
            setTimeout(() => {
                this.getData()
            }, 500)
        },
        //从服务器获取数据
        getData() {
            this.getCommodityData()
            this.getCategoryOptions()
        },
        getCommodityData() {
            this.loading = true
            this.$http.get("/commodity/get/brief").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return false
                    }
                    this.tabledata = response.data.data.commodity
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
        getCategoryOptions() {
            this.$http.get("/category/get/option/select").then(
                (response) => {
                    if (response.data.code != 200) {
                        return
                    }
                    this.cateOptions = response.data.data.category
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