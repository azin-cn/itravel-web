<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import * as settings from '@/config/settings.json';
  import SiderLayout from '@/views/components/layout/sider-layout.vue';

  const route = useRoute();

  const init = async () => {
    const { params } = route;
    const { userId } = params;
  };

  document.title = `${settings.title} - `;
</script>

<template>
  <div>
    <SiderLayout></SiderLayout>
  </div>
</template>
