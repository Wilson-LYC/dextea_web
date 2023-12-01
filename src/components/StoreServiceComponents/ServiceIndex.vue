<style scoped>
.container {
    height: calc(100vh - 100px);
}

.warp {
    position: relative;
    top: 45%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
}

#logo {
    width: 30%;
}
</style>
<template>
    <div class="container">
        <div class="warp">
            <img src="@/assets/img/logo.png" id="logo">
            <div style="font-size: 30px;margin-top: 30px;">Welcome</div>
        </div>
    </div>
</template>
<script>
export default {
    name: "ServiceIndex",
    data() {
        return {
        };
    },
    methods: {
    },
    mounted() {
        // this.$socket(); // 手动连接WebSocket
        // this.$options.sockets.onmessage = (event) => {
        //     const message = JSON.parse(event.data);
        //     console.log(message);
        // };
    }
}
</script>