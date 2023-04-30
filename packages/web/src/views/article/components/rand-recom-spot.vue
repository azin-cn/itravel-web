<script lang="ts" setup>
  import MoreToursTitle from '../../components/spot/more-tours-title.vue';
  import MoreTours from '../../components/spot/more-tours.vue';
</script>

<template>
  <section>
    <MoreToursTitle></MoreToursTitle>
    <MoreTours :line="1"></MoreTours>
  </section>
</template>
