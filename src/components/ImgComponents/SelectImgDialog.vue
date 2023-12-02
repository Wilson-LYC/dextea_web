<style scoped></style>
<template>
    <el-dialog title="选择图片" v-model="see" :draggable="true" :destroy-on-close="true" width="500px">
        <!-- 操作栏 -->
        <div class="btn-container" style="margin-bottom: 15px;">
            <el-button type="default" @click="refresh" :loading="refreshLoading">刷新</el-button>
        </div>
        <el-table :data="tabledata" style="width: 100%" border height="550px" table-layout="auto"
            @selection-change="handleSelectionChange" v-loading="tableLoading">
            <template #empty>无数据</template>
            <!-- 数据部分 -->
            <el-table-column prop="id" label="图片ID" width="100" fixed="left" sortable />
            <el-table-column label="图片">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-image :src="scope.row.url" style="height: 50px;" @click="detail(scope.row)" />
                    </div>
                </template>
            </el-table-column>
            <!-- 行内操作栏 -->
            <el-table-column fixed="right" label="操作" width="80" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="sel(scope.row)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
    <EditDialog v-model:visible="editDialogVisible" :url="cimg" />
</template>

<script>
import { ElMessage } from 'element-plus'
import EditDialog from '@/components/ImgComponents/EditImgDialog.vue'
export default {
    components: {
        EditDialog
    },
    props: {
        visible: Boolean,
        url: String
    },
    emits: ['update:visible', 'update:url'],
    data() {
        return {
            //表格数据
            tabledata: [],
            //加载动画
            tableLoading: false,
            //刷新按钮动画
            refreshLoading: false,
            //“编辑”对话框可见性
            editDialogVisible: false,
            cimg: ""
        }
    },
    methods: {
        //详情
        detail(val) {
            this.cimg = val.url
            this.editDialogVisible = true
        },
        refresh() {
            this.refreshLoading = true
            setTimeout(() => {
                this.getData()
            }, 500)
        },
        //从服务器获取数据
        getData() {
            this.tableLoading = true
            this.getImgData()
        },
        //从服务器获取图片数据
        getImgData() {
            this.$http.get("/v1/manage/img/list").then(
                (response) => {
                    if (response.data.code != 200) {
                        this.tableLoading = false
                        this.refreshLoading = false
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.tabledata = response.data.data.img
                    this.tableLoading = false
                    if (this.refreshLoading)
                        ElMessage.success("刷新成功")
                    this.refreshLoading = false
                }
            )
        },
        //关闭
        colse() {
            //关闭窗口
            this.see = false
        },
        //选择
        sel(val) {
            this.$emit('update:url', val.url)
            this.colse()
        }
    },
    mounted() {
        this.getData()
    },
    computed: {
        see: {
            get() {
                return this.visible
            },
            set(see) {
                this.$emit('update:visible', see)
            }
        }
    },
    watch: {
        see(val) {
            if (val == true) {
                this.getData()
            }
        }
    }
}
</script>