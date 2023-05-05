<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { redirectHome } from '@/router/utils';
  import { getSpotPanorama } from '@/api/spot';
  import { setDocumentTitle } from '@/utils/window';
  import useThree from './use-three';

  const route = useRoute();
  const router = useRouter();
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

    const {
      data: { name, panorama },
    } = await getSpotPanorama(spotId as string);
    const { renderThree } = useThree(threeRef.value as HTMLElement);
    renderThree(panorama);

    setDocumentTitle(`VR | ${name}`);
  };
  onMounted(() => {
    init();
  });
</script>

<template>
  <div
    class="w-full flex justify-between items-center"
    style="position: fixed; top: 0"
  >
    <div class="m-6 mr-0 cursor-pointer icon-click" @click.stop="router.back()">
      <icon-left size="18" />
    </div>
  </div>
  <div ref="threeRef" class="w-full h-full" style="height: 100vh"></div>
</template>

<style lang="less" scoped>
  .icon-click {
    transition: all 0.3s;
  }

  .icon-click:active {
    transform: scale(1.2);

    /* 解决active时长太短问题 */
    transition: 0s;
  }
</style>
