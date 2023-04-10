<script lang="ts" setup>
  import PageLayout from './page-layout.vue';
  import IHeader from './components/IHeader.vue';
  import IFooter from './components/IFooter.vue';
</script>

<template>
  <div class="layout">
    <a-layout style="min-height: 400px">
      <a-layout-header class="sticky top-0 w-full z-10">
        <IHeader />
      </a-layout-header>
      <a-layout-content>
        <PageLayout />
      </a-layout-content>
      <a-layout-footer>
        <IFooter></IFooter>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
  .layout :deep(.arco-layout-header),
  .layout :deep(.arco-layout-footer),
  .layout :deep(.arco-layout-sider-children),
  .layout :deep(.arco-layout-content) {
    display: flex;
    flex-direction: column;
    justify-content: center;

    /* color: var(--color-white); */
    font-size: 16px;
    font-stretch: condensed;
    text-align: center;
  }

  .layout :deep(.arco-layout-sider) {
    background-color: inherit;
  }
</style>
