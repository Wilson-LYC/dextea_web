<style scoped></style>

<template>
    <el-dialog v-model="see" :before-close="closeDialog" width="500px" :draggable="true" :destroy-on-close="true">
        <template #header>
            <div class="my-header">
                <span> 顾客详情 </span>
            </div>
        </template>
        <el-scrollbar height="150px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
                <el-form-item label="顾客ID" prop="id">
                    <el-input v-model="form.id" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="顾客昵称" prop="name">
                    <el-input v-model="form.name" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="form.phone" type="text" clearable></el-input>
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <!-- 操作按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    props: {
        visible: Boolean,
        customer: Object
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {},
            rules: {
                name: [{
                    required: true,
                    message: '请输入门店名称',
                    trigger: ['blur', 'change']
                }]
            }
        }
    },
    methods: {
        //清空数据
        dataReset() {
            this.form = {}
        },
        //关闭窗口
        closeDialog(done) {
            //关闭窗口
            this.see = false
            // ElMessage("窗口关闭")
            done()
        },
        //确认
        confirm() {
            console.log(this.form)
            this.$refs["myform"].validate(valid => {
                if (valid) {
                    //表单验证通过
                    let sData = JSON.parse(JSON.stringify(this.form))
                    //提交数据
                    this.$http.post("/v1/manage/customer/update", {
                        data: sData
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(
                        (response) => {
                            if (response.data.code !== 200) {
                                ElMessage.error(response.data.msg)
                                return
                            }
                            ElMessage.success("修改成功")
                            this.closeDialog()
                        }
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
        },
        //获取数据
        getData() {
            this.getCustomer()
        },
        //获取顾客信息
        getCustomer() {
            this.form = JSON.parse(JSON.stringify(this.customer))
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
    },
    watch: {
        see(val) {
            if (val) {
                this.getData()
            }
        }
    }
}
</script>