<style scoped>
.container {
    background: #ffffff;
    border-radius: 8px;
    padding: 20px;
    /* height:calc(100% - 40px); */
}
</style>

<template>
    <div class="container">
        <el-form :model="store" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default"
            style="width:400px;">
            <el-form-item label="门店ID" prop="id">
                <el-input v-model="store.id" type="text" disabled></el-input>
            </el-form-item>
            <el-form-item label="门店名称" prop="name">
                <el-input v-model="store.name" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input v-model="store.address" type="textarea" clearable
                    :autosize="{ minRows: 3, maxRows: 3 }"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="store.phone" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="营业时间" prop="openTime">
                <el-input v-model="store.openTime" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="营业状态" prop="openState">
                <el-select v-model="store.openState" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="(item, index) in openStateOptions" :key="index" :label="item.label"
                        :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    data() {
        return {
            store: {},
            rules: {
                name: [
                    { required: true, message: '请输入门店名称', trigger: 'blur' },
                ],
                address: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                ],
                openTime: [
                    { required: true, message: '请输入营业时间', trigger: 'blur' },
                ],
                openState: [
                    { required: true, message: '请选择营业状态', trigger: 'blur' }
                ]
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
            }]
        };
    },
    methods: {
        //获取数据
        getData() {
            this.getStore();
        },
        //获取门店信息
        getStore() {
            let sid = sessionStorage.getItem("storeId");
            this.$http.get("/v1/manage/store/detail?id=" + sid).then((response) => {
                if (response.data.code !== 200) {
                    ElMessage.error(response.data.msg);
                    return;
                }
                this.store = response.data.data.store;
            });
        },
        onSubmit() {
            this.$refs.myform.validate((valid) => {
                if (valid) {
                    this.$http.post("/v1/manage/store/update/info", {
                        data: this.store
                    }).then((response) => {
                        if (response.data.code !== 200) {
                            ElMessage.error(response.data.msg);
                            return;
                        }
                        ElMessage.success("保存成功");
                    });
                } else {
                    ElMessage.error("请按照要求填写");
                }
            });
        }
    },
    mounted() {
        this.getData();
    }
}
</script>