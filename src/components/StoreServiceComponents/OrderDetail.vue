<style scoped>
.mytable {
    height: calc(100vh - 220px);
    width: 100%;
}
</style>
<template>
    <div style="height: 120px;">
        <el-breadcrumb separator="/" style="margin-bottom: 10px;">
            <el-breadcrumb-item :to="{ path: '/store' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="8">
                <el-row>
                    <el-col :span="6" style="text-align: right;">
                        下单时间：
                    </el-col>
                    <el-col :span="18">
                        {{ order.orderTime }}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="6" style="text-align: right;">
                        顾客：
                    </el-col>
                    <el-col :span="18">
                        {{ order.custName }}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="6" style="text-align: right;">
                        联系方式：
                    </el-col>
                    <el-col :span="18">
                        {{ order.custPhone }}
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row style="margin-top: 5px;">
            <el-col :span="8">
                <el-row>
                    <el-col :span="6" style="text-align: right;">
                        取餐码：
                    </el-col>
                    <el-col :span="18">
                        {{ order.code }}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="6" style="text-align: right;">
                        总数量：
                    </el-col>
                    <el-col :span="18">
                        {{ order.num }}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <el-col :span="6" style="text-align: right;">
                        状态：
                    </el-col>
                    <el-col :span="18">
                        <el-tag type="success" effect="plain" round v-if="order.state === '1'">
                            已下单
                        </el-tag>
                        <el-tag type="success" effect="plain" round v-else-if="order.state === '2'">
                            制作中
                        </el-tag>
                        <el-tag type="success" effect="plain" round v-else-if="order.state === '3'">
                            待取餐
                        </el-tag>
                        <el-tag type="success" effect="plain" round v-else-if="order.state === '4'">
                            已完成
                        </el-tag>
                        <el-tag type="danger" effect="plain" round v-else-if="order.state === '0'">
                            退单
                        </el-tag>
                        <el-tag type="info" effect="plain" round v-else>
                            未知
                        </el-tag>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div style="margin-top: 10px;">
            <el-button type="primary">制作完成</el-button>
            <el-button type="success">已取餐</el-button>
            <el-button type="danger">退单</el-button>
        </div>
    </div>
    <el-table :data="order.commodity" border class="mytable" table-layout="auto" v-loading="tableLoading">
        <template #empty>无数据</template>
        <!-- 数据部分 -->
        <el-table-column prop="name" label="商品" width="200" fixed="left" :show-overflow-tooltip="true" />
        <el-table-column prop="custom" label="个性化定制" :show-overflow-tooltip="true" />
        <el-table-column prop="num" label="数量" width="100" :show-overflow-tooltip="true" />
    </el-table>
</template>
<script>
import { ElMessage } from 'element-plus'
export default {
    data() {
        return {
            order: {}
        }
    },
    methods:{
        getOrder(){
            let id = this.$route.params.id
            //get请求
            this.$http.get("/order/detail?id="+id, {
                headers: {
                    'Authorization': sessionStorage.getItem('token')
                }
            }).then(
                (response) => {
                    if (response.data.code != 200) {
                        ElMessage.error(response.data.msg)
                        this.$router.push(
                            {
                                path: '/store/service/index'
                            }
                        );
                        return
                    }
                    this.order = response.data.data.order
                },
                (response) => {
                }
            )
        },
        getData(){
            this.getOrder()
        }
    },
    mounted(){
        this.getData()
    },
    watch: {
        $route(to, from) {
            this.getData()
        }
    }
}
</script>