<script setup lang="ts">
import Header from '@/components/layout/header.vue';

const companyName = 'GOGOFOO';
</script>
<template>
  <Header :title="companyName" />
  <router-view/>
</template>

<style lang="scss" scoped>

</style>
