<style scoped>
.myscrollbar {
    height: calc(100vh - 160px);
}

.item {
    margin-bottom: 15px;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 5px;
}

.item:hover {
    cursor: pointer;
}
</style>
<template>
    <el-tabs class="demo-tabs" @tab-click="handleClick" style="height:100%;">
        <el-tab-pane label="制作中">
            <el-scrollbar class="myscrollbar">
                <div v-if="makeLsit.length < 1" style="color: #999999;">无数据</div>
                <!-- <MakingList v-model:change="change"/> -->
                <div class="item" v-for="(it, index) in makeLsit" @click="clickItem(it)">
                    <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.time }}</div>
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div v-if="it.num > 0">
                                <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: center;line-height: 50px;">
                                <el-button type="primary" @click="updateState(it.id, '3')">制作完成</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="待取茶">
            <el-scrollbar class="myscrollbar">
                <div v-if="waitLsit.length < 1" style="color: #999999;">无数据</div>
                <!-- <WaitingList v-model:change="change" /> -->
                <div class="item" v-for="(it, index) in waitLsit" @click="clickItem(it)">
                    <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.time }}</div>
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div v-if="it.num > 0">
                                <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: center;line-height: 50px;">
                                <el-button type="primary" @click="updateState(it.id, '4')">已取餐</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="已完成">
            <el-scrollbar class="myscrollbar">
                <div v-if="finishLsit.length < 1" style="color: #999999;">无数据</div>
                <!-- <FinishList v-model:change="change" /> -->
                <div class="item" v-for="(it, index) in finishLsit" @click="clickItem(it)">
                    <div style="font-size: 14px;color: #999999;line-height: 20px;">下单时间：{{ it.time }}</div>
                    <el-row>
                        <el-col :span="8">
                            <div>
                                <div style="font-size: 28px;font-weight: bold;line-height: 50px;">{{ it.code }}</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div v-if="it.num > 0">
                                <div style="font-size: 28px;font-weight: bold;line-height: 50px;">×{{ it.num }}</div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: center;line-height: 50px;">
                                <!-- <el-button type="primary">制作完成</el-button> -->
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-scrollbar>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
export default {
    data() {
        return {
            makeLsit: [],
            waitLsit: [],
            finishLsit: []
        }
    },
    methods: {
        clickItem(it) {
            this.$router.push(
                {
                    path: '/store/service/order/' + it.id
                }
            );
        },
        getMakeOrder() {
            //从sessionStorage中获取sid
            let sid = sessionStorage.getItem('storeId')
            //get请求
            this.$http.get("/order/get/samestate?sid=" + sid + "&state=2", {
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.makeLsit = response.data.data.order
                },
                (response) => {
                }
            )
        },
        getWaitOrder() {
            //从sessionStorage中获取sid
            let sid = sessionStorage.getItem('storeId')
            //get请求
            this.$http.get("/order/get/samestate?sid=" + sid + "&state=3", {
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.waitLsit = response.data.data.order
                },
                (response) => {
                }
            )
        },
        getFinishOrder() {
            //从sessionStorage中获取sid
            let sid = sessionStorage.getItem('storeId')
            //get请求
            this.$http.get("/order/get/samestate?sid=" + sid + "&state=4", {
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.finishLsit = response.data.data.order
                },
                (response) => {
                }
            )
        },
        getData() {
            this.getMakeOrder()
            this.getWaitOrder()
            this.getFinishOrder()
        },
        updateState(id, state) {
            this.$emit('update:change', (this.change + 1) % 10)
            //从sessionStorage中获取sid
            let sid = sessionStorage.getItem('storeId')
            //get请求
            this.$http.get("/order/update/state?id=" + id + "&state=" + state, {
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        return
                    }
                    this.getData()
                },
                (response) => {
                }
            )
        }
    },
    mounted() {
        this.getData()
        //1500ms刷新一次
        setInterval(() => {
            this.getData()
        }, 30000)
    },
}
</script>