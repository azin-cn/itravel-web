<script lang="ts" setup>
  import { ref } from 'vue';
  import { SpotBreifInfoModel } from '@/api/spot';
  import { ListResult } from '@/types/global';
  import { ArticleBriefInfo } from '@/api/article';
  import { UserState } from '@/store/modules/user/types';
  import RandRecomSpot from '../article/components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';
  import IPagination from '../components/pagination/index.vue';

  const spots = ref<ListResult<SpotBreifInfoModel>>();
  const articles = ref<ListResult<ArticleBriefInfo>>();
  const users = ref<ListResult<UserState>>();

  const spotPage = ref(1);
  const onSpotPageChange = async () => {};
  const articlePage = ref(1);
  const onArticlePageChange = async () => {};
  const userPage = ref(1);
  const onUserPageChange = async () => {};
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout>
      <template #content>
        <div class="m-2 flex-1 text-left">
          <div class="m-6 ml-0">
            <h2 class="text-lg link link-hover inline-block">
              <IconFont type="icon-zhilupai"></IconFont>
              更多
            </h2>
          </div>
        </div>
      </template>
    </SiderLayout>
    <RandRecomSpot></RandRecomSpot>
  </div>
</template>
