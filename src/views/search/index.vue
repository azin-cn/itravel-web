<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ITour } from '@/api/spot';
  import { ListResult } from '@/types/global';
  import { ArticleBriefInfo } from '@/api/article';
  import { UserState } from '@/store/modules/user/types';
  import {
    getSpotsByKeywords,
    getArticlesByKeywords,
    getUsersByKeywords,
  } from '@/api/search';
  import { redirectHome } from '@/router/utils';
  import RandRecomSpot from '../article/components/rand-recom-spot.vue';
  import SiderLayout from '../components/layout/sider-layout.vue';
  import IPagination from '../components/pagination/index.vue';

  const route = useRoute();
  const spots = ref<ListResult<ITour>>();
  const articles = ref<ListResult<ArticleBriefInfo>>();
  const users = ref<ListResult<UserState>>();

  const spotPage = ref(1);
  const onSpotPageChange = async () => {};
  const articlePage = ref(1);
  const onArticlePageChange = async () => {};
  const userPage = ref(1);
  const onUserPageChange = async () => {};

  const init = async () => {
    const { query } = route;
    const { s } = query;
    if (!s) {
      redirectHome();
      return;
    }

    const [{ data: _spots }, { data: _articles }, { data: _users }] =
      await Promise.all([
        getSpotsByKeywords(s as string),
        getArticlesByKeywords(s as string),
        getUsersByKeywords(s as string),
      ]);

    spots.value = _spots;
    articles.value = _articles;
    users.value = _users;
  };
  init();
</script>

<template>
  <div class="2xl:container mx-auto text-gray-700 text-left">
    <SiderLayout>
      <template #content>
        <div class="m-2 flex-1 text-left">
          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索景点
              </h2>
            </div>
          </section>

          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索文章
              </h2>
            </div>
          </section>

          <section>
            <div class="m-6 ml-0">
              <h2 class="text-lg link link-hover inline-block">
                <IconFont type="icon-zhilupai"></IconFont>
                搜索用户
              </h2>
            </div>
          </section>
        </div>
      </template>
    </SiderLayout>
    <RandRecomSpot></RandRecomSpot>
  </div>
</template>
