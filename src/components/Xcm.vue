<template>
    <div class="wrap">
        <iframe ref="dom_webview" class="webview" src="https://xc.caict.ac.cn/#/result"></iframe>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue'
let dom_webview = ref(null);
watch(dom_webview, (n, o) => {
	console.log(n)
})

</script>

<style scoped>
.wrap {
    width: 100%;
    height: 100%;
}
.wrap .webview {
    width: 100%;
    height: 100%;
    overflow: hidden;
	border: medium none;
}
</style>