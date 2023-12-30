<style scoped></style>

<template>
    <el-dialog title="新增商品" v-model="see" :before-close="closeDialog" width="500px" :draggable="true"
        :destroy-on-close="true">
        <!-- 表单 -->
        <el-form :model="form" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="form.name" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="基础售价" prop="price">
                <el-input v-model="form.price" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="销售状态" prop="state">
                <el-select v-model="form.state" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="(item, index) in sellOptions" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div style="color: #999999;">其他内容请在详情页设置</div>
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
                "price": "",
                "name": "",
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
                state: [
                    { required: true, message: '请选择商品状态', trigger: 'blur' },
                ]
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
                    //提交数据
                    this.$http.post("/v1/manage/commodity/add", {
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
                        }
                    )
                } else {
                    //填写不符合要求
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
        }
    }
}
</script>