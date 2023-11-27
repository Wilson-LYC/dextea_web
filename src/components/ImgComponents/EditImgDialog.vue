<style scoped>
</style>

<template>
    <el-dialog title="图片" v-model="see" :draggable="true" :destroy-on-close="true" width="800px">
        <div style="text-align: center;">
            <el-image :src="url" style="height: 500px;margin: auto;"/>
        </div>
        <!-- 操作按钮 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="colse">关闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: Boolean,
        url: String
    },
    emits: ['update:visible'],
    methods: {
        //关闭
        colse() {
            //关闭窗口
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
    }
}
</script>