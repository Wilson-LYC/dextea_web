<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="上传图片" v-model="see" :before-close="closeDialog" width="500px" :draggable="true"
        :destroy-on-close="true">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" size="default" v-model:file-list="imgList"
                :headers="myheaders" :before-upload="beforeUpload">
                <el-form-item>
                    <el-upload drag :action="uploadUrl" :auto-upload="false" list-type="picture" style="width: 100%;" ref="upload" :on-change="onChange">
                        <el-icon><upload-filled /></el-icon>
                        <div>
                            拖拽文件到此处，或<em>点击上传</em>
                        </div>
                        <template #tip>
                            <div>
                                仅支持JPG、PNG格式文件，且不超过5MB
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <!-- 操作按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">上传</el-button>
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
            imgList: [],
            myheaders: {},
            //上传图片的地址
            uploadUrl: '',
        }
    },
    methods: {
        //关闭窗口
        closeDialog(done) {
            //关闭窗口
            this.see = false
            // ElMessage("窗口关闭")
            done()
        },
        //确认
        confirm() {
        },
        //取消
        cancel() {
            //关闭窗口
            this.closeDialog()
        },
        beforeUpload(e) {

        },
        onChange(file,fileList) {
            console.log(file)
            console.log(fileList)
            console.log(this.imgList)
            this.$refs.upload.clearFiles()
            console.log(this.imgList)
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
        this.myheaders = {
            Authorization: sessionStorage.getItem("token")
        }
    }
}
</script>