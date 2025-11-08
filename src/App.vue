<template>
	<!-- This will render the component matched by the router -->
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  	name: 'App',
})
</script>

<style>
/* optional global styles */
</style>
