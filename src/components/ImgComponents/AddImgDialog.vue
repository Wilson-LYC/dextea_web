<style scoped>
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>

<template>
    <el-dialog title="上传图片" v-model="see" width="500px" :draggable="true" :destroy-on-close="true">
        <el-scrollbar max-height="400px">
            <!-- 表单 -->
            <el-form :model="form" ref="myform" :rules="rules" size="default" v-model:headers="myheaders">
                <el-form-item>
                    <el-upload drag :action="uploadUrl" :auto-upload="false" list-type="picture" style="width: 100%;"
                        ref="upload" :headers="myheaders" :before-upload="beforeUpload" :on-success="onSuccess"
                        :on-error="onError" multiple>
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
                <el-button type="primary" @click="onSubmit" :loading="loading">上传</el-button>
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
            myheaders: {},
            //上传图片的地址
            uploadUrl: 'http://192.168.205.57:6688/v1/manage/img/upload',
            loading: false
        }
    },
    methods: {
        beforeUpload(UploadRawFile) {
            //仅支持JPG、PNG格式文件，且不超过5MB
            const isJPG = UploadRawFile.type === 'image/jpeg'
            const isPNG = UploadRawFile.type === 'image/png'
            const isLt5M = UploadRawFile.size / 1024 / 1024 < 5
            if (!isJPG && !isPNG) {
                ElMessage.error('仅支持5MB以内的JPG、PNG格式文件')
                return false
            }
        },
        onSubmit() {
            this.loading = true
            this.$refs.upload.submit()
        },
        onSuccess(response, file, fileList) {
            if (response.code == 200) {
                ElMessage.success("上传成功")
                this.loading = false
                //关闭窗口
                this.see = false
            } else {
                ElMessage.error(response.msg)
            }
        },
        onError() {
            this.loading = false
            ElMessage.error("上传失败")
        },
        cancel(){
            this.see = false
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
            'Authorization': sessionStorage.getItem('token')
        }
    }
}
</script>