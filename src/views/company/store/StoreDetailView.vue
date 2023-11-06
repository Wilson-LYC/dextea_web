<style scoped></style>
<template>
    <!-- <div>{{ $route.params.id }}</div> -->
    <StoreInfoBoard :id="$route.params.id"/>
</template>
<script>
import StoreInfoBoard from '@/components/StoreInfo/StoreInfoBoard.vue'
export default {
    components: {
        StoreInfoBoard
    }
}
</script>
