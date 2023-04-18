<script lang="ts" setup>
  import { ref } from 'vue';
  import SiderLayout from '../components/layout/sider-layout.vue';
  import RandRecomSpot from '../article/components/rand-recom-spot.vue';
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout></SiderLayout>
    <RandRecomSpot></RandRecomSpot>
  </div>
</template>
