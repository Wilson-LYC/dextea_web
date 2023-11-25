<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="新增品类" v-model="see" :draggable="true" width="500px" :before-close="closeDialog" :destroy-on-close="true">
        <!-- 表单 -->
        <el-form :model="form" ref="myform" :rules="rules" label-position="left" label-width="80px" size="default">
            <el-form-item label="品类名" prop="name" class="required">
                <el-input v-model="form.name" type="text" clearable></el-input>
            </el-form-item>
        </el-form>
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
        visible: Boolean
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {
                name: ""
            },
            rules: {
                name: [
                    { required: true, message: '请输入品类名', trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
        //基础
        //清空数据
        dataReset() {
            this.form = {
                name: ""
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
                    //填写符合要求
                    let sData = JSON.parse(JSON.stringify(this.form))//浅拷贝
                    //提交数据
                    this.$http.post("/category/add", {
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
                    //填写不符合要求
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