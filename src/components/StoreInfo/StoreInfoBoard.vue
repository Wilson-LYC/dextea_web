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
    font-size: 25px;
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
                            营业中
                        </el-tag>
                        <el-tag type="danger" effect="plain" round v-else-if="store.openState === '2'">
                            休息中
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
                        {{ store.area.join('/') }}
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
    <EditDialog v-model:visible="EditDialogVisible" :id="store.id"/>
</template>
<script>
import {
    Edit,
} from '@element-plus/icons-vue'
import EditDialog from '@/components/StoreInfo/EditStoreDialog.vue'
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
                "id": 1,
                "name": "广州gogo新天地店",
                "area": ["广东省", "广州市"],
                "address": "小谷围街贝岗村贝岗村大街1号高高新天地商业广场一期一层第103、104、141、142号商铺",
                "phone": "020-85202718",
                "openTime": "周一至周日 10:00-22:00",
                "openState": "1",
            },
            setting: {
                gutter: 10,
                label: 6,
                value: 18
            },
            EditDialogVisible:false
        }
    },
    methods: {
        //编辑
        handleEdit() {
            this.EditDialogVisible = true
        }
    },
    watch: {
        EditDialogVisible(val){
            if(!val){
                ElMessage('请刷新数据')
            }
        }
    }
}
</script>