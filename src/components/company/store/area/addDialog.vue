<template>
    <el-dialog title="开设新区域" width="500" v-model="see" :draggable="true" :close-on-click-modal="false">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="data" ref="myform" :rules="rules" label-position="left" label-width="80px" size="default"
                @submit.native.prevent>
                <el-form-item label="区域类型" prop="type" class="required">
                    <el-radio-group v-model="data.type">
                        <el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value"
                            :disabled="item.disabled" style="{display: inline}">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上级区域" prop="superior" class="required" v-if="data.type==2">
                    <el-select v-model="data.superior" class="full-width-input" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in superiorOptions" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域名称" prop="name" class="required">
                    <el-input v-model="data.name" type="text" clearable></el-input>
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
export default {
    props: {
        visible: Boolean,
        superior: Object,
        isChange:Boolean,
    },
    emits: ['update:visible', 'update:isChange'],
    data() {
        return {
            data: {
                type: "",
                superior: "",
                name: "",
            },
            rules: {
                type: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                superior: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                name: [{
                    required: true,
                    message: '字段值不可为空',
                }],
            },
            typeOptions: [{
                "label": "省/直辖市",
                "value": "1"
            }, {
                "label": "市",
                "value": 2
            }],
        }
    },
    methods: {
        //确认
        confirm() {
            this.$refs["myform"].validate(valid => {
                if (valid) {
                    // console.log("success");
                    console.log(this.data);
                    this.$emit('update:isChange', !this.isChange)
                    this.resetData()
                    this.see = false
                } else {
                    // console.log("error");
                }
            });
        },
        //取消
        cancel() {
            this.see = false
            this.resetData()
        },
        //清空数据
        resetData() {
            this.data = {
                type: "",
                superior: "",
                name: "",
            }
        },
        //告诉父组件数据更新
        updateChange() {
            this.change=!this.isChange
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
        },
        superiorOptions:{
            get(){
                return this.superior
            }
        },
        change:{
            get() {
                return this.isChange
            },
            set(change) {
                this.$emit('update:isChange', change)
            }
        }
    }
}
</script>