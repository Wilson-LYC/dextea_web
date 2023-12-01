<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="新增门店" v-model="see" :before-close="closeDialog" width="500px" :draggable="true"
        :destroy-on-close="true">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
                <el-form-item label="门店名称" prop="name">
                    <el-input v-model="form.name" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="所在区域" prop="area">
                    <el-cascader v-model="form.area" class="full-width-input" :options="areaOptions" placeholder="请选择"
                        style="width: 100%;">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="form.address" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="form.phone" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="营业时间" prop="openTime">
                    <el-input v-model="form.openTime" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="营业状态" prop="openState">
                    <el-select v-model="form.openState" class="full-width-input" placeholder="请选择" style="width: 100%;">
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
        openArea: Array//营业区域
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {
                name: "",
                area: "",
                address: "",
                phone: "",
                openTime: "",
                openState: "0",
            },
            rules: {
                name: [{
                    required: true,
                    message: "请输入门店名称",
                    trigger: "blur"
                }],
                area: [{
                    required: true,
                    message: "请选择所在区域",
                    trigger: "change"
                }],
                address: [{
                    required: true,
                    message: "请输入详细地址",
                    trigger: "blur"
                }],
                phone: [{
                    required: true,
                    message: "请输入电话",
                    trigger: "blur"
                }],
                openTime: [{
                    required: true,
                    message: "请输入营业时间",
                    trigger: "blur"
                }],
                openState: [{
                    required: true,
                    message: "请选择营业状态",
                    trigger: "change"
                }]
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
            }]
        }
    },
    methods: {
        //清空数据
        formReset() {
            this.form = {
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
            this.formReset()
            //关闭窗口
            this.see = false
            // ElMessage("窗口关闭")
            done()
        },
        //确认
        confirm() {
            this.$refs["myform"].validate(valid => {
                if (valid) {
                    //表单验证通过
                    let sData = this.form
                    //提交数据
                    this.$http.post("/v1/manage/store/add", {
                        data: sData
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(
                        (response) => {
                            if (response.data.code !== 200) {
                                ElMessage.error(response.data.msg)
                                return
                            }
                            ElMessage.success("添加成功")
                            this.closeDialog()
                        },
                    )
                } else {
                    //表单验证不通过
                    ElMessage.error("请按要求填写")
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
        },
        areaOptions: {
            get() {
                return this.openArea
            }
        }
    }
}
</script>