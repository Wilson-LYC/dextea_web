<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 搜索栏 -->
        <div>
            <el-form :inline="true" :model="search.form" :rules="search.rules">
                <el-form-item label="订单ID" prop="id">
                    <el-input v-model="search.form.id" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="search.form.name" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="联系方式">
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
            <el-table-column prop="id" label="订单ID" width="100" fixed="left" sortable />
            <el-table-column prop="commodity" label="商品列表" width="200" :show-overflow-tooltip="true" />
            <el-table-column label="状态" width="80" align="center">
                <template #default="scope">
                    <el-tag type="success" effect="plain" round v-if="scope.row.openState === '1'">
                        已下单
                    </el-tag>
                    <el-tag type="danger" effect="plain" round v-else-if="scope.row.openState === '2'">
                        制作中
                    </el-tag>
                    <el-tag type="info" effect="plain" round v-else-if="scope.row.openState === '3'">
                        可取茶
                    </el-tag>
                    <el-tag type="info" effect="plain" round v-else-if="scope.row.openState === '4'">
                        已完成
                    </el-tag>
                    <el-tag type="info" effect="plain" round v-else>
                        未知
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="总消费(元)" width="300" :show-overflow-tooltip="true" />
            <el-table-column prop="totalNum" label="总数量" width="300" :show-overflow-tooltip="true" />
            <el-table-column prop="custPhone" label="顾客联系方式" width="300" :show-overflow-tooltip="true" />
            <el-table-column prop="orderTime" label="下单时间" width="300" :show-overflow-tooltip="true" />
            <!-- 行内操作栏 -->
            <el-table-column fixed="right" label="操作" align="center">
                <template #default="scope">
                    <!-- <el-button type="primary" size="small" @click="detail(scope.row)">详情</el-button> -->
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
        <!-- <AddDialog v-model:visible="addDialogVisible" :openArea="areaOptions" />
        <EditDialog v-model:visible="editDialogVisible" :store="sel" :openArea="areaOptions" /> -->
    </div>
</template>

<script>
// import AddDialog from '@/components/StoreComponents/AddStoreDialog.vue'
// import EditDialog from '@/components/StoreComponents/EditStoreDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    components: {
        // AddDialog,
        // EditDialog
    },
    data() {
        return {
            //表格数据
            tabledata: [{
                "id":1,
                "name":"wilson",
                "phone":"123456"
            }],
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
                    "openState": "",
                    "area": [],
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
                "phone": "",
                "openState": "",
                "area": []
            }
            this.getData()
        },
        //搜索
        searchSubmit() {
            this.searchLoading = true
            setTimeout(() => {
                this.$http.post("/store/search", {
                    data: this.search.form
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
                        this.tabledata = response.data.data.stores
                        ElMessage.success("查询成功")
                    },
                    (response) => {
                        ElMessage.error("服务器连接失败")
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
        del(store, index) {
            //get请求
            this.$http.get("/store/delete?id=" + store.id, {
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
                    this.getData()
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
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
            this.getStoreDate()
            this.getOpenAreaOption()
        },
        //获取所有门店
        getStoreDate() {
            this.tableLoading = true
            this.$http.get("/store/get/all",{
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return false
                    }
                    this.tabledata = response.data.data.stores
                    this.tableLoading = false
                    this.refreshLoading = false
                    return true
                },
                (response) => {
                    //通过延长加载时间，体现服务器异常
                    setTimeout(() => {
                        this.tableLoading = false
                        this.refreshLoading = false
                        ElMessage.error("服务器连接异常")
                        return false
                    }, 1000)
                }
            )
        },
        //获取营业区域选项
        getOpenAreaOption() {
            this.$http.get("/openarea/get/option", {
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        return
                    }
                    this.areaOptions = response.data.data.openArea
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
        // this.getData()
    }
}
</script>