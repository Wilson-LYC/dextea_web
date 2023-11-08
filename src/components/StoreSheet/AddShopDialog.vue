<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="新增门店" width="500" v-model="see" :draggable="true" :close-on-click-modal="false"
        :destroy-on-close="false" :before-close="closeDialog">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="data" ref="myform" :rules="rules" label-position="left" label-width="80px" size="default">
                <el-form-item label="门店名称" prop="name" class="required">
                    <el-input v-model="data.name" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="所在区域" prop="area" class="required">
                    <el-cascader v-model="data.area" class="full-width-input" :options="areaOptions" clearable
                        placeholder="请选择">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address" class="required">
                    <el-input v-model="data.address" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone" class="required">
                    <el-input v-model="data.phone" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="营业时间" prop="openTime" class="required">
                    <el-input v-model="data.openTime" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="营业状态" prop="openState" class="required">
                    <el-select v-model="data.openState" class="full-width-input" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in openStateOptions" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <!-- 操作按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    props: {
        visible: Boolean,
    },
    emits: ['update:visible'],
    data() {
        return {
            data: {
                name: "",
                area: "",
                address: "",
                phone: "",
                openTime: "",
                openState: "",
            },
            rules: {
                name: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                area: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                address: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                phone: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                openTime: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                openState: [{
                    required: true,
                    message: '字段值不可为空',
                }],
            },
            openStateOptions: [{
                "value": "0",
                "label": "未开业 "
            }, {
                "value": "1",
                "label": "营业中"
            }, {
                "value": "2",
                "label": "休息中"
            }],
            areaOptions: [
                {
                    "label": "广东省",
                    "value": "广东省",
                    "children": [{
                        "label": "广州市",
                        "value": "广州市"
                    }, {
                        "label": "韶关市",
                        "value": "韶关市"
                    }]
                },
                {
                    "label": "湖南省",
                    "value": "湖南省",
                    "children": [{
                        "label": "长沙市",
                        "value": "长沙市"
                    },
                    {
                        "label": "衡阳市",
                        "value": "衡阳市"
                    }]
                },
                {
                    "label": "北京市",
                    "value": "北京市"
                }
            ],
        }
    },
    methods: {
        //清空数据
        dataReset() {
            this.data = {
                name: "",
                area: "",
                address: "",
                phone: "",
                openTime: "",
                openState: "",
            }
        },
        //关闭窗口
        closeDialog(done) {
            //重置数据
            this.dataReset()
            //关闭窗口
            this.see = false
            // ElMessage("窗口关闭")
            done()
        },
        //确认
        confirm() {
            this.$refs["myform"].validate(valid => {
                if (valid) {
                    //关闭窗口
                    this.closeDialog()
                } else {
                    //报错
                    ElMessage.error("填写不符合要求")
                }
            });
        },
        //取消
        cancel() {
            //关闭窗口
            this.closeDialog()
        }
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
    }
}
</script>