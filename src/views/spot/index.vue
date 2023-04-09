<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { redirectHome } from '@/router/utils';
  import {
    getSpotBriefInfo,
    getSpotMonthsAndFeatures,
    FMInfoModel,
    SpotBreifInfoModel,
  } from '@/api/spot';
  import { limitMaxLength } from '@/utils/string';
  import * as settings from '@/config/settings.json';
  import ArticleBrief from '../components/article/article-brief.vue';
  import Recom from './components/recom.vue';

  const route = useRoute();
  const spotBreifInfo = ref<SpotBreifInfoModel>();
  const spotFMInfo = ref<FMInfoModel>();
  const init = async () => {
    /**
     * 携带参数进入路由
     */
    const { params } = route;
    const { spotId } = params;

    if (!spotId) {
      /**
       * 如果无id则返回首页
       */
      redirectHome();
      return;
    }

    const [{ data: breifInfo }, { data: fmInfo }] = await Promise.all([
      getSpotBriefInfo(spotId as string),
      getSpotMonthsAndFeatures(spotId as string),
    ]);

    spotBreifInfo.value = breifInfo;
    spotFMInfo.value = fmInfo;

    document.title = `${settings.title} - ${breifInfo.name}`;
  };
  init();
</script>

<template>
  <div>
    <div
      class="hero min-h-screen"
      :style="{
        backgroundImage: `url(${spotFMInfo?.thumbUrl})`,
      }"
    >
      <div class="hero-overlay bg-opacity-60"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">{{ spotFMInfo?.name }}</h1>
          <p class="mb-5">
            {{ limitMaxLength(spotFMInfo?.description || '暂无数据', 300) }}
          </p>
          <!-- <button class="btn btn-primary">Get Started</button> -->
        </div>
      </div>
    </div>

    <div class="2xl:container mx-auto text-gray-700 text-left">
      <ArticleBrief></ArticleBrief>
      <Recom></Recom>
    </div>
  </div>
</template>
