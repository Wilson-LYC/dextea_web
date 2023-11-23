<style scoped></style>
<template>
    <!-- <div>{{ $route.params.id }}</div> -->
    <el-breadcrumb separator="/" style="margin-bottom: 10px; padding: 0 10px;">
        <el-breadcrumb-item :to="{ path: '/company/store/all' }">门店列表</el-breadcrumb-item>
        <el-breadcrumb-item>门店详情</el-breadcrumb-item>
    </el-breadcrumb>
    <StoreInfoBoard :id="$route.params.id" />
    <div style="height: 20px;"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="销售商品" name="1">
            <CommoditySheet />
        </el-tab-pane>
        <el-tab-pane label="员工" name="2">
            <StaffSheet :sid="$route.params.id"/>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import StoreInfoBoard from '@/components/StoreComponents/StoreDetail.vue'
import CommoditySheet from '@/components/CommoditySheet/CommoditySheetForStore.vue'
import StaffSheet from '@/components/StaffComponents/StaffSheetForStore.vue'
export default {
    components: {
        StoreInfoBoard,
        CommoditySheet,
        StaffSheet
    },
    data() {
        return {
            activeName: '1'
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}
</script>
