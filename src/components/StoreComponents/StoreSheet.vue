<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 搜索栏 -->
        <div v-if="searchVisible">
            <el-form :inline="true" :model="search.form" :rules="search.rules" :size="size">
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
        <div class="btn-container" style="margin-bottom: 15px;" v-if="btnVisible">
            <el-button :size="size" type="primary" @click="add">新增</el-button>
            <el-button :size="size" type="success" @click="updateOpenState('1')">营业</el-button>
            <el-button :size="size" type="danger" @click="updateOpenState('2')">闭店</el-button>
            <el-button :size="size" type="info" @click="updateOpenState('0')">未开业</el-button>
            <el-button :size="size" type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>

        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border :height="height" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading" :size="size">
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
            <el-table-column fixed="right" label="操作" min-width="200" align="center" v-if="rowBtnVisible">
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
        <EditDialog v-model:visible="editDialogVisible" :store="sel" :openArea="areaOptions"/>
    </div>
</template>

<script>
import AddDialog from '@/components/StoreComponents/AddStoreDialog.vue'
import EditDialog from '@/components/StoreComponents/EditStoreDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    props: {
        //搜索栏是否可见
        searchVisible: {
            type: Boolean,
            default: true
        },
        //操作栏是否可见
        btnVisible: {
            type: Boolean,
            default: true
        },
        //行内操作栏是否可见
        rowBtnVisible: {
            type: Boolean,
            default: true
        },
        //表格高度
        height: {
            type: String,
            default: "550px"
        },
        //大小
        size: {
            type: String,
            default: "default"
        },
    },
    components: {
        AddDialog,
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
            //选择的门店
            sel: "",
            //搜索栏数据
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
                }
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
                this.$http.post("/v1/manage/store/search", {
                    data: this.search.form
                }, {
                    headers: {
                        'Content-Type': 'application/json',
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
        del(store) {
            //get请求
            this.$http.get("/v1/manage/store/delete?id=" + store.id).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    //成功
                    ElMessage.success("删除成功")
                    //刷新
                    this.getData()
                }
            )
        },
        //详情
        detail(data) {
            this.sel = data
            this.editDialogVisible = true
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //更新营业状态
        updateOpenState(state) {
            //判断是否选择了门店
            if (this.multipleSelection.length == 0) {
                ElMessage.warning("至少选择一个门店")
                return
            }
            //获取id列表
            let idList = []
            this.multipleSelection.forEach(element => {
                idList.push(element.id)
            });
            //构造json
            let json = {
                "list": idList,
                "openState": state
            }
            //提交数据
            this.$http.post("/v1/manage/store/update/openstate/multiple", {
                data: json
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(
                    (response) => {
                        if (response.data.code !== 200) {
                            ElMessage.error(response.data.msg)
                            return
                        }
                        //成功
                        ElMessage.success("修改成功")
                        //刷新
                        this.getData()
                    }
                )
                .error(
                    (error) => {
                        ElMessage.error("服务器连接失败")
                    }
                )
        },
        //刷新
        refresh() {
            this.refreshLoading = true
            //500ms后刷新
            setTimeout(() => {
                this.getData()
            }, 500)
        },
        //从服务器获取数据
        getData() {
            this.tableLoading = true
            this.getStore()
            this.getOpenAreaOption()
        },
        //获取所有门店
        getStore() {
            this.$http.get("/v1/manage/store/all")
                .then(
                    (response) => {
                        if (response.data.code != 200) {
                            ElMessage.error(response.data.msg)
                            this.tableLoading = false
                            this.refreshLoading = false
                            return
                        }
                        this.tabledata = response.data.data.stores
                        this.tableLoading = false
                        if (this.refreshLoading)
                            ElMessage.success("刷新成功")
                        this.refreshLoading = false
                        return
                    }
                )
        },
        //获取营业区域选项
        getOpenAreaOption() {
            this.$http.get("/openarea/get/option")
                .then(
                    (response) => {
                        if (response.data.code != 200) {
                            return
                        }
                        this.areaOptions = response.data.data.openArea
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