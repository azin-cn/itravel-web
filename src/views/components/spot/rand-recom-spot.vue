<script lang="ts" setup>
  import MoreToursTitle from './more-tours-title.vue';
  import MoreTours from './more-tours.vue';

  export interface IProps {
    line?: 1 | 2;
  }
  const prpos = withDefaults(defineProps<IProps>(), { line: 1 });
</script>

<template>
  <section>
    <MoreToursTitle></MoreToursTitle>
    <MoreTours :line="line"></MoreTours>
  </section>
</template>
