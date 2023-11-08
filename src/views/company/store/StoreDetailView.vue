<style scoped></style>
<template>
    <!-- <div>{{ $route.params.id }}</div> -->
    <StoreInfoBoard :id="$route.params.id"/>
    <div style="height: 20px;"></div>
    <CommoditySheet flag="true"/>
</template>
<script>
import StoreInfoBoard from '@/components/StoreInfo/StoreInfoBoard.vue'
import CommoditySheet from '@/components/CommoditySheet/CommoditySheet.vue'
export default {
    components: {
        StoreInfoBoard,
        CommoditySheet
    }
}
</script>
