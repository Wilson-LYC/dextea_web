<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 搜索栏 -->
        <div>
            <el-form :inline="true" :model="search.form" :rules="search.rules">
                <el-form-item label="订单ID" prop="id">
                    <el-input v-model="search.form.id" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="门店">
                    <el-select v-model="search.form.storeId" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in storeOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顾客">
                    <el-input v-model="search.form.custName" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="search.form.phone" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="取餐号">
                    <el-input v-model="search.form.code" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="制作进度">
                    <el-select v-model="search.form.state" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in orderStateOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker v-model="search.form.time" type="daterange" range-separator="To" start-placeholder="Start date"
                        end-placeholder="End date" :size="size" />
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
            <el-table-column prop="storeName" label="门店" width="200" :show-overflow-tooltip="true" />
            <el-table-column prop="custName" label="顾客" width="150" :show-overflow-tooltip="true" />
            <el-table-column prop="code" label="取餐号" width="100" :show-overflow-tooltip="true" />
            <el-table-column label="订单进度" width="80" align="center">
                <template #default="scope">
                    <el-tag type="info" effect="light" round v-if="scope.row.state === '1'">
                        已下单
                    </el-tag>
                    <el-tag type="warning" effect="light" round v-else-if="scope.row.state === '2'">
                        制作中
                    </el-tag>
                    <el-tag effect="light" round v-else-if="scope.row.state === '3'">
                        待取茶
                    </el-tag>
                    <el-tag type="success" effect="light" round v-else-if="scope.row.state === '4'">
                        已完成
                    </el-tag>
                    <el-tag type="danger" effect="light" round v-else-if="scope.row.state === '0'">
                        退单
                    </el-tag>
                    <el-tag type="danger" effect="light" round v-else>
                        未知
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="商品" width="300" align="center">
                <template #default="scope">
                    <el-scrollbar height="80">
                        <div style="text-align: left;">
                            <p v-for="i in scope.row.commodity" style="padding: 0;margin: 0;">{{ i.name }}（￥{{ i.price }}） ×
                                {{ i.num }} </p>
                        </div>
                    </el-scrollbar>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="总消费(元)" width="100" :show-overflow-tooltip="true" />
            <el-table-column prop="num" label="总数量" width="100" :show-overflow-tooltip="true" />
            <el-table-column prop="phone" label="联系方式" width="250" :show-overflow-tooltip="true" />
            <el-table-column prop="createtime" label="下单时间" width="250" :show-overflow-tooltip="true" />
            <!-- 行内操作栏 -->
            <el-table-column fixed="right" label="操作" align="center" width="200">
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
        <EditDialog v-model:visible="editDialogVisible" :order="sel" />
    </div>
</template>

<script>
import EditDialog from '@/components/OrderComponents/EditOrderDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    components: {
        EditDialog
    },
    data() {
        return {
            //表格数据
            tabledata: [{
                "id": 1,
                "name": "wilson",
                "phone": "123456"
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
                    "storeId": "",
                    "custName": "",
                    "code": "",
                    "state": "",
                    "phone": ""
                },
                rules: {
                    id: [{
                        pattern: /^[-]?\d+(\.\d+)?$/,
                        trigger: ['blur', 'change'],
                        message: '请输入数字'
                    }],
                },
            },
            //门店
            storeOptions: [],
            //订单状态选项
            orderStateOptions: [{
                value: "1",
                label: "已下单"
            }, {
                value: "2",
                label: "制作中"
            }, {
                value: "3",
                label: "待取茶"
            }, {
                value: "4",
                label: "已完成"
            }, {
                value: "0",
                label: "退单"
            }]
        }
    },
    methods: {
        //搜索相关
        // 重置搜索数据
        searchReset() {
            this.search.form = {
                "id": "",
                "storeId": "",
                "custName": "",
                "code": "",
                "state": "",
                "phone": "",
                "time":""
            }
            this.getData()
        },
        //搜索
        searchSubmit() {
            console.log(this.search.form)
            this.searchLoading = true
            setTimeout(() => {
                this.$http.post("/v1/manage/order/search", {
                    data: this.search.form
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    (response) => {
                        console.log(response.data)
                        if (response.data.code != 200) {
                            ElMessage.error("查询失败")
                            return
                        }
                        this.tabledata = response.data.data.order
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
        del(store) {
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
        //从服务器获取数据
        getData() {
            this.tableLoading = true
            this.getOrder()
            this.getStoreOption()
        },
        //获取所有订单
        getOrder() {
            this.$http.get("/v1/manage/order/list").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        this.tableLoading = false
                        this.refreshLoading = false
                        return
                    }
                    this.tabledata = response.data.data.order
                    this.tableLoading = false
                    if (this.refreshLoading)
                        ElMessage.success("刷新成功")
                    this.refreshLoading = false
                }
            )
        },
        getStoreOption() {
            //get请求
            this.$http.get("/v1/manage/store/option/select").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.storeOptions = response.data.data.stores
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