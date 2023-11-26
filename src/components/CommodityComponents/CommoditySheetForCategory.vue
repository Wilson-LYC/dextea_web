<style scoped></style>
<template>
    <div style="background: #ffffff;">
        <!-- 表格主体 -->
        <el-table :data="tabledata" style="width: 100%" border height="300px" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
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
        </el-table>
    </div>
</template>

<script>
export default {
    props:{
        cateId:{
            type:Number,
            required:true
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
            multipleSelection: []
        }
    },
    methods: {
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //从服务器获取数据
        getData() {
            this.getCommodityData()
        },
        getCommodityData() {
            this.loading = true
            this.$http.get("/commodity/get/samecate?cateId="+this.cateId,{
                headers: {
                    "Authorization": localStorage.getItem("token")
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
        }
    },
    mounted() {
        this.getData()
    }
}
</script>