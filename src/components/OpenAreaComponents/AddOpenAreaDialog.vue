<template>
    <el-dialog title="开设新区域" width="500" v-model="see" :draggable="true" :close-on-click-modal="false"
        :before-close="closeDialog">
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
                <el-form-item label="上级区域" prop="superior" class="required" v-if="data.type == 2">
                    <el-select v-model="data.superior" class="full-width-input" clearable placeholder="请选择">
                        <el-option v-for="(item, index) in openArea" :label="item.value" :value="index"></el-option>
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
import { ElMessage } from 'element-plus'
export default {
    props: {
        visible: Boolean,
        openArea: Object,
    },
    emits: ['update:visible'],
    data() {
        return {
            //表单数据
            data: {
                type: "",//1:省/直辖市，2:市
                superior: "",//上级区域
                name: "",//区域名称
            },
            //表单验证规则
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
            //区域类型选项
            typeOptions: [{
                "label": "省/直辖市",
                "value": "1"
            }, {
                "label": "市",
                "value": "2"
            }]
        }
    },
    methods: {
        //清空数据
        dataReset() {
            this.data = {
                type: "",
                superior: "",
                name: "",
            }
        },
        //关闭对话框
        closeDialog(done) {
            this.dataReset()
            this.see = false
            done()
        },
        //确认
        confirm() {
            this.$refs["myform"].validate(valid => {
                if (valid) {
                    //符合要求，处理数据
                    let newOpenArea = JSON.parse(JSON.stringify(this.openArea))//浅拷贝
                    if (this.data.type == 1) {
                        //省/直辖市
                        newOpenArea.push({
                            "value": this.data.name,
                            "num": "0",
                            "children": []
                        })
                    } else {
                        //市
                        newOpenArea[this.data.superior].children.push({
                            "value": this.data.name,
                            "num": "0"
                        })
                    }
                    //提交数据
                    this.$http.post("/company/openarea/update", {
                        data: newOpenArea
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(
                        (response) => {
                            if(response.data.code!==200){
                                ElMessage.error(response.data.msg)
                                return
                            }
                            //成功
                            ElMessage.success("添加成功")
                            //关闭窗口
                            this.closeDialog()
                        },
                        (response) => {
                            ElMessage.error("服务器连接失败")
                        }
                    )
                } else {
                    //不符合要求，提示错误
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