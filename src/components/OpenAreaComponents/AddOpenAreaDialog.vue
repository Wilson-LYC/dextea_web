<template>
    <el-dialog title="新增营业区域" width="500px" v-model="see" :draggable="true" :before-close="closeDialog" :destroy-on-close="true">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
                <el-form-item label="区域类型" prop="type" class="required">
                    <el-radio-group v-model="form.type">
                        <el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value"
                            :disabled="item.disabled" style="{display: inline}">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上级区域" prop="superior" class="required" v-if="form.type == 2">
                    <el-select v-model="form.superior" class="full-width-input" clearable placeholder="请选择" style="width: 100%;">
                        <el-option v-for="(item, index) in openArea" :label="item.value" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区域名称" prop="name" class="required">
                    <el-input v-model="form.name" type="text" clearable></el-input>
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
            form: {
                type: "",//1:省/直辖市，2:市
                superior: "",//上级区域
                name: "",//区域名称
            },
            //表单验证规则
            rules: {
                type: [{
                    required: true,
                    message: "请选择区域类型",
                    trigger: "change"
                }],
                superior: [{
                    required: true,
                    message: "请选择上级区域",
                    trigger: "change"
                }],
                name: [{
                    required: true,
                    message: "请输入区域名称",
                    trigger: "blur"
                }]
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
            this.form = {
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
                    //表单验证通过
                    let sData = JSON.parse(JSON.stringify(this.openArea))//浅拷贝
                    if (this.form.type == 1) {
                        //省/直辖市
                        sData.push({
                            "value": this.form.name,
                            "num": "0",
                            "children": []
                        })
                    } else {
                        //市
                        sData[this.form.superior].children.push({
                            "value": this.form.name,
                            "num": "0"
                        })
                    }
                    //提交数据
                    this.$http.post("/openarea/update", {
                        data: sData
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': sessionStorage.getItem('token')
                        }
                    }).then(
                        (response) => {
                            if (response.data.code !== 200) {
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
                    //表单验证不通过
                    ElMessage.error("未按要求填写")
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