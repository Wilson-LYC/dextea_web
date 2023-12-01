<style scoped></style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <!-- 操作栏 -->
        <div class="btn-container" style="margin-bottom: 15px;">
            <el-button type="success" @click="onsale()">在售</el-button>
            <el-button type="danger" @click="offsale()">售罄</el-button>
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
    props:{
        sid:Number
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
            cateOptions: []
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
                ElMessage.error("请至少选择一项")
                return
            }
            let cid = []
            this.multipleSelection.forEach(element => {
                if(element.state == '0')
                    cid.push(element.id)
            });
            sData = {
                "cid": cid,
                "sid": this.sid,
            }
            this.$http.post("/commodity/store/onsale", {
                data: sData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
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
        offsale() {
            let sData
            if (this.multipleSelection.length == 0) {
                ElMessage.error("请至少选择一项")
                return
            }
            let cid = []
            this.multipleSelection.forEach(element => {
                if(element.state == '1')
                    cid.push(element.id)
            });
            sData = {
                "cid": cid,
                "sid": this.sid,
            }
            console.log(sData)
            this.$http.post("/commodity/store/offsale", {
                data: sData
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('token')
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
            this.$http.get("/commodity/store?id="+this.sid, {
                headers: {
                    "Authorization": sessionStorage.getItem("token")
                }
            }).then(
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
            this.$http.get("/category/get/option/select",{
                headers: {
                    "Authorization": sessionStorage.getItem("token")
                }
            }).then(
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