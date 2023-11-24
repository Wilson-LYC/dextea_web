<template>
    <el-tabs type="card" :editable="true" @tab-remove="tabRemove" @tab-add="tabAdd" v-model="activeTab">
        <el-tab-pane v-for="(cit, cIndex) in custom" :label="cit.title" :name="cIndex">
            <el-form label-width="80px" label-position="left">
                <el-form-item label="定制项目">
                    <el-input v-model="cit.title" />
                </el-form-item>
            </el-form>
            <div style="margin-bottom: 10px;">
                <el-button type="primary" size="small" @click="addOption(cIndex)">新增要求</el-button>
            </div>
            <el-table :data="cit.option" border height="300px" size="small">
                <el-table-column label="项目">
                    <template #default="scope">
                        <el-input v-model="scope.row.text" />
                    </template>
                </el-table-column>
                <el-table-column label="价格">
                    <template #default="scope">
                        <el-input v-model="scope.row.cost" />
                    </template>
                </el-table-column>
                <!-- 行内操作栏 -->
                <el-table-column label="操作" width="100" align="center">
                    <template #default="scope">
                        <el-popconfirm width="100" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
                            icon-color="#626AEF" title="确定删除?" @confirm="delOption(cIndex,scope.$index)">
                            <template #reference>
                                <el-button type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
export default {
    props: {
        custom: {
            type: Array
        }
    },
    emits: ['update:custom'],
    methods: {
        tabRemove(index) {
            let tmp = JSON.parse(JSON.stringify(this.custom))
            tmp.splice(index, 1)
            this.$emit('update:custom', tmp)
        },
        tabAdd() {
            let citem = {
                "title": "新项目",
                "option": [],
                "opt": 0
            }
            this.custom.push(citem)
        },
        delOption(cIndex,oIndex){
            let tmp = JSON.parse(JSON.stringify(this.custom))
            tmp[cIndex].option.splice(oIndex,1)
            this.$emit('update:custom', tmp)
        },
        addOption(cIndex){
            let tmp = JSON.parse(JSON.stringify(this.custom))
            tmp[cIndex].option.push({
                "text": "",
                "cost": 0
            })
            this.$emit('update:custom', tmp)
        }
    },
    data() {
        return {
            activeTab: 0
        }
    }
}
</script>