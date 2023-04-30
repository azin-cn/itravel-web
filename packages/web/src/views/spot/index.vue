<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { redirectArticle, redirectHome, redirect3D } from '@/router/utils';
  import {
    getSpotBriefInfo,
    getSpotMonthsAndFeatures,
    FMInfoModel,
    SpotBreifInfoModel,
    MonthORFeatureBaseModel,
  } from '@/api/spot';
  import {
    getSpotBriefInfoOfArticles,
    ArticleBriefInfo,
    IPaginationOpton,
    getRandArticles,
  } from '@/api/article';
  import { getRandUsers } from '@/api/user';
  import { UserState } from '@/store/modules/user/types';
  import { limitMaxLength, formatNumber } from '@/utils/format';
  import * as settings from '@/config/settings.json';
  import { ListResult } from '@/types/global';
  import IPagination from '@/views/components/pagination/index.vue';
  import ArticleBrief from '@/views/components/article/article-brief.vue';
  import ArticleMini from '@/views/components/article/article-mini.vue';
  import UserMini from '@/views/components/user/user-mini.vue';
  import useFM from './use-fm';
  import Recom from './components/recom.vue';
  import FM from './components/f-m.vue';

  const route = useRoute();
  const { sortMonths } = useFM();
  const spotBreifInfo = ref<SpotBreifInfoModel>();
  const spotFMInfo = ref<FMInfoModel>();
  const spotBriefArticles = ref<ListResult<ArticleBriefInfo>>();
  const spotRandArticles = ref<ArticleBriefInfo[]>();
  const spotRandUsers = ref<UserState[]>();

  const page = ref(1);
  const onPageChange = async (v: number) => {
    page.value = v;
    /**
     * request new data
     */
    const params = {
      limit: 10,
      page: v,
    } as IPaginationOpton;

    const { data: briefArticles } = await getSpotBriefInfoOfArticles(
      spotBreifInfo.value?.id as string,
      params
    );
    spotBriefArticles.value = briefArticles;
  };
  const onRandArticleRefesh = async () => {
    const { data } = await getRandArticles();
    spotRandArticles.value = data;
  };
  const onRandUserRefresh = async () => {
    const { data } = await getRandUsers();
    spotRandUsers.value = data;
  };
  const onClick3D = (id: string) => {
    redirect3D(id);
  };

  const siderLimit = computed(() => {
    const { list } = spotBriefArticles.value || {};
    /**
     * 不存在返回 3
     */
    if (!list) return 3;

    /**
     * 如果article list的长度小于四，则分别限制randArticles和randUsers的长度为6
     */
    if (list.length < 4) return 6;

    /**
     * 最长十条
     */
    return 10;
  });

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

    const [
      { data: breifInfo },
      { data: fmInfo },
      { data: briefArticles },
      { data: randArticles },
      { data: randUsers },
    ] = await Promise.all([
      getSpotBriefInfo(spotId as string),
      getSpotMonthsAndFeatures(spotId as string),
      getSpotBriefInfoOfArticles(spotId as string),
      getRandArticles(),
      getRandUsers(),
    ]);

    fmInfo.months = sortMonths(fmInfo.months) as MonthORFeatureBaseModel[];
    spotBreifInfo.value = breifInfo;
    spotFMInfo.value = fmInfo;
    spotBriefArticles.value = briefArticles;
    spotRandArticles.value = randArticles;
    spotRandUsers.value = randUsers;

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
        </div>
      </div>
    </div>

    <div class="2xl:container mx-auto text-gray-700 text-left">
      <FM
        :features="spotFMInfo?.features as any"
        :months="spotFMInfo?.months as any"
        :province="spotBreifInfo?.province.name"
        :city="spotBreifInfo?.city.name"
        @click3d="onClick3D(spotBreifInfo?.id as string)"
      ></FM>

      <div class="m-12">
        <h2 class="text-xl link link-hover inline-block" @click.stop="() => {}">
          <IconFont type="icon-lvyou4"></IconFont>
          相关分享贴
          <IconFont type="icon-youjiantou4"></IconFont>
        </h2>
      </div>

      <a-layout class="mr-10 ml-10">
        <a-layout>
          <a-layout-content class="pb-1">
            <ArticleBrief
              :img-url="spotBreifInfo?.thumbUrl"
              :list="spotBriefArticles?.list as ArticleBriefInfo[]"
            />

            <IPagination
              :on-page-change="onPageChange"
              :page="page"
              :total="spotBriefArticles?.total"
            ></IPagination>
          </a-layout-content>

          <a-layout-sider
            :resize-directions="['left']"
            style="min-width: 26%; max-width: 50%"
            class="itravel-spot-layout__sider"
          >
            <ArticleMini
              :list="spotRandArticles as ArticleBriefInfo[]"
              :refresh="onRandArticleRefesh"
              :limit="siderLimit"
            />

            <UserMini
              :list="spotRandUsers as UserState[]"
              :refresh="onRandUserRefresh"
              :limit="siderLimit"
            />
          </a-layout-sider>
        </a-layout>
      </a-layout>

      <Recom></Recom>
    </div>
  </div>
</template>

<style scoped lang="less">
  .itravel-spot-layout__sider :deep(.arco-layout-sider-children) {
    justify-content: flex-start;
  }
</style>
