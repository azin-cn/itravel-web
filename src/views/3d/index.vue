<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { redirectHome } from '@/router/utils';
  import { getSpotPanorama } from '@/api/spot';
  import useThree from './use-three';

  const route = useRoute();
  const threeRef = ref<HTMLElement>();

  const { renderThree } = useThree(threeRef.value);

  const init = async () => {
    /**
     * 携带参数进入
     */
    const { params } = route;
    const { spotId } = params;

    if (!spotId) {
      redirectHome();
      return;
    }

    const { data } = await getSpotPanorama(spotId as string);
    renderThree(data);
  };
  init();
</script>

<template>
  <div ref="threeRef"></div>
</template>
