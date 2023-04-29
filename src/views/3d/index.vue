<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { redirectHome, redirectSpot } from '@/router/utils';
  import { getSpotPanorama } from '@/api/spot';
  import IHeader from '@/layout/components/IHeader.vue';
  import useThree from './use-three';

  const route = useRoute();
  const threeRef = ref<HTMLElement>();

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
    console.log(threeRef.value);
    const { renderThree } = useThree(threeRef.value as HTMLElement);
    renderThree(data);
  };
  onMounted(() => {
    init();
  });
</script>

<template>
  <div class="w-full" style="position: fixed; top: 0">
    <IHeader style="background-color: transparent"></IHeader>
  </div>
  <div ref="threeRef" class="w-full h-full" style="height: 100vh"></div>
</template>
