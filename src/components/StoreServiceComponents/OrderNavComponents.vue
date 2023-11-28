<style scoped>
.header{
    height: 60px;
    background: red;
    display: flex;
}
.hitme{
    width: 25%;
    background: blue;
}
.main{
    height: calc(100% - 60px);
    background: skyblue;
}
</style>
<template>
    <div class="header">
        <div class="hitme">
            123
        </div>
    </div>
    <div class="main">

    </div>
</template>
<script>
export default {
    components: {
    }
}
</script>