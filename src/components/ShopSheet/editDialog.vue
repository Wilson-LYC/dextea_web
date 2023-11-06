<style scoped></style>
<template>
    <el-dialog title="修改门店" width="500" v-model="see" :close-on-click-modal="false">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="data" ref="myform" :rules="rules" label-position="left" label-width="80px" size="default">
                <el-form-item label="门店ID" prop="id" class="required">
                    <el-input v-model="data.id" :disabled="true" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="门店名称" prop="name" class="required">
                    <el-input v-model="data.name" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="所在区域" prop="area" class="required">
                    <el-cascader v-model="data.area" class="full-width-input" :options="areaOptions" clearable
                        placeholder="请选择">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address" class="required">
                    <el-input v-model="data.address" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone" class="required">
                    <el-input v-model="data.phone" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="营业时间" prop="openTime" class="required">
                    <el-input v-model="data.openTime" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="营业状态" prop="openState" class="required">
                    <el-select v-model="data.openState" class="full-width-input" clearable>
                        <el-option v-for="(item, index) in openStateOptions" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-scrollbar>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            rules: {
                id: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                name: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                area: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                address: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                phone: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                openTime: [{
                    required: true,
                    message: '字段值不可为空',
                }],
                openState: [{
                    required: true,
                    message: '字段值不可为空',
                }],
            },
            openStateOptions: [{
                "value": "0",
                "label": "未开业 "
            }, {
                "value": "1",
                "label": "营业中"
            }, {
                "value": "2",
                "label": "休息中"
            }],
            areaOptions: [
                {
                    "label": "广东省",
                    "value": "广东省",
                    "children": [{
                        "label": "广州市",
                        "value": "广州市"
                    }, {
                        "label": "韶关市",
                        "value": "韶关市"
                    }]
                },
                {
                    "label": "湖南省",
                    "value": "湖南省",
                    "children": [{
                        "label": "长沙市",
                        "value": "长沙市"
                    }, {
                        "label": "衡阳市",
                        "value": "衡阳市"
                    }]
                }, {
                    "label": "北京市",
                    "value": "北京市"
                }
            ],
        }
    },
    methods: {
        //确认
        confirm() {
            this.$refs["myform"].validate(valid => {
                if (valid) {
                    // console.log("success");
                    console.log(this.data);
                    this.$emit('update:isChange', !this.isChange)
                    this.resetData()
                    this.see = false
                } else {
                    // console.log("error");
                }
            });
        },
        //取消
        cancel() {
            this.see = false
            this.resetData()
        },
    },
    props: {
        visible: Boolean,
        data: Object
    },
    emits: ['update:visible'],
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