<script lang="ts" setup>
  import RandRecomSpot from './components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout>
      <!-- <template #content>这是内容</template> -->
    </SiderLayout>

    <RandRecomSpot></RandRecomSpot>
  </div>
</template>
