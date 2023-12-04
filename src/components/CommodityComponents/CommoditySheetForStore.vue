<style scoped>
.container {
    background: #ffffff;
    border-radius: 8px;
    padding: 20px;
    height: calc(100% - 40px);
}

.mytable {
    height: calc(100% - 50px);
}
</style>
<template>
    <div class="container">
        <!-- 操作栏 -->
        <div class="btn-container" style="height: 50px;">
            <el-button :size="size" type="success" @click="onsale()">在售</el-button>
            <el-button :size="size" type="danger" @click="offsale()">售罄</el-button>
            <el-button :size="size" type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>

        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border table-layout="auto" @selection-change="handleSelectionChange"
            v-loading="tableLoading" :size="size" class="mytable">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="id" label="商品ID" min-width="80" fixed="left" sortable />
            <el-table-column prop="name" label="名称" min-width="80" :show-overflow-tooltip="true" />
            <el-table-column label="销售状态" min-width="80" align="center">
                <template #default="scope">
                    <el-tag type="danger" effect="light" round v-if="scope.row.state == '0'">
                        售罄
                    </el-tag>
                    <el-tag type="success" effect="light" round v-else-if="scope.row.state === '1'">
                        在售
                    </el-tag>
                    <el-tag type="info" effect="light" round v-else>
                        未知
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="基础售价(元)" min-width="80" :show-overflow-tooltip="true" />
            <el-table-column prop="category" label="品类" min-width="80" :show-overflow-tooltip="true" />
        </el-table>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    props: {
        size: {
            type: String,
            default: 'default'
        }
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
                "label": "在售"
            },
            {
                "value": "1",
                "label": "售罄"
            }],
            sid: ""
        }
    },
    methods: {
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //修改销售状态
        onsale() {
            let sData
            if (this.multipleSelection.length == 0) {
                ElMessage.warning("至少选择一件商品")
                return
            }
            let cid = []
            this.multipleSelection.forEach(element => {
                //排除已经在售的商品
                if (element.state == '0')
                    cid.push(element.id)
            });
            sData = {
                "cid": cid,
                "sid": this.sid
            }
            this.$http.post("/v1/manage/menu/onsale", {
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
                    ElMessage.success("操作成功")
                    //刷新
                    this.getData()
                }
            )
        },
        offsale() {
            let sData
            if (this.multipleSelection.length == 0) {
                ElMessage.warning("至少选择一件商品")
                return
            }
            let cid = []
            this.multipleSelection.forEach(element => {
                if (element.state == '1')
                    cid.push(element.id)
            });
            sData = {
                "cid": cid,
                "sid": this.sid
            }
            this.$http.post("/v1/manage/menu/offsale", {
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
                    ElMessage.success("操作成功")
                    //刷新
                    this.getData()
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
            this.tableLoading = true
            this.getCommodity()
        },
        getCommodity() {
            this.$http.get("/v1/manage/menu/get?id=" + this.sid).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        this.tableLoading = false
                        this.refreshLoading = false
                        return
                    }
                    this.tabledata = response.data.data.commodity
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
        this.sid = sessionStorage.getItem("storeId")
        this.getData()
    }
}
</script>