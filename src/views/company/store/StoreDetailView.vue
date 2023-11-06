<style scoped></style>
<template>
    <!-- <div>{{ $route.params.id }}</div> -->
    <StoreInoBoard :id="$route.params.id"/>
</template>
<script>
import StoreInoBoard from '@/components/StoreInfo/StoreInfoBoard.vue'
export default {
    components: {
        StoreInoBoard
    }
}
</script>