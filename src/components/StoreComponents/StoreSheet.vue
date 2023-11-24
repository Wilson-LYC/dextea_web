<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 搜索栏 -->
        <div>
            <el-form :inline="true" :model="search.form" :rules="search.rules">
                <el-form-item label="门店ID" prop="id">
                    <el-input v-model="search.form.id" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="门店名称">
                    <el-input v-model="search.form.name" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="search.form.phone" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="search.form.openState" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in openStateOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所在区域">
                    <el-cascader v-model="search.form.area" clearable style="width: 150px;" :options="areaOptions"
                        placeholder="请选择">
                    </el-cascader>
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
            <el-button type="success" @click="updateOpenState('1')">营业</el-button>
            <el-button type="danger" @click="updateOpenState('2')">闭店</el-button>
            <el-button type="info" @click="updateOpenState('0')">未开业</el-button>
            <el-button type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>

        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border height="550px" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="id" label="门店ID" min-width="80" fixed="left" sortable />
            <el-table-column prop="name" label="门店名称" min-width="200" :show-overflow-tooltip="true" />
            <el-table-column label="状态" width="80" align="center">
                <template #default="scope">
                    <el-tag type="success" effect="plain" round v-if="scope.row.openState === '1'">
                        营业
                    </el-tag>
                    <el-tag type="danger" effect="plain" round v-else-if="scope.row.openState === '2'">
                        闭店
                    </el-tag>
                    <el-tag type="info" effect="plain" round v-else>
                        未开业
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="area" label="所在区域" min-width="100" :show-overflow-tooltip="true" />
            <el-table-column prop="address" label="地址" min-width="300" :show-overflow-tooltip="true" />
            <el-table-column prop="phone" label="联系方式" min-width="100" :show-overflow-tooltip="true" />
            <el-table-column prop="openTime" label="营业时间" min-width="200" :show-overflow-tooltip="true" />
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
        <AddDialog v-model:visible="addDialogVisible" :openArea="areaOptions" />
    </div>
</template>

<script>
import AddDialog from './AddShopDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    components: {
        AddDialog
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
            },
            //选项
            areaOptions: [],
            //营业状态
            openStateOptions: [{
                "value": "0",
                "label": "未开业"
            },
            {
                "value": "1",
                "label": "营业中"
            },
            {
                "value": "2",
                "label": "休息中"
            }],
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
                this.$http.post("/company/store/search", {
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
            this.$http.get("/company/store/delete?id=" + store.id).then(
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
            this.$router.push({
                path: '/company/store/detail/' + data.id,
            })
        },
        //刷新
        refresh() {
            this.refreshLoading = true
            //500ms后刷新
            let res
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
            let idList = []
            this.multipleSelection.forEach(element => {
                idList.push(element.id)
            });
            let json = {
                "storeIdList": idList,
                "openState": state
            }
            //提交数据
            this.$http.post("/company/store/update/openstate/v2", {
                data: json
            }, {
                headers: {
                    'Content-Type': 'application/json'
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
        getStoreDate() {
            this.tableLoading = true
            this.$http.get("/company/store/get/all").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return false
                    }
                    this.tabledata = response.data.data.stores
                    this.areaOptions = response.data.data.openArea
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
        getOpenAreaOption(){
            this.$http.get("/company/openarea/option").then(
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
        //监听“新增”对话框可见性
        addDialogVisible(val) {
            //关闭时刷新数据
            if (val == false)
                this.getData()
        }
    },
    mounted() {
        this.getData()
    }
}
</script>