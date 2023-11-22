<style scoped>
.elrow {
    margin-bottom: 25px;
    font-size: 16px;
}

.header {
    margin: 0;
    padding: 0;
    margin-bottom: 25px;
    padding-bottom: 8px;
    border-bottom: 1px #e0e0e0 solid;
}

.title {
    margin: 0;
    padding: 0;
    font-size: 22px;
    color: #409EFF;
    font-weight: bold;
}
</style>
<template>
    <div style="background: #ffffff;border-radius: 8px; padding: 20px;">
        <div class="header">
            <el-row>
                <el-col :span="12">
                    <p class="title">门店信息</p>
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <el-button :icon="Edit" @click="handleEdit">编辑</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 数据 -->
        <el-row class="elrow">
            <el-col :span="8">
                <el-row :gutter="setting.gutter">
                    <el-col :span="setting.label" style="text-align: right;">
                        门店ID:
                    </el-col>
                    <el-col :span="setting.value">
                        {{ store.id }}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row :gutter="setting.gutter">
                    <el-col :span="setting.label" style="text-align: right;">
                        门店名称:
                    </el-col>
                    <el-col :span="setting.value">
                        {{ store.name }}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row :gutter="setting.gutter">
                    <el-col :span="setting.label" style="text-align: right;">
                        状态:
                    </el-col>
                    <el-col :span="setting.value">
                        <el-tag type="success" effect="plain" round v-if="store.openState === '1'">
                            营业
                        </el-tag>
                        <el-tag type="danger" effect="plain" round v-else-if="store.openState === '2'">
                            闭店
                        </el-tag>
                        <el-tag type="info" effect="plain" round v-else>
                            未开业
                        </el-tag>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="elrow">
            <el-col :span="8">
                <el-row :gutter="setting.gutter">
                    <el-col :span="setting.label" style="text-align: right;">
                        电话:
                    </el-col>
                    <el-col :span="setting.value">
                        {{ store.phone }}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row :gutter="setting.gutter">
                    <el-col :span="setting.label" style="text-align: right;">
                        营业时间:
                    </el-col>
                    <el-col :span="setting.value">
                        {{ store.openTime }}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row :gutter="setting.gutter">
                    <el-col :span="setting.label" style="text-align: right;">
                        地区:
                    </el-col>
                    <el-col :span="setting.value">
                        {{ store.area[0] }}{{ store.area[1] }}
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="elrow">
            <el-col :span="8">
                <el-row :gutter="setting.gutter">
                    <el-col :span="setting.label" style="text-align: right;">
                        地址:
                    </el-col>
                    <el-col :span="setting.value">
                        {{ store.address }}
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
    <EditDialog v-model:visible="EditDialogVisible" :store="store" />
</template>
<script>
import {
    Edit,
} from '@element-plus/icons-vue'
import EditDialog from './EditStoreDialog.vue'
import { ElMessage } from 'element-plus'
export default {
    components: {
        EditDialog
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            Edit,
            store: {
                id: "",
                name: "",
                openState: "",
                phone: "",
                openTime: "",
                area: [],
                address: ""
            },
            setting: {
                gutter: 10,
                label: 6,
                value: 18
            },
            EditDialogVisible: false
        }
    },
    methods: {
        //编辑
        handleEdit() {
            this.EditDialogVisible = true
        },
        //获取数据
        getData() {
            //get请求
            this.$http.get("/company/store/info?id=" + this.id).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.store = response.data.data.store
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
                }
            )
        }
    },
    watch: {
        EditDialogVisible(val) {
            if (val === false) {
                this.getData()
            }
        }
    },
    mounted() {
        this.getData()
    }
}
</script>