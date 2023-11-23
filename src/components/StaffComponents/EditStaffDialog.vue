<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="新增员工" width="500" v-model="see" :draggable="true" :close-on-click-modal="false"
        :destroy-on-close="false" :before-close="closeDialog">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" label-position="left" label-width="80px" size="default">
                <el-form-item label="员工ID" prop="id">
                    <el-input v-model="form.id" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="form.account" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input v-model="form.password" type="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="form.name" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="账号类型" prop="role">
                    <el-select v-model="form.role" class="full-width-input" clearable placeholder="请选择" disabled>
                        <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="门店ID" prop="storeId" v-if="form.role == '2'">
                    <el-input v-model="form.storeId" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="门店名称" prop="storeName" v-if="form.role == '2'">
                    <el-input v-model="form.storeName" type="text" disabled></el-input>
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
import bcrypt from 'bcryptjs'
export default {
    props: {
        visible: Boolean,
        staff: Object
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {},
            rules: {
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
            this.form = {}
        },
        //关闭窗口
        closeDialog(done) {
            //重置数据
            this.dataReset()
            //关闭窗口
            this.see = false
            done()
        },
        //确认
        confirm() {
            this.$refs["myform"].validate(valid => {
                if (valid) {
                    //填写符合要求
                    let sData = JSON.parse(JSON.stringify(this.form))//浅拷贝
                    //密码加密
                    // sData.password = bcrypt.hashSync(sData.password, 10)
                    //提交数据
                    this.$http.post("/company/staff/update", {
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
                            ElMessage.success("修改成功")
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
    },
    watch: {
        see(val) {
            if (val == true) {
                this.form = JSON.parse(JSON.stringify(this.staff))
            }
        }
    }
}
</script>