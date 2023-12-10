<style scoped>
.window {
    background: #eeeeee;
    height: calc(100vh - 80px);
    padding: 10px;
}

.container {
    background: #ffffff;
    height: 100%;
    border-radius: 8px;
    height: calc(100% - 20px);
    padding: 10px;
    text-align: center;
}

.warp {
    position: relative;
    top: 45%;
    transform: translateY(-50%);
    width: 100%;
}
.cnum{
    font-size: 100px;
    font-weight: bold;
}
</style>
<template>
    <div class="window">
        <div class="container">
            <el-button @click="openSound" v-if="!isOpen">启用播放</el-button>
            <div class="warp">
                <div class="cnum">{{ code }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElNotification } from 'element-plus'
export default {
    data() {
        return {
            scoket: '',
            audioQueue: [], // 音频队列
            isPlaying: false, // 是否正在播放音频
            isOpen: false,
            code: ''
        }
    },
    unmounted() {
        this.socket.close()
    },
    mounted() {
        this.init();
    },
    methods: {
        //websocket相关
        //初始化
        init: function () {
            let url = this.$wsurl+"/ws/service/";
            let sid = sessionStorage.getItem('storeId')
            if (typeof (WebSocket) === "undefined") {
                ElMessage.error("您的浏览器不支持socket服务")
            } else {
                // 实例化socket
                this.socket = new WebSocket(url + sid)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function () {
            ElMessage.success("语音叫号服务器已连接")
        },
        error: function () {
            ElMessage.error("服务器连接异常")
        },
        //接收服务器发来的消息
        getMessage: function (e) {
            let data = JSON.parse(e.data)
            if (data.type == 'audio' && this.isOpen) {
                let code = data.content.code
                let base64 = data.content.base64
                this.enqueueAudio(code, base64)
            } else {
                ElMessage.warning("语音叫号未启用")
            }
        },
        //给服务器发消息的方法
        send: function () {
            this.socket.send(this.parms);
        },
        close: function () {
        },
        notify(type, title, message) {
            ElNotification({
                title: title,
                message: message,
                type: type,
            })
        },
        playAudio(item) {
            let code = item.code
            this.code = code
            let base64 = item.base64
            let audio = new Audio(`data:audio/wav;base64,${base64}`);
            audio.play();
            audio.onended = () => {
                audio = null
                this.audioQueue.shift(); // 移除已播放的音频
                if (this.audioQueue.length > 0) {
                    this.playAudio(this.audioQueue[0]); // 播放下一个音频
                } else {
                    this.isPlaying = false; // 音频队列为空，停止播放
                }
            }
        },
        enqueueAudio(code, base64) {
            let json = {
                code: code,
                base64: base64
            }
            this.audioQueue.push(json); // 将音频添加到队列
            if (!this.isPlaying) {
                this.isPlaying = true; // 开始播放音频队列
                this.playAudio(this.audioQueue[0]);
            }
        },
        openSound() {
            this.playAudio("UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
            this.isOpen = true
            ElMessage.success("语音叫号已启用")
        }
    }
}
</script>