<style scoped></style>
<template>
    <!-- <div>{{ $route.params.id }}</div> -->
    <el-breadcrumb separator="/" style="margin-bottom: 10px; padding: 0 10px;">
        <el-breadcrumb-item :to="{ path: '/company/store/all' }">门店列表</el-breadcrumb-item>
        <el-breadcrumb-item>门店详情</el-breadcrumb-item>
    </el-breadcrumb>
    <StoreInfoBoard :id="$route.params.id" />
    <div style="height: 20px;"></div>
    <CommoditySheet flag="true" />
</template>
<script>
import StoreInfoBoard from '@/components/StoreComponents/StoreDetail.vue'
import CommoditySheet from '@/components/CommoditySheet/CommoditySheetForStore.vue'
export default {
    components: {
        StoreInfoBoard,
        CommoditySheet
    }
}
</script>
