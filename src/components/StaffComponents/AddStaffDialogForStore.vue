<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="新增员工" v-model="see" :before-close="closeDialog" width="500px" :draggable="true"
        :destroy-on-close="true">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="form.account" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="form.name" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="账号类型" prop="role">
                    <el-select v-model="form.role" disabled style="width:100%">
                        <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
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
        sid: Number
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {
                account: "",
                password: "",
                name: "",
                role: "2",
                storeId: "",
                storeName: ""
            },
            rules: {
                account: [
                    {
                        //账号不能为空
                        required: true,
                        message: "请输入账号",
                        trigger: "blur"
                    },
                    {
                        //账号不能重复
                        asyncValidator: (rule, value) => {
                            return new Promise((resolve, reject) => {
                                if (value != "") {
                                    this.$http.get("/v1/manage/staff/account?account=" + value).then(
                                        (response) => {
                                            if (response.data.code == 200) {
                                                resolve()
                                            } else {
                                                reject("账号已存在，请重新输入")
                                            }
                                        }
                                    )
                                }
                            });
                        }
                    }
                ],
                password: [{
                    required: true,
                    message: "请输入密码",
                    trigger: "blur"
                }],
                name: [{
                    required: true,
                    message: "请输入昵称",
                    trigger: "blur"
                }]
            },
            roleOptions: [{
                "value": "0",
                "label": "超级管理员"
            },
            {
                "value": "1",
                "label": "公司账号"
            },
            {
                "value": "2",
                "label": "门店账号"
            }],
        }
    },
    methods: {
        //基础
        //清空数据
        dataReset() {
            this.form = {
                account: "",
                password: "",
                name: "",
                role: "2",
                storeId: "",
                storeName: ""
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
                    let sData = this.form
                    //密码加密
                    sData.password = this.$md5(sData.password)
                    //提交数据
                    this.$http.post("/v1/manage/staff/add", {
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
                        }
                    )
                } else {
                    //填写不符合要求
                    ElMessage.error("请按照要求填写")
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
    },
    mounted() {
        this.form.storeId = this.sid
    }
}
</script>