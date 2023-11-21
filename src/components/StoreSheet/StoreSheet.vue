<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 搜索栏 -->
        <div>
            <el-form :inline="true" :model="search.data" :rules="search.rules">
                <el-form-item label="门店ID" prop="id">
                    <el-input v-model="search.data.id" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="门店名称">
                    <el-input v-model="search.data.name" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="search.data.phone" clearable style="width: 150px;" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="search.data.openState" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="(item, index) in openStateOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所在区域">
                    <el-cascader v-model="search.data.openArea" clearable style="width: 150px;" :options="areaOptions"
                        placeholder="请选择">
                    </el-cascader>
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
            <el-button type="success" @click="updateOpenState('1')">营业</el-button>
            <el-button type="danger" @click="updateOpenState('2')">闭店</el-button>
            <el-button type="info" @click="updateOpenState('0')">未开业</el-button>
            <el-button type="default" @click="getData">刷新</el-button>
        </div>

        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border height="550px" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="loading">
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
            <el-table-column label="所在区域" min-width="100" :show-overflow-tooltip="true">
                <template #default="scope">
                    {{ scope.row.area[0] }}{{ scope.row.area[1] }}
                </template>
            </el-table-column>
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
import { Text } from 'vue'
import AddDialog from './AddShopDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    components: {
        AddDialog,
        Text
    },
    data() {
        return {
            //表格数据
            tabledata: [
                {
                    id: "",
                    name: "",
                    openState: "",
                    area: [],
                    address: "",
                    phone: "",
                    openTime: ""
                }
            ],
            loading: false,
            //被选中的门店
            multipleSelection: [],
            //“新增”对话框可见性
            addDialogVisible: false,
            //搜索栏
            search: {
                data: {
                    "id": "",
                    "name": "",
                    "phone": "",
                    "openState": "",
                    "openArea": [],
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
            this.search.data = {
                "id": "",
                "name": "",
                "province": "",
                "city": "",
                "phone": "",
                "openState": "",
                "openArea": [],
                "phone": ""
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
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //从服务器获取数据
        getData() {
            this.loading = true
            this.$http.get("/company/store/get").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                    }
                    this.tabledata = response.data.data.stores
                    this.areaOptions = response.data.data.openArea
                    //500ms后关闭加载动画
                    setTimeout(() => {
                        this.loading = false
                    }, 0)
                },
                (response) => {
                    setTimeout(() => {
                        this.loading = false
                        ElMessage.error("服务器连接异常")
                    }, 1500)

                }
            )
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
            this.$http.post("/company/store/openstate/v2", {
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