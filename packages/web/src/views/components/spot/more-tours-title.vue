<script lang="ts" setup>
  export interface IProps {
    title?: string;
    onclick?: () => void;
  }
  const props = withDefaults(defineProps<IProps>(), {
    title: '更多旅游景点',
    onclick: () => {},
  });
</script>

<template>
  <div class="m-12">
    <h2 class="text-xl link link-hover inline-block" @click.stop="onclick">
      <IconFont type="icon-zhilupai"></IconFont>
      {{ title }}
      <IconFont type="icon-youjiantou4"></IconFont>
    </h2>
  </div>
</template>
