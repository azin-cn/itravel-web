<script lang="ts" setup>
  import * as settings from '@/config/settings.json';
</script>

<template>
  <a-layout-footer class="footer">© {{ settings.title }}</a-layout-footer>
</template>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
