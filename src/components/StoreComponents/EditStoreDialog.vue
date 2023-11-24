<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="修改门店信息" v-model="see" :before-close="closeDialog" width="500px" :draggable="true">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
                <el-form-item label="门店ID" prop="id">
                    <el-input v-model="form.id" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="门店名称" prop="name">
                    <el-input v-model="form.name" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="所在区域" prop="area">
                    <el-cascader v-model="form.area" class="full-width-input" :options="areaOptions" clearable
                        placeholder="请选择" style="width: 100%;">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="form.address" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
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
        store: Object
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {
                id: "",
                name: "",
                openState: "",
                phone: "",
                openTime: "",
                area: [],
                address: ""
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
                "label": "营业"
            }, {
                "value": "2",
                "label": "闭店"
            }],
            areaOptions: [],
        }
    },
    methods: {
        //清空数据
        dataReset() {
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
                    let sData = JSON.parse(JSON.stringify(this.form))//浅拷贝
                    //提交数据
                    this.$http.post("/company/store/update", {
                        data: sData
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(
                        (response) => {
                            if(response.data.code !== 200){
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
                    //表单验证不通过
                    ElMessage.error("未按要求填写")
                }
            });
        },
        //取消
        cancel() {
            //关闭窗口
            this.closeDialog()
        },
        //获取营业区域选项
        getAreaOptions() {
            //get请求
            this.$http.get("/company/openarea/option").then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.areaOptions = response.data.data.openArea
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
                }
            )
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
            if (val === false) {
                this.dataReset()
            }else{
                this.form=JSON.parse(JSON.stringify(this.store))
                this.getAreaOptions()
            }
        }
    }
}
</script>