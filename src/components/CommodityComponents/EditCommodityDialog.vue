<style scoped>
.mytitle {
    font-weight: bold;
    margin-bottom: 10px;
    padding: 0;
}
</style>
<template>
    <el-dialog v-model="see" :before-close="closeDialog" width="800px" :draggable="true" :destroy-on-close="true">
        <template #header>
            {{ comm.name }}
        </template>
        <el-scrollbar height="500px">
            <div class="mytitle">基本信息</div>
            <el-form :model="comm" ref="myform" :rules="rules" label-position="right" label-width="80px" size="default">
                <el-form-item label="商品ID" prop="id">
                    <el-input v-model="comm.id" type="text" disabled></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="comm.name" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="基础售价" prop="price">
                    <el-input v-model="comm.price" type="text" clearable></el-input>
                </el-form-item>
                <el-form-item label="销售状态" prop="state">
                    <el-select v-model="comm.state" placeholder="请选择" style="width: 100%;">
                        <el-option v-for="(item, index) in sellOptions" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品介绍" prop="introduce">
                    <el-input v-model="comm.introduce" type="textarea" clearable style="width: 100%;"
                        :autosize="{ minRows: 5, maxRows: 5 }"></el-input>
                </el-form-item>
                <el-form-item label="商品简介" prop="briefIntro">
                    <el-input v-model="comm.briefIntro" type="textarea" clearable style="width: 100%;"
                        :autosize="{ minRows: 3, maxRows: 3 }"></el-input>
                </el-form-item>
                <el-form-item label="商品类别" prop="category">
                    <el-checkbox-group v-model="comm.category">
                        <el-checkbox v-for="(item, index) in categoryOptions" :label="item" :name="index" />
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-button size="small" @click="selPic">图库中选择</el-button>
                    <el-button size="small" @click="upPic">上传图片</el-button>
                </el-form-item>
                <el-form-item label="">
                    <el-image :src="comm.img" style="width: 120px;" v-if="comm.img != null && comm.img != ''">
                        <template #error>
                            <div class="image-slot">
                                <el-icon>
                                    <icon-picture />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                    <div v-else>未选择图片</div>
                </el-form-item>
            </el-form>
            <div class="mytitle">个性化定制</div>
            <CustomEditor v-model:custom="comm.custom" />
        </el-scrollbar>
        <!-- 操作按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">修改</el-button>
            </span>
        </template>
    </el-dialog>
    <SeleceImg v-model:visible="selImgVisible" v-model:url="comm.img"/>
    <UploadImg v-model:visible="upImgVisible" v-model:url="comm.img"/>
</template>

<script>
import { ElMessage } from 'element-plus'
import CustomEditor from '@/components/CommodityComponents/CustomEditor.vue'
import SeleceImg from '@/components/ImgComponents/SelectImgDialog.vue'
import UploadImg from '@/components/ImgComponents/AddImgDialogForCommodity.vue'
export default {
    components: {
        CustomEditor,
        SeleceImg,
        UploadImg
    },
    props: {
        visible: Boolean,
        commId: Number
    },
    emits: ['update:visible'],
    data() {
        return {
            comm: {},
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
            }],
            categoryOptions: [],
            cimg: [],
            selImgVisible:false,
            upImgVisible:false
        }
    },
    methods: {
        //基础
        //清空数据
        dataReset() {
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
                    let sData = JSON.parse(JSON.stringify(this.comm))
                    console.log(sData)
                    this.$http.post("/commodity/update", {
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
                            ElMessage.success("修改成功")
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
        },
        //获取数据
        getData() {
            this.getCommData()
            this.getCategoryOptions()
        },
        //获取商品数据
        getCommData() {
            this.$http.get("/commodity/get/detail?id=" + this.commId, {
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code !== 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.comm = response.data.data.commodity
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
                }
            )
        },
        //获取品类选项数据
        getCategoryOptions() {
            this.$http.get("/category/get/option/multiple", {
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code !== 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.categoryOptions = response.data.data.options
                },
                (response) => {
                    ElMessage.error("服务器连接失败")
                }
            )
        },
        //选择图片
        selPic(){
            this.selImgVisible=true;
        },
        upPic(){
            this.upImgVisible=true;
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
                this.getData()
            }
        }
    },
}
</script>