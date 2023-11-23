<style scoped>
.mytitle {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}
</style>

<template>
    <el-dialog v-model="see" :close-on-click-modal="false" :before-close="closeDialog" fullscreen>
        <template #header>
            <div style="font-size: 20px;">新增商品</div>
        </template>
        <!-- 表单 -->
        <div class="mytitle">
            基本信息
        </div>
        <el-form :model="form" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default" style="width: 500px;">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="form.name" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input v-model="form.price" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="详细介绍" prop="introduce">
                <el-input v-model="form.introduce" type="textarea" clearable
                    :autosize="{ minRows: 2, maxRows: 2 }"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="briefIntro">
                <el-input v-model="form.briefIntro" type="textarea" clearable
                    :autosize="{ minRows: 2, maxRows: 2 }"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-select v-model="form.state" placeholder="请选择">
                    <el-option v-for="(item, index) in sellOptions" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="mytitle">
            客制化要求
        </div>
        <CustomEditor v-model:custom="form.custom" />
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
import CustomEditor from './CustomEditor.vue'
export default {
    components: {
        CustomEditor
    },
    props: {
        visible: Boolean
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {
                "id": "",
                "price": "",
                "name": "",
                "introduce": "",
                "briefIntro": "",
                "img": "",
                "state": "0",
                "custom": [
                    {
                        "title": "冰量",
                        "option": [
                            {
                                "text": "推荐",
                                "cost": 0
                            },
                            {
                                "text": "少冰",
                                "cost": 0
                            },
                            {
                                "text": "少少冰",
                                "cost": 0
                            },
                            {
                                "text": "去冰(不推荐)",
                                "cost": 0
                            }
                        ],
                        "opt": 0
                    },
                    {
                        "title": "甜度",
                        "option": [
                            {
                                "text": "推荐甜度(少甜)",
                                "cost": 0
                            },
                            {
                                "text": "少少甜",
                                "cost": 0
                            },
                            {
                                "text": "少少少甜",
                                "cost": 0
                            },
                            {
                                "text": "不另外加糖(不推荐)",
                                "cost": 0
                            },
                            {
                                "text": "多甜",
                                "cost": 0
                            }
                        ],
                        "opt": 0
                    }
                ]
            },
            rules: {
                name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                introduce: [
                    { required: true, message: '请输入商品详细介绍', trigger: 'blur' },
                ],
                briefIntro: [
                    { required: true, message: '请输入商品简介', trigger: 'blur' },
                ],
                state: [
                    { required: true, message: '请选择商品状态', trigger: 'blur' },
                ],
            },
            sellOptions: [{
                "value": "0",
                "label": "不可售"
            },
            {
                "value": "1",
                "label": "可售"
            }]
        }
    },
    methods: {
        //基础
        //清空数据
        dataReset() {
            this.form = {
                "id": "",
                "price": "",
                "name": "",
                "introduce": "",
                "briefIntro": "",
                "img": "",
                "state": "0",
                "custom": [
                    {
                        "title": "冰量",
                        "option": [
                            {
                                "text": "推荐",
                                "cost": 0
                            },
                            {
                                "text": "少冰",
                                "cost": 0
                            },
                            {
                                "text": "少少冰",
                                "cost": 0
                            },
                            {
                                "text": "去冰(不推荐)",
                                "cost": 0
                            }
                        ],
                        "opt": 0
                    },
                    {
                        "title": "甜度",
                        "option": [
                            {
                                "text": "推荐甜度(少甜)",
                                "cost": 0
                            },
                            {
                                "text": "少少甜",
                                "cost": 0
                            },
                            {
                                "text": "少少少甜",
                                "cost": 0
                            },
                            {
                                "text": "不另外加糖(不推荐)",
                                "cost": 0
                            },
                            {
                                "text": "多甜",
                                "cost": 0
                            }
                        ],
                        "opt": 0
                    }
                ]
            }
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
                    console.log(sData)
                    //提交数据
                    this.$http.post("/company/commodity/add", {
                        data: sData
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(
                        (response) => {
                            console.log(response.data)
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