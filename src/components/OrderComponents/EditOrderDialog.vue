<template>
    <el-dialog v-model="see" :before-close="closeDialog" width="800px" :draggable="true" :destroy-on-close="true">
        <template #header>
            <div class="my-header">
                <span> 订单详情 </span>
            </div>
        </template>
        <el-scrollbar height="500px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
                <el-form-item label="订单ID" prop="id">
                    <el-input v-model="form.id" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="订单进度" prop="state">
                    <el-select v-model="form.state" class="full-width-input" placeholder="请选择" style="width: 100%;">
                        <el-option v-for="(item, index) in orderStateOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="门店" prop="storeName">
                    <el-input v-model="form.storeName" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="顾客昵称" prop="custName">
                    <el-input v-model="form.custName" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="form.phone" type="text"></el-input>
                </el-form-item>
                <el-form-item label="总消费" prop="price">
                    <el-input v-model="form.price" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="总数量" prop="num">
                    <el-input v-model="form.num" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="订单备注" prop="num">
                    <el-input v-model="form.note" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }"></el-input>
                </el-form-item>
                <el-form-item label="下单时间" prop="ordertime">
                    <el-input v-model="form.createtime" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新时间" prop="updatetime">
                    <el-input v-model="form.updatetime" type="text" disabled></el-input>
                </el-form-item>
            </el-form>
            <!-- 商品详情 -->
            <div style="font-weight: bold;margin-bottom: 10px;">商品详情</div>
            <el-table :data="form.commodity" style="width: 100%" border>
                <el-table-column prop="name" label="商品" width="150" />
                <el-table-column prop="num" label="数量" width="80" />
                <el-table-column label="定制">
                    <template #default="scope">
                        <div v-for="item in scope.row.custom">
                            {{ item.item }}：{{ item.value }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="100">
                    <template #default="scope">
                        ￥{{ scope.row.price }}
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>

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
export default {
    props: {
        visible: Boolean,
        order: Object
    },
    emits: ['update:visible'],
    data() {
        return {
            form: {},
            rules: {
                state: [{
                    required: true,
                    message: '请选择订单状态',
                    trigger: 'change'
                }],
                phone: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ]
            },
            //订单状态选项
            orderStateOptions: [{
                value: "1",
                label: "已下单"
            }, {
                value: "2",
                label: "制作中"
            }, {
                value: "3",
                label: "待取茶"
            }, {
                value: "4",
                label: "已完成"
            }, {
                value: "0",
                label: "退单"
            }]
        }
    },
    methods: {
        //清空数据
        dataReset() {
            this.form = {}
        },
        //关闭窗口
        closeDialog(done) {
            this.see = false
            done()
        },
        //确认
        confirm() {
            console.log(this.form)
            this.$refs["myform"].validate(valid => {
                if (valid) {
                    //表单验证通过
                    let sData = this.form
                    //提交数据
                    this.$http.post("/v1/manage/order/update", {
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
            this.getOrder()
        },
        //获取订单信息
        getOrder() {
            this.form = JSON.parse(JSON.stringify(this.order))
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
    },
}
</script>