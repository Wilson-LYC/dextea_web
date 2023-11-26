<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="品类详情" v-model="see" :draggable="true" width="800px" :before-close="closeDialog" :destroy-on-close="true">
        <!-- 表单 -->
        <el-form :model="form" ref="myform" :rules="rules" label-position="left" label-width="80px" size="default">
            <el-form-item label="品类ID" prop="id">
                <el-input v-model="form.id" type="text" disabled></el-input>
            </el-form-item>
            <el-form-item label="品类名" prop="name">
                <el-input v-model="form.name" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="num">
                <el-input v-model="form.num" type="text" disabled></el-input>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px;font-weight: bold;">商品列表</div>
        <CommoditySheet v-model:cateId="sel"/>
        <!-- 操作按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">修改</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
import CommoditySheet from '@/components/CommodityComponents/CommoditySheetForCategory.vue'
export default {
    components: {
        CommoditySheet
    },
    props: {
        visible: Boolean,
        category: Object
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {},
            rules: {
                name: [
                    { required: true, message: '请输入品类名', trigger: 'blur' },
                ],
            },
            sel:0
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
                    this.$http.post("/company/category/update", {
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
    watch:{
        see(val){
            if(val==true){
                this.form=JSON.parse(JSON.stringify(this.category))
                this.sel=this.category.id
            }
        }
    }
}
</script>