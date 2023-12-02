<style scoped></style>
<template>
    <div style="background: #ffffff;">
        <!-- 操作栏 -->
        <div class="btn-container" style="margin-bottom: 15px;">
            <el-button :size="size" type="success" @click="updateSellState('1')">可售</el-button>
            <el-button :size="size" type="danger" @click="updateSellState('0')">不可售</el-button>
            <el-button :size="size" type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>
        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border height="300px" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading" :size="size">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column type="selection" width="50" fixed="left" />
            <el-table-column prop="id" label="商品ID" width="100" fixed="left" sortable />
            <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" />
            <el-table-column label="销售状态" width="100" align="center">
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
            <el-table-column prop="price" label="基础售价(元)" width="100" :show-overflow-tooltip="true" />
        </el-table>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    props: {
        cateId: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            default: "default"
        },
        btnVisible: {
            type: Boolean,
            default: true
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
        }
    },
    methods: {
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //修改销售状态
        updateSellState(state) {
            let sData
            if (this.multipleSelection.length == 0) {
                ElMessage.error("至少选择一个商品")
                return
            }
            let idList = []
            this.multipleSelection.forEach(element => {
                idList.push(element.id)
            });
            sData = {
                "id": idList,
                "state": state
            }
            this.$http.post("/v1/manage/commodity/update/state", {
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
            this.getCommodityData()
        },
        getCommodityData() {
            this.$http.get("/v1/manage/commodity/samecate?id=" + this.cateId).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return false
                    }
                    this.tabledata = response.data.data.commodity
                    this.tableLoading = false
                    if (this.refreshLoading) {
                        ElMessage.success("刷新成功")
                    }
                    this.refreshLoading = false
                    return true

                }
            )
        }
    },
    mounted() {
        this.getData()
    }
}
</script>